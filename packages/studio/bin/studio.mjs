import { existsSync } from "node:fs";

const here = existsSync(new URL("../src/", import.meta.url));
const studio = (module) =>
  new URL(here ? `../src/${module}.ts` : `../dist/${module}.js`, import.meta.url).href;

const usage = [
  "usage: gerak studio <subcommand> [args]",
  "  open <piece> [--root dir] [--port number]  serve the piece's canvas and print its address",
  "  graph <piece> [--json] [--root dir]  print a piece's cards and wires",
].join("\n");

const [subcommand, ...rest] = process.argv.slice(2);
if (subcommand === "open") {
  const { parseOpenArgs, startStudio } = await import(studio("index"));
  const parsed = parseOpenArgs(rest);
  if (parsed.kind === "usage") {
    console.log(parsed.message);
    process.exitCode = 1;
  } else {
    const started = await startStudio(parsed);
    console.log(JSON.stringify({ kind: "studio", piece: parsed.piece, url: started.url }));
  }
} else if (subcommand === "graph") {
  const { runGraph } = await import(studio("cli"));
  const { text, ok } = await runGraph(rest);
  console.log(text);
  if (!ok) process.exitCode = 1;
} else {
  console.log(
    subcommand === undefined ? usage : `Unknown studio subcommand ${subcommand}.\n${usage}`,
  );
  process.exitCode = 1;
}
