import { readFileSync } from "node:fs";
import { expect } from "vitest";
import ts from "typescript";

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

/** The pinned TypeScript parser owns lexical context, never a second regex lexer. */
export function parseSource(source: string, filename = "source.ts"): ts.SourceFile {
  return ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);
}

/** Erasure preserves offsets, line breaks, and separation between adjacent code tokens. */
function blank(source: string): string {
  return source.replace(/[^\r\n]/g, " ");
}

function literalText(node: ts.Node): boolean {
  return (
    ts.isStringLiteralLike(node) ||
    node.kind === ts.SyntaxKind.RegularExpressionLiteral ||
    node.kind === ts.SyntaxKind.TemplateHead ||
    node.kind === ts.SyntaxKind.TemplateMiddle ||
    node.kind === ts.SyntaxKind.TemplateTail ||
    node.kind === ts.SyntaxKind.JsxText
  );
}

/**
 * Visit syntax tokens, never JSDoc trees. Gaps are trivia, erased in both projections.
 * Regex bodies are not division; template substitutions are executable code, not template text.
 */
function project(source: string, filename: string, keepLiterals: boolean): string {
  const tree = parseSource(source, filename);
  const chunks: string[] = [];
  let end = 0;
  function visit(node: ts.Node): void {
    if (node.kind === ts.SyntaxKind.JSDocComment) return;
    const children = node.getChildren(tree);
    if (children.length > 0) {
      for (const child of children) visit(child);
      return;
    }
    if (node.kind === ts.SyntaxKind.EndOfFileToken) return;
    const start = node.getStart(tree);
    chunks.push(blank(source.slice(end, start)));
    const token = source.slice(start, node.end);
    chunks.push(!keepLiterals && literalText(node) ? blank(token) : token);
    end = node.end;
  }
  visit(tree);
  chunks.push(blank(source.slice(end)));
  return chunks.join("");
}

/** Statement projection: no comments, but literal tokens remain part of their statements. */
export function code(path: string | URL): string {
  return project(readFileSync(path, "utf8"), path instanceof URL ? path.pathname : path, true);
}

/**
 * Schema/symbol projection: comments, quoted/regex bodies, and template text cannot be evidence.
 * Executable template substitutions remain. Pass the actual filename for TSX syntax.
 */
export function codeOnly(source: string, filename = "source.ts"): string {
  return project(source, filename, false);
}

export interface SeamResultModule {
  readonly filename: string;
  readonly source: string;
}

export interface SeamResultRead {
  readonly filename: string;
  readonly position: number;
  readonly kind: "member" | "decoder-alias";
  readonly name: string;
}

export interface SeamResultOptions {
  readonly resultBindings: readonly string[];
  readonly decoderName: string;
  readonly ownerFilename: string;
}

/**
 * Reports syntactic reads of a seam result outside its owner, plus aliased decoder calls.
 *
 * The caller supplies the result bindings because a single-file parse without a type checker cannot
 * infer that an unannotated value such as `answer` has type `LiveWriteResult`. The analysis follows
 * identifier aliases, object destructuring, and direct helper calls whose arguments carry a result;
 * it also follows aliases of the named decoder so `const decode = liveWrite; decode(answer)` is not
 * hidden by a direct call-site count. Its function, taint, and decoder maps are keyed by identifier
 * text rather than lexical scope, as `docs/TESTING-STRATEGY.md` disclaims. It does not resolve
 * computed names, dynamic calls, or data flow that leaves the supplied modules.
 */
