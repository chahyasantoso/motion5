import type { StudioGraph } from "./graph";

/** The id of the graph's own preview card. */
export const MAIN_PREVIEW = "output:preview";

/** One preview card of the canvas: what is wired into it and its player settings. */
export interface PreviewEntry {
  readonly id: string;
  /** The id of the root scene, a sub-scene or a shot; empty means the root scene. */
  readonly source: string;
  readonly preset?: string | undefined;
  readonly safeZone?: string | undefined;
}

function record(value: unknown): Readonly<Record<string, unknown>> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;
}

/** Whether `id` names a preview card: the graph's own or an extra `preview:<n>`. */
export function isPreviewId(id: string): boolean {
  return id === MAIN_PREVIEW || /^preview:[1-9]\d*$/.test(id);
}

function entryOf(raw: unknown): PreviewEntry | undefined {
  const given = record(raw);
  const id = given?.["id"];
  if (typeof id !== "string" || !isPreviewId(id)) return undefined;
  const source = given?.["source"];
  const preset = given?.["preset"];
  const safeZone = given?.["safeZone"];
  return {
    id,
    source: typeof source === "string" ? source : "",
    ...(typeof preset === "string" ? { preset } : {}),
    ...(typeof safeZone === "string" ? { safeZone } : {}),
  };
}

/** The previews of untrusted layout JSON; the old single `preview` becomes the graph's preview entry. */
export function parsePreviews(given: Readonly<Record<string, unknown>>): readonly PreviewEntry[] {
  const found = new Map<string, PreviewEntry>();
  const listed = given["previews"];
  for (const raw of Array.isArray(listed) ? listed : []) {
    const entry = entryOf(raw);
    if (entry !== undefined && !found.has(entry.id)) found.set(entry.id, entry);
  }
  const old = record(given["preview"]);
  if (!found.has(MAIN_PREVIEW) && typeof old?.["preset"] === "string") {
    const entry = entryOf({ ...old, id: MAIN_PREVIEW });
    if (entry !== undefined) found.set(MAIN_PREVIEW, entry);
  }
  return [...found.values()];
}

/** The id of the root scene: the one scene with no parent. */
function rootId(graph: StudioGraph): string | undefined {
  return graph.cards.find((card) => card.kind === "scene" && card.parent === undefined)?.id;
}

/** `source` when it is a scene or shot of `graph`, else the root scene's id. */
export function resolvedSource(graph: StudioGraph, source: string): string {
  const card = graph.cards.find((each) => each.id === source);
  if (card !== undefined && (card.kind === "scene" || card.kind === "shot")) return source;
  return rootId(graph) ?? source;
}

/** The smallest unused `preview:<n>` id, from 2. */
export function nextPreviewId(entries: readonly PreviewEntry[]): string {
  const used = new Set(entries.map((entry) => entry.id));
  let n = 2;
  while (used.has(`preview:${n}`)) n += 1;
  return `preview:${n}`;
}
