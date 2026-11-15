import { tool } from "./load.mjs";
const { parseProbeArgs, probeElements } = await import(tool("page/probe"));

const args = parseProbeArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else
  try {
    const result = await probeElements(args);
    console.log(JSON.stringify(result));
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
