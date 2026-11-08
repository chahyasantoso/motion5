import { readFileSync } from "node:fs";
import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { parsePointsArgs, resample, toRows } = await import("../src/page/points.ts");
const { fromCaller } = await import("../src/page/page.ts");

const args = parsePointsArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else {
  const points = JSON.parse(readFileSync(fromCaller(args.file), "utf8"));
  console.log(JSON.stringify(toRows(resample(points, args.spacing), args.prefix)));
}
