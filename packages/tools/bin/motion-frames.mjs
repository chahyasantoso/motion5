import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { captureFrames, captureOnion, compareFrames, comparisonLines, parseFramesArgs } =
  await import("../src/page/frames.ts");

const args = parseFramesArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else
  try {
    let result;
    switch (args.kind) {
      case "onion":
        result = await captureOnion(args);
        break;
      case "compare":
        result = {
          kind: "compared",
          pageErrors: [],
          comparison: compareFrames(args.here, args.there),
        };
        break;
      case "frames":
        result = await captureFrames(args);
        break;
    }
    console.log(JSON.stringify(result));
    if ("comparison" in result && result.comparison !== undefined)
      for (const line of comparisonLines(result.comparison)) console.log(line);
    if (result.pageErrors.length > 0) process.exitCode = 1;
  } catch (error) {
    console.log(
      JSON.stringify({
        kind: "error",
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    process.exitCode = 1;
  }
