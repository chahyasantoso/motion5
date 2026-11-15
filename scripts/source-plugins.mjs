import { registerSourceLoader } from "./source-loader.mjs";

// Loads the tools' Vite plugin from source, so this repository's config needs no build of @gerak/tools.
registerSourceLoader();
export const { motionLivePlugin } = await import("@gerak/tools/vite");
