import type { Frame } from "./check";

export type PickReason = "start" | "end" | "fast" | "turn" | "even";

export interface PickedFrame {
  readonly at: number;
  readonly reason: PickReason;
}

/** The most frames a review photographs unless told otherwise. */
export const DEFAULT_PICKS = 10;
/** A sheet with fewer frames than this is filled with frames at even times. */
const EVEN_FLOOR = 6;
/** Two picked frames are at least this far apart, in ms. */
const MIN_GAP = 48;
/** A centre or size that moves less than this between two samples is at rest, in px. */
const REST_PX = 0.5;

interface Step {
  /** Sample index the step starts on; it ends on the next one. */
  readonly start: number;
  readonly dx: number;
  readonly dy: number;
  /** Centre and size change together, in px per sample. */
  readonly length: number;
}

interface Candidate {
  readonly element: string;
  readonly at: number;
  readonly reason: "fast" | "turn";
  readonly score: number;
}

function stepsOf(frames: readonly Frame[], name: string): readonly Step[] {
  const steps: Step[] = [];
  frames.forEach((frame, index) => {
    const before = frames[index - 1]?.elements.find((element) => element.name === name)?.box;
    const after = frame.elements.find((element) => element.name === name)?.box;
    if (before === undefined || after === undefined) return;
    const dx = after.x + after.width / 2 - (before.x + before.width / 2);
    const dy = after.y + after.height / 2 - (before.y + before.height / 2);
    const length = Math.hypot(dx, dy, after.width - before.width, after.height - before.height);
    steps.push({ start: index - 1, dx, dy, length });
  });
  return steps;
}

function candidates(frames: readonly Frame[]): {
  readonly fast: readonly Candidate[];
  readonly turn: readonly Candidate[];
} {
  const names = [...new Set(frames.flatMap(({ elements }) => elements.map(({ name }) => name)))];
  const fast: Candidate[] = [];
  const turn: Candidate[] = [];
  const atIndex = (index: number) => frames[index]?.at ?? 0;
  for (const name of names) {
    const steps = stepsOf(frames, name);
    // A sample takes the speed of the faster step on either side of it.
    const speed = new Map<number, number>();
    for (const step of steps)
      for (const index of [step.start, step.start + 1])
        speed.set(index, Math.max(speed.get(index) ?? 0, step.length));
    for (const [index, score] of speed)
      if (score >= REST_PX) fast.push({ element: name, at: atIndex(index), reason: "fast", score });
    const moving = steps.filter(({ dx, dy }) => Math.hypot(dx, dy) >= REST_PX);
    moving.forEach((step, index) => {
      const next = moving[index + 1];
      if (next === undefined || step.dx * next.dx + step.dy * next.dy >= 0) return;
      turn.push({
        element: name,
        at: atIndex(step.start + 1),
        reason: "turn",
        score: Math.hypot(step.dx, step.dy) + Math.hypot(next.dx, next.dy),
      });
    });
  }
  return { fast, turn };
}

/** Each element's strongest candidate of a kind scores 1, so a small dot stands beside six letters. */
function rank(list: readonly Candidate[]): readonly Candidate[] {
  const top = new Map<string, number>();
  for (const { element, score } of list) top.set(element, Math.max(top.get(element) ?? 0, score));
  return list.map((candidate) => ({
    ...candidate,
    score: Math.round((candidate.score / (top.get(candidate.element) ?? 1)) * 100) / 100,
  }));
}

/** Times to photograph, ascending: both ends, then each element's fastest and turning samples in turn, 48 ms apart, up to `cap`. */
export function pickFrames(frames: readonly Frame[], cap = DEFAULT_PICKS): readonly PickedFrame[] {
  const first = frames[0];
  const last = frames.at(-1);
  if (first === undefined || last === undefined) return [];
  if (first.at === last.at) return [{ at: first.at, reason: "start" }];
  const picked: PickedFrame[] = [
    { at: first.at, reason: "start" },
    { at: last.at, reason: "end" },
  ];
  const { fast, turn } = candidates(frames);
  const kinds = { turn: 0, fast: 1 };
  const ranked = [...rank(turn), ...rank(fast)].sort(
    (a, b) => b.score - a.score || kinds[a.reason] - kinds[b.reason] || a.at - b.at,
  );
  // Elements take turns, each its best moment left, so one busy element cannot take every frame.
  const queues = new Map<string, Candidate[]>();
  for (const candidate of ranked)
    queues.set(candidate.element, [...(queues.get(candidate.element) ?? []), candidate]);
  const free = (at: number) => picked.every((other) => Math.abs(other.at - at) >= MIN_GAP);
  for (let taken = true; taken && picked.length < Math.max(2, cap); ) {
    taken = false;
    for (const queue of queues.values()) {
      if (picked.length >= Math.max(2, cap)) break;
      const next = queue.findIndex(({ at }) => free(at));
      const [chosen] = next < 0 ? [] : queue.splice(next, 1);
      if (chosen === undefined) continue;
      picked.push({ at: chosen.at, reason: chosen.reason });
      taken = true;
    }
  }
  // Where little moves as a box, such as a canvas, frames at even times keep the sheet worth reading.
  const floor = Math.min(Math.max(2, cap), EVEN_FLOOR);
  for (let slot = 1; picked.length < floor && slot < EVEN_FLOOR; slot += 1) {
    const at = Math.round(first.at + ((last.at - first.at) * slot) / (EVEN_FLOOR - 1));
    if (picked.every((other) => Math.abs(other.at - at) >= MIN_GAP))
      picked.push({ at, reason: "even" });
  }
  return picked.sort((a, b) => a.at - b.at);
}
