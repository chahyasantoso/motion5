import { readFileSync, writeFileSync } from "node:fs";
import { resolve, sep } from "node:path";
import ts from "typescript";

/** A single scanned numeric literal in source code. */
export interface NumericLiteralSpan {
  readonly start: number;
  readonly end: number;
  readonly text: string;
  readonly value: number;
  readonly call?: string;
  readonly property?: string;
}

/** Result of resolving a requested scene file path. */
export type ResolveSceneResult =
  | { readonly kind: "ok"; readonly path: string }
  | { readonly kind: "refused"; readonly message: string };

/** Result of attempting a source file edit. */
export type SourceEditResult =
  | {
      readonly kind: "written";
      readonly source: string;
      readonly literals: readonly NumericLiteralSpan[];
    }
  | {
      readonly kind: "stale";
      readonly source: string;
      readonly literals: readonly NumericLiteralSpan[];
    };

interface EditPayload {
  readonly file: string;
  readonly start: number;
  readonly end: number;
  readonly oldText: string;
  readonly newText: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEditPayload(value: unknown): value is EditPayload {
  if (!isRecord(value)) return false;
  const file = Reflect.get(value, "file");
  const start = Reflect.get(value, "start");
  const end = Reflect.get(value, "end");
  const oldText = Reflect.get(value, "oldText");
  const newText = Reflect.get(value, "newText");
  return (
    typeof file === "string" &&
    typeof start === "number" &&
    typeof end === "number" &&
    typeof oldText === "string" &&
    typeof newText === "string"
  );
}

function enclosingCallAndProperty(node: ts.Node): {
  readonly call?: string;
  readonly property?: string;
} {
  const parent = node.parent;
  if (parent === undefined || !ts.isPropertyAssignment(parent)) {
    return {};
  }
  let property: string | undefined;
  if (ts.isIdentifier(parent.name) || ts.isStringLiteral(parent.name)) {
    property = parent.name.text;
  }
  const obj = parent.parent;
  let call: string | undefined;
  if (obj !== undefined && ts.isObjectLiteralExpression(obj)) {
    const callNode = obj.parent;
    if (
      callNode !== undefined &&
      ts.isCallExpression(callNode) &&
      ts.isIdentifier(callNode.expression)
    ) {
      call = callNode.expression.text;
    }
  }
  return {
    ...(call !== undefined ? { call } : {}),
    ...(property !== undefined ? { property } : {}),
  };
}

/** Scans all numeric literals in TypeScript source and their enclosing call and property. */
export function scanNumericLiterals(source: string): readonly NumericLiteralSpan[] {
  const sf = ts.createSourceFile(
    "scene.ts",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const spans: NumericLiteralSpan[] = [];

  function visit(node: ts.Node): void {
    if (
      ts.isPrefixUnaryExpression(node) &&
      node.operator === ts.SyntaxKind.MinusToken &&
      ts.isNumericLiteral(node.operand)
    ) {
      const start = node.getStart(sf);
      const end = node.getEnd();
      const text = source.slice(start, end);
      const value = Number(text);
      const { call, property } = enclosingCallAndProperty(node);
      spans.push({
        start,
        end,
        text,
        value,
        ...(call !== undefined ? { call } : {}),
        ...(property !== undefined ? { property } : {}),
      });
      return;
    }

    if (ts.isNumericLiteral(node)) {
      const start = node.getStart(sf);
      const end = node.getEnd();
      const text = source.slice(start, end);
      const value = Number(text);
      const { call, property } = enclosingCallAndProperty(node);
      spans.push({
        start,
        end,
        text,
        value,
        ...(call !== undefined ? { call } : {}),
        ...(property !== undefined ? { property } : {}),
      });
      return;
    }

    ts.forEachChild(node, visit);
  }

  visit(sf);
  return spans;
}

/** Resolves a scene file path relative to appRoot and verifies it stays inside apps. */
export function resolveSceneFile(
  fileParam: string,
  appRoot: string,
  repoRoot?: string,
): ResolveSceneResult {
  if (fileParam.length === 0 || (!fileParam.endsWith(".ts") && !fileParam.endsWith(".tsx"))) {
    return { kind: "refused", message: "Path must end in .ts or .tsx." };
  }
  const fullAppRoot = resolve(appRoot);
  const fullPath = resolve(fullAppRoot, fileParam);
  if (!fullPath.startsWith(fullAppRoot + sep)) {
    return { kind: "refused", message: "Path must stay inside apps/." };
  }
  const normalized = fullPath.replace(/\\/g, "/");
  const insideApps =
    repoRoot !== undefined
      ? fullPath.startsWith(resolve(repoRoot, "apps") + sep)
      : normalized.includes("/apps/");
  if (!insideApps) {
    return { kind: "refused", message: "Path must stay inside apps/." };
  }
  return { kind: "ok", path: fullPath };
}

/** Applies a replacement edit to a file on disk if oldText matches current contents. */
export function applySourceEdit(
  filePath: string,
  edit: {
    readonly start: number;
    readonly end: number;
    readonly oldText: string;
    readonly newText: string;
  },
): SourceEditResult {
  const current = readFileSync(filePath, "utf8");
  if (
    edit.start < 0 ||
    edit.end < edit.start ||
    edit.end > current.length ||
    current.slice(edit.start, edit.end) !== edit.oldText
  ) {
    return { kind: "stale", source: current, literals: scanNumericLiterals(current) };
  }
  const next = current.slice(0, edit.start) + edit.newText + current.slice(edit.end);
  writeFileSync(filePath, next, "utf8");
  return { kind: "written", source: next, literals: scanNumericLiterals(next) };
}

/** Returns true only for non-production serve commands. */
export function canAttachLiveEndpoints(config: {
  readonly command?: string | undefined;
  readonly isProduction?: boolean | undefined;
}): boolean {
  return config.command === "serve" && config.isProduction !== true;
}

export interface MotionLiveRequest {
  readonly method?: string | undefined;
  readonly url?: string | undefined;
  on(event: "data", listener: (chunk: Buffer | string) => void): unknown;
  on(event: "end", listener: () => void): unknown;
}

export interface MotionLiveResponse {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(chunk?: string): void;
}

export interface MotionLiveServer {
  readonly config: {
    readonly command?: string | undefined;
    readonly isProduction?: boolean | undefined;
    readonly root?: string | undefined;
  };
  readonly watcher?:
    | {
        emit(event: "change", path: string): unknown;
      }
    | undefined;
  readonly middlewares?:
    | {
        use(fn: (req: MotionLiveRequest, res: MotionLiveResponse, next: () => void) => void): void;
      }
    | undefined;
}

export interface MotionLivePlugin {
  readonly name: string;
  transform(code: string, id: string): { readonly code: string; readonly map: null } | null;
  configureServer(server: MotionLiveServer): void;
}

/** Provides live HMR scene transform and source/edit endpoints for the live editor. */
export function motionLivePlugin(options?: {
  readonly appRoot?: string;
  readonly repoRoot?: string;
}): MotionLivePlugin {
  return {
    name: "motion-live",
    transform(code: string, id: string) {
      const normalized = id.replace(/\\/g, "/");
      if (
        normalized.endsWith(".tsx") &&
        normalized.includes("/src/") &&
        !normalized.endsWith("-main.tsx")
      ) {
        const match = /from\s+["'](\.\/[a-z0-9-]+-scene)["']/.exec(code);
        if (match !== null && match[1] !== undefined) {
          const appended =
            code +
            `\nexport * as __motionScene from "${match[1]}";\n` +
            `if (import.meta.hot) {\n` +
            `  import.meta.hot.on("vite:error", (payload) => {\n` +
            `    window.dispatchEvent(new CustomEvent("motion:error", { detail: payload }));\n` +
            `  });\n` +
            `  import.meta.hot.accept((next) => {\n` +
            `    if (next) window.dispatchEvent(new CustomEvent("motion:hot", { detail: next }));\n` +
            `  });\n` +
            `}\n`;
          return { code: appended, map: null };
        }
      }
      return null;
    },
    configureServer(server: MotionLiveServer): void {
      if (!canAttachLiveEndpoints(server.config)) {
        throw new Error("motionLivePlugin refuses a production server.");
      }
      const appRoot = options?.appRoot ?? server.config.root ?? process.cwd();
      if (server.middlewares === undefined) {
        return;
      }
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url ?? "";
        const url = new URL(rawUrl, "http://localhost");
        if (req.method === "GET" && url.pathname === "/__motion/source") {
          const file = url.searchParams.get("file") ?? "";
          const resolved = resolveSceneFile(file, appRoot, options?.repoRoot);
          if (resolved.kind === "refused") {
            res.statusCode = 403;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: resolved.message }));
            return;
          }
          try {
            const source = readFileSync(resolved.path, "utf8");
            const literals = scanNumericLiterals(source);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ source, literals }));
          } catch (err: unknown) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            const message = err instanceof Error ? err.message : String(err);
            res.end(JSON.stringify({ error: message }));
          }
          return;
        }

        if (req.method === "POST" && url.pathname === "/__motion/edit") {
          let body = "";
          req.on("data", (chunk: Buffer | string) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            try {
              const parsed: unknown = JSON.parse(body);
              if (!isEditPayload(parsed)) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Invalid edit payload." }));
                return;
              }
              const resolved = resolveSceneFile(parsed.file, appRoot, options?.repoRoot);
              if (resolved.kind === "refused") {
                res.statusCode = 403;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: resolved.message }));
                return;
              }
              const result = applySourceEdit(resolved.path, {
                start: parsed.start,
                end: parsed.end,
                oldText: parsed.oldText,
                newText: parsed.newText,
              });
              if (result.kind === "written") {
                server.watcher?.emit("change", resolved.path);
              }
              res.statusCode = result.kind === "written" ? 200 : 409;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(result));
            } catch (err: unknown) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              const message = err instanceof Error ? err.message : String(err);
              res.end(JSON.stringify({ error: message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}
