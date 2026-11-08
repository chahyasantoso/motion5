import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { describeMotion, parseReadArgs, readMotion } = await import("../src/page/read.ts");

const args = parseReadArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else {
  const result = await readMotion(args);
  console.log(JSON.stringify({ ...result, lines: result.elements.flatMap(describeMotion) }));
  if (result.pageErrors.length > 0) process.exitCode = 1;
}
