import { registerSourceLoader } from "./source-loader.mjs";

registerSourceLoader();
const { captureFrames, parseFramesArgs } = await import("./motion-tools/frames.ts");

const args = parseFramesArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else {
  const result = await captureFrames(args);
  console.log(JSON.stringify(result));
  if (result.pageErrors.length > 0) process.exitCode = 1;
}
