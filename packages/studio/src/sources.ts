import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import ts from "typescript";
import { unreachable } from "@gerak/core";
import { scanHtmlCasts, type PageCastKind } from "@gerak/tools/page";

/** A place in a piece's code: a file relative to the piece folder, and a 1-based line. */
export interface CodeSite {
  readonly file: string;
  readonly line: number;
}

/** What kind of file a source is, by its extension. */
export type SourceKind = "audio" | "captions" | "clip" | "image" | "model";

/** A file under the piece's `audio/` or `media/` folder. */
export interface SourceFile {
  readonly path: string;
  readonly kind: SourceKind;
}

/** Where a cue file's events go: the scene's `cues`, or the `until` of a named shot. */
export type CueTarget =
  | { readonly kind: "scene" }
  | { readonly kind: "shot"; readonly shot: string };

/** A cue file the scene module imports, the job that makes it and where its events go. */
export interface CueFile {
  readonly path: string;
  /** The `.words.json` made beside it, when the scene imports that too. */
  readonly words?: string | undefined;
  readonly job: "beats" | "cues";
  /** The audio or captions file of the same name under `audio/`. */
  readonly from?: string | undefined;
  readonly feeds: readonly CueTarget[];
}

/** A `<video>` or `<audio>` cast element's file in the page. */
export interface MediaSource {
  readonly member: string;
  readonly path: string;
}

/** A literal option of a package move, such as `distance: 8`. */
export interface Knob {
  readonly name: string;
  readonly value: number | string | boolean;
}

/** A local function or const that wraps a package move, such as `backwards(fade())`. */
export interface Wrapper {
  readonly name: string;
  readonly site: CodeSite;
  readonly doc?: string | undefined;
}

/** One `.moves(...)` argument read from code: a package move, or hand-written code. */
export interface MoveSite {
  readonly kind: "motion" | "code";
  readonly label?: string | undefined;
  readonly site: CodeSite;
  /** The first paragraph of the doc comment of what a code move points at. */
  readonly doc?: string | undefined;
  readonly knobs?: readonly Knob[] | undefined;
  readonly wrappers?: readonly Wrapper[] | undefined;
}

/** The statically named members and beats a scene assigned to a const without a written name holds. */
export interface SubScene {
  readonly members: readonly string[];
  readonly beats: readonly string[];
}

/** A binding step read from code, in step order: a move, or a `.modifies(...)` call. */
export type StaticStep =
  | { readonly kind: "move"; readonly move: MoveSite }
  | { readonly kind: "modifies" };

/** Something the reader saw but cannot place, such as a dynamic import. */
export interface Unplaced {
  readonly site: CodeSite;
  readonly text: string;
}

/** What a piece's files say statically, read without running them. */
export interface PieceSources {
  /** The page's `data-cast` names, or undefined with no page. */
  readonly pageCasts: Readonly<Record<string, PageCastKind>> | undefined;
  readonly files: readonly SourceFile[];
  readonly cueFiles: readonly CueFile[];
  readonly media: readonly MediaSource[];
  /** Each statically named member's binding steps; absent when its moves cannot be read in order. */
  readonly steps: Readonly<Record<string, readonly StaticStep[]>>;
  /** Each `const x = scene(...)` with no written `name`, by the const's name. */
  readonly scenes: Readonly<Record<string, SubScene>>;
  readonly unplaced: readonly Unplaced[];
}

const KINDS: Readonly<Record<string, SourceKind>> = {
  ".mp3": "audio",
  ".wav": "audio",
  ".m4a": "audio",
  ".ogg": "audio",
  ".aac": "audio",
  ".flac": "audio",
  ".srt": "captions",
  ".vtt": "captions",
  ".mp4": "clip",
  ".webm": "clip",
  ".mov": "clip",
  ".png": "image",
  ".jpg": "image",
  ".jpeg": "image",
  ".webp": "image",
  ".gif": "image",
  ".svg": "image",
  ".avif": "image",
  ".glb": "model",
  ".gltf": "model",
};

