import type { Patch } from "../runtime/patch-registry";

export interface StageLike {
  style: { perspective?: string };
}

export interface DomPatchAdapter {
  apply(patch: Patch): void;
}

export function createDomPatchAdapter(stage: StageLike, perspective?: number): DomPatchAdapter {
  if (perspective !== undefined && Number.isFinite(perspective) && perspective > 0)
    stage.style.perspective = `${perspective}px`;
  return {
    apply(patch) {
      if (patch.status !== "ready") return;
      Object.assign(stage, patch.values);
    },
  };
}
