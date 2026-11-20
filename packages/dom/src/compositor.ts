import {
  INPUT_EVENTS,
  NO_EVENTS,
  liveAt,
  unreachable,
  type Anchor,
  type Events,
} from "@gerak/core";
import {
  frame,
  listPose,
  poseOf,
  type Drive,
  type Member,
  type Moves,
  type RestReader,
  type Stage,
  type TriggerBeat,
} from "@gerak/stage";

/** The fields the browser plays on its compositor thread, in the order `cssTransform` writes them. */
const FIELDS = ["x", "y", "rotation", "scale", "scaleX", "scaleY", "opacity"] as const;
type Field = (typeof FIELDS)[number];

/** How far a straight line between two keyframes may miss the scene, per field. */
export const TRACK_TOLERANCE: Readonly<Record<Field, number>> = Object.freeze({
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
const TRIGGER_GRID = 32;
const MAX_SAMPLES = 20000;
// A kept line may miss a sample by this share of the tolerance, leaving room for the curve between samples.
const FIT = 0.8;

/** One part's fields at one place along a track: a scroll position, or ms into a trigger beat. */
export interface TrackSample {
  readonly at: number;
  readonly fields: Readonly<Record<Field, number>>;
}

/** What the browser plays for one element: per part, its samples by ascending place, and its anchor. */
export interface Track {
  readonly parts: readonly (readonly TrackSample[])[];
  readonly anchor: Anchor | undefined;
}

/** A track played on the document timeline from a trigger beat's progress. */
export interface TriggerTrack extends Track {
  readonly beat: TriggerBeat;
}

/** What tracks are sampled from: the measured boxes, lines and rest, and the elements to try. */
export interface TrackInput {
  readonly boxes: Readonly<Record<string, RestReader>>;
  readonly lines: Readonly<Record<string, readonly number[]>>;
  readonly rest: RestReader;
  readonly names: ReadonlySet<string>;
}

interface Posed {
  readonly parts: readonly Readonly<Record<Field, number>>[];
  readonly anchor: Anchor | undefined;
}

interface Sampled {
  /** Each element's poses, one per part; a list's parts run as they are asked for, so before the notes. */
  readonly poses: ReadonlyMap<string, readonly (object | undefined)[]>;
  readonly moves: ReadonlyMap<string, Moves>;
  readonly drives: ReadonlyMap<string, Drive>;
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

function posesOf(member: Member, target: unknown): readonly (object | undefined)[] {
  const count = partsOf(member);
  return count === undefined
    ? [poseOf(target)]
    : Array.from({ length: count }, (_, index) => listPose(target, index, count));
}

/** The largest miss, in tolerances, of the straight line from `a` to `b` at `mid`. */
function missAt(a: TrackSample, b: TrackSample, mid: TrackSample): number {
  const at = b.at === a.at ? 0 : (mid.at - a.at) / (b.at - a.at);
  let worst = 0;
  for (const field of FIELDS) {
    const line = a.fields[field] + (b.fields[field] - a.fields[field]) * at;
    worst = Math.max(worst, Math.abs(line - mid.fields[field]) / TRACK_TOLERANCE[field]);
  }
  return worst;
}

/** The fewest samples whose straight lines stay within tolerance of every sample, keeping those at `pinned`. */
function fewest(
  samples: readonly TrackSample[],
  pinned: ReadonlySet<number>,
): readonly TrackSample[] {
  const first = samples[0];
  if (first === undefined) return [];
  const kept: TrackSample[] = [first];
  let from = 0;
  while (from < samples.length - 1) {
    let to = from + 1;
    for (
      let next = to + 1;
      next < samples.length && !pinned.has(samples[to]?.at ?? NaN);
      next += 1
    ) {
      const a = samples[from];
      const b = samples[next];
      if (a === undefined || b === undefined) break;
      let fits = true;
      for (let k = from + 1; k < next && fits; k += 1) {
        const mid = samples[k];
        if (mid !== undefined && missAt(a, b, mid) > FIT) fits = false;
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

/** Samples elements along `[0, length]`, adding samples where lines miss the scene; one `fits`
 * rejects on any sample, or that sets a field the browser does not play, is left out. */
function sampleTracks(
  stage: Stage,
  names: ReadonlySet<string>,
  length: number,
  gridStep: number,
  edges: readonly number[],
  run: (at: number, only: ReadonlySet<string>) => Sampled,
  fits: (name: string, at: number, sampled: Sampled) => boolean,
): Map<string, Track> {
  const members = new Map(stage.members.map((member) => [member.name, member]));
  const alive = new Set([...names].filter((name) => members.has(name)));
  const anchors = new Map<string, Anchor | undefined>();
  const samples = new Map<string, TrackSample[][]>();
  let taken = 0;

  const sample = (at: number, only: ReadonlySet<string>): Map<string, Posed> => {
    taken += 1;
    const sampled = run(at, only);
    const posed = new Map<string, Posed>();
    for (const name of only) {
      const member = members.get(name);
      if (member === undefined) continue;
      const raw = sampled.poses.get(name) ?? [];
      const parts = raw.map(fieldsOf);
      const anchor = anchorOf(raw[0]);
      const ok =
        fits(name, at, sampled) &&
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

  const add = (name: string, at: number, posed: Posed): void => {
    const lists = samples.get(name) ?? posed.parts.map(() => []);
    posed.parts.forEach((fields, index) => lists[index]?.push({ at, fields }));
    samples.set(name, lists);
  };

  const placed = new Set<number>();
  for (let at = 0; at < length; at += gridStep) placed.add(at);
  for (const at of edges) if (at > 0 && at < length) placed.add(at);
  placed.add(length);
  const grid = [...placed].sort((a, b) => a - b);
  for (const at of grid) {
    if (alive.size === 0) break;
    for (const [name, posed] of sample(at, new Set(alive))) add(name, at, posed);
  }

  const finest = gridStep / 32;
  const refine = (name: string, a: number, b: number, depth: number): void => {
    if (!alive.has(name) || b - a <= finest || taken > MAX_SAMPLES || depth > 24) return;
    const lists = samples.get(name);
    if (lists === undefined) return;
    const mid = (a + b) / 2;
    const posed = sample(mid, new Set([name])).get(name);
    if (posed === undefined) return;
    let worst = 0;
    posed.parts.forEach((fields, index) => {
      const list = lists[index] ?? [];
      const left = list.find((s) => s.at === a);
      const right = list.find((s) => s.at === b);
      if (left !== undefined && right !== undefined)
        worst = Math.max(worst, missAt(left, right, { at: mid, fields }));
    });
    add(name, mid, posed);
    // Half the tolerance at the midpoint leaves room for a curve between samples.
    if (worst <= 0.5) return;
    refine(name, a, mid, depth + 1);
    refine(name, mid, b, depth + 1);
  };
  for (const name of [...alive])
    for (let k = 0; k + 1 < grid.length; k += 1) {
      const a = grid[k];
      const b = grid[k + 1];
      if (a !== undefined && b !== undefined) refine(name, a, b, 0);
    }

  const tracks = new Map<string, Track>();
  if (taken > MAX_SAMPLES) return tracks;
  for (const name of alive) {
    const lists = samples.get(name);
    if (lists === undefined) continue;
    tracks.set(name, {
      parts: lists.map((list) =>
        fewest(
          [...list].sort((p, q) => p.at - q.at),
          new Set(edges),
        ),
      ),
      anchor: anchors.get(name),
    });
  }
  return tracks;
}

function runFrame(
  stage: Stage,
  input: TrackInput,
  ms: number,
  events: Events,
  only: ReadonlySet<string>,
): Sampled {
  const moves = new Map<string, Moves>();
  const drives = new Map<string, Drive>();
  const { targets } = frame(stage, {
    time: liveAt(ms),
    events,
    boxes: input.boxes,
    lines: input.lines,
    only,
    moves,
    drives,
  });
  const poses = new Map<string, readonly (object | undefined)[]>();
  for (const member of stage.members)
    if (only.has(member.name)) poses.set(member.name, posesOf(member, targets[member.name]));
  return { poses, moves, drives };
}

/** The tracks of the named elements whose motions read only the scroll position, sampled across the
 * page's scroll range `[0, maxScroll]`. */
export function scrollTracks(
  stage: Stage,
  input: TrackInput,
  maxScroll: number,
): Map<string, Track> {
  return sampleTracks(
    stage,
    input.names,
    maxScroll,
    GRID_PX,
    scrollEdges(stage, input),
    (y, only) => runFrame(stage, input, 0, [{ name: INPUT_EVENTS.scroll, at: 0, value: y }], only),
    (name, _, sampled) => sampled.drives.get(name)?.kind === "scroll" && !sampled.moves.has(name),
  );
}

/** Where the scroll beats of the named elements start and end, so samples land on their edges. */
function scrollEdges(stage: Stage, input: TrackInput): readonly number[] {
  const found = runFrame(stage, input, 0, NO_EVENTS, input.names);
  const edges = new Set<number>();
  for (const drive of found.drives.values())
    if (drive.kind === "scroll")
      for (const beat of drive.beats) {
        edges.add(beat.from.at(input.rest));
        edges.add(beat.to.at(input.rest));
      }
  return [...edges];
}

/** Whether every part shows its first sample before the trigger fires, with no clock note. */
function restsAtStart(member: Member, track: Track, before: Sampled): boolean {
  if (before.moves.has(member.name)) return false;
  const poses = before.poses.get(member.name) ?? [];
  return track.parts.every((samples, index) => {
    const first = samples[0];
    const fields = fieldsOf(poses[index]);
    return (
      first !== undefined && fields !== undefined && missAt(first, first, { at: 0, fields }) <= 1
    );
  });
}

/** The tracks of the named elements whose motions read only one trigger beat's progress, sampled across
 * the beat's ms; the pose before the trigger fires must equal the pose at its start. */
export function triggerTracks(stage: Stage, input: TrackInput): Map<string, TriggerTrack> {
  const found = runFrame(stage, input, 0, NO_EVENTS, input.names);
  const byBeat = new Map<TriggerBeat, Set<string>>();
  for (const name of input.names) {
    const drive = found.drives.get(name);
    if (drive?.kind !== "trigger") continue;
    const names = byBeat.get(drive.beat) ?? new Set<string>();
    names.add(name);
    byBeat.set(drive.beat, names);
  }
  const members = new Map(stage.members.map((member) => [member.name, member]));
  const out = new Map<string, TriggerTrack>();
  for (const [beat, names] of byBeat) {
    const threshold = beat.when.point.at(input.rest);
    const crossed: Events = [{ name: INPUT_EVENTS.scroll, at: 0, value: threshold }];
    const tracks = sampleTracks(
      stage,
      names,
      beat.ms,
      beat.ms / TRIGGER_GRID,
      [],
      (ms, only) => runFrame(stage, input, ms, crossed, only),
      (name, ms, sampled) => {
        const drive = sampled.drives.get(name);
        if (drive?.kind !== "trigger" || drive.beat !== beat) return false;
        // While the trigger runs it moves with time; once done, any clock note is the motion's own.
        return ms < beat.ms || !sampled.moves.has(name);
      },
    );
    const before = threshold > 0 ? runFrame(stage, input, 0, NO_EVENTS, names) : undefined;
    for (const [name, track] of tracks) {
      const member = members.get(name);
      if (member === undefined) continue;
      if (before !== undefined && !restsAtStart(member, track, before)) continue;
      out.set(name, { ...track, beat });
    }
  }
  return out;
}

/** The fields a part ever moves off their rest value. */
function movedFields(samples: readonly TrackSample[]): readonly Field[] {
  return FIELDS.filter((field) => samples.some((s) => s.fields[field] !== REST[field]));
}

/** Web Animation keyframes for one part, placed by `at / length`; every keyframe names the same
 * transform functions, so the browser blends each field along a straight line. */
export function trackKeyframes(samples: readonly TrackSample[], length: number): Keyframe[] {
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
    const key: Keyframe = { offset: Math.min(1, Math.max(0, s.at / length)) };
    if (parts.length > 0) key["transform"] = parts.join(" ");
    if (has("opacity")) key["opacity"] = String(s.fields.opacity);
    return key;
  });
}

/** The sample at or just before `at`, for the pose written under the animation. */
export function sampleNear(samples: readonly TrackSample[], at: number): TrackSample | undefined {
  let found = samples[0];
  for (const s of samples) if (s.at <= at) found = s;
  return found;
}
