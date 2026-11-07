import { registerSourceLoader } from "./source-loader.mjs";

registerSourceLoader();
const { listCatalog, loadBuiltinCatalog } = await import("./motion-tools/catalog.ts");
console.log(JSON.stringify(listCatalog(await loadBuiltinCatalog())));
