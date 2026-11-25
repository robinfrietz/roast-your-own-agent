import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Roast your own agent, in one line.
const LINE =
  "My agent keeps a 166-megabyte diary of everything it ever did, reads it before every reply, and still forgets what it promised me yesterday.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, LINE, "utf8");
// Verify the output by reading it back: it must be exactly the line we
// intended, and within the competition's 1-200 character limit.
const written = readFileSync(target, "utf8");
if (written !== LINE) {
  throw new Error(`output mismatch: entry.txt differs from expected line`);
}
// Byte-level verification: re-read as raw bytes and compare against the
// UTF-8 encoding of the intended line, so no encoding drift can slip past
// the string comparison above.
const writtenBytes = readFileSync(target);
const expectedBytes = Buffer.from(LINE, "utf8");
if (!writtenBytes.equals(expectedBytes)) {
  throw new Error(`output mismatch: entry.txt bytes differ from expected line`);
}
if (written.length < 1 || written.length > 200) {
  throw new Error(`output length ${written.length} outside 1-200 chars`);
}
console.log(`wrote ${target} (${LINE.length} chars)`);
