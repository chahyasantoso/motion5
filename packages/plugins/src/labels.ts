import type { LivePatch, Patch, ProjectHandle } from "@motion5/core";
import { patchRender, unreachable } from "@motion5/core/plugin-api";

export type Label = string | number | boolean;
const RETAINED = Symbol("label-retained");
type LabelState = Label | typeof RETAINED | undefined;

export function readLabel(
  values: Readonly<Record<string, unknown>>,
  key: string,
): Label | undefined {
  const value = values[key];
  return typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
    ? value
    : undefined;
}

function labelOf(patch: Patch | LivePatch | undefined, key: string): LabelState {
  const decision = patchRender(patch);
  switch (decision.kind) {
    case "render":
      return readLabel(decision.patch.values, key);
    case "retain":
      return RETAINED;
    case "gone":
      return undefined;
    default:
      return unreachable(decision);
  }
}

/**
 * Listeners run inside publication. They must not synchronously write through `project.edit` or
 * `track(...).setValues`; structural writes are refused as `schema-commit-reentrant`.
 * No initial callback is sent. A destroyed patch sends one undefined edge and unsubscribes.
 */
export function onLabelChange(
  project: Pick<ProjectHandle, "get" | "subscribeNode">,
  nodeId: string,
  key: string,
  listener: (next: Label | undefined, previous: Label | undefined) => void,
): () => void {
  let previous = labelOf(project.get(nodeId), key);
  let active = true;
  let release: (() => void) | undefined;
  const unsubscribe = () => {
    if (!active) return;
    active = false;
    release?.();
  };
  release = project.subscribeNode(nodeId, (patch) => {
    if (!active) return;
    const next = labelOf(patch, key);
    if (next === RETAINED) return;
    if (patch.status === "destroyed") unsubscribe();
    if (next === previous) return;
    const prior = previous === RETAINED ? undefined : previous;
    previous = next;
    listener(next, prior);
  });
  return unsubscribe;
}
