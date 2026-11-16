import { toolsOf } from "../../tools/bin/load.mjs";

/** The file URL of a tool module of this package, found as `@gerak/tools` finds its own. */
export const tool = toolsOf(import.meta.url);
