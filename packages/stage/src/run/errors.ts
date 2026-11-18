import { unreachable } from "@gerak/core";

/** Everything `compileStage`, `check` and stroke resolution can refuse. */
export type StageError =
  | { readonly kind: "invalid"; readonly field: string; readonly reason: string }
  | { readonly kind: "duplicate_member"; readonly name: string }
  | { readonly kind: "reserved_dot"; readonly name: string }
  | { readonly kind: "unknown_beat"; readonly member: string; readonly beat: string }
  | {
      readonly kind: "reversed_stretch";
      readonly member: string;
      readonly from: string;
      readonly to: string;
    }
  | { readonly kind: "morph_mismatch"; readonly member: string; readonly reason: string }
  | { readonly kind: "shape_mismatch"; readonly member: string; readonly reason: string }
  | { readonly kind: "unknown_target"; readonly name: string }
  | {
      readonly kind: "stroke_loop";
      readonly loop: readonly string[];
      readonly behind: readonly string[];
    };

/** Names as `"a", "b" and "c"`. */
export function listed(names: readonly string[]): string {
  const quoted = names.map((name) => `"${name}"`);
  const last = quoted.pop() ?? "";
  return quoted.length === 0 ? last : `${quoted.join(", ")} and ${last}`;
}

/** One line saying what is wrong and where. */
export function formatStageError(error: StageError): string {
  switch (error.kind) {
    case "invalid":
      return `${error.field}: ${error.reason}`;
    case "duplicate_member":
      return `cast: "${error.name}" is named twice; every member name is unique, group children included.`;
    case "reserved_dot":
      return `cast: "${error.name}" holds ".", which names list items.`;
    case "unknown_beat":
      return `cast: "${error.member}" shows on "${error.beat}", which is not a beat.`;
    case "reversed_stretch":
      return `cast: "${error.member}" shows from "${error.from}" to "${error.to}", which ends before it starts.`;
    case "morph_mismatch":
      return `cast: "${error.member}" cannot morph: ${error.reason}`;
    case "shape_mismatch":
      return `scene: "${error.member}" ${error.reason}`;
    case "unknown_target":
      return `scene: "${error.name}" is not in the cast.`;
    case "stroke_loop": {
      const one = error.behind.length === 1;
      const behind =
        error.behind.length === 0
          ? ""
          : `; ${listed(error.behind)} ${one ? "reads" : "read"} them and ${one ? "is" : "are"} not drawn either`;
      return `paths ${listed(error.loop)} read each other${behind}.`;
    }
    default:
      return unreachable(error);
  }
}
