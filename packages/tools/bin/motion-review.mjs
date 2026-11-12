import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { parseReviewArgs, printReview, reviewPage } = await import("../src/page/review.ts");

const { isSceneFile, parseSceneReviewArgs, reviewSceneFile } = await import(
  "../src/scene/review.ts"
);

const argv = process.argv.slice(2);
if (isSceneFile(argv)) {
  const args = parseSceneReviewArgs(argv);
  try {
    const result = args.kind === "usage" ? args : await reviewSceneFile(args);
    console.log(JSON.stringify(result));
    if (result.kind !== "reviewed" || result.findings.length > 0) process.exitCode = 1;
  } catch (error) {
    console.log(
      JSON.stringify({
        kind: "error",
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    process.exitCode = 1;
  }
} else {
  await reviewPageMain(argv);
}

async function reviewPageMain(argv) {
  const args = parseReviewArgs(argv);
  if (args.kind === "usage") {
    console.log(JSON.stringify(args));
    process.exitCode = 1;
  } else
    try {
      const result = await reviewPage(args);
      console.log(printReview(result));
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
}
