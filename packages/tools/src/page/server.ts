import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { motionLivePlugin, type MotionLivePlugin } from "../vite/index";

/** What a page server adds to the config of a pieces folder: the live plugin, dev optimizer settings and the folders it may serve. */
export interface PageServerConfig {
  readonly plugins: MotionLivePlugin[];
  readonly optimizeDeps: {
    readonly exclude: string[];
    readonly include: string[];
  };
  readonly server: { readonly fs: { readonly allow: string[] } };
}

const TOOLS_FOLDER = fileURLToPath(new URL("../../", import.meta.url));

const REACT_ENTRIES = [
  "react",
  "react-dom",
  "react-dom/client",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
];

/** Whether `name` resolves from the pieces folder. */
function resolvable(root: string, name: string): boolean {
  try {
    createRequire(join(root, "package.json")).resolve(name);
    return true;
  } catch {
    return false;
  }
}

/** The config every page server adds: `@gerak/tools` left unbundled for virtual modules, every dependency a page loads pre-bundled at start, and readable roots. */
export async function pageServerConfig(root: string): Promise<PageServerConfig> {
  const { searchForWorkspaceRoot } = await import("vite");
  return {
    plugins: [motionLivePlugin()],
    optimizeDeps: {
      exclude: ["@gerak/tools", "@gerak/tools/pages"],
      // A dependency found during a page load re-bundles mid-load and answers the page 504.
      include: resolvable(root, "three") ? [...REACT_ENTRIES, "three"] : REACT_ENTRIES,
    },
    server: { fs: { allow: [searchForWorkspaceRoot(root), root, TOOLS_FOLDER] } },
  };
}
