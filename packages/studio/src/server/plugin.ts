import { mkdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  PRESET_NAME,
  SAFE_ZONE_NAMES,
  listPresets,
  readPreset,
  safeZone,
  writePreset,
} from "@gerak/tools/page";
import type { Plugin, ViteDevServer } from "vite";
import { isMotionEvent, unreachable } from "@gerak/core";
import { layoutPath, parseLayout, readLayout, writeLayout } from "../layout";
import { pieceGraph } from "../piece";
import {
  BUS_PATH,
  COMMAND_EVENT,
  PRESETS_EVENT,
  REPLY_EVENT,
  type CommandEnvelope,
} from "../protocol";
import { runAct } from "./act";
import { parseCommand } from "../command";
import { addPin, pinsPath, readPins, resolvePin } from "../pin-store";
import { parseNewPin } from "../pins";
import { PINS_EVENT } from "../pins";
import { createRelay } from "./bus";
import type { SharedBrowser } from "./browser";
import { checkQueue } from "./check";
import { registeredStudioAgentTransport } from "./transport";

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

/** A thrown value as a response body: its message, and the file and line when it carries them. */
function failure(
  error: unknown,
  root: string,
): {
  readonly error: string;
  readonly file?: string;
  readonly line?: number;
} {
  if (!(error instanceof Error)) return { error: String(error) };
  const loc: unknown = Reflect.get(error, "loc");
  const file: unknown = Reflect.get(Object(loc), "file") ?? Reflect.get(error, "id");
  const line: unknown = Reflect.get(Object(loc), "line");
  const site =
    typeof file === "string" && typeof line === "number"
      ? { file, line }
      : siteInStack(error.stack ?? "", root);
  return {
    error: error.message,
    ...(site === undefined
      ? {}
      : { file: relative(root, site.file).replaceAll("\\", "/"), line: site.line }),
  };
}

