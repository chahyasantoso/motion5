import { tool } from "./load.mjs";
const { parseCatalogArgs, runCatalog } = await import(tool("catalog"));
const { callerDir, fromCaller, piecesRoot } = await import("@gerak/tools/page");

const args = parseCatalogArgs(process.argv.slice(2));
const found = args.kind === "usage" ? undefined : piecesRoot(callerDir(), args.root);
if (args.kind === "usage" || found?.kind === "missing") {
  console.log(args.kind === "usage" ? args.message : found.message);
  process.exitCode = 1;
} else {
  // A design file is named from where the command runs, as every other path is.
  const design = args.design === undefined ? undefined : fromCaller(args.design);
  const run = await runCatalog({ ...args, design }, found.root);
  for (const line of run.lines) console.log(line);
  process.exitCode = run.code;
}
