import { tool } from "./load.mjs";
const { parsePromoteArgs, promoteMove } = await import(tool("scene/promote"));
const { callerDir, piecesRoot } = await import(tool("page/root"));

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
