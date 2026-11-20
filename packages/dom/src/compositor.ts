import { INPUT_EVENTS, liveAt, unreachable, type Anchor } from "@gerak/core";
import {
  frame,
  listPose,
  poseOf,
  type Member,
  type Moves,
  type RestReader,
  type Stage,
} from "@gerak/stage";

/** The fields the browser plays on a scroll timeline, in the order `cssTransform` writes them. */
const FIELDS = ["x", "y", "rotation", "scale", "scaleX", "scaleY", "opacity"] as const;
type Field = (typeof FIELDS)[number];

/** How far a straight line between two keyframes may miss the scene, per field. */
export const SCROLL_TOLERANCE: Readonly<Record<Field, number>> = Object.freeze({
  x: 0.25,
  y: 0.25,
  rotation: 0.1,
  scale: 0.001,
  scaleX: 0.001,
  scaleY: 0.001,
  opacity: 0.005,
});

const REST: Readonly<Record<Field, number>> = Object.freeze({
  x: 0,
  y: 0,
  rotation: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  opacity: 1,
});

const GRID_PX = 16;
const FINEST_PX = 0.5;
const MAX_SAMPLES = 20000;

/** One part's fields at one scroll position. */
export interface ScrollSample {
  readonly y: number;
  readonly fields: Readonly<Record<Field, number>>;
}

/** What the browser plays for one element: per part, its samples by ascending scroll, and its anchor. */
export interface ScrollTrack {
  readonly parts: readonly (readonly ScrollSample[])[];
  readonly anchor: Anchor | undefined;
}

/** What `scrollTracks` samples from: the measured boxes and lines, and the page's scroll range. */
export interface ScrollTrackInput {
  readonly boxes: Readonly<Record<string, RestReader>>;
  readonly lines: Readonly<Record<string, readonly number[]>>;
  readonly maxScroll: number;
  readonly names: ReadonlySet<string>;
}

interface Posed {
  readonly parts: readonly Readonly<Record<Field, number>>[];
  readonly anchor: Anchor | undefined;
}

function fieldsOf(pose: object | undefined): Readonly<Record<Field, number>> | undefined {
  const out: Record<Field, number> = { ...REST };
  if (pose === undefined) return out;
  for (const [key, value] of Object.entries(pose)) {
    if (value === undefined || key === "anchor") continue;
    const field = FIELDS.find((name) => name === key);
    if (field === undefined || typeof value !== "number" || !Number.isFinite(value))
      return undefined;
    out[field] = value;
  }
  return out;
}

function anchorOf(pose: object | undefined): Anchor | undefined {
  if (pose === undefined) return undefined;
  const anchor: unknown = Reflect.get(pose, "anchor");
  switch (anchor) {
    case "center":
    case "top":
    case "bottom":
    case "left":
    case "right":
      return anchor;
    default:
      return undefined;
  }
}

function partsOf(member: Member): number | undefined {
  switch (member.kind) {
    case "list":
      return member.items.length;
    case "actor":
    case "group":
      return undefined;
    default:
      return unreachable(member);
  }
}

/** The largest miss, in tolerances, of the straight line from `a` to `b` at `mid`. */
function missAt(a: ScrollSample, b: ScrollSample, mid: ScrollSample): number {
  const at = b.y === a.y ? 0 : (mid.y - a.y) / (b.y - a.y);
  let worst = 0;
  for (const field of FIELDS) {
    const line = a.fields[field] + (b.fields[field] - a.fields[field]) * at;
    worst = Math.max(worst, Math.abs(line - mid.fields[field]) / SCROLL_TOLERANCE[field]);
  }
  return worst;
}

/** The fewest samples whose straight lines stay within tolerance of every sample. */
function fewest(samples: readonly ScrollSample[]): readonly ScrollSample[] {
  const first = samples[0];
  if (first === undefined) return [];
  const kept: ScrollSample[] = [first];
  let from = 0;
  while (from < samples.length - 1) {
    let to = from + 1;
    for (let next = to + 1; next < samples.length; next += 1) {
      const a = samples[from];
      const b = samples[next];
      if (a === undefined || b === undefined) break;
      let fits = true;
      for (let k = from + 1; k < next && fits; k += 1) {
        const mid = samples[k];
        if (mid !== undefined && missAt(a, b, mid) > 1) fits = false;
      }
      if (!fits) break;
      to = next;
    }
    const end = samples[to];
    if (end !== undefined) kept.push(end);
    from = to;
  }
  return kept;
}

/** Samples each named element's pose across the page's scroll range, and keeps those whose motions read
 * only the scroll position and set only fields the browser plays; an element that fails on any sample is left out. */
