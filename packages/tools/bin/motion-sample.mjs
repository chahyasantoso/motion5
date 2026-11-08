import { readFileSync } from "node:fs";
import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { parseSampleArgs, printableSample, sampleProject } = await import("../src/engine/sample.ts");
const { loadBuiltinCatalog } = await import("../src/engine/catalog.ts");

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
    print(
      printableSample(
        sampleProject(project, await loadBuiltinCatalog(), args.request, args.nodes),
        args.fields,
      ),
    );
}