export function seamResultReads(
  modules: readonly SeamResultModule[],
  options: SeamResultOptions,
): readonly SeamResultRead[] {
  const findings: SeamResultRead[] = [];
  for (const module of modules) {
    const tree = parseSource(module.source, module.filename);
    const tainted = new Set(options.resultBindings);
    const decoderAliases = new Set([options.decoderName]);
    const functions = new Map<string, ts.FunctionLikeDeclaration>();
    const reported = new Set<string>();

    function addFinding(node: ts.Node, kind: SeamResultRead["kind"], name: string): void {
      if (module.filename === options.ownerFilename) return;
      const key = `${node.getStart(tree)}:${kind}:${name}`;
      if (reported.has(key)) return;
      reported.add(key);
      findings.push({
        filename: module.filename,
        position: node.getStart(tree),
        kind,
        name,
      });
    }

    function identifierName(node: ts.Node | undefined): string | undefined {
      return node !== undefined && ts.isIdentifier(node) ? node.text : undefined;
    }

    function expressionName(node: ts.Expression): string | undefined {
      if (ts.isIdentifier(node)) return node.text;
      if (ts.isPropertyAccessExpression(node)) return node.name.text;
      if (ts.isElementAccessExpression(node) && ts.isStringLiteralLike(node.argumentExpression))
        return node.argumentExpression.text;
      return undefined;
    }

    function isTainted(node: ts.Node | undefined): boolean {
      if (node === undefined) return false;
      if (ts.isIdentifier(node)) return tainted.has(node.text);
      if (ts.isParenthesizedExpression(node)) return isTainted(node.expression);
      if (ts.isAsExpression(node) || ts.isTypeAssertionExpression(node))
        return isTainted(node.expression);
      if (ts.isNonNullExpression(node)) return isTainted(node.expression);
      return false;
    }

    function bindPattern(pattern: ts.BindingName): void {
      if (ts.isIdentifier(pattern)) {
        tainted.add(pattern.text);
        return;
      }
      for (const element of pattern.elements) {
        if (ts.isOmittedExpression(element)) continue;
        if (ts.isBindingElement(element)) {
          if (element.dotDotDotToken) bindPattern(element.name);
          else if (ts.isObjectBindingPattern(pattern)) {
            const property = element.propertyName ?? element.name;
            const member = expressionName(property as ts.Expression);
            if (member !== undefined) addFinding(element, "member", member);
            if (isTainted(element.initializer)) bindPattern(element.name);
          }
        }
      }
    }

    function isFunctionLikeDeclaration(node: ts.Node): node is ts.FunctionLikeDeclaration {
      return (
        ts.isFunctionDeclaration(node) ||
        ts.isFunctionExpression(node) ||
        ts.isArrowFunction(node) ||
        ts.isMethodDeclaration(node) ||
        ts.isGetAccessorDeclaration(node) ||
        ts.isSetAccessorDeclaration(node)
      );
    }

    function functionName(node: ts.FunctionLikeDeclaration): string | undefined {
      if (ts.isFunctionDeclaration(node) && node.name !== undefined) return node.name.text;
      if (node.parent !== undefined && ts.isVariableDeclaration(node.parent))
        return identifierName(node.parent.name);
      return undefined;
    }

    function returnsTainted(node: ts.FunctionLikeDeclaration): boolean {
      let result = false;
      if (node.body === undefined) return result;
      function visitReturn(child: ts.Node): void {
        if (ts.isReturnStatement(child) && isTainted(child.expression)) result = true;
        ts.forEachChild(child, visitReturn);
      }
      visitReturn(node.body);
      return result;
    }

    function callTarget(node: ts.Expression): string | undefined {
      return expressionName(node);
    }

    function decoderReference(node: ts.Expression): string | undefined {
      if (ts.isCallExpression(node)) return undefined;
      return callTarget(node);
    }

    function visitDeclarations(node: ts.Node): void {
      if (isFunctionLikeDeclaration(node)) {
        const name = functionName(node);
        if (name !== undefined) functions.set(name, node);
      }
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
        const value = node.initializer;
        if (value !== undefined && decoderReference(value) === options.decoderName)
          decoderAliases.add(node.name.text);
        if (value !== undefined && isTainted(value)) tainted.add(node.name.text);
      }
      ts.forEachChild(node, visitDeclarations);
    }
    visitDeclarations(tree);

    let changed = true;
    while (changed) {
      const before = tainted.size + decoderAliases.size;
      function visitFlow(node: ts.Node): void {
        if (ts.isVariableDeclaration(node) && node.initializer !== undefined) {
          const initializer = node.initializer;
          const target = node.name;
          if (isTainted(initializer)) bindPattern(target);
          const called = ts.isCallExpression(initializer)
            ? callTarget(initializer.expression)
            : undefined;
          const implementation = called === undefined ? undefined : functions.get(called);
          if (implementation !== undefined && returnsTainted(implementation)) bindPattern(target);
          if (ts.isIdentifier(target)) {
            const called = decoderReference(initializer);
            if (called !== undefined && decoderAliases.has(called)) decoderAliases.add(target.text);
          }
        }
        if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
          if (isTainted(node.right) && ts.isIdentifier(node.left)) tainted.add(node.left.text);
        }
        if (ts.isCallExpression(node)) {
          const called = callTarget(node.expression);
          const implementation = called === undefined ? undefined : functions.get(called);
          if (implementation !== undefined) {
            implementation.parameters.forEach((parameter, index) => {
              if (isTainted(node.arguments[index])) bindPattern(parameter.name);
            });
          }
        }
        ts.forEachChild(node, visitFlow);
      }
      visitFlow(tree);
      changed = before !== tainted.size + decoderAliases.size;
    }

    function visitReads(node: ts.Node): void {
      if (ts.isPropertyAccessExpression(node) && isTainted(node.expression))
        addFinding(node, "member", node.name.text);
      if (ts.isElementAccessExpression(node) && isTainted(node.expression)) {
        const member = node.argumentExpression;
        if (ts.isStringLiteralLike(member)) addFinding(node, "member", member.text);
      }
      if (ts.isCallExpression(node)) {
        const called = callTarget(node.expression);
        if (called !== undefined && decoderAliases.has(called) && called !== options.decoderName)
          addFinding(node, "decoder-alias", called);
      }
      ts.forEachChild(node, visitReads);
    }
    visitReads(tree);
  }
  return findings;
}

