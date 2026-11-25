import type { Limits } from "./stage";

/** Where one compiled window of a step comes from: a beat by its compiled name, fixed ms, or another window. */
export type StepWindow =
  | { readonly kind: "beat"; readonly beat: string }
  | { readonly kind: "ms"; readonly from: number; readonly to: number }
  | { readonly kind: "window" };

/** Where a `.shows(...)` window comes from: beats by compiled name, or a scroll range. */
export type ShowSummary =
  | { readonly kind: "beats"; readonly from: string; readonly to: string }
  | { readonly kind: "from"; readonly from: string }
  | { readonly kind: "until"; readonly until: string }
  | { readonly kind: "scroll" };

/** One call on a member's binding, as data for tools; `frame` never reads it. */
export type StepSummary =
  | {
      readonly kind: "motion";
      readonly label?: string | undefined;
      readonly window?: StepWindow | undefined;
      readonly joins: "layer" | "take";
      readonly loops: boolean;
      /** Members the motion reads through `stayWith`. */
      readonly reads: readonly string[];
    }
  | {
      readonly kind: "travel";
      readonly target: string;
      readonly fit: "contain" | "fill" | "none";
      readonly window?: StepWindow | undefined;
    }
  | { readonly kind: "modifies" }
  | { readonly kind: "shows"; readonly windows: readonly ShowSummary[] }
  | { readonly kind: "limits"; readonly limits: Limits };

/** Where a member comes from: the shot or named scene that binds it, and its binding's calls in order. */
export interface Provenance {
  readonly scene?: string | undefined;
  readonly steps: readonly StepSummary[];
}

/** Where a scene's members and beats come from, read from the scene as written; data for tools only. */
export interface ScenePlan {
  /** The scene's own `name`, when it has one. */
  readonly name?: string | undefined;
  readonly members: Readonly<Record<string, Provenance>>;
  /** The shot or named scene each beat was first used in, by compiled name. */
  readonly beats: Readonly<Record<string, string>>;
}
