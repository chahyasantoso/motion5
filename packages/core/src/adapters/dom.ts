import type { Patch } from "../runtime/patch-registry";
import type { RenderMetadata } from "../domain/plugins";

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
   * Writes values a caller derived, onto the target the resolver names for `nodeId`.
   *
   * The same renderable filtering, transform composition, dirty diff and omitted-key removal as
   * `apply`, without the patch protocol above it: a derivation is not a published node, so it
   * carries no status to gate and no revision to compare, and a caller that fabricated those to
   * reach `apply` would be authoring registry bookkeeping it has no business owning. Freshness
   * belongs to whoever built the record. See ADR-075.
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
 * Pins the reference box and the pivot before a composed transform reaches an SVG element.
 *
 * The consumers this adapter writes for migrated off the SVG `transform` attribute, whose `rotate`
 * and `scale` pivot at the element's own coordinate origin. CSS resolves a transform against a
 * reference box instead, so its defaults pivot at the centre of the view box, and ADR-073's
 * `fill-box` pin moved that to the centre of the element's bounding box: right only for content
 * that happens to be symmetric about its origin, and wrong for the label beside a joint or the
 * visor beside a skull. Pinning the view box with a zero origin restores the attribute's pivot for
 * a target whose ancestors are untransformed, which is every shipped consumer; under a transformed
 * ancestor the reference box is the viewport as this element's user space sees it, and that
 * boundary is stated in ADR-075 rather than papered over. Translation is origin-independent, so no
 * shipped translation moves for it. Structural detection, because this adapter types a target by
 * what it can be written to and never by `instanceof`, and idempotent, so a bound element pays two
 * writes once instead of two per frame. See ADR-075.
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
/**
 * Which of a target's three channels owns a key, decided by the target rather than by a list.
 *
 * A CSS property is a style write, as it always was. What was left used to be a property assignment
 * unconditionally, and on a real element that is how SVG geometry failed: `x1`, `y1`, `points` and
 * their neighbours are readonly IDL attributes, so `target.x1 = 4` throws in a module and reaches
 * nothing when it does not. A key naming no writable property on a target that answers
 * `setAttribute` is therefore an attribute, and a plain object with neither keeps the property
 * write every fake target in the suite relies on. The order is load-bearing: a key that is both a
 * CSS property and an SVG geometry attribute, such as `cx` or `r`, stays a style write, where a
 * unitless number is invalid CSS, so a derived position is `x`/`y` and this adapter composes it.
 * See ADR-075.
 */
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
      writeKey(target, key, value);
    }
    if (Object.keys(state).length > 0) {
      pinTransformReference(target);
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
  // One renderable set, one dirty cache, one write, for both entries. `apply` owns the patch
  // protocol above this and `applyValues` owns nothing extra below it, so a derived record and a
  // published one cannot drift into two filters or two diffs.
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
      writeValues(target, patch.values);
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