/** The first file under `root` a stack trace names, with its line. */
function siteInStack(stack: string, root: string): { file: string; line: number } | undefined {
  for (const match of stack.matchAll(/((?:[A-Za-z]:)?[^\s():]+):(\d+):\d+/g)) {
    const path = resolve((match[1] ?? "").replace(/^file:\/+/, ""));
    if (path.startsWith(`${root}${sep}`) && !path.includes(`${sep}node_modules${sep}`))
      return { file: path, line: Number(match[2]) };
  }
  return undefined;
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

/** The Studio's dev-server routes: the canvas page, a piece's graph, its layout sidecar and the command bus. */
export function studioPlugin(options: {
  readonly root: string;
  readonly busTimeoutMs?: number;
  /** The session's one browser, which checks run in; its only caller is `startStudio`, which always makes one. */
  readonly browser: SharedBrowser;
}): Plugin {
  const root = resolve(options.root);
  const busTimeoutMs = options.busTimeoutMs ?? 10000;
  const relay = createRelay();
  const checks = checkQueue(options.browser);
  let nextId = 0;
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
      const pinsFile = pinsPath(root);
      const pinsChanged = (file: string): void => {
        if (resolve(file) !== resolve(pinsFile)) return;
        server.ws.send({ type: "custom", event: PINS_EVENT, data: { piece: "*" } });
      };
      mkdirSync(dirname(pinsFile), { recursive: true });
      server.watcher.add(pinsFile);
      server.watcher.on("change", pinsChanged);
      server.watcher.on("add", pinsChanged);
      server.watcher.on("unlink", pinsChanged);
      const presetsDir = join(root, ".gerak", "presets");
      const presetsChanged = (file: string): void => {
        const path = resolve(file);
        if (!path.startsWith(`${presetsDir}${sep}`)) return;
        const piece = relative(presetsDir, path).split(sep)[0] ?? "*";
        server.ws.send({ type: "custom", event: PRESETS_EVENT, data: { piece } });
      };
      mkdirSync(presetsDir, { recursive: true });
      server.watcher.add(presetsDir);
      server.watcher.on("change", presetsChanged);
      server.watcher.on("add", presetsChanged);
      server.watcher.on("unlink", presetsChanged);
      server.ws.on(REPLY_EVENT, (data: unknown) => {
        relay.receive(data);
      });
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
            case "GET /__gerak/safe-zones":
              json(200, { zones: SAFE_ZONE_NAMES.map((name) => safeZone(name)) });
              return;
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
            case "GET /__gerak/pins":
              json(200, { pins: readPins(root).filter((pin) => pin.piece === piece) });
              return;
            case "POST /__gerak/pins": {
              let body: unknown;
              try {
                body = JSON.parse(await bodyOf(req));
              } catch {
                json(400, { error: "The body is not JSON." });
                return;
              }
              const given = parseNewPin(body);
              if (given === undefined || given.piece !== piece) {
                json(400, { error: "The body is not a pin of this piece." });
                return;
              }
              json(200, { pin: addPin(root, given) });
              return;
            }
            case "POST /__gerak/pins/resolve": {
              const text = url.searchParams.get("id") ?? "";
              const pin = /^\d+$/.test(text) ? resolvePin(root, Number(text)) : undefined;
              if (pin === undefined || pin.piece !== piece)
                json(404, { error: `No pin ${text} on ${piece}.` });
              else json(200, { pin });
              return;
            }
            case "GET /__gerak/presets": {
              const name = url.searchParams.get("name");
              if (name === null) {
                json(200, { names: listPresets(root, piece) });
                return;
              }
              const events = readPreset(root, piece, name);
              if ("reason" in events) json(404, { error: events.reason });
              else json(200, { events });
              return;
            }
            case "PUT /__gerak/presets": {
              const name = url.searchParams.get("name") ?? "";
              if (!PRESET_NAME.test(name)) {
                json(400, { error: `"${name}" is not a preset name.` });
                return;
              }
              let body: unknown;
              try {
                body = JSON.parse(await bodyOf(req));
              } catch {
                json(400, { error: "The body is not JSON." });
                return;
              }
              if (!Array.isArray(body) || !body.every(isMotionEvent)) {
                json(400, { error: "The body is not a list of events." });
                return;
              }
              json(200, { saved: writePreset(root, piece, name, body) });
              return;
            }
            case `POST ${BUS_PATH}`: {
              let body: unknown;
              try {
                body = JSON.parse(await bodyOf(req));
              } catch {
                json(400, { kind: "failed", message: "The body is not JSON." });
                return;
              }
              const command = parseCommand(body);
              if (command === undefined) {
                json(400, { kind: "failed", message: "The body is not a studio command." });
                return;
              }
              switch (command.kind) {
                case "graph": {
                  const result = await pieceGraph(root, piece, load);
                  json(
                    200,
                    result.kind === "graph"
                      ? { kind: "graph", graph: result.graph }
                      : { kind: "failed", message: result.message },
                  );
                  return;
                }
                case "check": {
                  const result = await pieceGraph(root, piece, load);
                  if (result.kind !== "graph") {
                    json(200, { kind: "failed", message: result.message });
                    return;
                  }
                  const base = server.resolvedUrls?.local[0];
                  if (base === undefined) {
                    json(200, { kind: "failed", message: "The server has no address yet." });
                    return;
                  }
                  json(200, await checks.run(result.graph, result.page, command, base));
                  return;
                }
                case "act": {
                  const result = await pieceGraph(root, piece, load);
                  if (result.kind !== "graph") {
                    json(200, { kind: "failed", message: result.message });
                    return;
                  }
                  const base = server.resolvedUrls?.local[0];
                  if (base === undefined) {
                    json(200, { kind: "failed", message: "The server has no address yet." });
                    return;
                  }
                  json(
                    200,
                    await checks.exclusive(() =>
                      runAct(options.browser, { root, piece, page: result.page, base, command }),
                    ),
                  );
                  return;
                }
                case "status":
                case "focus":
                case "viewport":
                case "seek":
                case "play":
                case "select":
                case "inspect": {
                  nextId += 1;
                  const id = `${Date.now().toString(36)}-${nextId}`;
                  const answer = relay.wait(id, busTimeoutMs);
                  const envelope: CommandEnvelope = { id, piece, command };
                  server.ws.send({ type: "custom", event: COMMAND_EVENT, data: envelope });
                  const reply = await answer;
                  if (reply === undefined)
                    json(504, {
                      kind: "failed",
                      message: `No canvas answered for ${piece}. Run npx gerak studio open ${piece}, or open its canvas in a browser.`,
                    });
                  else json(200, reply);
                  return;
                }
                default:
                  unreachable(command);
              }
              return;
            }
            default:
              next();
          }
        };
        run().catch((error: unknown) => {
          json(500, failure(error, root));
        });
      });
      registeredStudioAgentTransport()?.configureServer(server);
    },
  };
}
