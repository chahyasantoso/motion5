import {
  INPUT_EVENTS,
  NO_EVENTS,
  liveAt,
  unreachable,
  withProbeStore,
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

/** Sampled compositor tracks together with the measured rest box names they depend on. */
export interface SampledTracks<T extends Track = Track> {
  readonly tracks: Map<string, T>;
  readonly deps: ReadonlySet<string>;
}

/** What tracks are sampled from: the measured lines and rest, and the elements to try. */
export interface TrackInput {
  readonly counts?: Readonly<Record<string, number>> | undefined;
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

function posesOf(
  member: Member,
  target: unknown,
  counts: Readonly<Record<string, number>> | undefined,
): readonly (object | undefined)[] {
  if (member.kind !== "list") return [poseOf(target)];
  const count = counts?.[member.name] ?? 1;
  return Array.from({ length: count }, (_, index) => listPose(target, index, count));
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

/** The fewest samples whose lines stay within tolerance of every sample, keeping `pinned`; a line grows
 * while its slope stays in every field's window, so each sample is read once per line. */
export function fewest(
  samples: readonly TrackSample[],
  pinned: ReadonlySet<number>,
): readonly TrackSample[] {
  const first = samples[0];
  if (first === undefined) return [];
  const kept: TrackSample[] = [first];
  const low = FIELDS.map(() => -Infinity);
  const high = FIELDS.map(() => Infinity);
  let from = 0;
  while (from < samples.length - 1) {
    const a = samples[from];
    if (a === undefined) break;
    low.fill(-Infinity);
    high.fill(Infinity);
    let to = from + 1;
    for (let next = to + 1; next < samples.length; next += 1) {
      const mid = samples[to];
      const b = samples[next];
      if (mid === undefined || b === undefined || pinned.has(mid.at)) break;
      const span = mid.at - a.at;
      const reach = b.at - a.at;
      if (!(span > 0 && reach > span)) break;
      let fits = true;
      FIELDS.forEach((field, index) => {
        const slack = FIT * TRACK_TOLERANCE[field];
        const rise = mid.fields[field] - a.fields[field];
        low[index] = Math.max(low[index] ?? -Infinity, (rise - slack) / span);
        high[index] = Math.min(high[index] ?? Infinity, (rise + slack) / span);
        const slope = (b.fields[field] - a.fields[field]) / reach;
        if (slope < (low[index] ?? -Infinity) || slope > (high[index] ?? Infinity)) fits = false;
      });
      if (!fits) break;
      to = next;
    }
    const end = samples[to];
    if (end !== undefined) kept.push(end);
    from = to;
  }
  return kept;
}

/** Wraps `rest` so every box lookup records the read rest key in `deps`. */
function trackRest(rest: RestReader, deps: Set<string>): RestReader {
  return {
    get: (name: string) => {
      deps.add(name);
      return rest.get(name);
    },
    has: (name: string) => {
      deps.add(name);
      return rest.has(name);
    },
    keys: () => {
      const list = rest.keys();
      for (const key of list) deps.add(key);
      return list;
    },
    object: (name: string) => {
      deps.add(name);
      return rest.object(name);
    },
    objectKeys: () => rest.objectKeys(),
  };
}

function mergeIntervals(
  raw: readonly (readonly [number, number])[],
): readonly (readonly [number, number])[] {
  if (raw.length === 0) return [];
  const sorted = [...raw].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const first = sorted[0];
  if (first === undefined) return [];
  const merged: [number, number][] = [[first[0], first[1]]];
  for (let i = 1; i < sorted.length; i += 1) {
    const next = sorted[i];
    const prev = merged.at(-1);
    if (next === undefined || prev === undefined) continue;
    if (next[0] <= prev[1]) prev[1] = Math.max(prev[1], next[1]);
    else merged.push([next[0], next[1]]);
  }
  return merged;
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
  intervals?: readonly (readonly [number, number])[],
  budget?: { taken: number },
): Map<string, Track> {
  const members = new Map(stage.members.map((member) => [member.name, member]));
  const alive = new Set([...names].filter((name) => members.has(name)));
  const anchors = new Map<string, Anchor | undefined>();
  const samples = new Map<string, TrackSample[][]>();
  const counter = budget ?? { taken: 0 };
  if (alive.size === 0 || length / gridStep > MAX_SAMPLES / 2) return new Map();

  const sample = (at: number, only: ReadonlySet<string>): Map<string, Posed> => {
    counter.taken += 1;
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

  const placed = new Set<number>([0, length]);
  if (intervals === undefined) {
    for (let at = 0; at < length; at += gridStep) placed.add(at);
  } else {
    for (const [lo, hi] of intervals) {
      const start = Math.max(0, lo);
      const end = Math.min(length, hi);
      placed.add(start);
      placed.add(end);
      for (let at = start; at < end; at += gridStep) placed.add(at);
    }
  }
  for (const at of edges) if (at > 0 && at < length) placed.add(at);
  const grid = [...placed].sort((a, b) => a - b);
  if (grid.length > MAX_SAMPLES / 2) return new Map();
  for (const at of grid) {
    if (alive.size === 0) break;
    for (const [name, posed] of sample(at, new Set(alive))) add(name, at, posed);
  }

  const finest = gridStep / 32;
  const refine = (name: string, a: number, b: number, depth: number): void => {
    if (!alive.has(name) || b - a <= finest || counter.taken > MAX_SAMPLES || depth > 24) return;
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
  if (counter.taken > MAX_SAMPLES) return tracks;
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
    rest: input.rest,
    ...(input.counts === undefined ? {} : { counts: input.counts }),
    lines: input.lines,
    only,
    moves,
    drives,
  });
  const poses = new Map<string, readonly (object | undefined)[]>();
  for (const member of stage.members)
    if (only.has(member.name))
      poses.set(member.name, posesOf(member, targets[member.name], input.counts));
  return { poses, moves, drives };
}

function scrollDrive(
  drive: Drive | undefined,
): Extract<Drive, { readonly kind: "scroll" }> | undefined {
  if (drive === undefined) return undefined;
  switch (drive.kind) {
    case "scroll":
      return drive;
    case "trigger":
    case "more":
      return undefined;
    default:
      return unreachable(drive);
  }
}

function triggerDrive(
  drive: Drive | undefined,
): Extract<Drive, { readonly kind: "trigger" }> | undefined {
  if (drive === undefined) return undefined;
  switch (drive.kind) {
    case "trigger":
      return drive;
    case "scroll":
    case "more":
      return undefined;
    default:
      return unreachable(drive);
  }
}

/** The tracks of the named elements whose motions read only the scroll position, sampled across
 * each element's active scroll intervals inside `[0, maxScroll]`, with read rest box names. */
export function scrollTracks(
  stage: Stage,
  input: TrackInput,
  maxScroll: number,
): SampledTracks<Track> {
  return withProbeStore(() => {
    if (input.names.size === 0 || maxScroll <= 0 || maxScroll / GRID_PX > MAX_SAMPLES / 2) {
      return { tracks: new Map(), deps: new Set() };
    }
    const found = runFrame(stage, input, 0, NO_EVENTS, input.names);
    const elementBeatDeps = new Map<string, Set<string>>();
    const groups = new Map<
      string,
      {
        readonly names: Set<string>;
        readonly intervals: readonly (readonly [number, number])[];
        readonly edges: Set<number>;
      }
    >();
    for (const name of input.names) {
      const drive = scrollDrive(found.drives.get(name));
      if (drive === undefined || found.moves.has(name)) continue;
      const beatDeps = new Set<string>();
      const spy = trackRest(input.rest, beatDeps);
      const raw: [number, number][] = [];
      const elEdges = new Set<number>();
      for (const beat of drive.beats) {
        const start = beat.from.at(spy);
        const end = beat.to.at(spy);
        if (end > start) {
          const lo = Math.max(0, start);
          const hi = Math.min(maxScroll, end);
          if (lo > 0 && lo < maxScroll) elEdges.add(lo);
          if (hi > 0 && hi < maxScroll) elEdges.add(hi);
          if (lo < hi) raw.push([lo, hi]);
        } else if (start >= 0 && start < maxScroll) {
          if (start > 0) elEdges.add(start);
          const hi = Math.min(maxScroll, start + GRID_PX);
          if (hi > 0 && hi < maxScroll) elEdges.add(hi);
          if (start < hi) raw.push([start, hi]);
        }
      }
      const intervals = mergeIntervals(raw);
      elementBeatDeps.set(name, beatDeps);
      const signature = intervals.map(([a, b]) => `${a}:${b}`).join(",");
      const group = groups.get(signature) ?? { names: new Set(), intervals, edges: new Set() };
      group.names.add(name);
      for (const edge of elEdges) group.edges.add(edge);
      groups.set(signature, group);
    }
    const allTracks = new Map<string, Track>();
    const deps = new Set<string>();
    const budget = { taken: 0 };
    for (const group of groups.values()) {
      const groupRestDeps = new Set<string>();
      const groupInput: TrackInput = { ...input, rest: trackRest(input.rest, groupRestDeps) };
      const groupTracks = sampleTracks(
        stage,
        group.names,
        maxScroll,
        GRID_PX,
        [...group.edges],
        (y, only) =>
          runFrame(stage, groupInput, 0, [{ name: INPUT_EVENTS.scroll, at: 0, value: y }], only),
        (name, _, sampled) =>
          scrollDrive(sampled.drives.get(name)) !== undefined && !sampled.moves.has(name),
        group.intervals,
        budget,
      );
      if (budget.taken > MAX_SAMPLES) return { tracks: new Map(), deps: new Set() };
      if (groupTracks.size === 0) continue;
      for (const [name, track] of groupTracks) {
        allTracks.set(name, track);
        for (const dep of elementBeatDeps.get(name) ?? []) deps.add(dep);
      }
      for (const dep of groupRestDeps) deps.add(dep);
    }
    return { tracks: allTracks, deps };
  });
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

/** Trigger-driven tracks of `input.names` and their read rest box names, sampled across each beat's ms. */
export function triggerTracks(stage: Stage, input: TrackInput): SampledTracks<TriggerTrack> {
  return withProbeStore(() => {
    if (input.names.size === 0) return { tracks: new Map(), deps: new Set() };
    const found = runFrame(stage, input, 0, NO_EVENTS, input.names);
    const byBeat = new Map<TriggerBeat, Set<string>>();
    for (const name of input.names) {
      const drive = triggerDrive(found.drives.get(name));
      if (drive === undefined) continue;
      const names = byBeat.get(drive.beat) ?? new Set<string>();
      names.add(name);
      byBeat.set(drive.beat, names);
    }
    const members = new Map(stage.members.map((member) => [member.name, member]));
    const out = new Map<string, TriggerTrack>();
    const deps = new Set<string>();
    for (const [beat, names] of byBeat) {
      const beatDeps = new Set<string>();
      const trackedInput: TrackInput = { ...input, rest: trackRest(input.rest, beatDeps) };
      const threshold = beat.when.point.at(trackedInput.rest);
      const crossed: Events = [{ name: INPUT_EVENTS.scroll, at: 0, value: threshold }];
      const tracks = sampleTracks(
        stage,
        names,
        beat.ms,
        beat.ms / TRIGGER_GRID,
        [],
        (ms, only) => runFrame(stage, trackedInput, ms, crossed, only),
        (name, ms, sampled) => {
          const drive = triggerDrive(sampled.drives.get(name));
          if (drive === undefined || drive.beat !== beat) return false;
          // While the trigger runs it moves with time; once done, any clock note is the motion's own.
          return ms < beat.ms || !sampled.moves.has(name);
        },
      );
      const before = threshold > 0 ? runFrame(stage, trackedInput, 0, NO_EVENTS, names) : undefined;
      let keptAny = false;
      for (const [name, track] of tracks) {
        const member = members.get(name);
        if (member === undefined) continue;
        if (before !== undefined && !restsAtStart(member, track, before)) continue;
        out.set(name, { ...track, beat });
        keptAny = true;
      }
      if (keptAny) for (const dep of beatDeps) deps.add(dep);
    }
    return { tracks: out, deps };
  });
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
