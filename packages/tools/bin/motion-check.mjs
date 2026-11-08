import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { checkMotion, describeFinding, parseCheckArgs } = await import("../src/page/check.ts");

const args = parseCheckArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else {
  const result = await checkMotion(args);
  console.log(JSON.stringify({ ...result, lines: result.findings.map(describeFinding) }));
  if (result.findings.length > 0 || result.pageErrors.length > 0) process.exitCode = 1;
}
