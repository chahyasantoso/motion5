import type { Span } from "@gerak/core";

/** Ms a member shows, start included and end excluded; an end at the piece's last ms holds past it. */
export type Window = readonly [from: number, to: number];

/** What `visibleAt` needs of a member: its name, parent index and own windows. */
export interface Shown {
  readonly name: string;
  readonly parent: number;
  readonly on?: readonly Window[] | undefined;
}

/** The window from `from` to `to` ms; one reaching `durationMs` holds past it. */
export function windowOf(from: number, to: number, durationMs: number): Window {
  return Object.freeze([from, to >= durationMs ? Infinity : to]);
}

function holds([from, to]: Window, ms: number): boolean {
  return ms >= from && ms < to;
}

function inside(windows: readonly Window[] | undefined, ms: number): boolean {
  return windows === undefined || windows.some((window) => holds(window, ms));
}

/** The latest-started beat whose window holds `ms`, or `undefined` in a gap between beats. */
export function beatAt(
  beats: Readonly<Record<string, Span>>,
  durationMs: number,
  ms: number,
): string | undefined {
  let found: { readonly name: string; readonly from: number } | undefined;
  for (const [name, { from, to }] of Object.entries(beats))
    if (holds(windowOf(from, to, durationMs), ms) && (found === undefined || from >= found.from))
      found = { name, from };
  return found?.name;
}

function recordAt(members: readonly Shown[], ms: number): Readonly<Record<string, boolean>> {
  const shown: boolean[] = [];
  const record: Record<string, boolean> = {};
  members.forEach((member, index) => {
    const own = inside(member.on, ms) && (member.parent < 0 || shown[member.parent] === true);
    shown[index] = own;
    record[member.name] = own;
  });
  return Object.freeze(record);
}

/** Which members show at a ms, computed once per span between window ends; parents come before children. */
export function visibility(
  members: readonly Shown[],
): (ms: number) => Readonly<Record<string, boolean>> {
  const points = [
    ...new Set(members.flatMap(({ on }) => (on ?? []).flatMap(([from, to]) => [from, to]))),
  ]
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  if (points.length === 0) {
    const always = recordAt(members, 0);
    return () => always;
  }
  // Region 0 precedes points[0]; region i+1 holds across [points[i], points[i+1]).
  const regions: readonly Readonly<Record<string, boolean>>[] = [
    recordAt(members, (points[0] ?? 0) - 1),
    ...points.map((point) => recordAt(members, point)),
  ];
  return (ms) => {
    let low = 0;
    let high = points.length - 1;
    let found = -1;
    while (low <= high) {
      const middle = (low + high) >> 1;
      if ((points[middle] ?? Infinity) <= ms) {
        found = middle;
        low = middle + 1;
      } else high = middle - 1;
    }
    return regions[found + 1] ?? regions[0] ?? {};
  };
}
