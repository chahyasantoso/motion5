import type { PluginCatalog, ProjectDefinition } from "@motion5/core";
import { unreachable } from "@motion5/core/plugin-api";
import { sampleProject, type NodeSample } from "./sample";

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

const STEP_MS = 16;
const BAR_WIDTH = 60;
const END_LIMIT_MS = 60_000;

/** The time each time-triggered Motion stops changing, or why the project has none. */
function endOf(project: ProjectDefinition): number | readonly string[] {
  const reasons: string[] = [];
  let end = 0;
  for (const motion of project.motions) {
    const trigger = motion.trigger;
    switch (trigger.type) {
      case "time": {
        const read = (value: unknown, fallback: number) =>
          typeof value === "number" ? value : fallback;
        const repeat = read(trigger.repeat, 0);
        if (repeat === -1) reasons.push(`Motion "${motion.id}" repeats forever.`);
        else end = Math.max(end, read(trigger.delay, 0) + read(trigger.duration, 0) * (repeat + 1));
        break;
      }
      case "manual":
      case "scroll":
        reasons.push(`Motion "${motion.id}" has a ${trigger.type} trigger, which has no times.`);
        break;
      default:
        return unreachable(trigger);
    }
  }
  return reasons.length > 0 ? reasons : Math.min(end, END_LIMIT_MS);
}

function fingerprint(sample: NodeSample | undefined): string {
  if (sample === undefined) return "missing";
  switch (sample.status) {
    case "ready":
      return JSON.stringify(sample.outputs);
    case "blocked":
    case "error":
    case "absent":
    case "unknown":
      return sample.status;
    default:
      return unreachable(sample);
  }
}

/** Each node's first and last change over a run sampled every 16 ms, read from published outputs. */
export function timelineOf(project: ProjectDefinition, catalog: PluginCatalog): TimelineResult {
  const end = endOf(project);
  if (typeof end !== "number") return { kind: "not-timed", reasons: end };
  const ms: number[] = [];
  for (let at = 0; at <= end + 2 * STEP_MS; at += STEP_MS) ms.push(at);
  const result = sampleProject(project, catalog, { kind: "time", ms });
  switch (result.kind) {
    case "accepted":
      break;
    case "refused":
      return { kind: "not-timed", reasons: result.diagnostics.map(({ message }) => message) };
    case "unsupported":
      return { kind: "not-timed", reasons: result.reasons };
    default:
      return unreachable(result);
  }
  const nodes = Object.keys(result.samples[0]?.nodes ?? {});
  const rows = nodes.map((node): TimelineRow => {
    let start: number | undefined;
    let rest = 0;
    for (let index = 1; index < result.samples.length; index += 1) {
      const before = fingerprint(result.samples[index - 1]?.nodes[node]);
      const after = fingerprint(result.samples[index]?.nodes[node]);
      if (before === after) continue;
      const at = result.samples[index - 1]?.at ?? 0;
      start ??= at;
      rest = result.samples[index]?.at ?? at;
    }
    return start === undefined ? { kind: "still", node } : { kind: "moves", node, start, rest };
  });
  return { kind: "timeline", step: STEP_MS, end, rows };
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
