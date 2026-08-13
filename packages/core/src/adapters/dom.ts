import type { Patch } from "../runtime/patch-registry";
import type { ResolvedPlugins } from "../domain/plugins";

export interface StageLike {
  style: { perspective?: string; [key: string]: unknown };
  [key: string]: unknown;
}
export interface DomTarget {
  style: { removeProperty?: (property: string) => void; [key: string]: unknown };
  [key: string]: unknown;
}
export type DomTargetResolver = (nodeId: string) => DomTarget | undefined;
export type DomPatchWriter = (target: DomTarget, values: Readonly<Record<string, unknown>>) => void;
export interface DomPatchAdapter {
  apply(patch: Patch): void;
  clear(target?: DomTarget): void;
}

const transformKeys = new Set(["x", "y", "z", "rotation", "rotationX", "rotationY", "scale"]);
const transformState = new WeakMap<object, Record<string, unknown>>();
function transformValue(key: string, value: unknown): string {
  if (key === "scale") return `scale(${String(value)})`;
  if (key === "rotation") return `rotate(${String(value)}deg)`;
  if (key === "rotationX") return `rotateX(${String(value)}deg)`;
  if (key === "rotationY") return `rotateY(${String(value)}deg)`;
  return `${key}(${String(value)}px)`;
}
function composeTransform(values: Readonly<Record<string, unknown>>): string {
  const parts: string[] = [];
  if ("x" in values || "y" in values || "z" in values) {
    const x = values.x ?? 0;
    const y = values.y ?? 0;
    const z = values.z ?? 0;
    parts.push(`translate3d(${String(x)}px, ${String(y)}px, ${String(z)}px)`);
  }
  for (const key of ["rotation", "rotationX", "rotationY", "scale"])
    if (key in values) parts.push(transformValue(key, values[key]));
  return parts.join(" ");
}
function removeStyleProperty(target: DomTarget, key: string): void {
  if (typeof target.style.removeProperty === "function") target.style.removeProperty(key);
  else target.style[key] = undefined;
}
function defaultWriter(target: DomTarget, values: Readonly<Record<string, unknown>>): void {
  const state = transformState.get(target) ?? {};
  const hadTransform = Object.keys(state).length > 0;
  for (const [key, value] of Object.entries(values)) {
    if (transformKeys.has(key)) {
      if (value === undefined) delete state[key];
      else state[key] = value;
      continue;
    }
    if (value === undefined) removeStyleProperty(target, key);
    else if (key in target.style || key.startsWith("--")) target.style[key] = value;
    else target[key] = value;
  }
  if (Object.keys(state).length > 0) target.style.transform = composeTransform(state);
  else if (hadTransform) removeStyleProperty(target, "transform");
  transformState.set(target, state);
}
function renderableValues(values: Readonly<Record<string, unknown>>, metadata: ResolvedPlugins): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (key.startsWith("_") || key === "offset" || metadata.internalKeys.includes(key)) continue;
    const serializer = metadata.outputSerializers[key];
    result[key] = serializer ? serializer(value) : value;
  }
  return result;
}
export function createDomPatchAdapter(
  stage: StageLike,
  perspective?: number,
  resolveTarget: DomTargetResolver = () => stage,
  write: DomPatchWriter = defaultWriter,
  metadata: ResolvedPlugins = {
    plugins: Object.freeze([]),
    diagnostics: Object.freeze([]),
    internalKeys: Object.freeze([]),
    outputSerializers: Object.freeze({}),
  },
): DomPatchAdapter {
  if (perspective !== undefined && Number.isFinite(perspective) && perspective > 0)
    stage.style.perspective = `${perspective}px`;
  const lastApplied = new WeakMap<object, Record<string, unknown>>();
  return {
    apply(patch) {
      if (patch.status !== "ready") return;
      const target = resolveTarget(patch.nodeId);
      if (target === undefined) return;
      const next = renderableValues(patch.values, metadata);
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
      transformState.delete(target);
    },
  };
}
