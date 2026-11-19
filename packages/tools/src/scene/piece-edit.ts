import { DEFAULT_FRAME } from "@gerak/stage";
import ts from "typescript";

/** What to add to a piece: `.element(...)` calls as source, their names, skin rules and paint-server markup. */
export interface PieceAddition {
  readonly names: readonly string[];
  readonly members: string;
  readonly css: string;
  readonly defs: string;
  readonly defIds: readonly string[];
}

/** The edited source and the piece's own frame, or why the piece cannot be edited. */
export type PieceEdit =
  | {
      readonly kind: "edited";
      readonly source: string;
      readonly frame: { readonly width: number; readonly height: number };
    }
  | { readonly kind: "refused"; readonly message: string };

interface Insertion {
  readonly at: number;
  readonly text: string;
}

const ELEMENT_MAKERS = new Set(["box", "shape", "text", "many", "group"]);

function unwrapped(node: ts.Expression): ts.Expression {
  let current = node;
  while (
    ts.isSatisfiesExpression(current) ||
    ts.isAsExpression(current) ||
    ts.isParenthesizedExpression(current) ||
    ts.isTypeAssertionExpression(current)
  )
    current = current.expression;
  return current;
}

function namedConst(file: ts.SourceFile, name: string): ts.Expression | undefined {
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations)
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === name &&
        declaration.initializer !== undefined
      )
        return unwrapped(declaration.initializer);
  }
  return undefined;
}

/** The default export's chain and the `sceneBuilder(...)` call at its root. */
function defaultChain(
  file: ts.SourceFile,
): { readonly chain: ts.Expression; readonly root: ts.CallExpression } | undefined {
  for (const statement of file.statements) {
    if (!ts.isExportAssignment(statement) || statement.isExportEquals) continue;
    let chain = unwrapped(statement.expression);
    if (ts.isIdentifier(chain)) {
      const bound = namedConst(file, chain.text);
      if (bound === undefined) return undefined;
      chain = bound;
    }
    let node: ts.Expression = chain;
    while (ts.isCallExpression(node)) {
      const callee = node.expression;
      if (ts.isIdentifier(callee))
        return callee.text === "sceneBuilder" ? { chain, root: node } : undefined;
      if (!ts.isPropertyAccessExpression(callee)) return undefined;
      node = callee.expression;
    }
    return undefined;
  }
  return undefined;
}

function keyName(name: ts.PropertyName): string | undefined {
  return ts.isIdentifier(name) ||
    ts.isStringLiteral(name) ||
    ts.isNoSubstitutionTemplateLiteral(name)
    ? name.text
    : undefined;
}

function property(
  object: ts.ObjectLiteralExpression,
  name: string,
): ts.PropertyAssignment | undefined {
  for (const member of object.properties)
    if (ts.isPropertyAssignment(member) && keyName(member.name) === name) return member;
  return undefined;
}

function numberIn(object: ts.ObjectLiteralExpression, name: string): number | undefined {
  const found = property(object, name);
  const value = found === undefined ? undefined : unwrapped(found.initializer);
  return value !== undefined && ts.isNumericLiteral(value) ? Number(value.text) : undefined;
}

