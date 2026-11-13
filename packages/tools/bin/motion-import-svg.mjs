import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { importSvg } = await import("../src/scene/import-svg.ts");
const { DEFAULT_ROOT, fromCaller } = await import("../src/page/page.ts");

const all = process.argv.slice(2);
const force = all.includes("--force");
const args = all.filter((arg) => arg !== "--force");
const flags = new Map();
const positional = [];
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === "--name" || arg === "--root" || arg === "--margin") {
    flags.set(arg, args[index + 1]);
    index += 1;
  } else positional.push(arg);
}
const file = positional[0];
const name = flags.get("--name");
const root = flags.get("--root");
const margin = flags.has("--margin") ? Number(flags.get("--margin")) : undefined;
const shapeOk =
  file !== undefined &&
  !file.startsWith("--") &&
  positional.length === 1 &&
  name !== undefined &&
  (!flags.has("--root") || root !== undefined) &&
  (!flags.has("--margin") || flags.get("--margin") !== undefined);
const result = !shapeOk
  ? {
      kind: "refused",
      message:
        "usage: motion:import-svg <file.svg> --name <piece> [--root dir] [--margin px] [--force]",
    }
  : await importSvg(fromCaller(file), name, root === undefined ? DEFAULT_ROOT : fromCaller(root), {
      force,
      ...(margin === undefined ? {} : { margin }),
    });
console.log(JSON.stringify(result));
if (result.kind !== "written") process.exitCode = 1;
