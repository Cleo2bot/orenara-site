import opentype from "opentype.js";
import sharp from "sharp";
import { mkdirSync, readFileSync } from "fs";

const TEXT = "ORENARA";
const FONT_SIZE = 200;
const TRACKING = 0.22 * FONT_SIZE;
const INK = "#0F1113";
const BONE = "#F3EEE4";

async function main() {
  const buf = readFileSync("/tmp/Archivo-Medium.ttf");
  const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  let x = 0;
  const paths: string[] = [];
  for (const ch of TEXT) {
    const glyph = font.charToGlyph(ch);
    const p = glyph.getPath(x, FONT_SIZE, FONT_SIZE);
    paths.push(p.toPathData(3));
    x += (glyph.advanceWidth! / font.unitsPerEm) * FONT_SIZE + TRACKING;
  }
  const width = Math.ceil(x - TRACKING);
  const ascent = (font.ascender / font.unitsPerEm) * FONT_SIZE;
  const descent = Math.abs((font.descender / font.unitsPerEm) * FONT_SIZE);
  const height = Math.ceil(ascent + descent);
  const padX = Math.round(FONT_SIZE * 0.4);
  const padY = Math.round(FONT_SIZE * 0.4);
  const W = width + padX * 2;
  const H = height + padY * 2;
  const dy = padY + ascent - FONT_SIZE;
  const svg = (fill: string, bg?: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    (bg ? `<rect width="${W}" height="${H}" fill="${bg}"/>` : "") +
    `<g transform="translate(${padX},${dy})" fill="${fill}">` +
    paths.map((d) => `<path d="${d}"/>`).join("") +
    `</g></svg>`;
  mkdirSync("exports", { recursive: true });
  await sharp(Buffer.from(svg(INK))).png().toFile("exports/orenara-wordmark-dark.png");
  await sharp(Buffer.from(svg(INK, "#FFFFFF"))).png().toFile("exports/orenara-wordmark-dark-on-white.png");
  await sharp(Buffer.from(svg(BONE, INK))).png().toFile("exports/orenara-wordmark-bone-on-ink.png");
  console.log(`done ${W}x${H}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