/** Every element name the piece makes: the string first argument of `box`, `shape`, `text`, `many`, `group`. */
function elementNames(file: ts.SourceFile): ReadonlySet<string> {
  const names = new Set<string>();
  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      ELEMENT_MAKERS.has(node.expression.text)
    ) {
      const [first] = node.arguments;
      if (first !== undefined && ts.isStringLiteralLike(first)) names.add(first.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return names;
}

/** Where a block of members goes at the end of an object literal, with the comma it needs. */
function appendedMembers(
  source: string,
  object: ts.ObjectLiteralExpression,
  text: string,
): Insertion {
  const at = object.properties.end;
  const comma = object.properties.length > 0 && !object.properties.hasTrailingComma ? "," : "";
  const rest = source.slice(at);
  const close = /^[ \t]*\r?\n/.test(rest) ? "" : "\n";
  return { at, text: `${comma}\n${text}${close}` };
}

/** Where text goes at the end of a template literal's own text. */
function appendedText(
  source: string,
  literal: ts.NoSubstitutionTemplateLiteral,
  text: string,
): Insertion {
  const at = literal.getEnd() - 1;
  const before = source.slice(literal.getStart() + 1, at);
  return { at, text: `${before === "" || before.endsWith("\n") ? "" : "\n"}${text}\n` };
}

/** `source` with the elements appended to its `sceneBuilder` chain, and the rules and defs to its `skin`. */
export function addToPiece(source: string, add: PieceAddition): PieceEdit {
  const file = ts.createSourceFile(
    "piece.ts",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const refuse = (message: string): PieceEdit => ({ kind: "refused", message });

  const found = defaultChain(file);
  if (found === undefined)
    return refuse("The piece must default-export a `sceneBuilder(...)` chain.");

  // A piece with no `frame` plays in the stage's default one.
  const [first] = found.root.arguments;
  const options = first === undefined ? undefined : unwrapped(first);
  if (options !== undefined && !ts.isObjectLiteralExpression(options))
    return refuse("The piece's `sceneBuilder` options are not an object literal.");
  const frameProp = options === undefined ? undefined : property(options, "frame");
  const frameNode = frameProp === undefined ? undefined : unwrapped(frameProp.initializer);
  const width =
    frameNode === undefined
      ? DEFAULT_FRAME.width
      : ts.isObjectLiteralExpression(frameNode)
        ? numberIn(frameNode, "width")
        : undefined;
  const height =
    frameNode === undefined
      ? DEFAULT_FRAME.height
      : ts.isObjectLiteralExpression(frameNode)
        ? numberIn(frameNode, "height")
        : undefined;
  if (width === undefined || height === undefined)
    return refuse("The piece's `frame` is not an object literal with a numeric width and height.");

  const known = elementNames(file);
  const clash = add.names.find((name) => known.has(name));
  if (clash !== undefined) return refuse(`The piece already has an element "${clash}".`);

  const skin = namedConst(file, "skin");
  if (skin === undefined || !ts.isObjectLiteralExpression(skin))
    return refuse("The piece's `export const skin` is not an object literal.");
  const css = property(skin, "css");
  const cssText = css === undefined ? undefined : unwrapped(css.initializer);
  if (cssText === undefined || !ts.isNoSubstitutionTemplateLiteral(cssText))
    return refuse("The piece's `skin.css` is not a template literal without substitutions.");

  const edits: Insertion[] = [
    { at: found.chain.getEnd(), text: `\n${add.members}` },
    appendedText(source, cssText, add.css),
  ];
  if (add.defs !== "") {
    const defs = property(skin, "defs");
    if (defs === undefined) {
      const line = source.lastIndexOf("\n", css === undefined ? 0 : css.getStart()) + 1;
      const indent = /^[ \t]*/.exec(source.slice(line))?.[0] ?? "";
      edits.push(appendedMembers(source, skin, `${indent}defs: \`${add.defs}\`,`));
    } else {
      const defsText = unwrapped(defs.initializer);
      if (!ts.isNoSubstitutionTemplateLiteral(defsText))
        return refuse("The piece's `skin.defs` is not a template literal without substitutions.");
      const taken = new Set<string>();
      for (const match of defsText.text.matchAll(/\bid\s*=\s*["']([^"']+)["']/g))
        if (match[1] !== undefined) taken.add(match[1]);
      const repeated = add.defIds.find((id) => taken.has(id));
      if (repeated !== undefined)
        return refuse(`The piece's defs already has the id "${repeated}".`);
      edits.push(appendedText(source, defsText, add.defs));
    }
  }

  let next = source;
  for (const { at, text } of [...edits].sort((a, b) => b.at - a.at))
    next = next.slice(0, at) + text + next.slice(at);
  return { kind: "edited", source: next, frame: { width, height } };
}
