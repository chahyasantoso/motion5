import { existsSync } from "node:fs";

const here = existsSync(new URL("../src/", import.meta.url));
const studio = (module) =>
  new URL(here ? `../src/${module}.ts` : `../dist/${module}.js`, import.meta.url).href;

const usage = [
  "usage: gerak studio <subcommand> [args]",
  "  open <piece> [--root dir] [--port number] [--headless]  serve the piece's canvas and print its address; --headless opens it in a hidden browser",
  "  graph <piece> [--json] [--root dir]  print a piece's cards and wires",
  "  graph [--root dir] [--piece name]  the open canvas's piece graph, as JSON",
  "  status  what the open canvas shows",
  "  focus --scene <name|all> | --shot <name|index|all>  focus a scene or shot",
  "  viewport <preset|WxH|platform> [--safe-zone platform]  set the preview frame",
  "  seek --ms <n> | --scroll <px|selector>  move the page",
  "  play [--from ms] [--to ms] [--speed n]  play the timeline",
  "  select <card-id>  select a card",
  "  inspect [<card-id>]  a card's live values",
  "  check [--sizes WxH,...] [--safe-zone platform] [--to ms]  check the page",
  "  act '<action-list>' [--save-preset name]  run actions on the piece's page and print the events they log; --save-preset keeps them as a preset",
  "  presets [--piece name] [--root dir]  list the piece's recorded presets; works without a studio",
  "  pins <list|show|add|resolve|clear> [--root dir]  the notes left on pieces; works without a studio",
  "  every subcommand but open, pins, presets and graph <piece> takes --root dir and --piece name",
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
    const stop = () => void started.close().finally(() => process.exit(0));
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
    console.log(
      JSON.stringify({
        kind: "studio",
        piece: parsed.piece,
        url: started.url,
        ...(parsed.headless ? { headless: true } : {}),
      }),
    );
  }
} else if (
  ["status", "focus", "viewport", "seek", "play", "select", "inspect", "check", "act"].includes(
    subcommand ?? "",
  ) ||
  (subcommand === "graph" &&
    rest.every(
      (arg, at) => arg.startsWith("--") || ["--root", "--piece"].includes(rest[at - 1] ?? ""),
    ) &&
    !rest.includes("--json"))
) {
  const { runBus } = await import(studio("bus-cli"));
  const { text, ok } = await runBus(subcommand, rest);
  console.log(text);
  if (!ok) process.exitCode = 1;
} else if (subcommand === "presets") {
  const { runPresets } = await import(studio("presets-cli"));
  const { text, ok } = runPresets(rest);
  console.log(text);
  if (!ok) process.exitCode = 1;
} else if (subcommand === "pins") {
  const { runPins } = await import(studio("pins-cli"));
  const { text, ok } = await runPins(rest);
  console.log(text);
  if (!ok) process.exitCode = 1;
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
