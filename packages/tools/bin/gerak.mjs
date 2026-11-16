#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { COMMANDS } from "./commands.mjs";

const [command, ...rest] = process.argv.slice(2);
const usage = [
  "usage: gerak <command> [args]",
  ...Object.entries(COMMANDS).map(([name, { summary }]) => `  ${name}  ${summary}`),
].join("\n");

if (command === undefined) {
  console.log(usage);
  process.exitCode = 1;
} else if (command === "--help" || command === "-h") {
  console.log(usage);
} else if (!Object.hasOwn(COMMANDS, command)) {
  console.log(`Unknown command ${command}.\n${usage}`);
  process.exitCode = 1;
} else {
  const file = new URL(COMMANDS[command].file, import.meta.url);
  process.argv = [process.argv[0], fileURLToPath(file), ...rest];
  await import(file.href);
}
