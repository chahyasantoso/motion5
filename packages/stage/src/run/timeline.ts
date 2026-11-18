/** Ms a member shows, both ends included; an end at the piece's last ms holds past it. */
export type Window = readonly [from: number, to: number];

/** What `visibleAt` needs of a member: its name, parent index and own windows. */
export interface Shown {
  readonly name: string;
  readonly parent: number;
  readonly on?: readonly Window[] | undefined;
}

function inside(windows: readonly Window[] | undefined, ms: number): boolean {
  return windows === undefined || windows.some(([from, to]) => ms >= from && ms <= to);
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
  // Region 2i+1 is exactly points[i]; region 2i+2 lies between points[i] and points[i+1].
  const regions: Readonly<Record<string, boolean>>[] = [recordAt(members, (points[0] ?? 0) - 1)];
  points.forEach((point, index) => {
    const next = points[index + 1];
    regions.push(recordAt(members, point));
    regions.push(recordAt(members, next === undefined ? point + 1 : (point + next) / 2));
  });
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
    const region = found < 0 ? 0 : points[found] === ms ? 2 * found + 1 : 2 * found + 2;
    return regions[region] ?? regions[0] ?? {};
  };
}
