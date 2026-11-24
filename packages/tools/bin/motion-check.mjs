import { tool } from "./load.mjs";
const { checkMotion, describeCheckLines, parseCheckArgs } = await import(tool("page/check"));

const args = parseCheckArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else
  try {
    const result = await checkMotion(args);
    console.log(JSON.stringify({ ...result, lines: describeCheckLines(result) }));
    if (result.findings.length > 0 || result.pageErrors.length > 0) process.exitCode = 1;
  } catch (error) {
    console.log(
      JSON.stringify({
        kind: "error",
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    process.exitCode = 1;
  }
