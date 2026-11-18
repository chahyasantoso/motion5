/** Ms a member shows, start included and end excluded; an end at the piece's last ms holds past it. */
export type Window = readonly [from: number, to: number];

/** What `visibleAt` needs of a member: its name, parent index and own windows. */
export interface Shown {
  readonly name: string;
  readonly parent: number;
  readonly on?: readonly Window[] | undefined;
}

function inside(windows: readonly Window[] | undefined, ms: number): boolean {
  return windows === undefined || windows.some(([from, to]) => ms >= from && ms < to);
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
