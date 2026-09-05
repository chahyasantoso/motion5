import { readFileSync } from "node:fs";
import { expect } from "vitest";

/**
 * One owner for every source-text assertion in the suite.
 *
 * Four test files declared `code` byte-identically and three of them declared a two-bound `region`
 * beside it, so issue #314's rule about what a region may be bounded by was a rule about four copies
 * of two functions. Declared here once, so it changes once.
 *
 * The rule: a region's bounds belong to the claim's subject. A declaration is addressed by its own
 * opening and its own terminator, never by the name of whatever happens to be declared next to it,
 * because a neighbour's name is part of no claim about its neighbour. `docs/TESTING-STRATEGY.md`
 * owns it, including which claims a source region may carry at all.
 */

/**
 * A source file with its whole-line comments removed.
 *
 * Whole-line only, deliberately: a commented-out statement can neither satisfy a `toContain` nor
 * defeat a `not.toContain`, which is the direction every claim in the suite needs. A trailing
 * comment on a code line survives, so a `toContain` claim names a statement rather than a phrase
 * that could be written in prose.
 */
export function code(path: string): string {
  return readFileSync(path, "utf8")
    .split("\n")
    .filter((line) => !/^(?:\/\/|\/\*|\*)/.test(line.trim()))
    .join("\n");
}

/**
 * The source of one declaration, bounded by its own signature and its own closing brace.
 *
 * The retired spelling sliced from one member's name to the *next* member's name, which made three
 * edits that change no behaviour able to turn a case red or, worse, widen its window in silence:
 * declaring anything between the two, renaming the neighbour, or moving either one.
 *
 * Anchored on the signature at a known indent rather than on the first occurrence of a name, which
 * is the half that had already fired. A private name matches every call site as well as its
 * declaration, `#handle` calls `#writeValues` and is declared earlier in the file, so a window
 * opened on the bare name began inside the handle factory and ran fifteen members. Requiring the
 * newline and the indent is what makes a call site unmatchable, and asserting that the opening is
 * unique is what makes the match a decision rather than a coincidence of declaration order.
 *
 * `indent` is the declaration's own column, so `""` addresses a module-level function and the
 * default addresses a class member. Issue #314.
 */
export function member(source: string, signature: string, indent = "  "): string {
  const opening = `\n${indent}${signature}`;
  const start = source.indexOf(opening);
  expect(start, `nothing is declared as "${signature}" at indent ${indent.length}`).toBeGreaterThan(
    -1,
  );
  const again = source.indexOf(opening, start + opening.length);
  expect(again, `"${signature}" opens more than one declaration`).toBe(-1);
  const close = source.indexOf(`\n${indent}}`, start + opening.length);
  expect(close, `"${signature}" is not closed at indent ${indent.length}`).toBeGreaterThan(start);
  return source.slice(start, close);
}

/**
 * The source of one declaration whose own syntax carries its terminator: `}` for an interface, `;`
 * for a type alias.
 *
 * `PK-18`'s two regions were already sound by the rule above, because both of their bounds belong to
 * the declaration they name. They are re-expressed through this function so the brace and the
 * semicolon are matched by one owner rather than assumed at two call sites, which is what makes a
 * later change to the rule reach them.
 */
export function declaration(source: string, opening: string, terminator: "}" | ";"): string {
  const start = source.indexOf(opening);
  expect(start, `no declaration opens with "${opening}"`).toBeGreaterThan(-1);
  const end = source.indexOf(terminator, start + opening.length);
  expect(end, `"${opening}" is not terminated by "${terminator}"`).toBeGreaterThan(start);
  return source.slice(start, end);
}
