import { callerDir, listPresets, piecesRoot } from "@gerak/tools/page";
import { readDiscovery } from "./server/discovery";

const USAGE = "usage: gerak studio presets [--piece name] [--root dir]";

/** Lists a piece's recorded presets from the files, with no studio needed. */
export function runPresets(argv: readonly string[]): {
  readonly text: string;
  readonly ok: boolean;
} {
  const values = new Map<string, string>();
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (flag !== "--root" && flag !== "--piece")
      return { text: `Unknown argument ${flag ?? ""}.\n${USAGE}`, ok: false };
    if (value === undefined) return { text: `${flag} needs a value.\n${USAGE}`, ok: false };
    if (values.has(flag)) return { text: `${flag} is given twice.\n${USAGE}`, ok: false };
    values.set(flag, value);
  }
  const found = piecesRoot(callerDir(), values.get("--root"));
  if (found.kind === "missing") return { text: found.message, ok: false };
  const piece = values.get("--piece") ?? readDiscovery(found.root)?.piece;
  if (piece === undefined)
    return { text: `Name a piece with --piece, or open a studio.\n${USAGE}`, ok: false };
  return {
    text: JSON.stringify({ piece, names: listPresets(found.root, piece) }, null, 2),
    ok: true,
  };
}
