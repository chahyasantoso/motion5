import { readFileSync } from "node:fs";
import { registerSourceLoader } from "./source-loader.mjs";

registerSourceLoader();
const { parseSampleArgs, sampleProject } = await import("./motion-tools/sample.ts");
const { loadBuiltinCatalog } = await import("./motion-tools/catalog.ts");

function print(result) {
  console.log(JSON.stringify(result));
  if (result.kind !== "accepted") process.exitCode = 1;
}

const args = parseSampleArgs(process.argv.slice(2));
if (args.kind === "usage") {
  print(args);
} else {
  let project;
  try {
    project = JSON.parse(readFileSync(args.file, "utf8"));
  } catch (error) {
    print({ kind: "usage", message: `Cannot read ${args.file}: ${error.message}` });
  }
  if (project !== undefined)
    print(sampleProject(project, await loadBuiltinCatalog(), args.request, args.nodes));
}
