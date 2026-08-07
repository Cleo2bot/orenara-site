/**
 * Post-generation leak check: scans a PDF's extracted text against the shared
 * supplier-code denylist (supplier-denylist.json) and exits non-zero on any match.
 *
 * Used automatically by generate-brochure.tsx and generate-channel-catalogue.tsx.
 * Can also be run standalone:  pnpm --filter @workspace/scripts exec tsx src/check-pdf-leaks.ts <pdf...>
 */
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DENYLIST_PATH = path.resolve(__dirname, "supplier-denylist.json");

export function checkPdfForLeaks(pdfPath: string): void {
  if (!existsSync(pdfPath)) {
    throw new Error(`leak check: PDF not found: ${pdfPath}`);
  }
  const { patterns } = JSON.parse(readFileSync(DENYLIST_PATH, "utf8")) as {
    patterns: string[];
  };
  const text = execFileSync("pdftotext", [pdfPath, "-"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });

  const hits: string[] = [];
  for (const p of patterns) {
    const re = new RegExp(p, "gi");
    for (const m of text.matchAll(re)) {
      hits.push(`pattern ${p} matched "${m[0]}"`);
    }
  }
  if (hits.length > 0) {
    throw new Error(
      `SUPPLIER CODE LEAK in ${path.basename(pdfPath)}:\n  ` + hits.join("\n  "),
    );
  }
  console.log(`leak check passed: ${path.basename(pdfPath)}`);
}

// Standalone CLI usage
const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error("usage: tsx src/check-pdf-leaks.ts <pdf> [...more pdfs]");
    process.exit(2);
  }
  try {
    for (const f of files) checkPdfForLeaks(f);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
}
