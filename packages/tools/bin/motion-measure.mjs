import { tool } from "./load.mjs";
const { measurePage, parseMeasureArgs } = await import(tool("page/measure"));

const args = parseMeasureArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else
  try {
    const result = await measurePage(args);
    console.log(JSON.stringify(result));
    if (result.kind !== "measured" || result.pageErrors.length > 0) process.exitCode = 1;
  } catch (error) {
    console.log(
      JSON.stringify({
        kind: "error",
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    process.exitCode = 1;
  }
