import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { scaffold, scaffoldMove } = await import("../src/scene/new.ts");
const { DEFAULT_ROOT, fromCaller } = await import("../src/page/page.ts");

const all = process.argv.slice(2);
const three = all.includes("--three");
const move = all.includes("--move");
const args = all.filter((arg) => arg !== "--three" && arg !== "--move");
const name = args[0];
const rootFlag = args.indexOf("--root");
const shapeOk =
  name !== undefined &&
  !name.startsWith("--") &&
  !(move && three) &&
  (args.length === 1 || (args.length === 3 && rootFlag === 1 && args[2] !== undefined));
const root = rootFlag === 1 ? fromCaller(args[2]) : DEFAULT_ROOT;
const result = !shapeOk
  ? {
      kind: "refused",
      message:
        "usage: motion:new <name> [--three] [--root dir] | motion:new --move <id> [--root dir]",
    }
  : move
    ? scaffoldMove(name, root)
    : scaffold(name, root, { three });
console.log(JSON.stringify(result));
if (result.kind !== "written") process.exitCode = 1;
