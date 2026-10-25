import type {
  AuthoredCell,
  AuthoredValues,
  CellAddress,
  TrackDefinition,
  TrackInput,
  Value,
} from "../contract/v5";
import { unreachable } from "../lang/exhaustive";

/**
 * Every edit the public edit surface can build, as serializable data.
 *
 * An edit names its target node and nothing else that is not authored data, so a caller can clone
 * one, log one, or write one to a fixture and replay it. Structural edits carry whole definitions or
 * one binding, cheap edits carry authored values or one addressed cell, and live edits carry one
 * whole evaluated value or the instruction to drop it.
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

interface SetValuesShape {
  readonly kind: "set-values";
  readonly nodeId: string;
  readonly values: AuthoredValues;
}

interface SetFieldShape {
  readonly kind: "set-field";
  readonly nodeId: string;
  readonly address: CellAddress;
  readonly cell: AuthoredCell;
}

/** The two authored edits that move values without a rebuild and without re-inferring a contract. */
export type CheapEdit = SetValuesShape | SetFieldShape;

interface WriteLiveShape {
  readonly kind: "write-live";
  readonly nodeId: string;
  readonly value: Value;
}

interface ReleaseLiveShape {
  readonly kind: "release-live";
  readonly nodeId: string;
}

/** The two live edits: a whole evaluated value stands over the authored one, or is dropped. */
export type LiveEdit = WriteLiveShape | ReleaseLiveShape;

/** Every edit the runtime applies through one plan. */
export type Edit = StructuralEdit | CheapEdit | LiveEdit;

/** Which path one edit takes through a commit. */
export type EditTier = "structural" | "cheap";

/**
 * Whether one edit is structural. The one total decision over the union, so a new kind owes an
 * answer here; `isValueEdit`, `tierOf` and the batch classifier all read it.
 */
export function isStructuralEdit(edit: Edit): edit is StructuralEdit {
  switch (edit.kind) {
    case "replace-track":
    case "replace-input":
    case "remove-track":
    case "bind":
    case "unbind":
      return true;
    case "set-values":
    case "set-field":
    case "write-live":
    case "release-live":
      return false;
    default:
      return unreachable(edit);
  }
}

/** Whether one edit is a cheap or live value edit: exactly the edits that are not structural. */
export function isValueEdit(edit: Edit): edit is CheapEdit | LiveEdit {
  return !isStructuralEdit(edit);
}

/** The tier one edit belongs to. */
export function tierOf(edit: Edit): EditTier {
  return isStructuralEdit(edit) ? "structural" : "cheap";
}

/**
 * Whether one edit drops a live overlay.
 *
 * A replacement or a removal compiles a fresh Track, and the live writer has no inverse, so the
 * overlay cannot survive either. A binding edit rebuilds the graph but not the timeline, which is
 * what keeps the overlay standing across it, and an authored edit moves only the values beneath an
 * overlay that remains in force. `release-live` drops one too, but by its own explicit verb rather
 * than as a side effect of a structural change, so it answers false here.
 */
export function clearsOverlay(edit: Edit): boolean {
  switch (edit.kind) {
    case "replace-track":
    case "replace-input":
    case "remove-track":
      return true;
    case "bind":
    case "unbind":
    case "set-values":
    case "set-field":
    case "write-live":
    case "release-live":
      return false;
    default:
      return unreachable(edit);
  }
}

/** The public API verb corresponding to a cheap or live value edit kind. */
export function publicVerbOf(kind: CheapEdit["kind"] | LiveEdit["kind"]): string {
  switch (kind) {
    case "set-values":
      return "input.values.set";
    case "set-field":
      return "input.values.setField";
    case "write-live":
      return "writeValues";
    case "release-live":
      return "releaseValues";
    default:
      return unreachable(kind);
  }
}
