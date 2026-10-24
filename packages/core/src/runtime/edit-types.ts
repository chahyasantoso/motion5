import type { TrackDefinition, TrackInput } from "../contract/v5";
import { unreachable } from "../lang/exhaustive";

/**
 * Every edit the public edit surface can build, as serializable data.
 *
 * An edit names its target node and nothing else that is not authored data, so a caller can clone
 * one, log one, or write one to a fixture and replay it. Structural edits carry whole definitions or
 * one binding; the cheap tier added in the next slice carries authored cells and live values.
 *
 * `replace-input` omits `input` rather than holding `undefined` when the caller removes the input
 * wholly, so an edit survives a JSON round-trip as the same shape it was built with.
 */
interface ReplaceTrackShape {
  readonly kind: "replace-track";
  readonly nodeId: string;
  readonly track: TrackDefinition;
}

interface ReplaceInputShape {
  readonly kind: "replace-input";
  readonly nodeId: string;
  readonly input?: TrackInput;
}

interface RemoveTrackShape {
  readonly kind: "remove-track";
  readonly nodeId: string;
}

interface BindShape {
  readonly kind: "bind";
  readonly nodeId: string;
  readonly slot: string;
  readonly source: string;
  readonly memberKey?: string;
}

interface UnbindShape {
  readonly kind: "unbind";
  readonly nodeId: string;
  readonly slot: string;
  readonly memberKey?: string;
}

/** The five edits that rebuild the graph and may move the committed contract. */
export type StructuralEdit =
  | ReplaceTrackShape
  | ReplaceInputShape
  | RemoveTrackShape
  | BindShape
  | UnbindShape;

/** Every edit the runtime applies through one plan, structural today and widened by the next slice. */
export type Edit = StructuralEdit;

/** Which path one edit takes through a commit. */
export type EditTier = "structural";

/** The tier one edit belongs to, total over the union so a new kind owes a decision here. */
export function tierOf(edit: Edit): EditTier {
  switch (edit.kind) {
    case "replace-track":
    case "replace-input":
    case "remove-track":
    case "bind":
    case "unbind":
      return "structural";
    default:
      return unreachable(edit);
  }
}

/**
 * Whether one edit drops a live overlay.
 *
 * A replacement or a removal compiles a fresh Track, and the live writer has no inverse, so the
 * overlay cannot survive either. A binding edit rebuilds the graph but not the timeline, which is
 * what keeps the overlay standing across it.
 */
export function clearsOverlay(edit: Edit): boolean {
  switch (edit.kind) {
    case "replace-track":
    case "replace-input":
    case "remove-track":
      return true;
    case "bind":
    case "unbind":
      return false;
    default:
      return unreachable(edit);
  }
}
