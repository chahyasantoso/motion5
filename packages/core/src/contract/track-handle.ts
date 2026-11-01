import { StaleHandleError, type Handle } from "./handle";
import type {
  AuthoredCell,
  AuthoredStaticValue,
  AuthoredValues as InputValues,
  CellAddress,
  PatchBatch,
  TrackDefinition,
  TrackInput,
  Value,
} from "./v5";

/** Sole failure every stale `TrackHandle` member reports: names refused id. */
export class StaleTrackHandleError extends StaleHandleError {
  /** Stable identity; kebab shape shared by diagnostic rule ids. */
  static readonly ruleId = "stale-track-handle";
  readonly ruleId = StaleTrackHandleError.ruleId;
  /** Qualified graph node id refused handle captured against. */
  readonly nodeId: string;
  constructor(nodeId: string) {
    super("Track", nodeId);
    this.name = "StaleTrackHandleError";
    this.nodeId = nodeId;
  }
}

/** One authored requirement binding from `input.requires`, as handle reports it. */
export interface RequireView {
  readonly slot: string;
  readonly source: string;
  /** Key binding authored under in map-valued slot; absent for scalar slot. */
  readonly memberKey?: string;
}

/** Mask values: one authored static value per key, never animated stops. */
export type LiveValues = Readonly<Record<string, AuthoredStaticValue>>;

/** Capability handle for one graph node, live while captured token current. `live` never throws; all other members refuse once stale. */
export interface TrackHandle extends Handle<TrackDefinition> {
  /** Track's authored input: frozen view over same handle, same token. Read allocates nothing; verbs refuse once stale as this handle does. */
  readonly input: TrackInputHandle;
  /** Every requirement binding this track authored, ordered by slot then member key. Read-only; binding a slot belongs to `input.requires`. List, empty when none. */
  readonly requires: readonly RequireView[];
  remove(): void;
  replace(next: TrackDefinition): void;
  /** Replaces node's evaluated local value until `releaseValues` or structural edit. Must match committed contract, else `live-values-invalid` and prior overlay stands. */
  writeValues(value: Value): PatchBatch;
  /** Drops live overlay, resumes authored evaluation at current progress. No overlay: no-op, empty batch, no publication. Clean release clears an `"error"` node. */
  releaseValues(): PatchBatch;
}

/** Authored input of one track, reached through `TrackHandle.input`. Every verb plans one `Edit`; `replace` swaps whole input, never merges. */
export interface TrackInputHandle {
  /** Replaces whole `input` member; removes it when called with no argument. */
  replace(input?: TrackInput): void;
  /** Dependency bindings this track authors, as edit view not record. */
  readonly requires: TrackRequiresHandle;
  /** Authored values this track evaluates, as edit view not record. */
  readonly values: TrackValuesHandle;
}

/** Authored values half of one track's input: `set` swaps whole, `setField` writes one cell. Both validate against committed contract, cause one publication; no shape moves. */
export interface TrackValuesHandle {
  /** Replaces `input.values` whole; any row count within committed contract. */
  set(values: InputValues): PatchBatch;
  /** Writes one authored cell or field; `address.row` selects table cell, absent for record. Form mismatch: `values-shape-invalid`; unknown address: `cell-address-unknown`. */
  setField(address: CellAddress, cell: AuthoredCell): PatchBatch;
}

/** Bindings half of one track's input: `set` redirects slot to source, `remove` drops it. `memberKey` picks map entry else slot itself; both are structural edges. */
export interface TrackRequiresHandle {
  set(slot: string, source: string, memberKey?: string): void;
  remove(slot: string, memberKey?: string): void;
}
