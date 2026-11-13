import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { comparePage, parseCompareArgs } = await import("../src/page/compare.ts");

const args = parseCompareArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else
  try {
    const result = await comparePage(args);
    console.log(JSON.stringify(result));
    if (result.kind === "usage") process.exitCode = 1;
  } catch (error) {
    console.log(
      JSON.stringify({
        kind: "error",
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    process.exitCode = 1;
  }
