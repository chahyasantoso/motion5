/** The stages one live frame passes through, in order. */
export const STAGES = ["detect", "adapt", "fill", "write", "draw"] as const;
export type Stage = (typeof STAGES)[number];

export interface FrameTimings {
  readonly tMs: number;
  readonly stages: Readonly<Record<Stage, number>>;
}

/**
 * Per-stage wall time for one live frame. Live-only instrumentation: the filler modules never read
 * a clock, and this is not a latency claim about anything but the browser it ran in.
 */
export function createStageTimer(now: () => number = () => performance.now()) {
  let last = now();
  const stages = {} as Record<Stage, number>;
  return {
    mark(stage: Stage) {
      const at = now();
      stages[stage] = at - last;
      last = at;
    },
    finish(tMs: number): FrameTimings {
      for (const stage of STAGES) stages[stage] ??= 0;
      return { tMs, stages: { ...stages } };
    },
  };
}

export function formatTimings(timings: FrameTimings): string {
  return STAGES.map((stage) => `${stage} ${timings.stages[stage].toFixed(1)}ms`).join(" · ");
}
