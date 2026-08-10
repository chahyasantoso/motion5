import type { Patch } from "../runtime/patch-registry";

export interface StageLike {
  style: { perspective?: string; [key: string]: unknown };
  [key: string]: unknown;
}

export interface DomTarget {
  style: { [key: string]: unknown };
  [key: string]: unknown;
}

export type DomTargetResolver = (nodeId: string) => DomTarget | undefined;
export type DomPatchWriter = (target: DomTarget, values: Readonly<Record<string, unknown>>) => void;

export interface DomPatchAdapter {
  apply(patch: Patch): void;
  clear(target?: DomTarget): void;
}

function defaultWriter(target: DomTarget, values: Readonly<Record<string, unknown>>): void {
  for (const [key, value] of Object.entries(values)) {
    if (key in target.style || key.startsWith("--")) target.style[key] = value;
    else target[key] = value;
  }
}

function renderableValues(values: Readonly<Record<string, unknown>>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (key.startsWith("_") || key === "offset") continue;
    result[key] = value;
  }
  return result;
}

export function createDomPatchAdapter(
  stage: StageLike,
  perspective?: number,
  resolveTarget: DomTargetResolver = () => stage,
  write: DomPatchWriter = defaultWriter,
): DomPatchAdapter {
  if (perspective !== undefined && Number.isFinite(perspective) && perspective > 0)
    stage.style.perspective = `${perspective}px`;
  const lastApplied = new WeakMap<object, Record<string, unknown>>();
  return {
    apply(patch) {
      if (patch.status !== "ready") return;
      const target = resolveTarget(patch.nodeId);
      if (target === undefined) return;
      const next = renderableValues(patch.values);
      const previous = lastApplied.get(target) ?? {};
      const dirty: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(next))
        if (!Object.is(previous[key], value)) dirty[key] = value;
      for (const key of Object.keys(previous)) if (!(key in next)) dirty[key] = undefined;
      if (Object.keys(dirty).length === 0) return;
      write(target, dirty);
      lastApplied.set(target, next);
    },
    clear(target) {
      if (target === undefined) return;
      lastApplied.delete(target);
    },
  };
}