/** Named calls, including namespace and literal-property access, never declarations or prose. */
export function callSites(source: string, name: string): readonly number[] {
  const tree = parseSource(source);
  const found: number[] = [];
  function visit(node: ts.Node): void {
    if (ts.isCallExpression(node)) {
      const callee = node.expression;
      const calledName = ts.isIdentifier(callee)
        ? callee.text
        : ts.isPropertyAccessExpression(callee)
          ? callee.name.text
          : ts.isElementAccessExpression(callee) &&
              ts.isStringLiteralLike(callee.argumentExpression)
            ? callee.argumentExpression.text
            : undefined;
      if (calledName === name) found.push(node.getStart(tree));
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  return found;
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
 * Exactly one top-level interface or type alias, ending at its parsed terminator.
 * Nested member braces and semicolons cannot truncate the subject. Prose cannot impersonate its
 * opening, and missing, duplicate, wrong-kind, and unterminated declarations fail explicitly.
 * The signature remains shared with PK-18; issue #317 strengthens the one owner.
 */
export function declaration(source: string, opening: string, terminator: "}" | ";"): string {
  const tree = parseSource(source);
  const matches = tree.statements.filter((node) => {
    if (!ts.isInterfaceDeclaration(node) && !ts.isTypeAliasDeclaration(node)) return false;
    const text = node.getText(tree);
    if (!text.startsWith(opening)) return false;
    return !/\w$/.test(opening) || !/^\w/.test(text.slice(opening.length));
  });
  expect(matches, `expected exactly one declaration opening with "${opening}"`).toHaveLength(1);
  const node = matches[0]!;
  expect(
    terminator === "}" ? ts.isInterfaceDeclaration(node) : ts.isTypeAliasDeclaration(node),
    `"${opening}" has the wrong declaration kind`,
  ).toBe(true);
  expect(node.getText(tree).endsWith(terminator), `"${opening}" has no "${terminator}"`).toBe(true);
  return project(source, "source.ts", true).slice(node.getStart(tree), node.end - 1);
}
