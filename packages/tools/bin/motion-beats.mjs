import { tool } from "./load.mjs";
const { parseBeatsArgs, runBeats } = await import(tool("audio/beats"));

const args = parseBeatsArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else
  try {
    const result = runBeats(args);
    console.log(JSON.stringify(result));
    if (result.kind !== "beats") process.exitCode = 1;
  } catch (error) {
    console.log(
      JSON.stringify({
        kind: "error",
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    process.exitCode = 1;
  }
