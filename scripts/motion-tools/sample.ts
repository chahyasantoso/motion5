import { Engine, createManualClock, validateV5 } from "@motion5/core";
import type {
  Diagnostic,
  LivePatch,
  Outputs,
  PluginCatalog,
  ProjectDefinition,
} from "@motion5/core";
import { unreachable } from "@motion5/core/plugin-api";
import { createGsapInterpolator } from "@motion5/core/adapters";
import { createFakeScheduler } from "@motion5/core/testing";
import { gsap } from "gsap";

export type SampleRequest =
  | { readonly kind: "time"; readonly ms: readonly number[] }
  | { readonly kind: "progress"; readonly progress: readonly number[] };

export type NodeSample =
  | {
      readonly status: "ready";
      readonly progress: number;
      readonly outputs: Outputs;
      readonly diagnostics: readonly Diagnostic[];
    }
  | { readonly status: "blocked" | "error"; readonly diagnostics: readonly Diagnostic[] }
  | { readonly status: "absent" };

export type SampleResult =
  | {
      readonly kind: "accepted";
      readonly samples: readonly {
        readonly at: number;
        readonly nodes: Readonly<Record<string, NodeSample>>;
      }[];
      readonly diagnostics: readonly Diagnostic[];
    }
  | { readonly kind: "refused"; readonly diagnostics: readonly Diagnostic[] }
  | { readonly kind: "unsupported"; readonly reasons: readonly string[] };

type TriggerType = ProjectDefinition["motions"][number]["trigger"]["type"];

/** The one trigger type each request can drive; a scroll motion is driven by none. */
function drivenTrigger(request: SampleRequest): TriggerType {
  switch (request.kind) {
    case "time":
      return "time";
    case "progress":
      return "manual";
    default:
      return unreachable(request);
  }
}

function pointsOf(request: SampleRequest): readonly number[] {
  switch (request.kind) {
    case "time":
      return request.ms;
    case "progress":
      return request.progress;
    default:
      return unreachable(request);
  }
}

function unsupportedReasons(project: ProjectDefinition, request: SampleRequest): string[] {
  const driven = drivenTrigger(request);
  return project.motions
    .filter((motion) => motion.trigger.type !== driven)
    .map(
      (motion) =>
        `Motion "${motion.id}" has a ${motion.trigger.type} trigger, which a ${request.kind} sample cannot drive.`,
    );
}

function readNode(patch: LivePatch | undefined): NodeSample {
  if (patch === undefined) return { status: "absent" };
  switch (patch.status) {
    case "ready":
      return {
        status: "ready",
        progress: patch.sourceProgress,
        outputs: patch.outputs,
        diagnostics: patch.diagnostics,
      };
    case "blocked":
      return { status: "blocked", diagnostics: patch.diagnostics };
    case "error":
      return { status: "error", diagnostics: patch.diagnostics };
    default:
      return unreachable(patch);
  }
}

/** Samples what each node publishes at each requested time or progress, driven by a manual clock. */
export function sampleProject(
  project: ProjectDefinition,
  catalog: PluginCatalog,
  request: SampleRequest,
  nodes?: readonly string[],
): SampleResult {
  const validation = validateV5(project, catalog);
  if (validation.kind === "refused")
    return { kind: "refused", diagnostics: validation.diagnostics };
  const reasons = unsupportedReasons(project, request);
  if (reasons.length > 0) return { kind: "unsupported", reasons };

  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const handle = new Engine({
    clock,
    interpolator: createGsapInterpolator(gsap),
    scheduler,
    plugins: catalog,
  }).load(project);
  try {
    const all = [
      ...project.motions.flatMap((motion) =>
        motion.tracks.map((track) => `${motion.id}/${track.id}`),
      ),
      ...handle.freeTrackIds(),
    ];
    for (const id of all) handle.mount(id);
    const ids = nodes ?? all;

    const drive = (at: number, previous: number): void => {
      switch (request.kind) {
        case "time":
          clock.tick(at - previous);
          break;
        case "progress":
          for (const motion of project.motions)
            handle.signal(motion.id, { type: "manual", progress: at });
          break;
        default:
          return unreachable(request);
      }
      scheduler.flush();
    };

    let previous = 0;
    const samples = pointsOf(request).map((at) => {
      drive(at, previous);
      previous = at;
      const sampled: Record<string, NodeSample> = {};
      for (const id of ids) sampled[id] = readNode(handle.get(id));
      return { at, nodes: sampled };
    });
    return { kind: "accepted", samples, diagnostics: validation.diagnostics };
  } finally {
    handle.dispose();
  }
}

export type SampleArgs =
  | {
      readonly kind: "ok";
      readonly file: string;
      readonly request: SampleRequest;
      readonly nodes?: readonly string[];
    }
  | { readonly kind: "usage"; readonly message: string };

const USAGE = "usage: motion:sample <project.json> (--at ms,ms | --progress p,p) [--nodes id,id]";

function parseNumbers(text: string | undefined): number[] | undefined {
  if (text === undefined || text === "") return undefined;
  const values = text.split(",").map((part) => (part.trim() === "" ? NaN : Number(part)));
  if (!values.every((value) => Number.isFinite(value) && value >= 0)) return undefined;
  for (let i = 1; i < values.length; i += 1) if (values[i]! < values[i - 1]!) return undefined;
  return values;
}

export function parseSampleArgs(argv: readonly string[]): SampleArgs {
  const usage = (message: string): SampleArgs => ({ kind: "usage", message });
  const files: string[] = [];
  const flags = new Map<string, string | undefined>();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]!;
    if (!arg.startsWith("--")) {
      files.push(arg);
      continue;
    }
    if (arg !== "--at" && arg !== "--progress" && arg !== "--nodes")
      return usage(`Unknown flag ${arg}. ${USAGE}`);
    if (flags.has(arg)) return usage(`Repeated flag ${arg}. ${USAGE}`);
    flags.set(arg, argv[i + 1]);
    i += 1;
  }
  const file = files[0];
  if (file === undefined || files.length !== 1) return usage(`Expected one project file. ${USAGE}`);
  const hasAt = flags.has("--at");
  if (hasAt === flags.has("--progress"))
    return usage(`Pass exactly one of --at and --progress. ${USAGE}`);

  let request: SampleRequest;
  if (hasAt) {
    const ms = parseNumbers(flags.get("--at"));
    if (ms === undefined)
      return usage(`--at needs ascending non-negative numbers, comma-separated. ${USAGE}`);
    request = { kind: "time", ms };
  } else {
    const progress = parseNumbers(flags.get("--progress"));
    if (progress === undefined || progress.some((value) => value > 1))
      return usage(`--progress needs ascending numbers from 0 to 1, comma-separated. ${USAGE}`);
    request = { kind: "progress", progress };
  }
  if (!flags.has("--nodes")) return { kind: "ok", file, request };
  const text = flags.get("--nodes");
  if (text === undefined || text === "") return usage(`--nodes needs ids. ${USAGE}`);
  return { kind: "ok", file, request, nodes: text.split(",") };
}
