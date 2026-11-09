import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { scaffold } = await import("../src/scene/new.ts");
const { DEFAULT_ROOT, fromCaller } = await import("../src/page/page.ts");

const all = process.argv.slice(2);
const three = all.includes("--three");
const args = all.filter((arg) => arg !== "--three");
const name = args[0];
const rootFlag = args.indexOf("--root");
const shapeOk =
  name !== undefined &&
  !name.startsWith("--") &&
  (args.length === 1 || (args.length === 3 && rootFlag === 1 && args[2] !== undefined));
const result = shapeOk
  ? scaffold(name, rootFlag === 1 ? fromCaller(args[2]) : DEFAULT_ROOT, { three })
  : { kind: "refused", message: "usage: motion:new <name> [--three] [--root dir]" };
console.log(JSON.stringify(result));
if (result.kind !== "written") process.exitCode = 1;
