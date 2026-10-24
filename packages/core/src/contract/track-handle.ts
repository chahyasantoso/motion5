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

/**
 * The one failure a stale `TrackHandle` reports, from every member it has.
 *
 * The parent is the abstract `StaleHandleError`, which owns the sentence and the `TypeError`
 * relationship this class used to declare itself. Both arguments for that parent are unchanged and
 * are recorded there; what stays here is the noun, the rule id, and the id this handle refused.
 *
 * `nodeId` rather than the base's `id`, and that is not two names for one fact: a qualified graph
 * node id and a motion id are different things, each named by the refusal that carries it, while
 * `Handle.id` is the generic read a caller uses when it does not care which kind it holds.
 */
export class StaleTrackHandleError extends StaleHandleError {
  /** Stable identity, in the kebab shape every diagnostic rule id in this project uses. */
  static readonly ruleId = "stale-track-handle";
  readonly ruleId = StaleTrackHandleError.ruleId;
  /** The qualified node id the refused handle was captured against. */
  readonly nodeId: string;
  constructor(nodeId: string) {
    super("Track", nodeId);
    this.name = "StaleTrackHandleError";
    this.nodeId = nodeId;
  }
}

/**
 * One requirement binding a track authored, as a handle reports it.
 *
 * Projected from `input.requires`, which is the one authored binding record on an identified-table
 * track, so nothing derives a second opinion about what an author wrote or about the order two
 * bindings come in. The slot belongs to the track's one plugin now, so a `plugin` field here would
 * name the same fact twice and is deliberately absent. `memberKey` travels with it because a
 * map-valued slot binds one source per key, and a view that dropped it would report two entries of
 * one slot as one indistinguishable pair. See ADR-057 and ADR-062.
 *
 * The authored diagnostics path is deliberately absent. It exists so a refusal can cite the path the
 * author actually wrote, and that belongs to the layer doing the refusing; carried here it would be
 * a second owner of where something was written.
 */
export interface RequireView {
  readonly slot: string;
  readonly source: string;
  /** The key this binding was authored under inside a map-valued slot, absent for a scalar one. */
  readonly memberKey?: string;
}

/**
 * The values a mask may carry: one authored static value per key.
 *
 * Closed to `AuthoredStaticValue` rather than open to any renderer-neutral value, and it stays
 * closed. A mask is rebuilt from the retained definition on every write and shadows the timeline at
 * every progress, so a stop list here would be a permanently frozen animation rather than a live
 * one. That refusal is now a type rather than a check: this is the type of `Track`'s mask and of the
 * static half of a live write, and nothing that reaches it can carry stops.
 *
 * Declared beside the handle that takes it rather than in three places. `Track` and `ProjectRuntime`
 * name this type instead of respelling the record, for the same reason `TrackHandle` itself is
 * declared once here. See ADR-059 and ADR-060.
 */
export type LiveValues = Readonly<Record<string, AuthoredStaticValue>>;

/**
 * A capability handle for one graph node, valid while the token it captured is current.
 *
 * Declared once, here, and named by both `ProjectRuntime` and `engine.ts` rather than declared in
 * each. Two structurally identical interfaces drift the first time one of them gains a member,
 * which is exactly what happened to the two private `readNumber` copies that
 * `packages/plugins/src/frame.ts` was created to close.
 *
 * `id`, `live` and `definition` come from `Handle`, which owns the contract every member below reads:
 * `live` never throws and everything else refuses once stale. `definition` is what this interface
 * used to spell `track`; there is no alias, which is the one break in that change.
 */
export interface TrackHandle extends Handle<TrackDefinition> {
  /**
   * The track's authored input, as a frozen view over this same handle and token.
   *
   * A view rather than a record: reading it allocates nothing that can go stale on its own, and
   * every verb it exposes resolves the token this handle captured. The view itself never refuses;
   * its verbs refuse exactly as the track handle's own structural verbs do.
   */
  readonly input: TrackInputHandle;
  /**
   * Every requirement binding this track authored, ordered by slot and then member key.
   *
   * A read, not an edit. Binding a slot is a structural change and belongs to
   * `input.requires`; this is what an editor or a devtool asks before it decides to make one. Total:
   * a track that binds nothing answers with an empty list rather than with nothing, so a caller never
   * spells `?? []` and never makes the shape depend on the input.
   */
  readonly requires: readonly RequireView[];
  remove(): void;
  replace(next: TrackDefinition): void;
  /**
   * Writes this node's whole evaluated local value until `releaseValues` or a structural edit.
   *
   * The value is a table or a record and must satisfy the contract the track committed to: scalar
   * kinds, required fields, no extras, unique row ids and finite values. A shape that does not match
   * is `live-values-invalid`, and the previous overlay stands when a write is refused. The authored
   * definition never moves, so a write never renames a row or changes an authored field. The overlay
   * survives authored value edits, binding edits and seeks, and is cleared only by a structural
   * replacement or removal, `releaseValues`, and destroy.
   *
   * Returns the `PatchBatch` of the one publication it causes, and is allowed on a node whose status
   * is `"error"`: a valid write recomposes the node and clears the error on the next flush.
   */
  writeValues(value: Value): PatchBatch;
  /**
   * Drops the live overlay and resumes authored evaluation at the current progress.
   *
   * With no overlay standing this is a no-op answered with the empty batch and no publication. It is
   * allowed on an errored node, and a release that composes cleanly clears the error on the next
   * flush.
   */
  releaseValues(): PatchBatch;
}

/**
 * The authored input of one track, reached through `TrackHandle.input`.
 *
 * Frozen and stateless: it carries the same host, node id and token the track handle captured, and
 * every verb builds one `Edit` and lets the runtime plan it. `replace` takes the whole input rather
 * than merging, because a caller that wants to move one slot uses `requires` and a caller that wants
 * to move one value uses the value tier.
 */
export interface TrackInputHandle {
  /** Replaces the whole `input` member, or removes it when called with no argument. */
  replace(input?: TrackInput): void;
  /** The dependency bindings this track authors, as an edit view rather than a record. */
  readonly requires: TrackRequiresHandle;
  /** The authored values this track evaluates, as an edit view rather than a record. */
  readonly values: TrackValuesHandle;
}

/**
 * The authored values half of one track's input.
 *
 * `set` writes the whole authored table or record with no merge, and `setField` writes one addressed
 * cell or field. Both validate against the contract the track committed to at its last structural
 * commit, never against an inference of the values being written, and both return the batch of the
 * one publication they cause. A cheap edit moves no graph shape, so it never stages a Track and
 * never re-infers.
 */
export interface TrackValuesHandle {
  /** Replaces `input.values` whole. Any row count is allowed within the committed contract. */
  set(values: InputValues): PatchBatch;
  /**
   * Writes one authored cell or field.
   *
   * `address.row` selects a table cell and must be absent for a record field. The address must name
   * an authored row and a declared field; a mismatch between the address form and the track's shape
   * is `values-shape-invalid`, and an address that does not exist is `cell-address-unknown`.
   */
  setField(address: CellAddress, cell: AuthoredCell): PatchBatch;
}

/**
 * The bindings half of one track's input.
 *
 * `set` redirects one slot to one source and `remove` drops it. `memberKey` addresses one entry of a
 * map-valued slot; omitting it addresses the slot itself. Both are structural: a binding is an edge,
 * and an edge is what the graph and every affected consumer are rebuilt from.
 */
export interface TrackRequiresHandle {
  set(slot: string, source: string, memberKey?: string): void;
  remove(slot: string, memberKey?: string): void;
}
