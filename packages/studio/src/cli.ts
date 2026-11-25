import { unreachable } from "@gerak/core";
import { callerDir, piecesRoot } from "@gerak/tools/page";
import { pieceGraph } from "./piece";
import { printGraph } from "./print";

const USAGE = "usage: gerak studio graph <piece> [--json] [--root dir]";

/** Runs `gerak studio graph`: the graph as an outline, or as JSON with `--json`. */
export async function runGraph(
  argv: readonly string[],
): Promise<{ readonly text: string; readonly ok: boolean }> {
  const positional: string[] = [];
  let json = false;
  let rootFlag: string | undefined;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--json") json = true;
    else if (arg === "--root") {
      rootFlag = argv[index + 1];
      if (rootFlag === undefined) return { text: "--root needs a folder.", ok: false };
      index += 1;
    } else if (arg !== undefined && arg.startsWith("--"))
      return { text: `Unknown flag ${arg}.\n${USAGE}`, ok: false };
    else if (arg !== undefined) positional.push(arg);
  }
  const name = positional[0];
  if (name === undefined || positional.length !== 1) return { text: USAGE, ok: false };
  const found = piecesRoot(callerDir(), rootFlag);
  if (found.kind === "missing") return { text: found.message, ok: false };
  const result = await pieceGraph(found.root, name);
  switch (result.kind) {
    case "graph":
      return {
        text: json ? JSON.stringify(result.graph, null, 2) : printGraph(result.graph),
        ok: true,
      };
    case "refused":
      return { text: result.message, ok: false };
    default:
      return unreachable(result);
  }
}

const OPEN_USAGE = "usage: gerak studio open <piece> [--root dir] [--port number] [--headless]";

/** Parses `gerak studio open`: the piece, the pieces folder and the port, or why not. */
export function parseOpenArgs(argv: readonly string[]):
  | {
      readonly kind: "open";
      readonly piece: string;
      readonly root: string;
      readonly port: number;
      readonly headless: boolean;
    }
  | { readonly kind: "usage"; readonly message: string } {
  const positional: string[] = [];
  let rootFlag: string | undefined;
  let port = 5173;
  let headless = false;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    if (arg === "--headless") headless = true;
    else if (arg === "--root" || arg === "--port") {
      if (value === undefined) return { kind: "usage", message: `${arg} needs a value.` };
      index += 1;
      if (arg === "--root") rootFlag = value;
      else {
        port = Number(value);
        if (!Number.isInteger(port) || port < 0 || port > 65535)
          return { kind: "usage", message: `--port must be 0 to 65535, got "${value}".` };
      }
    } else if (arg !== undefined && arg.startsWith("--"))
      return { kind: "usage", message: `Unknown flag ${arg}.\n${OPEN_USAGE}` };
    else if (arg !== undefined) positional.push(arg);
  }
  const piece = positional[0];
  if (piece === undefined || positional.length !== 1) return { kind: "usage", message: OPEN_USAGE };
  const found = piecesRoot(callerDir(), rootFlag);
  if (found.kind === "missing") return { kind: "usage", message: found.message };
  return { kind: "open", piece, root: found.root, port, headless };
}