const ELEMENT_MAKERS = new Set(["box", "text", "shape", "object"]);
const BINDING_CALLS = new Set(["moves", "modifies", "shows", "limits"]);
const WINDOW_CALLS = new Set(["in", "take", "loop", "ambient"]);
const CODE_MAKERS = new Set(["motion", "bind", "bindEach"]);

interface ModuleFile {
  readonly path: string;
  readonly source: ts.SourceFile;
  readonly imports: ReadonlyMap<string, { readonly spec: string; readonly imported: string }>;
  readonly consts: ReadonlyMap<string, ts.Expression>;
  /** Names taken out of an object by destructuring: `const { a } = from`. */
  readonly picks: ReadonlyMap<string, { readonly from: ts.Expression; readonly key: string }>;
  readonly functions: ReadonlyMap<string, ts.FunctionDeclaration>;
}

type Resolved =
  | { readonly kind: "const"; readonly file: ModuleFile; readonly expr: ts.Expression }
  | { readonly kind: "function"; readonly file: ModuleFile; readonly decl: ts.Node }
  | {
      readonly kind: "pick";
      readonly file: ModuleFile;
      readonly from: ts.Expression;
      readonly key: string;
    }
  | { readonly kind: "package"; readonly spec: string; readonly imported: string }
  | { readonly kind: "json"; readonly path: string };

function optionsText(options: ts.ObjectLiteralExpression, key: string): ts.Expression | undefined {
  for (const property of options.properties)
    if (
      ts.isPropertyAssignment(property) &&
      (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) &&
      property.name.text === key
    )
      return property.initializer;
  return undefined;
}

function knobsOf(call: ts.CallExpression): readonly Knob[] {
  const options = call.arguments[0];
  if (options === undefined || !ts.isObjectLiteralExpression(options)) return [];
  const out: Knob[] = [];
  for (const property of options.properties) {
    if (
      !ts.isPropertyAssignment(property) ||
      !(ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))
    )
      continue;
    const value = property.initializer;
    const name = property.name.text;
    if (ts.isNumericLiteral(value)) out.push({ name, value: Number(value.text) });
    else if (
      ts.isPrefixUnaryExpression(value) &&
      value.operator === ts.SyntaxKind.MinusToken &&
      ts.isNumericLiteral(value.operand)
    )
      out.push({ name, value: -Number(value.operand.text) });
    else if (ts.isStringLiteralLike(value)) out.push({ name, value: value.text });
    else if (value.kind === ts.SyntaxKind.TrueKeyword) out.push({ name, value: true });
    else if (value.kind === ts.SyntaxKind.FalseKeyword) out.push({ name, value: false });
  }
  return out;
}

/** The first paragraph of the doc comment on a function declaration or a const's initializer. */
function docOf(node: ts.Node): string | undefined {
  let host: ts.Node | undefined;
  if (ts.isFunctionDeclaration(node)) host = node;
  else if (ts.isVariableDeclaration(node.parent) && node.parent.initializer === node) {
    const statement = node.parent.parent.parent;
    if (ts.isVariableStatement(statement)) host = statement;
  }
  if (host === undefined) return undefined;
  const docs = ts.getJSDocCommentsAndTags(host).filter(ts.isJSDoc);
  const text = ts.getTextOfJSDocComment(docs.at(-1)?.comment);
  const first = text
    ?.split(/\r?\n\s*\r?\n/)[0]
    ?.replace(/\s*\r?\n\s*/g, " ")
    .trim();
  return first === undefined || first === "" ? undefined : first;
}

