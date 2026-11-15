import { readFileSync } from "node:fs";
import { tool } from "./load.mjs";
const { parsePointsArgs, resample, toRows } = await import(tool("page/points"));
const { fromCaller } = await import(tool("page/page"));

const args = parsePointsArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else {
  const points = JSON.parse(readFileSync(fromCaller(args.file), "utf8"));
  console.log(JSON.stringify(toRows(resample(points, args.spacing), args.prefix)));
}
