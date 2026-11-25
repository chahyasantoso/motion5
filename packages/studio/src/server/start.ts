import { fileURLToPath } from "node:url";
import { pageServerConfig } from "@gerak/tools/page";
import { removeDiscovery, writeDiscovery } from "./discovery";
import { sharedBrowser } from "./browser";
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
  readonly busTimeoutMs?: number;
  /** Opens the canvas in the session's own headless browser and keeps it open until `close`. */
  readonly headless?: boolean;
}): Promise<{
  readonly url: string;
  /** How many browsers this session has launched: none until a check or a headless canvas needs one. */
  launches(): number;
  close(): Promise<void>;
}> {
  const { createServer } = await import("vite");
  const added = await pageServerConfig(options.root);
  const browser = sharedBrowser();
  const server = await createServer({
    root: options.root,
    logLevel: "error",
    plugins: [
      ...added.plugins,
      studioPlugin({
        root: options.root,
        browser,
        ...(options.busTimeoutMs === undefined ? {} : { busTimeoutMs: options.busTimeoutMs }),
      }),
    ],
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
  const url = studioUrl(base, options.piece);
  if (options.headless === true) {
    try {
      const page = await (await browser.get()).newPage({ viewport: { width: 1440, height: 900 } });
      await page.goto(url, { waitUntil: "load" });
    } catch (error) {
      await browser.close();
      await server.close();
      throw error;
    }
  }
  writeDiscovery(options.root, { url: base, piece: options.piece });
  return {
    url,
    launches: () => browser.launches,
    close: async () => {
      removeDiscovery(options.root);
      await browser.close();
      await server.close();
    },
  };
}
