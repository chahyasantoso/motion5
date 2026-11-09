import { existsSync } from "node:fs";
import { join } from "node:path";
import { DEFAULT_ROOT, fromCaller } from "./page";

export { DEFAULT_ROOT } from "./page";

/** Arguments parsed for the motion:live command. */
export type LiveArgs =
  | { readonly kind: "ok"; readonly scene: string; readonly root: string; readonly port: number }
  | { readonly kind: "usage"; readonly message: string };

const SCENE_NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const DEFAULT_PORT = 5173;

/** Parses command-line arguments for the motion:live command. */
export function parseLiveArgs(argv: readonly string[]): LiveArgs {
  const usage = (message: string): LiveArgs => ({ kind: "usage", message });
  const positional: string[] = [];
  let rootArg: string | undefined;
  let portArg: string | undefined;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === undefined) continue;
    if (arg === "--root") {
      const next = argv[index + 1];
      if (next === undefined || next.startsWith("--")) return usage("--root needs a folder.");
      rootArg = next;
      index += 1;
      continue;
    }
    if (arg === "--port") {
      const next = argv[index + 1];
      if (next === undefined || next.startsWith("--")) return usage("--port needs a port number.");
      portArg = next;
      index += 1;
      continue;
    }
    if (arg.startsWith("--")) {
      return usage(`Unknown flag ${arg}.`);
    }
    positional.push(arg);
  }

  const scene = positional[0];
  if (scene === undefined || positional.length !== 1) {
    return usage("Expected one scene name: motion:live <name> [--root dir] [--port number].");
  }

  if (!SCENE_NAME.test(scene)) {
    return usage(`Scene name "${scene}" must be lower kebab-case, like "timing" or "rope-word".`);
  }

  const root = rootArg !== undefined ? fromCaller(rootArg) : DEFAULT_ROOT;
  const scenePath = join(root, `src/${scene}-scene.ts`);
  if (!existsSync(scenePath)) {
    return usage(`No scene src/${scene}-scene.ts under ${root}.`);
  }

  let port = DEFAULT_PORT;
  if (portArg !== undefined) {
    const parsedPort = Number(portArg);
    if (!Number.isInteger(parsedPort) || parsedPort < 0 || parsedPort > 65535) {
      return usage(`--port must be an integer between 0 and 65535, got "${portArg}".`);
    }
    port = parsedPort;
  }

  return { kind: "ok", scene, root, port };
}

/** Builds the live URL for a scene on a base address. */
export function livePageUrl(base: string, scene: string): string {
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return `${prefix}live.html?scene=${encodeURIComponent(scene)}`;
}

/** Probes for an existing live server or starts a new Vite dev server for a scene. */
export async function startLiveServer(options: {
  readonly scene: string;
  readonly root: string;
  readonly port: number;
}): Promise<{ readonly url: string; readonly reused: boolean; close(): Promise<void> }> {
  if (options.port > 0) {
    try {
      const probe = await fetch(`http://localhost:${options.port}/live.html`);
      if (probe.ok) {
        return {
          url: livePageUrl(`http://localhost:${options.port}/`, options.scene),
          reused: true,
          close: async () => undefined,
        };
      }
    } catch {
      // Port is not listening yet; start a fresh dev server.
    }
  }

  const { createServer } = await import("vite");
  const server = await createServer({
    root: options.root,
    logLevel: "silent",
    server: { port: options.port },
  });
  await server.listen();
  const base = server.resolvedUrls?.local[0] ?? `http://localhost:${options.port}/`;
  return {
    url: livePageUrl(base, options.scene),
    reused: false,
    close: () => server.close(),
  };
}
