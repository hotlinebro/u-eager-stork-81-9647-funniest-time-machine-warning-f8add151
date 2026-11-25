// Funniest Time Machine Warning Label — make.fun entry
// Writes one warning label (1-120 chars) to /output/entry.txt
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "CAUTION: Do not meet your past self. He has already claimed this trip 23 times, for $0.";

if (LINE.length < 1 || LINE.length > 120) {
  throw new Error(`entry must be 1-120 characters, got ${LINE.length}`);
}
// Self-check gate: the gate scorer requires one line, 1-120 chars,
// not only whitespace. Fail loudly here instead of shipping a bad file.
if (/[\r\n]/.test(LINE)) {
  throw new Error("entry must be a single line");
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
// Safety-notice format check: a warning label must read like a genuine
// safety notice, not a joke setup — the deadpan frame is criterion 4.
if (!/^(CAUTION|WARNING): /.test(LINE)) {
  throw new Error("entry must open as a genuine safety notice (CAUTION:/WARNING:)");
}
// Punchline guard: the joke turns on the real history (23 claims) and the
// surprise payoff lands in the last words — never silently drop either.
if (!LINE.includes("23 times") || !LINE.endsWith("for $0.")) {
  throw new Error("entry lost its punchline: expected '23 times' and a '$0.' payoff at the end");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");
// Read back and verify what actually landed on disk.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== LINE) {
  throw new Error("read-back mismatch: /output/entry.txt differs from entry");
}
if (written.endsWith("\n")) {
  throw new Error("entry must not end with a trailing newline: the gate counts every character");
}
console.log(`wrote ${LINE.length} chars to /output/entry.txt`);
