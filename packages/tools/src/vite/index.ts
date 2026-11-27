import { resolve, sep } from "node:path";
import { syncHtmlCastFile } from "../page/cast-file";

/** Returns true only for non-production serve commands. */
export function canAttachLiveEndpoints(config: {
  readonly command?: string | undefined;
  readonly isProduction?: boolean | undefined;
}): boolean {
  return config.command === "serve" && config.isProduction !== true;
}

type MotionLiveHeaders = Readonly<Record<string, string | readonly string[] | undefined>>;

function firstHeader(value: string | readonly string[] | undefined): string | undefined {
  return typeof value === "string" ? value : value?.[0];
}

/** Whether a request comes from a page this server serves, or from no page at all. */
function isOwnRequest(headers: MotionLiveHeaders | undefined): boolean {
  const site = firstHeader(headers?.["sec-fetch-site"]);
  if (site !== undefined) return site === "same-origin" || site === "none";
  const origin = firstHeader(headers?.["origin"]);
  if (origin === undefined) return true;
  const host = firstHeader(headers?.["host"]);
  return host !== undefined && URL.canParse(origin) && new URL(origin).host === host;
}

export interface MotionLiveRequest {
  readonly method?: string | undefined;
  readonly url?: string | undefined;
  readonly headers?: MotionLiveHeaders | undefined;
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
        on?(event: string, listener: (path: string) => void): unknown;
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
  readonly apply: "serve";
  transform(code: string, id: string): { readonly code: string; readonly map: null } | null;
  configureServer(server: MotionLiveServer): void;
}

/** What a hot module appends: its stamp, Vite errors, and the update it hands the page. */
const HOT_SWAP =
  `export const __motionStamp = Number(new URL(import.meta.url).searchParams.get("t") ?? 0);\n` +
  `if (import.meta.hot) {\n` +
  `  const seen = import.meta.hot.data;\n` +
  `  import.meta.hot.on("vite:beforeUpdate", (payload) => {\n` +
  `    for (const update of payload.updates)\n` +
  `      seen.latest = Math.max(seen.latest ?? 0, update.timestamp);\n` +
  `  });\n` +
  `  import.meta.hot.on("vite:error", (payload) => {\n` +
  `    const detail = { ...payload, stamp: seen.latest ?? 0 };\n` +
  `    window.dispatchEvent(new CustomEvent("motion:error", { detail }));\n` +
  `  });\n` +
  `  import.meta.hot.accept((next) => {\n` +
  `    if (!next) return;\n` +
  `    const hot = new CustomEvent("motion:hot", { detail: next, cancelable: true });\n` +
  `    if (window.dispatchEvent(hot)) import.meta.hot.invalidate();\n` +
  `  });\n` +
  `}\n`;

/** Whether a source file default-exports a piece made by `scene`. */
function isStageSource(code: string): boolean {
  return /\bexport\s+default\b/.test(code) && /\bscene\s*\(/.test(code);
}

/** Provides live HMR scene transforms and HTML cast sync for dev servers. */
export function motionLivePlugin(options?: {
  readonly appRoot?: string;
  readonly repoRoot?: string;
}): MotionLivePlugin {
  return {
    name: "motion-live",
    apply: "serve",
    transform(code: string, id: string) {
      const normalized = id.replace(/\\/g, "/");
      if (!normalized.includes("/src/") || normalized.endsWith("-main.tsx")) return null;
      if (normalized.endsWith(".tsx")) {
        const match = /from\s+["'](\.\/[a-z0-9-]+-scene)["']/.exec(code);
        if (match === null || match[1] === undefined) return null;
        const scene = `\nexport * as __motionScene from "${match[1]}";\n`;
        return { code: code + scene + HOT_SWAP, map: null };
      }
      if (normalized.endsWith(".ts") && isStageSource(code))
        return { code: `${code}\n${HOT_SWAP}`, map: null };
      return null;
    },
    configureServer(server: MotionLiveServer): void {
      if (!canAttachLiveEndpoints(server.config)) {
        throw new Error("motionLivePlugin refuses a production server.");
      }
      const appRoot = options?.appRoot ?? server.config.root ?? process.cwd();
      const resolvedRoot = resolve(appRoot);
      const rootPrefix = resolvedRoot.endsWith(sep) ? resolvedRoot : `${resolvedRoot}${sep}`;
      const syncHtml = (filePath: string): void => {
        const resolved = resolve(filePath);
        const matchesRoot =
          process.platform === "win32"
            ? resolved.toLowerCase().startsWith(rootPrefix.toLowerCase())
            : resolved.startsWith(rootPrefix);
        if (!resolved.endsWith(".html") || !matchesRoot) return;
        syncHtmlCastFile(resolved);
      };
      server.watcher?.on?.("add", syncHtml);
      server.watcher?.on?.("change", syncHtml);
      if (server.middlewares === undefined) {
        return;
      }
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url ?? "";
        const url = new URL(rawUrl, "http://localhost");
        if (url.pathname.startsWith("/__motion/") && !isOwnRequest(req.headers)) {
          res.statusCode = 403;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Only this server's own pages may read or edit." }));
          return;
        }
        next();
      });
    },
  };
}
