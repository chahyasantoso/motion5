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

interface SetParamShape {
  readonly kind: "set-param";
  readonly nodeId: string;
  readonly param: AuthoredValues;
}

interface SetParamFieldShape {
  readonly kind: "set-param-field";
  readonly nodeId: string;
  readonly address: CellAddress;
  readonly cell: AuthoredCell;
}

/** The four authored edits: move local values or params without a rebuild. */
export type CheapEdit = SetValuesShape | SetFieldShape | SetParamShape | SetParamFieldShape;

interface WriteLiveShape {
  readonly kind: "write-live";
  readonly nodeId: string;
  readonly value: Value;
}

interface WriteParamLiveShape {
  readonly kind: "write-live-param";
  readonly nodeId: string;
  readonly value: Value;
}

interface ReleaseLiveShape {
  readonly kind: "release-live";
  readonly nodeId: string;
}

interface ReleaseParamLiveShape {
  readonly kind: "release-live-param";
  readonly nodeId: string;
}

/** The four live edits: an evaluated channel stands over the authored one, or is dropped. */
export type LiveEdit =
  | WriteLiveShape
  | WriteParamLiveShape
  | ReleaseLiveShape
  | ReleaseParamLiveShape;

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
    case "set-param":
    case "set-param-field":
    case "write-live":
    case "write-live-param":
    case "release-live":
    case "release-live-param":
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

/** Whether one edit clears the live overlays as a side effect: replace/remove compile a fresh Track; bind/unbind leave the timeline standing. */
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
    case "set-param":
    case "set-param-field":
    case "write-live":
    case "write-live-param":
    case "release-live":
    case "release-live-param":
      return false;
    default:
      return unreachable(edit);
  }
}

/** Public API verb for one cheap or live edit. */
export type PublicValueVerb =
  | "input.values.set"
  | "input.values.setField"
  | "input.param.set"
  | "input.param.setField"
  | "writeValues"
  | "writeParam"
  | "releaseValues"
  | "releaseParam";

const PUBLIC_VERB: Readonly<Record<(CheapEdit | LiveEdit)["kind"], PublicValueVerb>> = {
  "set-values": "input.values.set",
  "set-field": "input.values.setField",
  "set-param": "input.param.set",
  "set-param-field": "input.param.setField",
  "write-live": "writeValues",
  "write-live-param": "writeParam",
  "release-live": "releaseValues",
  "release-live-param": "releaseParam",
};

/** Public API verb for a cheap or live edit kind. */
export function publicVerbOf(kind: (CheapEdit | LiveEdit)["kind"]): PublicValueVerb {
  return PUBLIC_VERB[kind];
}
