import type { PluginCatalog, ProjectDefinition } from "@motion5/core";
import { unreachable } from "@motion5/core/plugin-api";
import { sampleProject, type NodeSample } from "./sample";
import { STEP_MS, changeRows, type TimelineResult } from "../timeline/timeline";

export { renderTimeline, type TimelineResult, type TimelineRow } from "../timeline/timeline";

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
  const rows = changeRows(
    result.samples.map(({ at, nodes }) => ({
      at,
      fingerprints: Object.fromEntries(
        Object.entries(nodes).map(([node, sample]) => [node, fingerprint(sample)]),
      ),
    })),
  );
  return { kind: "timeline", step: STEP_MS, end, rows };
}