export function scrollTracks(stage: Stage, input: ScrollTrackInput): Map<string, ScrollTrack> {
  const members = new Map(stage.members.map((member) => [member.name, member]));
  const alive = new Set([...input.names].filter((name) => members.has(name)));
  const anchors = new Map<string, Anchor | undefined>();
  const samples = new Map<string, ScrollSample[][]>();
  let taken = 0;

  const sample = (y: number, only: ReadonlySet<string>): Map<string, Posed> => {
    taken += 1;
    const moves = new Map<string, Moves>();
    const scrollOnly = new Map<string, boolean>();
    const { targets } = frame(stage, {
      time: liveAt(0),
      events: [{ name: INPUT_EVENTS.scroll, at: 0, value: y }],
      boxes: input.boxes,
      lines: input.lines,
      only,
      moves,
      scrollOnly,
    });
    const posed = new Map<string, Posed>();
    for (const name of only) {
      const member = members.get(name);
      if (member === undefined) continue;
      const count = partsOf(member);
      const raw =
        count === undefined
          ? [poseOf(targets[name])]
          : Array.from({ length: count }, (_, index) => listPose(targets[name], index, count));
      const parts = raw.map(fieldsOf);
      const anchor = anchorOf(raw[0]);
      const ok =
        scrollOnly.get(name) === true &&
        !moves.has(name) &&
        raw.every((pose) => anchorOf(pose) === anchor) &&
        (!anchors.has(name) || anchors.get(name) === anchor);
      const fields = parts.filter((part) => part !== undefined);
      if (!ok || fields.length !== parts.length) {
        alive.delete(name);
        continue;
      }
      anchors.set(name, anchor);
      posed.set(name, { parts: fields, anchor });
    }
    return posed;
  };

  const add = (name: string, y: number, posed: Posed): void => {
    const lists = samples.get(name) ?? posed.parts.map(() => []);
    posed.parts.forEach((fields, index) => lists[index]?.push({ y, fields }));
    samples.set(name, lists);
  };

  const max = input.maxScroll;
  const grid: number[] = [];
  for (let y = 0; y < max; y += GRID_PX) grid.push(y);
  grid.push(max);
  for (const y of grid) {
    if (alive.size === 0) break;
    for (const [name, posed] of sample(y, new Set(alive))) add(name, y, posed);
  }

  const refine = (name: string, a: number, b: number, depth: number): void => {
    if (!alive.has(name) || b - a <= FINEST_PX || taken > MAX_SAMPLES || depth > 24) return;
    const lists = samples.get(name);
    if (lists === undefined) return;
    const mid = (a + b) / 2;
    const posed = sample(mid, new Set([name])).get(name);
    if (posed === undefined) return;
    let worst = 0;
    posed.parts.forEach((fields, index) => {
      const list = lists[index] ?? [];
      const left = list.find((s) => s.y === a);
      const right = list.find((s) => s.y === b);
      if (left !== undefined && right !== undefined)
        worst = Math.max(worst, missAt(left, right, { y: mid, fields }));
    });
    add(name, mid, posed);
    if (worst <= 1) return;
    refine(name, a, mid, depth + 1);
    refine(name, mid, b, depth + 1);
  };
  for (const name of [...alive])
    for (let k = 0; k + 1 < grid.length; k += 1) {
      const a = grid[k];
      const b = grid[k + 1];
      if (a !== undefined && b !== undefined) refine(name, a, b, 0);
    }

  const tracks = new Map<string, ScrollTrack>();
  if (taken > MAX_SAMPLES) return tracks;
  for (const name of alive) {
    const lists = samples.get(name);
    if (lists === undefined) continue;
    tracks.set(name, {
      parts: lists.map((list) => fewest([...list].sort((p, q) => p.y - q.y))),
      anchor: anchors.get(name),
    });
  }
  return tracks;
}

/** The fields a part ever moves off their rest value. */
function movedFields(samples: readonly ScrollSample[]): readonly Field[] {
  return FIELDS.filter((field) => samples.some((s) => s.fields[field] !== REST[field]));
}

/** Web Animation keyframes for one part, placed by scroll position over the whole range; every keyframe
 * names the same transform functions, so the browser blends each field along a straight line. */
export function scrollKeyframes(samples: readonly ScrollSample[], maxScroll: number): Keyframe[] {
  const moved = movedFields(samples);
  if (moved.length === 0) return [];
  const has = (field: Field): boolean => moved.includes(field);
  const shifts = has("x") || has("y");
  const turns = ["rotation", "scale", "scaleX", "scaleY"] as const;
  return samples.map((s) => {
    const parts: string[] = [];
    if (shifts) parts.push(`translate3d(${String(s.fields.x)}px, ${String(s.fields.y)}px, 0px)`);
    for (const field of turns)
      if (has(field))
        parts.push(
          field === "rotation"
            ? `rotate(${String(s.fields.rotation)}deg)`
            : `${field}(${String(s.fields[field])})`,
        );
    const key: Keyframe = { offset: Math.min(1, Math.max(0, s.y / maxScroll)) };
    if (parts.length > 0) key["transform"] = parts.join(" ");
    if (has("opacity")) key["opacity"] = String(s.fields.opacity);
    return key;
  });
}

/** The sample at or just before `y`, for the pose written under the animation. */
export function sampleNear(samples: readonly ScrollSample[], y: number): ScrollSample | undefined {
  let found = samples[0];
  for (const s of samples) if (s.y <= y) found = s;
  return found;
}
