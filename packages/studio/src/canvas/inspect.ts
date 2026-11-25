import type { StepSummary } from "@gerak/stage/provenance";
import type { Card, StudioGraph } from "../graph";
import type { Inspection, Rect } from "../protocol";
import { firstMount } from "./mount-view";

const MAX_DEPTH = 6;

/** A value reduced to plain numbers, strings, booleans, arrays and objects; anything else is dropped. */
export function jsonSafe(value: unknown, depth = 0): unknown {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "string" || typeof value === "boolean") return value;
  if (depth >= MAX_DEPTH || typeof value !== "object" || value === null) return undefined;
  if (Array.isArray(value)) return value.map((each) => jsonSafe(each, depth + 1) ?? null);
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(value)) {
    const safe = jsonSafe(Reflect.get(value, key), depth + 1);
    if (safe !== undefined) out[key] = safe;
  }
  return out;
}

function recordOf(value: unknown): Readonly<Record<string, unknown>> | undefined {
  const safe = jsonSafe(value);
  return typeof safe === "object" && safe !== null && !Array.isArray(safe)
    ? Object.fromEntries(Object.entries(safe))
    : undefined;
}

function rectOf(value: unknown): Rect | undefined {
  const x: unknown = Reflect.get(Object(value), "x");
  const y: unknown = Reflect.get(Object(value), "y");
  const width: unknown = Reflect.get(Object(value), "width");
  const height: unknown = Reflect.get(Object(value), "height");
  return typeof x === "number" &&
    typeof y === "number" &&
    typeof width === "number" &&
    typeof height === "number"
    ? { x, y, width, height }
    : undefined;
}

/** The member a card stands for: a move's member, or the name of a cast card; `undefined` for other cards. */
export function memberOf(card: Card): string | undefined {
  switch (card.kind) {
    case "box":
    case "text":
    case "shape":
    case "object":
    case "list":
      return card.name;
    case "motion":
    case "code":
      return card.step?.member;
    default:
      return undefined;
  }
}

function stepsOf(graph: StudioGraph, member: string, card: Card): readonly StepSummary[] {
  const owner = graph.cards.find((each) => each.id === `member:${member}`) ?? card;
  return owner.cast?.steps ?? [];
}

function called(owner: unknown, name: string): unknown {
  const found: unknown = Reflect.get(Object(owner), name);
  return typeof found === "function" ? Reflect.apply(found, owner, []) : undefined;
}

/** What the page says of `card` now: its pose, box, rest box and 3D bounds, with its steps from the graph. */
export function inspectCard(
  card: Card,
  graph: StudioGraph,
  win: Window | undefined,
  atMs: number,
): Inspection {
  const member = memberOf(card);
  const base = { card: card.id, kind: card.kind, atMs };
  if (member === undefined)
    return {
      ...base,
      pose: undefined,
      rect: undefined,
      rest: undefined,
      bounds: undefined,
      steps: [],
    };
  const mount = firstMount(win);
  const values: unknown = Reflect.get(Object(Reflect.get(Object(mount), "player")), "values");
  const rest: unknown = Reflect.get(Object(Reflect.get(Object(mount), "rest")), member);
  const objects: unknown = Reflect.get(Object(called(mount, "measure")), "objects");
  const element = win?.document.querySelector(`[data-cast="${CSS.escape(member)}"]`);
  const box = element?.getBoundingClientRect();
  return {
    ...base,
    pose: recordOf(Reflect.get(Object(values), member)),
    rect:
      box === undefined ? undefined : { x: box.x, y: box.y, width: box.width, height: box.height },
    rest: rectOf(rest),
    bounds: recordOf(Reflect.get(Object(objects), member)),
    steps: stepsOf(graph, member, card),
  };
}
