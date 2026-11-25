import { relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin, ViteDevServer } from "vite";
import { layoutPath, parseLayout, readLayout, writeLayout } from "../layout";
import { pieceGraph } from "../piece";

/** The path the canvas page is served at. */
export const STUDIO_PATH = "/__gerak/studio";

const FROM_SOURCE = import.meta.url.endsWith(".ts");
const CLIENT = fileURLToPath(
  new URL(FROM_SOURCE ? "../canvas/main.tsx" : "../canvas/main.js", import.meta.url),
);
const THEME = fileURLToPath(new URL("../canvas/theme.css", import.meta.url));

function fsUrl(path: string): string {
  return `/@fs/${path.replaceAll("\\", "/").replace(/^\//, "")}`;
}

/** The canvas page: one root, the theme and the client entry, served through Vite. */
export function studioHtml(piece: string): string {
  return [
    "<!doctype html>",
    '<html lang="en">',
    "  <head>",
    '    <meta charset="UTF-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `    <title>${piece} · gerak studio</title>`,
    `    <link rel="stylesheet" href="${fsUrl(THEME)}" />`,
    "  </head>",
    "  <body>",
    '    <div id="studio"></div>',
    `    <script type="module" src="${fsUrl(CLIENT)}"></script>`,
    "  </body>",
    "</html>",
  ].join("\n");
}

type Headers = Readonly<Record<string, string | readonly string[] | undefined>>;

function first(value: string | readonly string[] | undefined): string | undefined {
  return typeof value === "string" ? value : value?.[0];
}

/** Whether a request comes from a page this server serves, or from no page at all. */
function ownRequest(headers: Headers): boolean {
  const site = first(headers["sec-fetch-site"]);
  if (site !== undefined) return site === "same-origin" || site === "none";
  const origin = first(headers["origin"]);
  if (origin === undefined) return true;
  const host = first(headers["host"]);
  return host !== undefined && URL.canParse(origin) && new URL(origin).host === host;
}

const PIECE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

function bodyOf(req: NodeJS.ReadableStream): Promise<string> {
  return new Promise((done, fail) => {
    let text = "";
    req.on("data", (chunk: Buffer | string) => {
      text += chunk.toString();
    });
    req.on("end", () => done(text));
    req.on("error", fail);
  });
}

/** The Studio's dev-server routes: the canvas page, a piece's graph and its layout sidecar. */
export function studioPlugin(options: { readonly root: string }): Plugin {
  const root = resolve(options.root);
  return {
    name: "gerak-studio",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      const changed = (file: string): void => {
        const path = resolve(file);
        if (!path.startsWith(`${root}${sep}`) || path.includes(`${sep}.gerak${sep}`)) return;
        const name = relative(root, path).replaceAll("\\", "/");
        server.ws.send({ type: "custom", event: "gerak:changed", data: { file: name } });
      };
      server.watcher.on("change", changed);
      server.watcher.on("add", changed);
      server.watcher.on("unlink", changed);
      const load = (file: string): Promise<unknown> => server.ssrLoadModule(file);
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url ?? "", "http://localhost");
        if (!url.pathname.startsWith("/__gerak/")) {
          next();
          return;
        }
        const send = (status: number, body: string, type = "application/json"): void => {
          res.statusCode = status;
          res.setHeader("Content-Type", type);
          res.end(body);
        };
        const json = (status: number, value: unknown): void => send(status, JSON.stringify(value));
        if (!ownRequest(req.headers)) {
          json(403, { error: "Only this server's own pages may call the Studio." });
          return;
        }
        const piece = url.searchParams.get("piece") ?? "";
        if (!PIECE.test(piece)) {
          json(400, { error: `"${piece}" is not a piece name.` });
          return;
        }
        const route = `${req.method ?? "GET"} ${url.pathname}`;
        const run = async (): Promise<void> => {
          switch (route) {
            case `GET ${STUDIO_PATH}`: {
              const html = await server.transformIndexHtml(url.pathname, studioHtml(piece));
              send(200, html, "text/html");
              return;
            }
            case "GET /__gerak/graph": {
              const result = await pieceGraph(root, piece, load);
              if (result.kind === "graph")
                json(200, { graph: result.graph, page: result.page ?? null });
              else json(422, { error: result.message });
              return;
            }
            case "GET /__gerak/layout":
              json(200, readLayout(layoutPath(root, piece)));
              return;
            case "PUT /__gerak/layout": {
              const given = parseLayout(JSON.parse(await bodyOf(req)));
              const result = await pieceGraph(root, piece, load);
              if (result.kind === "graph")
                json(200, writeLayout(layoutPath(root, piece), given, result.graph));
              else json(422, { error: result.message });
              return;
            }
            default:
              next();
          }
        };
        run().catch((error: unknown) => {
          json(500, { error: error instanceof Error ? error.message : String(error) });
        });
      });
    },
  };
}
