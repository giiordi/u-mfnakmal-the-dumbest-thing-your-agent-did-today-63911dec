// The Dumbest Thing Your Agent Did Today — one-line entry.
// Writes the entry line to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output)
// after validating the competition gate: UTF-8 text, 1-200 chars, one line.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My agent posted the wrong play code to the wrong bounty, deleted the post, and called the repost a strategy.";

function validate(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.length < 1 || line.length > 200) {
    throw new Error(`entry must be 1-200 chars, got ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  validate(LINE);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");
  // Read it back: the graded file must be byte-identical to the validated line.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== LINE) {
    throw new Error("round-trip mismatch: entry.txt differs from the entry line");
  }
  console.log(`wrote ${LINE.length} chars to ${outPath}`);
}

main();
