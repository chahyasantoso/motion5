import type { Patch } from "../runtime/patch-registry";
import type { RenderMetadata } from "../domain/plugins";

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
const SVG_TRANSFORM_BOX = "fill-box";
/**
 * Pins the reference box before a composed transform reaches an SVG element.
 *
 * CSS `transform-box` initially resolves against the nearest view box, so on an SVG element a future
 * `rotation` or `scale` would pivot around the viewport while the `transform` attribute those
 * consumers used pivoted around the element itself. Translation is origin-independent, which is why
 * no shipped output changes here; the pin is what makes the next transform key correct when it is
 * published rather than one bug report later. Structural detection, because this adapter types a
 * target by what it can be written to and never by `instanceof`, and idempotent, so a bound element
 * pays one write instead of one per frame. See ADR-073.
 */
function pinTransformBox(target: DomTarget): void {
  if (!("ownerSVGElement" in target)) return;
  if (target.style.transformBox !== SVG_TRANSFORM_BOX)
    target.style.transformBox = SVG_TRANSFORM_BOX;
}
/**
 * The shipped writer, over the transform state of exactly one adapter.
 *
 * Composition is stateful: `x` alone has to be written as a whole `transform` string beside the
 * `scale` an earlier patch set, so the writer keeps the keys it has already composed per target.
 * That state is handed in rather than reached for, because two adapters bound to one element are
 * two owners of one element's pose. A module-level map let the second inherit keys it was never
 * sent, compose them into a transform its own patches never mentioned, and lose them again when
 * either one cleared. One adapter, one composition. See ADR-074.
 */
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
      if (value === undefined) removeStyleProperty(target, key);
      else if (key in target.style || key.startsWith("--")) target.style[key] = value;
      else target[key] = value;
    }
    if (Object.keys(state).length > 0) {
      pinTransformBox(target);
      target.style.transform = composeTransform(state);
    } else if (hadTransform) removeStyleProperty(target, "transform");
    transformState.set(target, state);
  };
}
/**
 * A plain record, as opposed to an array, a class instance, or a primitive.
 *
 * The same predicate the publisher uses to decide what a composed value may be, for the opposite
 * reason: there a record is legal to publish, here a record is not a property a renderer writes.
 */
function isPlainRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
// No internal-key denylist here. `Track.compose` removes internal keys before publication, so this
// adapter and every other renderer receive the same filtered values; consulting `internalKeys`
// again here would be a second owner that only one of the two shipped renderers implements. What
// remains is renderer business: `offset` is a tween-engine artifact, and `_` cannot reach a patch.
// See ADR-042.
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
    // A composite output is a value other nodes read, not a property a renderer can write. `ik`
    // publishes `rotations` as a record keyed by member id, and with the default `resolveTarget`
    // every patch resolves to the stage, so `defaultWriter` would fall through to
    // `target[key] = value` and set `stage.rotations` on every frame forever: this adapter's own
    // suppression is `Object.is` against a freshly built object and can never match. Skipped after
    // serialization, so a plugin that serializes a composite into something renderable still
    // renders. See ADR-051.
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
  /**
   * The newest revision this adapter has accepted, per target and per node.
   *
   * Keyed by both, because a revision is monotonic per node and says nothing across nodes: the
   * default resolver hands one stage every node's patches, so a per-target key alone would drop a
   * lower-numbered node's writes as stale. Keyed by target as well, because a rebound element
   * arrives with no record while the retained patch that re-poses it carries a revision this
   * adapter has already accepted; `clear` drops the record with the rest of that target's state,
   * which is what makes a rebind write. See ADR-074.
   */
  const appliedRevisions = new WeakMap<object, Map<string, number>>();
  const writeTarget = write ?? createTransformWriter(transformState);
  return {
    apply(patch) {
      if (patch.status !== "ready") return;
      const target = resolveTarget(patch.nodeId);
      if (target === undefined) return;
      const revisions = appliedRevisions.get(target) ?? new Map<string, number>();
      const accepted = revisions.get(patch.nodeId);
      // Refused before the diff, and recorded even when the diff turns out empty. `lastApplied` is
      // what the next frame's dirty set is measured against, so an older patch does not cost one
      // stale frame: it leaves every later diff wrong about what the element holds. An accepted
      // patch that wrote nothing is still the newest one seen, and calling it unseen would let the
      // patch before it through.
      if (accepted !== undefined && patch.revision <= accepted) return;
      revisions.set(patch.nodeId, patch.revision);
      appliedRevisions.set(target, revisions);
      const next = renderableValues(patch.values, metadata);
      const previous = lastApplied.get(target) ?? {};
      const dirty: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(next))
        if (!Object.is(previous[key], value)) dirty[key] = value;
      for (const key of Object.keys(previous)) if (!(key in next)) dirty[key] = undefined;
      if (Object.keys(dirty).length === 0) return;
      writeTarget(target, dirty);
      lastApplied.set(target, next);
    },
    clear(target) {
      if (target === undefined) return;
      lastApplied.delete(target);
      transformState.delete(target);
      appliedRevisions.delete(target);
    },
  };
}
