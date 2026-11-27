import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { isInputEntry, type Input } from "@gerak/core";

/** The names a recorded preset may have; Windows device names are refused. */
export const PRESET_NAME = /^(?!(?:con|prn|aux|nul|com\d|lpt\d)$)[a-z0-9][a-z0-9-]*$/;

/** Where a piece's recorded preset lives: one `Input` JSON file under the pieces folder. */
export function presetPath(root: string, piece: string, name: string): string {
  return join(root, ".gerak", "presets", piece, `${name}.json`);
}

function badName(name: string): string {
  return `"${name}" is not a preset name: use lowercase letters, digits and dashes, starting with a letter or digit.`;
}

/** A recorded preset's events, or why it cannot be read. */
export function readPreset(
  root: string,
  piece: string,
  name: string,
): Input | { readonly reason: string } {
  if (!PRESET_NAME.test(name)) return { reason: badName(name) };
  const path = presetPath(root, piece, name);
  if (!existsSync(path))
    return { reason: `No preset ${name} for ${piece}: ${path} does not exist.` };
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return { reason: `${path} is not JSON.` };
  }
  if (!Array.isArray(parsed)) return { reason: `${path} is not a list of events.` };
  const list: readonly unknown[] = parsed;
  const events: Input = list.filter(isInputEntry);
  if (events.length !== list.length)
    return { reason: `${path} holds an entry that is not an event.` };
  return events;
}

/** Writes a preset sorted by time and returns its path; throws on a bad name. */
export function writePreset(root: string, piece: string, name: string, events: Input): string {
  if (!PRESET_NAME.test(name)) throw new Error(badName(name));
  const path = presetPath(root, piece, name);
  mkdirSync(dirname(path), { recursive: true });
  const sorted = [...events].sort((a, b) => a.at - b.at);
  writeFileSync(path, `${JSON.stringify(sorted, null, 2)}\n`);
  return path;
}

/** The names of a piece's recorded presets, sorted. */
export function listPresets(root: string, piece: string): readonly string[] {
  const folder = dirname(presetPath(root, piece, "x"));
  if (!existsSync(folder)) return [];
  return readdirSync(folder)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.slice(0, -".json".length))
    .filter((name) => PRESET_NAME.test(name))
    .sort();
}
