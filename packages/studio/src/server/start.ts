import { fileURLToPath } from "node:url";
import { pageServerConfig } from "@gerak/tools/page";
import { STUDIO_PATH, studioPlugin } from "./plugin";

const STUDIO_FOLDER = fileURLToPath(new URL("../../", import.meta.url));

/** The canvas address of `piece` on a server's base address. */
export function studioUrl(base: string, piece: string): string {
  return `${base.replace(/\/$/, "")}${STUDIO_PATH}?piece=${encodeURIComponent(piece)}`;
}

/** Starts a dev server over the pieces folder `root` serving the pieces' pages and the Studio canvas. */
export async function startStudio(options: {
  readonly root: string;
  readonly piece: string;
  readonly port: number;
}): Promise<{ readonly url: string; close(): Promise<void> }> {
  const { createServer } = await import("vite");
  const added = pageServerConfig(options.root);
  const server = await createServer({
    root: options.root,
    logLevel: "error",
    plugins: [...added.plugins, studioPlugin({ root: options.root })],
    optimizeDeps: {
      entries: ["*/*.html"],
      exclude: [...added.optimizeDeps.exclude, "@gerak/studio"],
      include: [...added.optimizeDeps.include, "@xyflow/react"],
    },
    server: {
      ...added.server,
      port: options.port,
      fs: { allow: [...added.server.fs.allow, STUDIO_FOLDER] },
    },
  });
  await server.listen();
  const base = server.resolvedUrls?.local[0] ?? `http://localhost:${options.port}/`;
  return { url: studioUrl(base, options.piece), close: () => server.close() };
}
