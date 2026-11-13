import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { parsePromoteArgs, promoteMove } = await import("../src/scene/promote.ts");
const { DEFAULT_ROOT, fromCaller } = await import("../src/page/page.ts");

const args = parsePromoteArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(args.message);
  process.exitCode = 1;
} else {
  const run = await promoteMove(
    args.id,
    args.root === undefined ? DEFAULT_ROOT : fromCaller(args.root),
  );
  for (const line of run.lines) console.log(line);
  process.exitCode = run.code;
}
