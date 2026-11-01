import type {
  AuthoredCell,
  AuthoredValues,
  CellAddress,
  TrackDefinition,
  TrackInput,
  Value,
} from "../contract/v5";
import { unreachable } from "../lang/exhaustive";

/** Serializable edit data: one target node plus its payload; clone, log, replay. */
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

/** The five edits that rebuild the graph; may move the committed contract. */
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

/** The two authored edits: move values without a rebuild or a contract re-inference. */
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

/** The two live edits: an evaluated value stands over the authored one, or is dropped. */
export type LiveEdit = WriteLiveShape | ReleaseLiveShape;

/** Every edit the runtime applies through one plan. */
export type Edit = StructuralEdit | CheapEdit | LiveEdit;

/** Which path one edit takes through a commit. */
export type EditTier = "structural" | "cheap";

/** Whether one edit is structural: the one total decision over the union, so a new kind owes an answer; `isValueEdit`, `tierOf` and the batch classifier read it. */
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

/** Whether one edit is a cheap or live edit: exactly the non-structural kinds. */
export function isValueEdit(edit: Edit): edit is CheapEdit | LiveEdit {
  return !isStructuralEdit(edit);
}

/** The tier one edit belongs to. */
export function tierOf(edit: Edit): EditTier {
  return isStructuralEdit(edit) ? "structural" : "cheap";
}

/** Whether one edit clears the live overlay as a side effect: replace/remove compile a fresh Track; bind/unbind leave the timeline standing. */
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

/** Public API verb for one cheap or live edit. */
export type PublicValueVerb =
  | "input.values.set"
  | "input.values.setField"
  | "writeValues"
  | "releaseValues";

const PUBLIC_VERB: Readonly<Record<(CheapEdit | LiveEdit)["kind"], PublicValueVerb>> = {
  "set-values": "input.values.set",
  "set-field": "input.values.setField",
  "write-live": "writeValues",
  "release-live": "releaseValues",
};

/** Public API verb for a cheap or live edit kind. */
export function publicVerbOf(kind: (CheapEdit | LiveEdit)["kind"]): PublicValueVerb {
  return PUBLIC_VERB[kind];
}
