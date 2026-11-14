import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { importSvg, importSvgInto } = await import("../src/scene/import-svg.ts");
const { DEFAULT_ROOT, fromCaller } = await import("../src/page/page.ts");

const usage =
  "usage: motion:import-svg <file.svg> --name <piece> [--root dir] [--margin px] [--force]\n   or: motion:import-svg <file.svg> --into <piece> --at x,y --prefix <word> [--scale s] [--root dir]";
const withValue = ["--name", "--into", "--root", "--margin", "--at", "--scale", "--prefix"];

const all = process.argv.slice(2);
const force = all.includes("--force");
const args = all.filter((arg) => arg !== "--force");
const flags = new Map();
const positional = [];
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (withValue.includes(arg)) {
    flags.set(arg, args[index + 1]);
    index += 1;
  } else positional.push(arg);
}

function refuse(message) {
  return { kind: "refused", message };
}

function run() {
  const file = positional[0];
  if (file === undefined || file.startsWith("--") || positional.length !== 1) return refuse(usage);
  for (const flag of flags.keys())
    if (flags.get(flag) === undefined || flags.get(flag).startsWith("--")) return refuse(usage);
  const root = flags.has("--root") ? fromCaller(flags.get("--root")) : DEFAULT_ROOT;
  const name = flags.get("--name");
  const into = flags.get("--into");
  if ((name === undefined) === (into === undefined))
    return refuse(`Give exactly one of --name and --into.\n${usage}`);
  if (name !== undefined) {
    for (const flag of ["--at", "--scale", "--prefix"])
      if (flags.has(flag)) return refuse(`${flag} goes only with --into.\n${usage}`);
    return importSvg(fromCaller(file), name, root, {
      force,
      ...(flags.has("--margin") ? { margin: Number(flags.get("--margin")) } : {}),
    });
  }
  if (flags.has("--margin")) return refuse(`--margin goes only with --name.\n${usage}`);
  if (force) return refuse(`--force goes only with --name.\n${usage}`);
  if (!flags.has("--at") || !flags.has("--prefix"))
    return refuse(`--into needs --at and --prefix.\n${usage}`);
  const point = flags.get("--at").split(",");
  if (point.length !== 2 || point.some((part) => part.trim() === ""))
    return refuse(`--at must be x,y, two numbers.\n${usage}`);
  return importSvgInto(fromCaller(file), into, root, {
    at: { x: Number(point[0]), y: Number(point[1]) },
    prefix: flags.get("--prefix"),
    ...(flags.has("--scale") ? { scale: Number(flags.get("--scale")) } : {}),
  });
}

const result = await run();
console.log(JSON.stringify(result));
if (result.kind !== "written") process.exitCode = 1;
