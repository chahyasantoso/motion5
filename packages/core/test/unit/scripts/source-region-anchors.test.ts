import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { code, codeOnly, declaration, parseSource } from "../../helpers/source-region";

// A source-text assertion is addressed by something the claim names, and this gate refuses the shape
// that is not. Issue #314 found two cases in `live-value-updates.test.ts` sliced between one
// member's name and the name of the *next* member, so three edits that change no behaviour could
// turn them red, and one of them could widen the window in silence instead.
//
// The scan that issue asked for rather than guessed at found the same shape in three more places:
// `LV-14` bounded by `compose(`, `SH-7` bounded by `#removeTrack(`, and `RA-113` hand-rolling the
// identical slice with `indexOf` and no helper at all. It also found the lower bound to be the worse
// half. `#writeValues(` matches its declaration and every call site, and `#handle` calls it while
// being declared earlier in the file, so the window `LV-5` and `PK-17` actually read began inside
// the handle factory and covered fifteen members, `#apply` and `#invalidateOne` among them. Both
// claims were true of that window by accident, and one of them was a claim about a single owner
// measured over two of them.
//
// Gated rather than written down alone, on `evidence-case-ids.test.ts`'s reason: the shape this
// refuses is invisible in review, because a window bounded by a plausible identifier reads exactly
// like a window bounded by a claim. `docs/TESTING-STRATEGY.md` owns the rule itself, and
// `packages/core/test/helpers/source-region.ts` is the one owner of the reading.
//
// The scan root and the walk are `evidence-case-ids.test.ts`'s, deliberately: a source-reading idiom
// is no more one package's than a citation id is.
const REPO_ROOT = fileURLToPath(new URL("../../../../../", import.meta.url));
const SELF = "packages/core/test/unit/scripts/source-region-anchors.test.ts";
const HELPER = "packages/core/test/helpers/source-region.ts";
const UNWALKED = new Set(["node_modules", "dist", "coverage"]);
const TEST_FILE = /\.test\.tsx?$/;
/** Actual import specifier suffix; a mention in a comment or fixture is not an import. */
const HELPER_IMPORT = "/helpers/source-region";

/** Source URL syntax is independent of the receiving name or surrounding read wrapper. */
function readsSource(source: string): boolean {
  let found = false;
  function visit(node: ts.Node): void {
    if (
      ts.isNewExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "URL" &&
      node.arguments?.[0] !== undefined &&
      ts.isStringLiteralLike(node.arguments[0]) &&
      /(?:^|\/)src\//.test(node.arguments[0].text)
    )
      found = true;
    ts.forEachChild(node, visit);
  }
  visit(parseSource(source));
  return found;
}

function importsOwner(source: string): boolean {
  return parseSource(source).statements.some(
    (node) =>
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      node.moduleSpecifier.text.endsWith(HELPER_IMPORT) &&
      node.importClause !== undefined &&
      !node.importClause.isTypeOnly &&
      node.importClause.namedBindings !== undefined &&
      (ts.isNamespaceImport(node.importClause.namedBindings) ||
        node.importClause.namedBindings.elements.some((element) => !element.isTypeOnly)),
  );
}
/**
 * A local redeclaration of anything the one owner exports, asked only of a file that reads source.
 *
 * Scoped rather than suite-wide, and the scope is a finding rather than a carve-out: `member` is a
 * domain word in this suite. Three solver cases declare a local `member()` that builds a
 * `MemberState` or a bone definition, and none of them is a second owner of anything this rule is
 * about, so a gate refusing the spelling suite-wide would be measuring a name instead of a subject.
 * This file's first run did exactly that and named all three, which is the measurement rather than
 * the theory.
 */
