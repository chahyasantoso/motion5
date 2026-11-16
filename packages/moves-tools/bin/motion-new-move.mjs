import { tool } from "./load.mjs";
const { parseNewMoveArgs, scaffoldMove } = await import(tool("new-move"));
const { callerDir, piecesRoot } = await import("@gerak/tools/page");

const args = parseNewMoveArgs(process.argv.slice(2));
const found = args.kind === "usage" ? undefined : piecesRoot(callerDir(), args.root);
const result = (() => {
  if (found?.kind === "missing") return { kind: "refused", message: found.message };
  switch (args.kind) {
    case "usage":
      return { kind: "refused", message: args.message };
    case "move":
      return scaffoldMove(args.id, found?.root ?? "", args.brief);
  }
})();
console.log(JSON.stringify(result));
if (result.kind !== "written") process.exitCode = 1;
