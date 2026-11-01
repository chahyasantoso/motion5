import { unreachable } from "../lang/exhaustive";
import type { Patch, ReadyPatch } from "./v5";

/** What a renderer may do with one patch: `render` carries the ready patch, `retain` keeps the last render, `gone` means destroyed or absent. */
export type PatchRender =
  | { readonly kind: "render"; readonly patch: ReadyPatch }
  | { readonly kind: "retain" }
  | { readonly kind: "gone" };

const RETAIN: PatchRender = Object.freeze({ kind: "retain" });
const GONE: PatchRender = Object.freeze({ kind: "gone" });

/** Decides a patch's render outcome; `undefined` is a destroyed node, and a status added to `Patch` fails here until given a case. */
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
