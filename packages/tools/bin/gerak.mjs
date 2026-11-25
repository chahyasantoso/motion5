#!/usr/bin/env node
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { COMMANDS } from "./commands.mjs";

const commands = Object.fromEntries(
  Object.entries(COMMANDS).map(([name, { file, summary }]) => [
    name,
    { url: new URL(file, import.meta.url).href, summary },
  ]),
);

const [command, ...rest] = process.argv.slice(2);

/** The `bin/<name>.mjs` an installed `@gerak/<name>` package adds as a command, if any. */
function addedCommand(name) {
  if (!/^[a-z][a-z0-9-]*$/.test(name)) return undefined;
  try {
    const url = new URL(`../bin/${name}.mjs`, import.meta.resolve(`@gerak/${name}`));
    return existsSync(url) ? url : undefined;
  } catch {
    return undefined;
  }
}

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
    const added = addedCommand(command);
    if (added === undefined) {
      console.log(
        `Unknown command ${command}. No installed package @gerak/${command} adds it.\n${usage}`,
      );
      process.exitCode = 1;
    } else {
      await import("./load.mjs");
      process.argv = [process.argv[0], fileURLToPath(added), ...rest];
      await import(added.href);
    }
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
