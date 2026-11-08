import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { parseSampleArgs, printableSample, sampleProject } = await import("../src/engine/sample.ts");
const { loadBuiltinCatalog } = await import("../src/engine/catalog.ts");
const { readSceneModule, sampleScene } = await import("../src/scene/scene.ts");

function print(result) {
  console.log(JSON.stringify(result));
  if (result.kind !== "accepted") process.exitCode = 1;
}

const args = parseSampleArgs(process.argv.slice(2));
if (args.kind === "usage") {
  print(args);
} else if (/\.tsx?$/.test(args.file)) {
  const module = readSceneModule(await import(pathToFileURL(resolve(args.file)).href));
  if ("reason" in module) print({ kind: "usage", message: module.reason });
  else
    print({
      kind: "accepted",
      samples: sampleScene(module, args.request, args.nodes, args.fields),
    });
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
