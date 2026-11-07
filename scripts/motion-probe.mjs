import { registerSourceLoader } from "./source-loader.mjs";

registerSourceLoader();
const { parseProbeArgs, probeElements } = await import("./motion-tools/probe.ts");

const args = parseProbeArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else {
  const result = await probeElements(args);
  console.log(JSON.stringify(result));
  if (result.pageErrors.length > 0) process.exitCode = 1;
}
