import opentype from "opentype.js";
import sharp from "sharp";
import { mkdirSync, readFileSync } from "fs";

const S = 1080;
const INK = "#0F1113";
const BONE = "#F3EEE4";
const EMBER = "#D9A05B";

async function main() {
  const buf = readFileSync("/tmp/Archivo-Medium.ttf");
  const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

  // Big "O" monogram centered
  const FS = 620;
  const glyph = font.charToGlyph("O");
  const bb = glyph.getPath(0, FS, FS).getBoundingBox();
  const gw = bb.x2 - bb.x1;
  const gh = bb.y2 - bb.y1;
  const ox = (S - gw) / 2 - bb.x1;
  const oy = (S - gh) / 2 - bb.y1;
  const d = glyph.getPath(ox, FS + oy, FS).toPathData(3);

  // wordmark version: same math as the invoice wordmark script
  const FSW = 112;
  const TR = 0.22 * FSW;
  let x = 0;
  const wpaths: string[] = [];
  for (const ch of "ORENARA") {
    const g = font.charToGlyph(ch);
    wpaths.push(g.getPath(x, FSW, FSW).toPathData(3));
    x += (g.advanceWidth! / font.unitsPerEm) * FSW + TR;
  }
  const ww = x - TR;
  // bounding box of all paths for exact centering
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const ch2 of [font.charToGlyph("O").getPath(0, FSW, FSW).getBoundingBox()]) {}
  const tx = (S - ww) / 2;
  const ty = (S - FSW * 0.72) / 2 + FSW * 0.72; // optical baseline centering for caps
  const wsvgGroup = `<g transform="translate(${tx},${ty - FSW})" fill="${BONE}">` + wpaths.map(p => `<path d="${p}"/>`).join("") + `</g>`;

  const mono = (fill: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><rect width="${S}" height="${S}" fill="${INK}"/><path d="${d}" fill="${fill}"/></svg>`;
  const wordmarkSvg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><rect width="${S}" height="${S}" fill="${INK}"/>${wsvgGroup}</svg>`;

  mkdirSync("exports", { recursive: true });
  await sharp(Buffer.from(mono(EMBER))).png().toFile("exports/orenara-ig-avatar-ember-o.png");
  await sharp(Buffer.from(mono(BONE))).png().toFile("exports/orenara-ig-avatar-bone-o.png");
  await sharp(Buffer.from(wordmarkSvg)).png().toFile("exports/orenara-ig-avatar-wordmark.png");
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); });
