import { fileURLToPath } from "node:url";
import { searchForWorkspaceRoot } from "vite";
import { motionLivePlugin, type MotionLivePlugin } from "../vite/index";

/** What a page server adds to the config of a pieces folder: the live plugin, and the folders it may serve. */
export interface PageServerConfig {
  readonly plugins: MotionLivePlugin[];
  readonly server: { readonly fs: { readonly allow: string[] } };
}

const TOOLS_FOLDER = fileURLToPath(new URL("../../", import.meta.url));

/** The config every page server adds: the live plugin; readable, Vite's own workspace root, the pieces folder and this package. */
export function pageServerConfig(root: string): PageServerConfig {
  return {
    plugins: [motionLivePlugin()],
    server: { fs: { allow: [searchForWorkspaceRoot(root), root, TOOLS_FOLDER] } },
  };
}