function relativeModule(from: string, spec: string): string | undefined {
  const base = resolve(dirname(from), spec);
  const tries = [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts")];
  return tries.find((path) => /\.tsx?$/.test(path) && existsSync(path) && statSync(path).isFile());
}

function readModule(path: string): ModuleFile {
  const text = readFileSync(path, "utf8");
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
  const imports = new Map<string, { spec: string; imported: string }>();
  const consts = new Map<string, ts.Expression>();
  const functions = new Map<string, ts.FunctionDeclaration>();
  const picks = new Map<string, { from: ts.Expression; key: string }>();
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const spec = statement.moduleSpecifier.text;
      const clause = statement.importClause;
      if (clause?.name !== undefined) imports.set(clause.name.text, { spec, imported: "default" });
      const bindings = clause?.namedBindings;
      if (bindings !== undefined && ts.isNamedImports(bindings))
        for (const element of bindings.elements)
          imports.set(element.name.text, {
            spec,
            imported: (element.propertyName ?? element.name).text,
          });
    } else if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        const { name, initializer } = declaration;
        if (initializer === undefined) continue;
        if (ts.isIdentifier(name)) consts.set(name.text, initializer);
        else if (ts.isObjectBindingPattern(name))
          for (const element of name.elements) {
            const key = element.propertyName ?? element.name;
            if (
              element.dotDotDotToken === undefined &&
              ts.isIdentifier(element.name) &&
              ts.isIdentifier(key)
            )
              picks.set(element.name.text, { from: initializer, key: key.text });
          }
      }
    } else if (ts.isFunctionDeclaration(statement) && statement.name !== undefined) {
      functions.set(statement.name.text, statement);
    }
  }
  return { path, source, imports, consts, picks, functions };
}

