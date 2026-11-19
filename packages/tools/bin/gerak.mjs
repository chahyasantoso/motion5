#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { COMMANDS } from "./commands.mjs";

const commands = Object.fromEntries(
  Object.entries(COMMANDS).map(([name, { file, summary }]) => [
    name,
    { url: new URL(file, import.meta.url).href, summary },
  ]),
);

const [command, ...rest] = process.argv.slice(2);

async function main() {
  const usage = [
    "usage: gerak <command> [args]",
    ...Object.entries(commands).map(([name, { summary }]) => `  ${name}  ${summary}`),
  ].join("\n");
  if (command === undefined) {
    console.log(usage);
    process.exitCode = 1;
  } else if (command === "--help" || command === "-h") {
    console.log(usage);
  } else if (!Object.hasOwn(commands, command)) {
    console.log(`Unknown command ${command}.\n${usage}`);
    process.exitCode = 1;
  } else {
    const url = commands[command].url;
    process.argv = [process.argv[0], fileURLToPath(url), ...rest];
    await import(url);
  }
}

try {
  await main();
} catch (error) {
  console.log(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
