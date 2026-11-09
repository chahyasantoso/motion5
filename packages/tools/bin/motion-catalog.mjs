import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { listCatalog, loadBuiltinCatalog, parseCatalogArgs } = await import(
  "../src/engine/catalog.ts"
);

const args = parseCatalogArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else {
  try {
    const ids = args.kind === "plugins" ? args.ids : undefined;
    console.log(JSON.stringify(listCatalog(await loadBuiltinCatalog(), ids)));
  } catch (error) {
    console.log(JSON.stringify({ kind: "usage", message: error.message }));
    process.exitCode = 1;
  }
}