/** Reads a piece's sources: the scene module and the modules it imports, its page and its folders. */
export function readSources(sceneFile: string): PieceSources {
  const scenePath = resolve(sceneFile);
  const srcDir = dirname(scenePath);
  const pieceDir = basename(srcDir) === "src" ? dirname(srcDir) : srcDir;
  const rel = (path: string): string => relative(pieceDir, path).replaceAll("\\", "/");

  const modules = new Map<string, ModuleFile>();
  const queue = [scenePath];
  while (queue.length > 0) {
    const path = queue.shift();
    if (path === undefined || modules.has(path)) continue;
    const module = readModule(path);
    modules.set(path, module);
    for (const { spec } of module.imports.values())
      if (spec.startsWith(".")) {
        const next = relativeModule(path, spec);
        if (next !== undefined) queue.push(next);
      }
  }

  const siteOf = (file: ModuleFile, node: ts.Node): CodeSite => ({
    file: rel(file.path),
    line: file.source.getLineAndCharacterOfPosition(node.getStart(file.source)).line + 1,
  });

  const resolveName = (file: ModuleFile, name: string, depth = 0): Resolved | undefined => {
    if (depth > 8) return undefined;
    const local = file.consts.get(name);
    if (local !== undefined) return { kind: "const", file, expr: local };
    const fn = file.functions.get(name);
    if (fn !== undefined) return { kind: "function", file, decl: fn };
    const pick = file.picks.get(name);
    if (pick !== undefined) return { kind: "pick", file, ...pick };
    const imported = file.imports.get(name);
    if (imported === undefined) return undefined;
    if (!imported.spec.startsWith(".")) return { kind: "package", ...imported };
    if (imported.spec.endsWith(".json"))
      return { kind: "json", path: rel(resolve(dirname(file.path), imported.spec)) };
    const target = relativeModule(file.path, imported.spec);
    const module = target === undefined ? undefined : modules.get(target);
    return module === undefined ? undefined : resolveName(module, imported.imported, depth + 1);
  };

  const unwrap = (expr: ts.Expression): ts.Expression => {
    let at = expr;
    for (;;) {
      if (ts.isParenthesizedExpression(at) || ts.isAsExpression(at) || ts.isSatisfiesExpression(at))
        at = at.expression;
      else return at;
    }
  };

  /** The initializer of property `key` of the object literal `expr` names. */
  const propertyOf = (
    file: ModuleFile,
    expr: ts.Expression,
    key: string,
    depth: number,
  ): { readonly file: ModuleFile; readonly expr: ts.Expression } | undefined => {
    const at = unwrap(expr);
    if (depth > 8) return undefined;
    if (ts.isObjectLiteralExpression(at)) {
      const found = optionsText(at, key);
      return found === undefined ? undefined : { file, expr: found };
    }
    if (ts.isIdentifier(at)) {
      const found = resolveName(file, at.text);
      if (found?.kind === "const") return propertyOf(found.file, found.expr, key, depth + 1);
      if (found?.kind === "pick") {
        const inner = propertyOf(found.file, found.from, found.key, depth + 1);
        return inner === undefined ? undefined : propertyOf(inner.file, inner.expr, key, depth + 1);
      }
    }
    return undefined;
  };

  const elementName = (file: ModuleFile, expr: ts.Expression, depth = 0): string | undefined => {
    const at = unwrap(expr);
    if (depth > 8) return undefined;
    if (ts.isIdentifier(at)) {
      const found = resolveName(file, at.text);
      if (found?.kind === "const") return elementName(found.file, found.expr, depth + 1);
      if (found?.kind === "pick") {
        const inner = propertyOf(found.file, found.from, found.key, depth + 1);
        return inner === undefined ? undefined : elementName(inner.file, inner.expr, depth + 1);
      }
      return undefined;
    }
    if (ts.isPropertyAccessExpression(at)) {
      const inner = propertyOf(file, at.expression, at.name.text, depth + 1);
      return inner === undefined ? undefined : elementName(inner.file, inner.expr, depth + 1);
    }
    if (!ts.isCallExpression(at) || !ts.isIdentifier(at.expression)) return undefined;
    if (!ELEMENT_MAKERS.has(at.expression.text)) return undefined;
    const first = at.arguments[0];
    if (first === undefined) return undefined;
    if (ts.isStringLiteralLike(first)) return first.text;
    if (ts.isPropertyAccessExpression(first) && first.name.text === "name") {
      const owner = first.expression;
      if (ts.isPropertyAccessExpression(owner)) return owner.name.text;
    }
    return undefined;
  };

  const classify = (
    file: ModuleFile,
    expr: ts.Expression,
    label: string | undefined,
    depth = 0,
  ): MoveSite => {
    let at = unwrap(expr);
    while (
      ts.isCallExpression(at) &&
      ts.isPropertyAccessExpression(at.expression) &&
      WINDOW_CALLS.has(at.expression.name.text)
    )
      at = unwrap(at.expression.expression);
    const docField = (node: ts.Node): { readonly doc?: string } => {
      const doc = docOf(node);
      return doc === undefined ? {} : { doc };
    };
    const code = (node: ts.Node, name = label): MoveSite => ({
      kind: "code",
      ...(name === undefined ? {} : { label: name }),
      site: siteOf(file, node),
      ...docField(node),
    });
    if (depth > 8) return code(at);
    if (ts.isIdentifier(at)) {
      const found = resolveName(file, at.text);
      const name = label ?? at.text;
      if (found === undefined || found.kind === "json") return code(at, name);
      switch (found.kind) {
        case "package":
          return { kind: "motion", label: name, site: siteOf(file, at) };
        case "const":
          return classify(found.file, found.expr, name, depth + 1);
        case "function":
          return {
            kind: "code",
            label: name,
            site: siteOf(found.file, found.decl),
            ...docField(found.decl),
          };
        case "pick":
          return code(at, name);
        default:
          return unreachable(found);
      }
    }
    if (ts.isCallExpression(at) && ts.isIdentifier(at.expression)) {
      const callee = at.expression.text;
      const found = resolveName(file, callee);
      if (found?.kind === "package") {
        if (callee === "stagger" && at.arguments[0] !== undefined) {
          const inner = classify(file, at.arguments[0], undefined, depth + 1);
          return { ...inner, label: `stagger(${inner.label ?? "…"})` };
        }
        if (callee === "motion" && at.arguments[0] !== undefined) {
          const made = unwrap(at.arguments[0]);
          if (ts.isCallExpression(made) && ts.isIdentifier(made.expression)) {
            const inner = resolveName(file, made.expression.text);
            if (inner?.kind === "function")
              return {
                kind: "code",
                label: label ?? made.expression.text,
                site: siteOf(inner.file, inner.decl),
                ...docField(inner.decl),
              };
            if (inner?.kind === "const")
              return {
                kind: "code",
                label: label ?? made.expression.text,
                site: siteOf(inner.file, inner.expr),
                ...docField(inner.expr),
              };
          }
        }
        if (CODE_MAKERS.has(callee))
          return code(at, label ?? (callee === "motion" ? undefined : callee));
        const knobs = knobsOf(at);
        return {
          kind: "motion",
          label: label ?? callee,
          site: siteOf(file, at),
          ...(knobs.length === 0 ? {} : { knobs }),
        };
      }
      if (found?.kind === "function" || found?.kind === "const") {
        const defined = found.kind === "function" ? found.decl : found.expr;
        const wrapped = at.arguments.length === 1 ? at.arguments[0] : undefined;
        const inner =
          wrapped === undefined ? undefined : classify(file, wrapped, undefined, depth + 1);
        if (inner?.kind === "motion" && inner.wrappers === undefined)
          return {
            ...inner,
            label: label ?? inner.label,
            wrappers: [{ name: callee, site: siteOf(found.file, defined), ...docField(defined) }],
          };
        return {
          kind: "code",
          label: label ?? callee,
          site: siteOf(found.file, defined),
          ...docField(defined),
        };
      }
      return code(at, label ?? callee);
    }
    return code(at);
  };

  const rootConst = new Set<string>();
  for (const statement of modules.get(scenePath)?.source.statements ?? [])
    if (ts.isExportAssignment(statement) && ts.isIdentifier(statement.expression))
      rootConst.add(statement.expression.text);

  /** The const a `scene(...)` call without a written `name` assigns to, when `node` sits inside it. */
  const sceneConstOf = (node: ts.Node): string | undefined => {
    for (let at = node.parent; at !== undefined; at = at.parent) {
      if (!ts.isCallExpression(at) || !ts.isIdentifier(at.expression)) continue;
      if (at.expression.text !== "scene") continue;
      const owner = at.parent;
      if (!ts.isVariableDeclaration(owner) || !ts.isIdentifier(owner.name)) return undefined;
      if (owner.initializer !== at || rootConst.has(owner.name.text)) return undefined;
      const first = at.arguments[0];
      if (first !== undefined && ts.isObjectLiteralExpression(first))
        if (optionsText(first, "name") !== undefined) return undefined;
      return owner.name.text;
    }
    return undefined;
  };
  const memberOwners = new Map<string, Set<string>>();
  const beatOwners = new Map<string, Set<string>>();
  const own = (into: Map<string, Set<string>>, name: string, owner: string | undefined): void => {
    if (owner === undefined) return;
    const held = into.get(name) ?? new Set<string>();
    held.add(owner);
    into.set(name, held);
  };
  const beatNameOf = (file: ModuleFile, expr: ts.Expression, depth = 0): string | undefined => {
    const at = unwrap(expr);
    if (depth > 8) return undefined;
    if (ts.isIdentifier(at)) {
      const found = resolveName(file, at.text);
      return found?.kind === "const" ? beatNameOf(found.file, found.expr, depth + 1) : undefined;
    }
    if (!ts.isCallExpression(at) || !ts.isIdentifier(at.expression)) return undefined;
    const first = at.arguments[0];
    if (at.expression.text !== "beat" || first === undefined) return undefined;
    return ts.isStringLiteralLike(first) ? first.text : undefined;
  };

  const steps: Record<string, readonly StaticStep[]> = {};
  const unreadable = new Set<string>();
  const unplaced: Unplaced[] = [];
  const jsonFeeds = new Map<string, CueTarget[]>();
  const feed = (path: string, target: CueTarget): void => {
    const held = jsonFeeds.get(path) ?? [];
    if (!held.some((each) => JSON.stringify(each) === JSON.stringify(target))) held.push(target);
    jsonFeeds.set(path, held);
  };

  /** JSON files an expression reads: through names, consts and one level of local functions. */
  const jsonRead = (file: ModuleFile, expr: ts.Node, into: Set<string>, depth = 0): void => {
    const visit = (node: ts.Node): void => {
      if (ts.isIdentifier(node)) {
        const found = resolveName(file, node.text);
        if (found?.kind === "json") into.add(found.path);
        else if (found?.kind === "const" && depth < 2)
          jsonRead(found.file, found.expr, into, depth + 1);
        else if (found?.kind === "function" && depth < 2)
          jsonRead(found.file, found.decl, into, depth + 1);
      }
      ts.forEachChild(node, visit);
    };
    visit(expr);
  };

  const sceneNameOf = (file: ModuleFile, expr: ts.Expression, depth = 0): string | undefined => {
    const at = unwrap(expr);
    if (depth > 8) return undefined;
    if (ts.isIdentifier(at)) {
      const found = resolveName(file, at.text);
      return found?.kind === "const" ? sceneNameOf(found.file, found.expr, depth + 1) : undefined;
    }
    if (
      !ts.isCallExpression(at) ||
      !ts.isIdentifier(at.expression) ||
      at.expression.text !== "scene"
    )
      return undefined;
    const first = at.arguments[0];
    if (first === undefined || !ts.isObjectLiteralExpression(first)) return undefined;
    const name = optionsText(first, "name");
    return name !== undefined && ts.isStringLiteralLike(name) ? name.text : undefined;
  };

  for (const file of modules.values()) {
    const visit = (node: ts.Node): void => {
      if (ts.isCallExpression(node)) {
        if (node.expression.kind === ts.SyntaxKind.ImportKeyword)
          unplaced.push({ site: siteOf(file, node), text: node.getText(file.source) });
        const callee = node.expression;
        if (ts.isIdentifier(callee) && callee.text === "scene") {
          const head = node.arguments[0];
          const owner = head === undefined ? undefined : sceneConstOf(head);
          for (const arg of node.arguments) {
            const named = ts.isObjectLiteralExpression(arg) ? undefined : elementName(file, arg);
            if (named !== undefined) own(memberOwners, named, owner);
          }
          const first = node.arguments[0];
          const cues =
            first !== undefined && ts.isObjectLiteralExpression(first)
              ? optionsText(first, "cues")
              : undefined;
          if (cues !== undefined) {
            const read = new Set<string>();
            jsonRead(file, cues, read);
            for (const path of read) feed(path, { kind: "scene" });
          }
        }
        if (ts.isIdentifier(callee) && callee.text === "shot") {
          const [taken, options] = node.arguments;
          if (options !== undefined && ts.isObjectLiteralExpression(options)) {
            const until = optionsText(options, "until");
            const named = optionsText(options, "name");
            const shot =
              named !== undefined && ts.isStringLiteralLike(named)
                ? named.text
                : taken === undefined
                  ? undefined
                  : sceneNameOf(file, taken);
            if (until !== undefined && shot !== undefined) {
              const read = new Set<string>();
              jsonRead(file, until, read);
              for (const path of read) feed(path, { kind: "shot", shot });
            }
          }
        }
        if (
          ts.isPropertyAccessExpression(callee) &&
          callee.name.text === "in" &&
          node.arguments[0] !== undefined
        ) {
          const named = beatNameOf(file, node.arguments[0]);
          if (named !== undefined) own(beatOwners, named, sceneConstOf(node));
        }
        const outer =
          ts.isPropertyAccessExpression(node.parent) &&
          BINDING_CALLS.has(node.parent.name.text) &&
          ts.isCallExpression(node.parent.parent);
        if (
          ts.isPropertyAccessExpression(callee) &&
          BINDING_CALLS.has(callee.name.text) &&
          !outer
        ) {
          const chain: { readonly name: string; readonly args: ts.NodeArray<ts.Expression> }[] = [];
          let at: ts.Expression = node;
          while (
            ts.isCallExpression(at) &&
            ts.isPropertyAccessExpression(at.expression) &&
            BINDING_CALLS.has(at.expression.name.text)
          ) {
            chain.unshift({ name: at.expression.name.text, args: at.arguments });
            at = at.expression.expression;
          }
          const member = elementName(file, at);
          if (member !== undefined) {
            own(memberOwners, member, sceneConstOf(node));
            const read: StaticStep[] = [];
            let whole = true;
            for (const call of chain) {
              if (call.name === "modifies") read.push({ kind: "modifies" });
              if (call.name !== "moves") continue;
              for (const arg of call.args) {
                if (ts.isSpreadElement(arg)) {
                  whole = false;
                  unplaced.push({ site: siteOf(file, arg), text: arg.getText(file.source) });
                  continue;
                }
                read.push({ kind: "move", move: classify(file, arg, undefined) });
              }
            }
            if (!whole || member in steps) unreadable.add(member);
            else steps[member] = read;
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(file.source);
  }
  for (const member of unreadable) delete steps[member];
  const held = new Map<string, { members: string[]; beats: string[] }>();
  const holdIn = (owners: Map<string, Set<string>>, key: "members" | "beats"): void => {
    for (const [name, sets] of owners) {
      const [only, ...more] = sets;
      if (only === undefined || more.length > 0) continue;
      const entry = held.get(only) ?? { members: [], beats: [] };
      entry[key].push(name);
      held.set(only, entry);
    }
  };
  holdIn(memberOwners, "members");
  holdIn(beatOwners, "beats");
  const scenes = Object.fromEntries(held);

  const files = sourceFiles(pieceDir, rel);
  const cueFiles: CueFile[] = [];
  const imported = new Set<string>();
  for (const file of modules.values())
    for (const { spec } of file.imports.values())
      if (spec.endsWith(".json")) imported.add(rel(resolve(dirname(file.path), spec)));
  for (const path of [...imported].sort()) {
    if (!path.endsWith(".cues.json")) continue;
    const stem = basename(path, ".cues.json");
    const words = path.replace(/\.cues\.json$/, ".words.json");
    const from = files.find(
      (file) =>
        (file.kind === "audio" || file.kind === "captions") &&
        file.path.startsWith("audio/") &&
        basename(file.path, extname(file.path)) === stem,
    );
    const job =
      from === undefined
        ? jobOfContent(join(pieceDir, path))
        : from.kind === "audio"
          ? "beats"
          : "cues";
    cueFiles.push({
      path,
      ...(imported.has(words) ? { words } : {}),
      job,
      ...(from === undefined ? {} : { from: from.path }),
      feeds: jsonFeeds.get(path) ?? [],
    });
  }

  const page = join(
    pieceDir,
    `${basename(scenePath)
      .replace(/\.tsx?$/, "")
      .replace(/-scene$/, "")}.html`,
  );
  const html = existsSync(page) ? readFileSync(page, "utf8") : undefined;
  return {
    pageCasts: html === undefined ? undefined : scanHtmlCasts(html),
    files,
    cueFiles,
    media: html === undefined ? [] : mediaOf(html),
    steps,
    scenes,
    unplaced,
  };
}

function jobOfContent(path: string): "beats" | "cues" {
  try {
    const events: unknown = JSON.parse(readFileSync(path, "utf8"));
    if (
      Array.isArray(events) &&
      events.some((event) => Reflect.get(Object(event), "name") === "word")
    )
      return "cues";
  } catch {
    return "beats";
  }
  return "beats";
}

function sourceFiles(pieceDir: string, rel: (path: string) => string): readonly SourceFile[] {
  const out: SourceFile[] = [];
  const walk = (dir: string, depth: number): void => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (depth < 2) walk(path, depth + 1);
        continue;
      }
      const kind = KINDS[extname(entry.name).toLowerCase()];
      if (kind !== undefined) out.push({ path: rel(path), kind });
    }
  };
  walk(join(pieceDir, "audio"), 0);
  walk(join(pieceDir, "media"), 0);
  return out;
}

function attribute(tag: string, name: string): string | undefined {
  const match = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>\`]+))`, "i").exec(
    tag,
  );
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

function mediaOf(html: string): readonly MediaSource[] {
  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const out: MediaSource[] = [];
  for (const match of cleaned.matchAll(
    /<(video|audio)\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/\1>/gi,
  )) {
    const tag = match[2] ?? "";
    const member = attribute(tag, "data-cast");
    const inner = /<source\b((?:[^>"']|"[^"]*"|'[^']*')*)>/i.exec(match[3] ?? "")?.[1];
    const src =
      attribute(tag, "src") ?? (inner === undefined ? undefined : attribute(inner, "src"));
    if (member !== undefined && src !== undefined)
      out.push({ member, path: src.replace(/^\.\//, "") });
  }
  return out;
}