const REDECLARED =
  /^\s*(?:export\s+)?function\s+(code|codeOnly|region|member|declaration|callSites|parseSource)\s*\(/m;
/**
 * The retired helper's own declaration, refused suite-wide because that one name is not overloaded.
 *
 * Nothing in this tree calls a chain member, a bone or a published record a region, so a file
 * declaring one is reintroducing the mechanism wherever it happens to sit.
 */
const RETIRED_HELPER = /^\s*(?:export\s+)?function\s+region\s*\(/m;
/** A call to the retired two-bound helper, which no longer exists to be called. */
const RETIRED_CALL = /(?<![.\w])region\s*\(/;
/**
 * Closed migration set, emptied by issue #317. No additions: discovery must find new readers.
 * The syntactic scope is source-path URLs, including directories and wrapped reads, not arbitrary
 * computed filesystem paths. Importing production code or quoting a fixture is not a source read.
 */
const PENDING: readonly string[] = [];

function testFilesUnder(directory: string): readonly string[] {
  const found: string[] = [];
  for (const entry of readdirSync(`${REPO_ROOT}${directory}`, { withFileTypes: true })) {
    const path = `${directory}${entry.name}`;
    if (entry.isDirectory()) {
      if (entry.name.startsWith(".") || UNWALKED.has(entry.name)) continue;
      found.push(...testFilesUnder(`${path}/`));
    } else if (TEST_FILE.test(entry.name) && path !== SELF) found.push(path);
  }
  return found;
}

function testFiles(): readonly string[] {
  return [...testFilesUnder("")].sort();
}

function sourceOf(relativePath: string): string {
  return readFileSync(`${REPO_ROOT}${relativePath}`, "utf8");
}

describe("source-region anchors", () => {
  const files = testFiles().map((path) => ({ path, source: sourceOf(path) }));
  const readers = files.filter(({ source }) => readsSource(source));

  it("declares the source helpers in one place and nowhere else", () => {
    const shadowed = readers.filter(({ source }) => REDECLARED.test(codeOnly(source)));
    expect(shadowed.map(({ path }) => path).sort()).toEqual([]);
    const retired = files.filter(({ source }) => RETIRED_HELPER.test(codeOnly(source)));
    expect(retired.map(({ path }) => path).sort()).toEqual([]);
    const owner = codeOnly(sourceOf(HELPER));
    const exported = ["code", "codeOnly", "member", "declaration", "callSites", "parseSource"];
    expect(exported.filter((name) => !owner.includes(`export function ${name}(`))).toEqual([]);
  });

  it("leaves no call to the retired two-bound helper anywhere in the suite", () => {
    const offenders = files.filter(({ source }) => RETIRED_CALL.test(codeOnly(source)));
    expect(offenders.map(({ path }) => path).sort()).toEqual([]);
  });

  it("reads source through the one owner with an empty closed pending set", () => {
    expect(readers.length).toBeGreaterThanOrEqual(13);
    expect(readers.map(({ path }) => path)).toEqual(
      expect.arrayContaining([
        "packages/core/test/integration/bare-authored-leaf.test.ts",
        "packages/core/test/integration/plugin-group-values-section.test.ts",
        "packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts",
      ]),
    );
    expect(
      readers
        .filter(({ source }) => !importsOwner(source))
        .map(({ path }) => path)
        .sort(),
    ).toEqual([...PENDING].sort());
    expect(PENDING).toEqual([]);
  });

  it("discovers renamed and wrapped source URLs but not imports or quoted examples", () => {
    for (const source of [
      'const renamed = new URL("../../src/contract/v5.ts", import.meta.url);',
      'const anything = read(new URL("../../src/engine.ts", import.meta.url));',
      'const directory = new URL("../../src/adapters/", import.meta.url);',
    ])
      expect(readsSource(source)).toBe(true);
    for (const source of [
      'import { Engine } from "../../src/engine";',
      '// new URL("../../src/engine.ts", import.meta.url)',
      `const example = ${JSON.stringify('new URL("../../src/engine.ts", import.meta.url)')};`,
      'const config = new URL("../../docs/README.md", import.meta.url);',
    ])
      expect(readsSource(source)).toBe(false);
  });

  it("requires a real helper import rather than prose or a type-only import", () => {
    const statement = 'import { code as readCode } from "../../helpers/source-region";';
    expect(importsOwner(statement)).toBe(true);
    expect(importsOwner(`// ${statement}`)).toBe(false);
    expect(importsOwner(`const example = ${JSON.stringify(statement)};`)).toBe(false);
    expect(importsOwner('import type { code } from "../../helpers/source-region";')).toBe(false);
    expect(importsOwner('import { type code } from "../../helpers/source-region";')).toBe(false);
  });

  it("keeps parsed declaration bounds through nested braces and semicolons", () => {
    const source =
      "export type Shape = { nested: { first: string; second: number }; tail: boolean };";
    expect(declaration(source, "export type Shape", ";")).toContain("tail: boolean");
    expect(() =>
      declaration('const prose = "export type Shape = string;";', "export type Shape", ";"),
    ).toThrow();
    expect(() => declaration(`${source}\n${source}`, "export type Shape", ";")).toThrow();
    expect(() =>
      declaration("export type ShapeExtra = string;", "export type Shape", ";"),
    ).toThrow();
  });

  it("reads statement syntax without comments while preserving quoted tokens", () => {
    const directory = mkdtempSync(join(tmpdir(), "motion5-source-projection-"));
    const path = join(directory, "fixture.ts");
    const source = [
      '/** removed-doc */ const url = "https://example.test/a"; // removed-tail',
      'const literal = "/* literal */"; const pattern = /word/;',
      "const text = `literal ${actual()}`;",
      "const result = left/* removed-inline */+right;",
    ].join("\n");
    try {
      writeFileSync(path, source);
      const projected = code(path);
      expect(projected.length).toBe(source.length);
      expect(projected).not.toMatch(/removed-doc|removed-tail|removed-inline/);
      expect(projected).toContain('"https://example.test/a"');
      expect(projected).toContain('"/* literal */"');
      expect(projected).toContain("/word/");
      expect(projected).toContain("`literal ${actual()}`");
      expect(projected.indexOf("actual")).toBe(source.indexOf("actual"));
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("preserves offsets and executable template substitutions while erasing literal text", () => {
    const source = [
      '/** prose */ const url = "https://example.test/a"; // trailing',
      "const pattern = /symbol/;",
      "const text = `symbol ${realCall()} tail ${otherCall()}`;",
      "const divided = value / divisor; const adjacent = a/* gap */+b;",
    ].join("\n");
    const projected = codeOnly(source);
    expect(projected.length).toBe(source.length);
    expect(projected.split("\n").map((line) => line.length)).toEqual(
      source.split("\n").map((line) => line.length),
    );
    expect(projected).not.toContain("symbol");
    expect(projected).not.toContain("https");
    expect(projected.indexOf("realCall")).toBe(source.indexOf("realCall"));
    expect(projected.indexOf("otherCall")).toBe(source.indexOf("otherCall"));
    expect(projected).toContain("value / divisor");
    expect(projected).toContain("a         +b");
    const jsx = codeOnly('const view = <div title="symbol">prose{actual()}</div>;', "view.tsx");
    expect(jsx).toContain("actual()");
    expect(jsx).not.toMatch(/symbol|prose/);
  });
});
