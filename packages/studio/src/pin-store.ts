import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { parsePinFile, type NewPin, type Pin, type PinStatus } from "./pins";

interface PinFile {
  readonly next: number;
  readonly pins: readonly Pin[];
}

/** The one file under the pieces folder that holds every piece's pins. */
export function pinsPath(root: string): string {
  return join(root, ".gerak", "pins.json");
}

function readFile(root: string): PinFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(pinsPath(root), "utf8"));
  } catch {
    return { next: 1, pins: [] };
  }
  return parsePinFile(parsed);
}

function writeFile(root: string, file: PinFile): void {
  const path = pinsPath(root);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(file, null, 2)}\n`);
}

/** Every pin in the file, of every piece; empty when the file is missing or unreadable. */
export function readPins(root: string): readonly Pin[] {
  return readFile(root).pins;
}

/** Numbers, dates and stores a new open pin; its id is above every id ever written. */
export function addPin(root: string, pin: NewPin, now: Date = new Date()): Pin {
  const file = readFile(root);
  const made: Pin = { ...pin, id: file.next, status: "open", createdAt: now.toISOString() };
  writeFile(root, { next: file.next + 1, pins: [...file.pins, made] });
  return made;
}

/** Marks a pin resolved and returns it, or undefined when no pin has that id. */
export function resolvePin(root: string, id: number): Pin | undefined {
  const file = readFile(root);
  const found = file.pins.find((pin) => pin.id === id);
  if (found === undefined) return undefined;
  const resolved: Pin = { ...found, status: "resolved" };
  writeFile(root, {
    next: file.next,
    pins: file.pins.map((pin) => (pin.id === id ? resolved : pin)),
  });
  return resolved;
}

/** Removes the pins matching every given field and returns how many went. */
export function clearPins(
  root: string,
  options: { readonly piece?: string | undefined; readonly status?: PinStatus | undefined },
): number {
  const file = readFile(root);
  const matches = (pin: Pin): boolean =>
    (options.piece === undefined || pin.piece === options.piece) &&
    (options.status === undefined || pin.status === options.status);
  const kept = file.pins.filter((pin) => !matches(pin));
  const removed = file.pins.length - kept.length;
  if (removed > 0) writeFile(root, { next: file.next, pins: kept });
  return removed;
}
