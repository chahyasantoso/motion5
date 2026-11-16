import { fileURLToPath } from "node:url";
import { motionLivePlugin, type MotionLivePlugin } from "../vite/index";

/** What a page server adds to the config of a pieces folder: the live plugin, and the folders it may serve. */
export interface PageServerConfig {
  readonly plugins: MotionLivePlugin[];
  readonly server: { readonly fs: { readonly allow: string[] } };
}

const TOOLS_FOLDER = fileURLToPath(new URL("../../", import.meta.url));

/** The config every page server adds: the live plugin, and the pieces folder and this package as readable. */
export function pageServerConfig(root: string): PageServerConfig {
  return {
    plugins: [motionLivePlugin()],
    server: { fs: { allow: [root, TOOLS_FOLDER] } },
  };
}
