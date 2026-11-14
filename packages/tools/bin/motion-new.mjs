import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { parseNewArgs, scaffold, scaffoldMove } = await import("../src/scene/new.ts");
const { DEFAULT_ROOT, fromCaller } = await import("../src/page/page.ts");

const args = parseNewArgs(process.argv.slice(2));
const root =
  args.kind !== "usage" && args.root !== undefined ? fromCaller(args.root) : DEFAULT_ROOT;
const result = (() => {
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
