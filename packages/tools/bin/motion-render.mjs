import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { parseRenderArgs, renderPage } = await import("../src/page/render.ts");

const args = parseRenderArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else {
  const result = await renderPage(args);
  console.log(JSON.stringify(result));
  if (result.kind !== "rendered" || result.pageErrors.length > 0) process.exitCode = 1;
}
