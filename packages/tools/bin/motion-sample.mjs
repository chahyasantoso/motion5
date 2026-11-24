import { tool } from "./load.mjs";
const { loadSceneFile, parseSampleArgs, sampleScene, watchScene } = await import(
  tool("scene/scene")
);

function print(result) {
  console.log(JSON.stringify(result));
  if (result.kind !== "accepted" && result.kind !== "watched") process.exitCode = 1;
}

const args = parseSampleArgs(process.argv.slice(2));
if (args.kind === "usage") {
  print(args);
} else if (!/\.tsx?$/.test(args.file)) {
  print({ kind: "usage", message: `${args.file} is not a .ts scene file.` });
} else {
  const module = await loadSceneFile(args.file);
  if ("reason" in module) print({ kind: "usage", message: module.reason });
  else if (args.kind === "watch") print(watchScene(module, args, args.events));
  else
    print({
      kind: "accepted",
      samples: sampleScene(module, args.request, args.nodes, args.fields, args.events),
    });
}
