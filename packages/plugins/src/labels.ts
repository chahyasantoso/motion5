import type { LivePatch, Patch, ProjectHandle } from "@motion5/core";
import {
  isImmutableLeaf,
  patchRender,
  unreachable,
  type ImmutableLeaf,
} from "@motion5/core/plugin-api";

/** A published label is exactly a renderer-neutral leaf; core owns the leaf rule (ADR-137). */
export type Label = ImmutableLeaf;

/** The one reader of a label leaf from published values. */
export function readLabel(
  values: Readonly<Record<string, unknown>>,
  key: string,
): Label | undefined {
  const value = values[key];
  return isImmutableLeaf(value) ? value : undefined;
}

type LabelRead =
  | { readonly kind: "label"; readonly label: Label | undefined }
  | { readonly kind: "retained" }
  | { readonly kind: "gone" };

// `patchRender` is the one owner of what a patch status means to a consumer (ADR-094).
function labelOf(patch: Patch | LivePatch | undefined, key: string): LabelRead {
  const decision = patchRender(patch);
  switch (decision.kind) {
    case "render":
      return { kind: "label", label: readLabel(decision.patch.values, key) };
    case "retain":
      return { kind: "retained" };
    case "gone":
      return { kind: "gone" };
    default:
      return unreachable(decision);
  }
}

/**
 * Calls `listener` when the label under `key` changes by `!==`; no initial call. Blocked and error
 * patches retain the last label and fire nothing. A `destroyed` patch (sent only on eviction: a
 * graph delete or a replace that removes the node) fires once with `undefined` when a label was
 * present, then unsubscribes. Detach and unmount send nothing. The disposer is idempotent. Events
 * are edges over published state (D11).
 *
 * Listeners run inside publication. They must not synchronously write through `project.edit` or
 * `track(...).setValues`; those writes are refused as `schema-commit-reentrant`.
 */
export function onLabelChange(
  project: Pick<ProjectHandle, "get" | "subscribeNode">,
  nodeId: string,
  key: string,
  listener: (next: Label | undefined, previous: Label | undefined) => void,
): () => void {
  const initial = labelOf(project.get(nodeId), key);
  let previous = initial.kind === "label" ? initial.label : undefined;
  let active = true;
  let release: (() => void) | undefined;
  const unsubscribe = (): void => {
    if (!active) return;
    active = false;
    release?.();
  };
  const deliver = (next: Label | undefined): void => {
    if (next === previous) return;
    const prior = previous;
    previous = next;
    listener(next, prior);
  };
  release = project.subscribeNode(nodeId, (patch) => {
    if (!active) return;
    const read = labelOf(patch, key);
    switch (read.kind) {
      case "label":
        return deliver(read.label);
      case "retained":
        return;
      case "gone":
        unsubscribe();
        return deliver(undefined);
      default:
        return unreachable(read);
    }
  });
  if (!active) release();
  return unsubscribe;
}
