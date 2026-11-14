import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { measureFps, parseFpsArgs } = await import("../src/page/fps.ts");

const args = parseFpsArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else
  try {
    const result = await measureFps(args);
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
