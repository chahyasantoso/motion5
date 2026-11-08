import { parseNumbers } from "./args";
import { fitCurve, type Fit } from "./curves";
import { readPageArgs, withPage, type PageTarget } from "./page";

/** What `motion:read` measures on each element: its own transform, decomposed, and its own opacity. */
export const CHANNELS = ["x", "y", "rotation", "scaleX", "scaleY", "opacity"] as const;
export type Channel = (typeof CHANNELS)[number];

/** The least change between two frames that counts as motion, per channel. */
const STILL: Readonly<Record<Channel, number>> = {
  x: 0.25,
  y: 0.25,
  rotation: 0.1,
  scaleX: 0.001,
  scaleY: 0.001,
  opacity: 0.002,
};

/** A reversal splits a move when it goes back at least this share of the way it came. */
const RETRACE = 0.3;

export interface Segment {
  readonly channel: Channel;
  readonly from: number;
  readonly to: number;
  readonly start: number;
  readonly end: number;
  readonly ease: Fit | { readonly name: "step" };
}

export interface ElementMotion {
  readonly name: string;
  readonly segments: readonly Segment[];
}

export interface ReadMotionRequest extends PageTarget {
  readonly select: readonly string[];
  readonly to: number;
}

export type ReadMotionArgs =
  | ({ readonly kind: "ok" } & ReadMotionRequest)
  | { readonly kind: "usage"; readonly message: string };

export interface ReadMotionResult {
  readonly kind: "read";
  readonly elements: readonly ElementMotion[];
  readonly pageErrors: readonly string[];
}

const STEP_MS = 16;
const USAGE = "usage: motion:read <page> --select selector,selector --to ms [--size WxH]";

export function parseReadArgs(argv: readonly string[]): ReadMotionArgs {
  const usage = (message: string): ReadMotionArgs => ({
    kind: "usage",
    message: `${message} ${USAGE}`,
  });
  const read = readPageArgs(argv, ["--select", "--to"]);
  if (read.kind === "usage") return usage(read.message);
  const select = (read.flags.get("--select") ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part !== "");
  if (select.length === 0) return usage("--select needs CSS selectors.");
  const to = parseNumbers(read.flags.get("--to"));
  if (to?.length !== 1 || to[0] === undefined) return usage("--to needs one time in ms.");
  return { kind: "ok", ...read.target, select, to: to[0] };
}

/** The indices where a run of motion turns back far enough to be a move of its own. */
function turns(values: readonly number[], first: number, last: number): number[] {
  const extremes: number[] = [];
  let direction = 0;
  for (let i = first + 1; i <= last; i += 1) {
    const step = Math.sign((values[i] ?? 0) - (values[i - 1] ?? 0));
    if (step === 0) continue;
    if (direction !== 0 && step !== direction) extremes.push(i - 1);
    direction = step;
  }
  const kept: number[] = [];
  let from = first;
  extremes.forEach((at, index) => {
    const next = extremes[index + 1] ?? last;
    const came = Math.abs((values[at] ?? 0) - (values[from] ?? 0));
    const back = Math.abs((values[at] ?? 0) - (values[next] ?? 0));
    if (came > 0 && back >= RETRACE * came) {
      kept.push(at);
      from = at;
    }
  });
  return kept;
}

function segment(
  channel: Channel,
  times: readonly number[],
  values: readonly number[],
  first: number,
  last: number,
): Segment {
  const from = values[first] ?? 0;
  const to = values[last] ?? 0;
  const start = times[first] ?? 0;
  const end = times[last] ?? 0;
  if (last - first < 3 || Math.abs(to - from) < 4 * STILL[channel])
    return { channel, from, to, start, end, ease: { name: "step" } };
  const points = [];
  for (let i = first; i <= last; i += 1)
    points.push({
      u: ((times[i] ?? 0) - start) / (end - start),
      p: ((values[i] ?? 0) - from) / (to - from),
    });
  return { channel, from, to, start, end, ease: fitCurve(points) };
}

/** Angles read from a matrix wrap at ±180; this keeps each the short way from the last, so a wrap is no move. */
export function unwrapTurns(degrees: readonly number[]): readonly number[] {
  const out: number[] = [];
  for (const angle of degrees) {
    const last = out.at(-1);
    out.push(last === undefined ? angle : last + ((((angle - last) % 360) + 540) % 360) - 180);
  }
  return out;
}

