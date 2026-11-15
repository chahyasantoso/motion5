import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { parsePromoteArgs, promoteMove } = await import("../src/scene/promote.ts");
const { callerDir, piecesRoot } = await import("../src/page/root.ts");

const args = parsePromoteArgs(process.argv.slice(2));
const found = args.kind === "usage" ? undefined : piecesRoot(callerDir(), args.root);
if (args.kind === "usage" || found?.kind === "missing") {
  console.log(args.kind === "usage" ? args.message : found.message);
  process.exitCode = 1;
} else {
  const run = await promoteMove(args.id, found.root);
  for (const line of run.lines) console.log(line);
  process.exitCode = run.code;
}
