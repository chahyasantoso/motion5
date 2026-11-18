import { unreachable } from "@gerak/core";

/** Closed union of all compile-time and runtime stage validation errors. */
export type StageError =
  | { readonly kind: "duplicate_member"; readonly name: string }
  | { readonly kind: "reserved_dot_in_name"; readonly name: string }
  | { readonly kind: "empty_on_stretches"; readonly member: string }
  | { readonly kind: "unknown_beat"; readonly member: string; readonly beat: string }
  | {
      readonly kind: "reversed_stretch";
      readonly member: string;
      readonly from: string;
      readonly to: string;
    }
  | { readonly kind: "morph_mismatch"; readonly member: string; readonly reason: string }
  | {
      readonly kind: "stroke_loop";
      readonly loop: readonly string[];
      readonly behind: readonly string[];
    }
  | { readonly kind: "invalid_initial_layout"; readonly message: string }
  | { readonly kind: "empty_layouts" }
  | { readonly kind: "shape_mismatch"; readonly member: string; readonly reason: string }
  | { readonly kind: "invalid_definition"; readonly field: string; readonly reason: string };

/** Discriminated compilation outcome holding either a validated value or typed errors. */
export type CompileResult<S> =
  | { readonly ok: true; readonly stage: S }
  | { readonly ok: false; readonly errors: readonly StageError[] };

function formatListed(names: readonly string[]): string {
  const quoted = names.map((name) => `"${name}"`);
  const last = quoted.pop();
  return quoted.length === 0 ? (last ?? "") : `${quoted.join(", ")} and ${last ?? ""}`;
}

/** Formats any `StageError` into a concise human-readable diagnostic via exhaustive switch. */
export function formatStageError(error: StageError): string {
  switch (error.kind) {
    case "duplicate_member":
      return `cast: duplicate member name "${error.name}".`;
    case "reserved_dot_in_name":
      return `cast: member name "${error.name}" holds ".", which is reserved for list items.`;
    case "empty_on_stretches":
      return `cast: "${error.member}" has empty \`on\` stretches; omit \`on\` to always show it.`;
    case "unknown_beat":
      return `cast: "${error.member}" references unknown beat "${error.beat}".`;
    case "reversed_stretch":
      return `cast: "${error.member}" stretch ["${error.from}", "${error.to}"] ends before it starts.`;
    case "morph_mismatch":
      return `cast: "${error.member}" cannot morph: ${error.reason}`;
    case "stroke_loop": {
      const behind =
        error.behind.length === 0
          ? ""
          : `; ${formatListed(error.behind)} ${error.behind.length === 1 ? "reads" : "read"} them and ${error.behind.length === 1 ? "is" : "are"} not drawn either`;
      return `paths ${formatListed(error.loop)} read each other${behind}.`;
    }
    case "invalid_initial_layout":
      return `layouts: ${error.message}`;
    case "empty_layouts":
      return "layouts: `names` must list at least one layout.";
    case "shape_mismatch":
      return `scene: "${error.member}" shape mismatch: ${error.reason}`;
    case "invalid_definition":
      return `${error.field}: ${error.reason}`;
    default:
      return unreachable(error);
  }
}
