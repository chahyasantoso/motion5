import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { parseCatalogArgs, runCatalog } = await import("../src/scene/catalog.ts");
const { DEFAULT_ROOT, fromCaller } = await import("../src/page/page.ts");

const args = parseCatalogArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(args.message);
  process.exitCode = 1;
} else {
  // A design file is named from where the command runs, as every other path is.
  const design = args.design === undefined ? undefined : fromCaller(args.design);
  const run = await runCatalog(
    { ...args, design },
    args.root === undefined ? DEFAULT_ROOT : fromCaller(args.root),
  );
  for (const line of run.lines) console.log(line);
  process.exitCode = run.code;
}
