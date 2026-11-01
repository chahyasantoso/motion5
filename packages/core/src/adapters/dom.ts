import type { Patch } from "../contract/v5";
import { patchRender } from "../contract/patch-render";
import { selectRecord } from "../contract/output-select";
import { unreachable } from "../lang/exhaustive";
import type { RenderMetadata } from "../ports/render-metadata";

export interface StageLike {
  style: { perspective?: string; [key: string]: unknown };
  [key: string]: unknown;
}
export interface DomTarget {
  style: { removeProperty?: (property: string) => void; [key: string]: unknown };
  setAttribute?: (name: string, value: string) => void;
  removeAttribute?: (name: string) => void;
  [key: string]: unknown;
}
export type DomTargetResolver = (nodeId: string) => DomTarget | undefined;
export type DomPatchWriter = (target: DomTarget, values: Readonly<Record<string, unknown>>) => void;
export interface DomPatchAdapter {
  apply(patch: Patch): void;
  /**
   * Writes caller-derived values onto the resolver's target for `nodeId`, filtered and diffed as `apply` writes them, with no patch or revision.
   */
  applyValues(nodeId: string, values: Readonly<Record<string, unknown>>): void;
  clear(target?: DomTarget): void;
}

const transformKeys = new Set(["x", "y", "z", "rotation", "rotationX", "rotationY", "scale"]);
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
const SVG_TRANSFORM_BOX = "view-box";
const SVG_TRANSFORM_ORIGIN = "0px 0px";
/**
 * SVG: CSS pivots at the view box centre, the attribute pivoted at the element origin, so pin view-box and a zero origin once.
 */
function pinTransformReference(target: DomTarget): void {
  if (!("ownerSVGElement" in target)) return;
  if (target.style.transformBox !== SVG_TRANSFORM_BOX)
    target.style.transformBox = SVG_TRANSFORM_BOX;
  if (target.style.transformOrigin !== SVG_TRANSFORM_ORIGIN)
    target.style.transformOrigin = SVG_TRANSFORM_ORIGIN;
}
type WriteChannel = "attribute" | "property" | "style";
function isWritableProperty(target: DomTarget, key: string): boolean {
  for (let owner: object | null = target; owner !== null; owner = Object.getPrototypeOf(owner)) {
    const descriptor = Object.getOwnPropertyDescriptor(owner, key);
    if (descriptor === undefined) continue;
    return descriptor.set !== undefined || descriptor.writable === true;
  }
  return false;
}
/** Style first, so `cx` and `r` stay CSS; geometry with no writable property writes as an attribute. */
function channelFor(target: DomTarget, key: string): WriteChannel {
  if (key.startsWith("--") || key in target.style) return "style";
  if (isWritableProperty(target, key)) return "property";
  return typeof target.setAttribute === "function" ? "attribute" : "property";
}
function writeKey(target: DomTarget, key: string, value: unknown): void {
  const channel = channelFor(target, key);
  if (channel === "style") {
    if (value === undefined) removeStyleProperty(target, key);
    else target.style[key] = value;
    return;
  }
  if (channel === "attribute") {
    if (value === undefined) target.removeAttribute?.(key);
    else target.setAttribute?.(key, String(value));
    return;
  }
  target[key] = value;
}
/** Transform state is handed in per adapter and per target: two adapters on one element must not share composed keys. */
function createTransformWriter(
  transformState: WeakMap<object, Record<string, unknown>>,
): DomPatchWriter {
  return (target, values) => {
    const state = transformState.get(target) ?? {};
    const hadTransform = Object.keys(state).length > 0;
    for (const [key, value] of Object.entries(values)) {
      if (transformKeys.has(key)) {
        if (value === undefined) delete state[key];
        else state[key] = value;
        continue;
      }
      writeKey(target, key, value);
    }
    if (Object.keys(state).length > 0) {
      pinTransformReference(target);
      target.style.transform = composeTransform(state);
    } else if (hadTransform) removeStyleProperty(target, "transform");
    transformState.set(target, state);
  };
}
/** A plain record is a composite other nodes read, not a property a renderer writes. */
function isPlainRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
// Internal keys are filtered upstream; only renderer artifacts (`_`, `offset`) are dropped here, no second denylist.
function renderableValues(
  values: Readonly<Record<string, unknown>>,
  metadata?: RenderMetadata,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const outputSerializers = metadata?.outputSerializers ?? {};
  for (const [key, value] of Object.entries(values)) {
    if (key.startsWith("_") || key === "offset") continue;
    const serializer = outputSerializers[key];
    const rendered = serializer ? serializer(value) : value;
    // Composites are read by other nodes, not written: skipped after serialization, so a serializer that flattens one still renders.
    if (isPlainRecord(rendered)) continue;
    result[key] = rendered;
  }
  return result;
}
export function createDomPatchAdapter(
  stage: StageLike,
  perspective?: number,
  resolveTarget: DomTargetResolver = () => stage,
  write?: DomPatchWriter,
  metadata?: RenderMetadata,
): DomPatchAdapter {
  if (perspective !== undefined && Number.isFinite(perspective) && perspective > 0)
    stage.style.perspective = `${perspective}px`;
  const lastApplied = new WeakMap<object, Record<string, unknown>>();
  const transformState = new WeakMap<object, Record<string, unknown>>();
  /** Newest accepted revision, keyed by target then node: monotonic per node, and `clear` forgets it so a rebind writes. */
  const appliedRevisions = new WeakMap<object, Map<string, number>>();
  const writeTarget = write ?? createTransformWriter(transformState);
  // One filter, one dirty cache, one write for both entries, so a derived record and a published one cannot drift.
  function writeValues(target: DomTarget, values: Readonly<Record<string, unknown>>): void {
    const next = renderableValues(values, metadata);
    const previous = lastApplied.get(target) ?? {};
    const dirty: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(next))
      if (!Object.is(previous[key], value)) dirty[key] = value;
    for (const key of Object.keys(previous)) if (!(key in next)) dirty[key] = undefined;
    if (Object.keys(dirty).length === 0) return;
    writeTarget(target, dirty);
    lastApplied.set(target, next);
  }
  return {
    apply(patch) {
      const decision = patchRender(patch);
      if (decision.kind !== "render") return;
      const ready = decision.patch;
      const target = resolveTarget(ready.nodeId);
      if (target === undefined) return;
      const revisions = appliedRevisions.get(target) ?? new Map<string, number>();
      const accepted = revisions.get(ready.nodeId);
      // Gated before the diff and recorded even when the diff is empty, so revision alone decides staleness.
      if (accepted !== undefined && ready.revision <= accepted) return;
      revisions.set(ready.nodeId, ready.revision);
      appliedRevisions.set(target, revisions);
      const picked = selectRecord(ready.outputs.values);
      switch (picked.kind) {
        case "record":
          writeValues(target, picked.values);
          return;
        case "missing-output":
        case "wrong-kind":
          return;
        default:
          return unreachable(picked);
      }
    },
    applyValues(nodeId, values) {
      const target = resolveTarget(nodeId);
      if (target === undefined) return;
      writeValues(target, values);
    },
    clear(target) {
      if (target === undefined) return;
      lastApplied.delete(target);
      transformState.delete(target);
      appliedRevisions.delete(target);
    },
  };
}
