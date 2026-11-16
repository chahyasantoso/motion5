import { fileURLToPath } from "node:url";
import { searchForWorkspaceRoot } from "vite";
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

/** The config every page server adds: `@gerak/tools` left unbundled for virtual modules, CJS React peers pre-bundled, and readable roots. */
export function pageServerConfig(root: string): PageServerConfig {
  return {
    plugins: [motionLivePlugin()],
    optimizeDeps: {
      exclude: ["@gerak/tools", "@gerak/tools/pages"],
      include: ["react", "react-dom", "react-dom/client", "react/jsx-runtime"],
    },
    server: { fs: { allow: [searchForWorkspaceRoot(root), root, TOOLS_FOLDER] } },
  };
}
