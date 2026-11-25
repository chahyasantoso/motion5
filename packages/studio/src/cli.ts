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
