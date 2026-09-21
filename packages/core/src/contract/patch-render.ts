import { unreachable } from "../lang/exhaustive";
import type { Patch, ReadyPatch } from "./v5";

/**
 * The render decision for one patch, shared by every renderer-facing consumer.
 *
 * `render` is the only status that owns values, and it carries that ready patch so a consumer's
 * narrowing follows the decision into the values it is entitled to read. `retain` means a node
 * still exists but its current composition cannot be used, so a caller keeps its last render or
 * writes its not-derivable marker. `gone` means the node no longer exists.
 *
 * `retain` and `gone` are two members rather than one even though all four of today's consumers
 * treat them the same way, because they are two facts: a refused node will publish again and a
 * destroyed one will not. Collapsing them would make the first consumer that wants to unmount a
 * target re-derive the difference from the status it was handed, which is the partition this module
 * exists to own. It is in core rather than in `packages/react` because `adapters/dom.ts` is a core
 * consumer and cannot import from react, so a react-owned union would leave core with a private
 * copy of the policy. #460 settled the same question the same way for `liveOrAbsent`.
 */
export type PatchRender =
  | { readonly kind: "render"; readonly patch: ReadyPatch }
  | { readonly kind: "retain" }
  | { readonly kind: "gone" };

const RETAIN: PatchRender = Object.freeze({ kind: "retain" });
const GONE: PatchRender = Object.freeze({ kind: "gone" });

/**
 * Answers what a renderer may do with a patch, including the absence a destroyed node reads as.
 *
 * The union carries the ready patch on its `render` member, and that is the load-bearing half
 * rather than a convenience. A reader that tested a bare string would have thrown away the
 * discriminant narrowing its next four lines depend on, so every consumer would have gone back to
 * asking the status itself to reach `values`, which is the duplication this module exists to
 * remove. The decision and what the decision entitles a caller to read travel together. See
 * ADR-094.
 *
 * `undefined` is answered before the switch because it is the read side of a destroyed node: a
 * source whose `get` narrows to a live patch or absence has already dropped the terminal variant,
 * so a consumer holding `undefined` is holding the same fact `destroyed` states. Handling it here
 * is what keeps that equivalence in one place instead of in every hook that calls `get`.
 *
 * A status added to `Patch` fails at this switch until it is given an explicit render decision,
 * which is the whole point: before this, four consumers each absorbed a new status silently, in
 * whichever direction their negative check happened to fall.
 */
export function patchRender(patch: Patch | undefined): PatchRender {
  if (patch === undefined) return GONE;
  switch (patch.status) {
    case "ready":
      return { kind: "render", patch };
    case "blocked":
    case "error":
      return RETAIN;
    case "destroyed":
      return GONE;
    default:
      return unreachable(patch);
  }
}
