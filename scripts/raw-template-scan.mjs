#!/usr/bin/env node
// A subprocess scenario body is a String.raw template, so a backtick inside one closes it and the
// next one opens another. That is not a style question: it is a syntax error several lines later, and
// it took four CI jobs down at once because tsc, prettier, the vitest transform and evidence
// discovery each failed on the same byte pair. A vitest guard cannot own this, since a test file that
// does not parse is exactly the file that stops a vitest guard from loading, so the check is a lexer
// that runs before typecheck.
//
// The rule is deliberately narrow and deliberately not swept across the repository. Several other
// subprocess suites interpolate from their outer fixture on purpose, which is intended behaviour, so
// this scans only the files that declare the prohibition in their own docblock.
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const SCANNED = [
  "packages/core/test/unit/scripts/checkpoint-policy.test.ts",
  "packages/core/test/unit/scripts/automation-checkpoint.test.ts",
];
const TAG = "String.raw";
// What may legally follow a scenario body's closing backtick, ignoring whitespace.
const TERMINATOR = /^[\s]*[),;.]/;

/** Every String.raw template in source order, located by lexing rather than by parsing. */
function templates(text) {
  const found = [];
  let at = text.indexOf(TAG);
  while (at !== -1) {
    let cursor = at + TAG.length;
    while (cursor < text.length && /\s/.test(text[cursor])) cursor += 1;
    if (text[cursor] === "`") {
      // A raw template has no escape processing, so the next backtick is the close, full stop.
      const close = text.indexOf("`", cursor + 1);
      found.push({
        open: cursor,
        close,
        body: close === -1 ? null : text.slice(cursor + 1, close),
      });
    }
    at = text.indexOf(TAG, at + TAG.length);
  }
  return found;
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

const root = fileURLToPath(new URL("../", import.meta.url));
const failures = [];

for (const file of SCANNED) {
  const text = await readFile(new URL(file, new URL(`file://${root}`)), "utf8");
  const found = templates(text);
  if (found.length === 0)
    failures.push(`${file}: no String.raw template found; is this file still the scenario owner?`);
  for (const template of found) {
    const line = lineOf(text, template.open);
    if (template.close === -1) {
      failures.push(`${file}:${line}: a String.raw template is never closed`);
      continue;
    }
    if (template.body.includes("${"))
      failures.push(
        `${file}:${line}: a String.raw template interpolates; a scenario body must be inert`,
      );
    const after = text.slice(template.close + 1);
    if (!TERMINATOR.test(after))
      failures.push(
        `${file}:${lineOf(text, template.close)}: a String.raw template closes mid-expression, so its body quoted a backtick`,
      );
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(failure);
  console.error(
    "A scenario body carries no backtick and no interpolation, comments included. Name a command in prose.",
  );
  process.exitCode = 1;
} else {
  console.log(`raw-template-scan: ${SCANNED.length} files clean`);
}
