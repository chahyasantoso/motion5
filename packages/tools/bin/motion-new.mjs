import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { parseNewArgs, scaffold, scaffoldMove } = await import("../src/scene/new.ts");
const { callerDir, piecesRoot } = await import("../src/page/root.ts");

const args = parseNewArgs(process.argv.slice(2));
const found = args.kind === "usage" ? undefined : piecesRoot(callerDir(), args.root);
const result = (() => {
  if (found?.kind === "missing") return { kind: "refused", message: found.message };
  const root = found?.root ?? "";
  switch (args.kind) {
    case "usage":
      return { kind: "refused", message: args.message };
    case "move":
      return scaffoldMove(args.id, root, args.brief);
    case "piece":
      return scaffold(args.name, root, {
        three: args.three,
        ...(args.brief === undefined ? {} : { brief: args.brief }),
      });
  }
})();
console.log(JSON.stringify(result));
if (result.kind !== "written") process.exitCode = 1;