/** One channel's samples as moves: each from where it starts to where it settles or turns back. */
export function segmentsOf(
  channel: Channel,
  times: readonly number[],
  values: readonly number[],
): readonly Segment[] {
  const moving = (i: number) => Math.abs((values[i] ?? 0) - (values[i - 1] ?? 0)) > STILL[channel];
  const segments: Segment[] = [];
  let i = 1;
  while (i < values.length) {
    if (!moving(i)) {
      i += 1;
      continue;
    }
    let first = i - 1;
    let last = i;
    while (last + 1 < values.length && (moving(last + 1) || moving(last + 2))) last += 1;
    // A slow start or end creeps below the still limit: follow it while it keeps going the same way.
    const step = (at: number) => (values[at] ?? 0) - (values[at - 1] ?? 0);
    const creeps = (at: number, toward: number) =>
      Math.sign(step(at)) === Math.sign(toward) && Math.abs(step(at)) > STILL[channel] / 50;
    while (first > 0 && creeps(first, step(first + 1))) first -= 1;
    while (last + 1 < values.length && creeps(last + 1, step(last))) last += 1;
    let from = first;
    for (const turn of turns(values, first, last)) {
      segments.push(segment(channel, times, values, from, turn));
      from = turn;
    }
    segments.push(segment(channel, times, values, from, last));
    i = last + 1;
  }
  return segments;
}

function shown(value: number): string {
  return String(Math.round(value * 100) / 100);
}

function easeText(ease: Segment["ease"]): string {
  if (!("rms" in ease)) return ease.name;
  if (ease.bezier === undefined) return ease.name;
  return `≈ cubic-bezier(${ease.bezier.control.join(", ")}), nearest ${ease.name} (rms ${ease.rms})`;
}

/** One line per move, for a reader who wants prose rather than JSON; channels moving together share one. */
export function describeMotion(element: ElementMotion): readonly string[] {
  const lines = new Map<string, string[]>();
  for (const { channel, from, to, start, end, ease } of element.segments) {
    const key = `${start}-${end} ms (${end - start} ms), ${easeText(ease)}`;
    lines.set(key, [...(lines.get(key) ?? []), `${channel} ${shown(from)} → ${shown(to)}`]);
  }
  return [...lines].map(([key, moves]) => `${element.name} ${moves.join(", ")}, ${key}`);
}

/** Samples each match's own transform and opacity every 16 ms up to `to`, and reads them as moves. */
export async function readMotion(request: ReadMotionRequest): Promise<ReadMotionResult> {
  const { value, pageErrors } = await withPage(request, async ({ page, advanceTo }) => {
    const times: number[] = [];
    const series = new Map<string, number[][]>();
    for (let at = 0; at <= request.to; at += STEP_MS) {
      await advanceTo(at);
      const sampled = await page.evaluate((selectors) => {
        const rows: { name: string; values: number[] }[] = [];
        for (const selector of selectors)
          document.querySelectorAll(selector).forEach((element, index) => {
            const style = getComputedStyle(element);
            const matrix = new DOMMatrixReadOnly(style.transform === "none" ? "" : style.transform);
            const scaleX = Math.hypot(matrix.a, matrix.b);
            const turn = (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI;
            const scaleY = scaleX === 0 ? 0 : (matrix.a * matrix.d - matrix.b * matrix.c) / scaleX;
            const text = (element.textContent ?? "").trim().slice(0, 12);
            rows.push({
              name: `${selector}[${index}]${text === "" ? "" : ` "${text}"`}`,
              values: [matrix.e, matrix.f, turn, scaleX, scaleY, Number(style.opacity)],
            });
          });
        return rows;
      }, request.select);
      times.push(at);
      for (const row of sampled) {
        const rows = series.get(row.name) ?? [];
        rows.push(row.values);
        series.set(row.name, rows);
      }
    }
    return [...series].map(([name, rows]) => ({
      name,
      segments: CHANNELS.flatMap((channel, column) =>
        segmentsOf(
          channel,
          times,
          channel === "rotation"
            ? unwrapTurns(rows.map((row) => row[column] ?? 0))
            : rows.map((row) => row[column] ?? 0),
        ),
      ).sort((a, b) => a.start - b.start),
    }));
  });
  return { kind: "read", elements: value, pageErrors };
}
