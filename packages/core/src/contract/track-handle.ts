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

/** The one failure a stale `TrackHandle` reports from every member: names the id it refused. */
export class StaleTrackHandleError extends StaleHandleError {
  /** Stable identity in the kebab shape every diagnostic rule id uses. */
  static readonly ruleId = "stale-track-handle";
  readonly ruleId = StaleTrackHandleError.ruleId;
  /** Qualified graph node id the refused handle was captured against. */
  readonly nodeId: string;
  constructor(nodeId: string) {
    super("Track", nodeId);
    this.name = "StaleTrackHandleError";
    this.nodeId = nodeId;
  }
}

/** One authored requirement binding, projected from `input.requires`, as a handle reports it. */
export interface RequireView {
  readonly slot: string;
  readonly source: string;
  /** Key this binding was authored under in a map-valued slot; absent for a scalar slot. */
  readonly memberKey?: string;
}

/** Values a mask may carry: one authored static value per key, never animated stops. */
export type LiveValues = Readonly<Record<string, AuthoredStaticValue>>;

/**
 * A capability handle for one graph node, live while its captured token is current.
 * `live` never throws; every other member refuses once stale. */
export interface TrackHandle extends Handle<TrackDefinition> {
  /**
   * The track's authored input, a frozen view over this same handle and token.
   * Reading it allocates nothing; its verbs refuse once stale exactly as this handle's do. */
  readonly input: TrackInputHandle;
  /**
   * Every requirement binding this track authored, ordered by slot, then member key.
   * A read: binding a slot belongs to `input.requires`. Always a list, empty when none. */
  readonly requires: readonly RequireView[];
  remove(): void;
  replace(next: TrackDefinition): void;
  /**
   * Replaces the node's evaluated local value until `releaseValues` or a structural edit.
   * Must match the committed contract, else `live-values-invalid` and the prior overlay stands. */
  writeValues(value: Value): PatchBatch;
  /**
   * Drops the live overlay and resumes authored evaluation at the current progress.
   * No overlay: no-op, empty batch, no publication. A clean release clears an `"error"` node. */
  releaseValues(): PatchBatch;
}

/**
 * The authored input of one track, reached through `TrackHandle.input`.
 * Every verb plans one `Edit`; `replace` swaps the whole input rather than merging. */
export interface TrackInputHandle {
  /** Replaces the whole `input` member, or removes it when called with no argument. */
  replace(input?: TrackInput): void;
  /** The dependency bindings this track authors, as an edit view rather than a record. */
  readonly requires: TrackRequiresHandle;
  /** The authored values this track evaluates, as an edit view rather than a record. */
  readonly values: TrackValuesHandle;
}

/**
 * The authored values half of one track's input: `set` swaps whole, `setField` writes one cell.
 * Both validate against the committed contract and cause one publication; no shape moves. */
export interface TrackValuesHandle {
  /** Replaces `input.values` whole; any row count allowed within the committed contract. */
  set(values: InputValues): PatchBatch;
  /**
   * Writes one authored cell or field; `address.row` selects a table cell, absent for a record.
   * Form mismatch: `values-shape-invalid`; unknown address: `cell-address-unknown`. */
  setField(address: CellAddress, cell: AuthoredCell): PatchBatch;
}

/**
 * The bindings half of one track's input: `set` redirects a slot to a source, `remove` drops it.
 * `memberKey` picks one map entry, else the slot itself; both verbs are structural edges. */
export interface TrackRequiresHandle {
  set(slot: string, source: string, memberKey?: string): void;
  remove(slot: string, memberKey?: string): void;
}
