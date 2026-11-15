import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { tool } from "./load.mjs";
const { formatJointTable, jointTable, parseJointsArgs, readGltf } = await import(
  tool("scene/joints")
);
const { fromCaller } = await import(tool("page/page"));

const refuse = (reason) => {
  console.log(JSON.stringify({ kind: "refused", reason }));
  process.exitCode = 1;
};

const args = parseJointsArgs(process.argv.slice(2));
if (args.kind === "usage") {
  console.log(JSON.stringify(args));
  process.exitCode = 1;
} else {
  const model = fromCaller(args.model);
  let bytes;
  try {
    bytes = new Uint8Array(readFileSync(model));
  } catch {
    refuse(`Cannot read ${args.model}.`);
  }
  if (bytes !== undefined) {
    const read = readGltf(bytes);
    const result = read.kind === "ok" ? jointTable(read.gltf, basename(model)) : read;
    if (result.kind === "refused") {
      refuse(result.reason);
    } else {
      const file =
        args.out === undefined
          ? join(dirname(model), `${basename(model, extname(model))}.joints.json`)
          : fromCaller(args.out);
      writeFileSync(file, formatJointTable(result.table));
      console.log(
        JSON.stringify({ kind: "written", file, joints: Object.keys(result.table.joints).length }),
      );
    }
  }
}
