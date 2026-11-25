import { tool } from "./load.mjs";
const { parseCuesArgs, runCues } = await import(tool("audio/cues"));

const args = parseCuesArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else
  try {
    const result = runCues(args);
    console.log(JSON.stringify(result));
    if (result.kind !== "cues") process.exitCode = 1;
  } catch (error) {
    console.log(
      JSON.stringify({
        kind: "error",
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    process.exitCode = 1;
  }
