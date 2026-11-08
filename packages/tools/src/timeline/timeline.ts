import { unreachable } from "../page/unreachable";

export type TimelineRow =
  | { readonly kind: "moves"; readonly node: string; readonly start: number; readonly rest: number }
  | { readonly kind: "still"; readonly node: string };

export type TimelineResult =
  | {
      readonly kind: "timeline";
      readonly step: number;
      readonly end: number;
      readonly rows: readonly TimelineRow[];
    }
  | { readonly kind: "not-timed"; readonly reasons: readonly string[] };

export const STEP_MS = 16;
const BAR_WIDTH = 60;

/** A run sampled at ascending times, each sample a fingerprint per target. */
export interface FingerprintSample {
  readonly at: number;
  readonly fingerprints: Readonly<Record<string, string>>;
}

/** Each target's first and last change across the samples, or `still` when it never changes. */
export function changeRows(samples: readonly FingerprintSample[]): TimelineRow[] {
  const targets = Object.keys(samples[0]?.fingerprints ?? {});
  return targets.map((node): TimelineRow => {
    let start: number | undefined;
    let rest = 0;
    for (let index = 1; index < samples.length; index += 1) {
      const before = samples[index - 1]?.fingerprints[node];
      const after = samples[index]?.fingerprints[node];
      if (before === after) continue;
      const at = samples[index - 1]?.at ?? 0;
      start ??= at;
      rest = samples[index]?.at ?? at;
    }
    return start === undefined ? { kind: "still", node } : { kind: "moves", node, start, rest };
  });
}

/** One text bar per node: `#` while it changes, `.` while it holds. */
export function renderTimeline(timeline: TimelineResult): string {
  switch (timeline.kind) {
    case "not-timed":
      return timeline.reasons.join("\n");
    case "timeline": {
      const width = Math.max(...timeline.rows.map(({ node }) => node.length), 4);
      const column = (at: number) => Math.round((at / timeline.end) * (BAR_WIDTH - 1));
      const lines = timeline.rows.map((row) => {
        switch (row.kind) {
          case "still":
            return `${row.node.padEnd(width)} ${".".repeat(BAR_WIDTH)}  still`;
          case "moves": {
            const from = column(row.start);
            const to = Math.max(from, column(Math.min(row.rest, timeline.end)));
            const bar =
              ".".repeat(from) + "#".repeat(to - from + 1) + ".".repeat(BAR_WIDTH - to - 1);
            return `${row.node.padEnd(width)} ${bar}  ${row.start}-${row.rest} ms`;
          }
          default:
            return unreachable(row);
        }
      });
      const scale = `${"".padEnd(width)} 0 ms${`${timeline.end} ms`.padStart(BAR_WIDTH - 4)}`;
      return [scale, ...lines].join("\n");
    }
    default:
      return unreachable(timeline);
  }
}
