import type {
  AuthoredCell,
  AuthoredRecord,
  AuthoredRow,
  AuthoredValues,
  CellAddress,
  Diagnostic,
  GroupedTrackDefinition,
  SourceBinding,
  TrackDefinition,
  TrackInput,
  ValueSpec,
} from "../contract/v5";
import { diagnostic, hintDiagnostic, hintDiagnostics } from "../contract/diagnostics";
import { validateTrackDefinition } from "../contract/validate-v5";
import { deriveSourceContract } from "../contract/v5-infer";
import { parseTrackDefinition, type ParsedValues } from "../contract/v5-parse";
import type { CommittedContract } from "../graph/committed-contract";
import { withRequires } from "../graph/committed-contract";
import { collectTrack, finalizeGraph, type GraphNode } from "../graph/ir";
import { qualifyFreeTrack, qualifyMotionTrack } from "../graph/ids";
import { acceptedOutcome, refusedOutcomeFrom, type Outcome } from "../lang/outcome";
import { unreachable } from "../lang/exhaustive";
import type { PluginCapabilities } from "../ports/plugin-capabilities";
import { AUTHORED, type ValueState } from "./value-state";
import type { Edit } from "./edit-types";

/**
 * The pure half of the structural edit tier: one committed view, one edit, one answer.
 *
 * Nothing here reads a runtime, a clock, a scheduler, a timeline or a commit plan. It sees tracks as
 * data, asks the contract and graph layers the questions they already own, and answers either a new
 * view and the change that reaches it or the diagnostics that refused it. That boundary is what
 * makes a table of edit-by-state cases possible without an engine, and it is enforced by a test that
 * scans this file's imports.
 *
 * A structural edit is planned against the whole candidate graph rather than against the node it
 * names, because the questions the graph owns are global: a binding may complete a cycle, a plugin
 * change may make an unrelated consumer incompatible, and a removal may leave a source that no
 * longer exists. Planning one node in isolation would answer none of them.
 */
export interface PlannedTrack {
  readonly nodeId: string;
  readonly track: GroupedTrackDefinition;
  readonly owner: "motion" | "free";
  readonly ownerId: string;
  readonly authoredIndex: number;
  readonly valueState: ValueState;
  readonly contract: CommittedContract | undefined;
}

/** Every committed track one plan can see, keyed by node id. */
export interface PlanState {
  readonly tracks: ReadonlyMap<string, PlannedTrack>;
}

/** What a plan may ask about plugins, total and without an engine. */
export interface PlanEnvironment {
  readonly capabilities: PluginCapabilities;
  readonly isPluginRegistered?: (pluginId: string) => boolean;
}

interface UpdateTrackChange {
  readonly kind: "update-track";
  readonly track: PlannedTrack;
  readonly bindingOnly: boolean;
}

interface RemoveTrackChange {
  readonly kind: "remove-track";
  readonly nodeId: string;
}

/**
 * One authored value edit, with the parsed values the compiled Track will evaluate.
 *
 * The parsed form travels with the change so the runtime applies exactly what this plan validated
 * and the parser stays the only reader of an authored cell. The committed contract and value state
 * travel unchanged on `track`, which is the whole claim of the cheap tier.
 */
interface AuthoredValuesChange {
  readonly kind: "authored-values";
  readonly track: PlannedTrack;
  readonly values: ParsedValues;
}

/** What one edit changes, or nothing when it changed nothing. */
export type PlannedChange = UpdateTrackChange | RemoveTrackChange | AuthoredValuesChange;

export interface PlanAccepted {
  readonly state: PlanState;
  readonly change: PlannedChange | undefined;
}

export type PlanOutcome = Outcome<PlanAccepted, Diagnostic>;

type MutableInput = { -readonly [K in keyof TrackInput]: TrackInput[K] };
type MutableTrack = { -readonly [K in keyof GroupedTrackDefinition]: GroupedTrackDefinition[K] };

function refused(diagnostics: readonly Diagnostic[]): PlanOutcome {
  return refusedOutcomeFrom<PlanAccepted, Diagnostic>(diagnostics);
}

function accepted(state: PlanState, change: PlannedChange | undefined): PlanOutcome {
  return acceptedOutcome<PlanAccepted, Diagnostic>({ state, change }, Object.freeze([]));
}

function requiredTrack(state: PlanState, nodeId: string): PlannedTrack {
  const track = state.tracks.get(nodeId);
  if (track === undefined) throw new TypeError(`Unknown graph node "${nodeId}".`);
  return track;
}

function expectedNodeId(track: PlannedTrack, trackId: string): string {
  return track.owner === "free"
    ? qualifyFreeTrack(trackId).value
    : qualifyMotionTrack(track.ownerId, trackId).value;
}

function withInput(
  track: GroupedTrackDefinition,
  input: TrackInput | undefined,
): GroupedTrackDefinition {
  const next: MutableTrack = { ...track };
  if (input === undefined) delete next.input;
  else next.input = input;
  return next;
}

function withRequiresInput(
  track: GroupedTrackDefinition,
  requires: Readonly<Record<string, SourceBinding>>,
): GroupedTrackDefinition {
  const input: MutableInput = { ...track.input, requires };
  return { ...track, input };
}

/**
 * The plugin's declared input kind against the authored values, when a plugin track names one.
 *
 * The parser cannot own this: it holds no plugin registry, so it reads a track's local values as an
 * authored shape and leaves the question of which shape the plugin accepts to the layer that admits
 * it. The full value check belongs to composition; this one answer is enough to refuse an edit that
 * could never compose.
 */
function pluginShapeDiagnostics(
  track: TrackDefinition,
  nodeId: string,
  capabilities: PluginCapabilities,
): readonly Diagnostic[] {
  const plugin = track.plugin;
  if (plugin === undefined) return Object.freeze([]);
  const definition = capabilities.pluginDefinition?.(plugin);
  if (definition === undefined) return Object.freeze([]);
  const values = track.input?.values;
  if (values === undefined) return Object.freeze([]);
  const authored = Array.isArray(values) ? "table" : "record";
  if (authored === definition.inputs.values.kind) return Object.freeze([]);
  return Object.freeze([
    diagnostic(
      "values-shape-invalid",
      `${nodeId}.input.values`,
      `Plugin '${plugin}' declares ${definition.inputs.values.kind} input.`,
    ),
  ]);
}

function validateTrack(
  track: TrackDefinition,
  path: string,
  nodeId: string,
  environment: PlanEnvironment,
): Outcome<TrackDefinition, Diagnostic> {
  // A runtime with no admission predicate cannot judge a plugin id, and the graph it is editing
  // already admitted this one. The parser treats absence as "nothing is registered", so the
  // unjudged environment is expressed as a predicate that admits what is already loaded.
  const context = {
    isPluginRegistered: environment.isPluginRegistered ?? (() => true),
  };
  const validated = validateTrackDefinition(track, path, context);
  switch (validated.kind) {
    case "refused":
      return validated;
    case "accepted": {
      const shape = pluginShapeDiagnostics(validated.value, nodeId, environment.capabilities);
      if (shape.length > 0) return refusedOutcomeFrom([...validated.diagnostics, ...shape]);
      return validated;
    }
    default:
      return unreachable(validated);
  }
}

/**
 * The whole candidate graph over `tracks`, with each node's committed contract carried.
 *
 * An omitted carried contract is the one instruction that a node's contract is stale: a replacement
 * derives a fresh one, and every other node keeps what its last structural commit answered. The
 * graph then reads those contracts rather than the authored values a cheap edit may have moved.
 */
function finalize(
  tracks: ReadonlyMap<string, PlannedTrack>,
  environment: PlanEnvironment,
): Outcome<ReadonlyMap<string, PlannedTrack>, Diagnostic> {
  const carried = new Map<string, CommittedContract>();
  for (const [nodeId, entry] of tracks)
    if (entry.contract !== undefined) carried.set(nodeId, entry.contract);
  const nodes: GraphNode[] = [];
  const diagnostics: Diagnostic[] = [];
  for (const entry of tracks.values()) {
    const node = collectTrack(
      entry.track,
      entry.owner,
      entry.ownerId,
      entry.authoredIndex,
      diagnostics,
    );
    if (node !== undefined) nodes.push(node);
  }
  const built = finalizeGraph(nodes, diagnostics, environment.capabilities, carried);
  if (built.graph === undefined) return refusedOutcomeFrom(built.diagnostics);
  const next = new Map(tracks);
  for (const [nodeId, entry] of next) {
    const contract = built.graph.nodeById[nodeId]?.contract;
    if (contract !== undefined && contract !== entry.contract)
      next.set(nodeId, { ...entry, contract });
  }
  return acceptedOutcome(next, built.diagnostics);
}

function changeOf(
  state: ReadonlyMap<string, PlannedTrack>,
  nodeId: string,
  bindingOnly: boolean,
): PlannedChange {
  return { kind: "update-track", track: requiredTrack({ tracks: state }, nodeId), bindingOnly };
}

function planReplaceTrack(
  state: PlanState,
  edit: Extract<Edit, { kind: "replace-track" }>,
  environment: PlanEnvironment,
): PlanOutcome {
  const current = requiredTrack(state, edit.nodeId);
  if (expectedNodeId(current, edit.track.id) !== edit.nodeId)
    throw new TypeError(`Replacement must preserve node id "${edit.nodeId}".`);
  const validated = validateTrack(
    edit.track,
    `replaceTrack(${edit.nodeId})`,
    edit.nodeId,
    environment,
  );
  if (validated.kind === "refused") return refused(validated.diagnostics);
  const next = new Map(state.tracks);
  next.set(edit.nodeId, {
    ...current,
    track: validated.value,
    valueState: AUTHORED,
    contract: undefined,
  });
  const built = finalize(next, environment);
  if (built.kind === "refused") return built;
  return acceptedOutcome(
    {
      state: { tracks: built.value },
      change: changeOf(built.value, edit.nodeId, false),
    },
    built.diagnostics,
  );
}

function planReplaceInput(
  state: PlanState,
  edit: Extract<Edit, { kind: "replace-input" }>,
  environment: PlanEnvironment,
): PlanOutcome {
  const current = requiredTrack(state, edit.nodeId);
  if (current.track.input === edit.input) return accepted(state, undefined);
  const track = withInput(current.track, edit.input);
  const validated = validateTrack(track, `replaceInput(${edit.nodeId})`, edit.nodeId, environment);
  if (validated.kind === "refused") return refused(validated.diagnostics);
  const next = new Map(state.tracks);
  next.set(edit.nodeId, {
    ...current,
    track: validated.value,
    valueState: AUTHORED,
    contract: undefined,
  });
  const built = finalize(next, environment);
  if (built.kind === "refused") return built;
  return acceptedOutcome(
    {
      state: { tracks: built.value },
      change: changeOf(built.value, edit.nodeId, false),
    },
    built.diagnostics,
  );
}

function planRemoveTrack(
  state: PlanState,
  edit: Extract<Edit, { kind: "remove-track" }>,
  environment: PlanEnvironment,
): PlanOutcome {
  requiredTrack(state, edit.nodeId);
  const next = new Map(state.tracks);
  next.delete(edit.nodeId);
  const built = finalize(next, environment);
  if (built.kind === "refused") return built;
  return acceptedOutcome(
    { state: { tracks: built.value }, change: { kind: "remove-track", nodeId: edit.nodeId } },
    built.diagnostics,
  );
}

function boundSource(
  track: GroupedTrackDefinition,
  slot: string,
  source: string,
  memberKey: string | undefined,
): GroupedTrackDefinition | undefined {
  const requires = track.input?.requires ?? {};
  const current = requires[slot];
  if (memberKey === undefined) {
    if (current === source) return undefined;
    return withRequiresInput(track, { ...requires, [slot]: source });
  }
  const entries: Readonly<Record<string, string>> =
    typeof current === "string" ? {} : (current ?? {});
  if (entries[memberKey] === source) return undefined;
  return withRequiresInput(track, {
    ...requires,
    [slot]: Object.freeze({ ...entries, [memberKey]: source }),
  });
}

function unboundSource(
  track: GroupedTrackDefinition,
  slot: string,
  memberKey: string | undefined,
): GroupedTrackDefinition | undefined {
  const requires = track.input?.requires;
  if (requires === undefined) return undefined;
  const current = requires[slot];
  if (current === undefined) return undefined;
  if (memberKey === undefined) {
    const next: Record<string, SourceBinding> = { ...requires };
    delete next[slot];
    return withRequiresInput(track, next);
  }
  if (typeof current === "string") return undefined;
  if (!Object.hasOwn(current, memberKey)) return undefined;
  const entries: Record<string, string> = { ...current };
  delete entries[memberKey];
  return withRequiresInput(track, { ...requires, [slot]: Object.freeze(entries) });
}

function planBinding(
  state: PlanState,
  edit: Extract<Edit, { kind: "bind" } | { kind: "unbind" }>,
  environment: PlanEnvironment,
): PlanOutcome {
  const current = requiredTrack(state, edit.nodeId);
  const track =
    edit.kind === "bind"
      ? boundSource(current.track, edit.slot, edit.source, edit.memberKey)
      : unboundSource(current.track, edit.slot, edit.memberKey);
  if (track === undefined) return accepted(state, undefined);
  const path = edit.kind === "bind" ? `bind(${edit.nodeId})` : `unbind(${edit.nodeId})`;
  const validated = validateTrack(track, path, edit.nodeId, environment);
  if (validated.kind === "refused") return refused(validated.diagnostics);
  const requires = validated.value.input?.requires ?? {};
  const contract =
    current.contract === undefined ? undefined : withRequires(current.contract, requires);
  const next = new Map(state.tracks);
  next.set(edit.nodeId, { ...current, track: validated.value, contract });
  const built = finalize(next, environment);
  if (built.kind === "refused") return built;
  return acceptedOutcome(
    {
      state: { tracks: built.value },
      change: changeOf(built.value, edit.nodeId, true),
    },
    built.diagnostics,
  );
}

/**
 * The sentence every cheap-tier contract refusal carries, beside the reason it already names.
 *
 * A cheap edit never re-infers, so the only way to move the contract is the structural replacement
 * that owns inference. The sentence is appended where the refusal is produced so the validator keeps
 * owning the reason and this tier owns the remedy.
 */
const REPLACE_HINT = " Use track.input.replace(...) or track.replace(...) to change the contract.";

function freezeAuthored<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  for (const child of Object.values(value)) freezeAuthored(child);
  return Object.freeze(value);
}

function withInputValues(
  track: GroupedTrackDefinition,
  values: AuthoredValues,
): GroupedTrackDefinition {
  const input: TrackInput = Object.freeze({
    ...(track.input ?? {}),
    values: freezeAuthored(values),
  });
  return Object.freeze({ ...track, input });
}

/**
 * The authored spec cheap edits validate against, never inferred from the values being written.
 *
 * A declared schema is used as written so its `static` flags still apply; a plugin track uses the
 * plugin's declared local spec; an inferred source uses the contract its last structural commit
 * stored. The fallback to the committed spec covers a plugin definition the capabilities cannot
 * answer, which is still the contract that commit resolved.
 */
function committedInputSpec(
  track: TrackDefinition,
  contract: CommittedContract | undefined,
  environment: PlanEnvironment,
): ValueSpec | undefined {
  if (track.plugin !== undefined)
    return (
      environment.capabilities.pluginDefinition?.(track.plugin)?.inputs.values ??
      contract?.input.spec
    );
  return track.input?.schema ?? contract?.input.spec;
}

type AuthoredShape = "table" | "record";

function isAuthoredTable(values: AuthoredValues | undefined): values is readonly AuthoredRow[] {
  return Array.isArray(values);
}

function authoredShape(
  track: TrackDefinition,
  spec: ValueSpec | undefined,
): AuthoredShape | undefined {
  const values = track.input?.values;
  if (isAuthoredTable(values)) return "table";
  if (values !== undefined) return "record";
  return spec?.kind;
}

/**
 * Stops on a field the plugin declares static.
 *
 * The parser enforces this against `input.schema`, which a plugin track cannot carry, so a plugin
 * track's local spec is checked here instead. The rule is the parser's own; only the spec it is
 * asked against arrives from the plugin.
 */
function staticStopDiagnostics(
  values: ParsedValues,
  spec: ValueSpec,
  path: string,
): readonly Diagnostic[] {
  const fields = spec.kind === "table" ? spec.schema.row.fields : spec.fields;
  const entries =
    values.kind === "table"
      ? values.rows.flatMap((row, index) =>
          Object.entries(row.cells).map(([name, cell]) => ({
            name,
            cell,
            path: `${path}[${index}].cells.${name}`,
          })),
        )
      : Object.entries(values.fields).map(([name, cell]) => ({
          name,
          cell,
          path: `${path}.${name}`,
        }));
  const diagnostics: Diagnostic[] = [];
  for (const entry of entries) {
    if (entry.cell.kind !== "animated") continue;
    if (fields[entry.name]?.static !== true) continue;
    diagnostics.push(
      diagnostic("static-field-stops", entry.path, "A static field cannot author a stop sequence."),
    );
  }
  return Object.freeze(diagnostics);
}

interface ValidatedAuthored {
  readonly track: GroupedTrackDefinition;
  readonly values: ParsedValues;
}

function validateAuthoredValues(
  track: GroupedTrackDefinition,
  path: string,
  nodeId: string,
  contract: CommittedContract | undefined,
  environment: PlanEnvironment,
): Outcome<ValidatedAuthored, Diagnostic> {
  // A runtime with no admission predicate cannot judge a plugin id, and the graph it is editing
  // already admitted this one. The parser treats absence as "nothing is registered", so the
  // unjudged environment is expressed as a predicate that admits what is already loaded.
  const context = {
    isPluginRegistered: environment.isPluginRegistered ?? (() => true),
  };
  const parsed = parseTrackDefinition(track, path, context);
  if (parsed.kind === "refused") {
    const diagnostics = parsed.diagnostics.map((entry) =>
      entry.ruleId === "static-field-stops" ? hintDiagnostic(entry, REPLACE_HINT) : entry,
    );
    return refusedOutcomeFrom(diagnostics);
  }
  const values = parsed.value.input.values;
  if (values === undefined) throw new TypeError(`Authored edit at "${nodeId}" carries no values.`);
  const spec = committedInputSpec(track, contract, environment);
  if (spec === undefined) return acceptedOutcome({ track, values }, parsed.diagnostics);
  const checked = deriveSourceContract(values, spec, `${nodeId}.input.values`);
  if (checked.kind === "refused")
    return refusedOutcomeFrom(hintDiagnostics(checked.diagnostics, REPLACE_HINT));
  if (track.plugin !== undefined) {
    const staticStops = staticStopDiagnostics(values, spec, `${nodeId}.input.values`);
    if (staticStops.length > 0)
      return refusedOutcomeFrom(hintDiagnostics(staticStops, REPLACE_HINT));
  }
  return acceptedOutcome({ track, values }, parsed.diagnostics);
}

type AddressedValues =
  | { readonly kind: "ok"; readonly values: AuthoredValues }
  | { readonly kind: "refused"; readonly diagnostic: Diagnostic };

function refusedAddress(diagnostic: Diagnostic): AddressedValues {
  return { kind: "refused", diagnostic };
}

/**
 * The whole authored values with the addressed cell written, or the address that does not exist.
 *
 * Row order and every untouched cell travel by identity, and a field the row omitted is added in
 * place when the committed spec declares it. The address never decides whether the edit is valid on
 * its own: a table row is found by id and a record field must be declared or authored.
 */
function addressedValues(
  track: GroupedTrackDefinition,
  address: CellAddress,
  shape: AuthoredShape,
  spec: ValueSpec | undefined,
  cell: AuthoredCell,
  nodeId: string,
): AddressedValues {
  const values = track.input?.values;
  switch (shape) {
    case "record": {
      if (address.row !== undefined)
        return refusedAddress(
          diagnostic(
            "values-shape-invalid",
            `${nodeId}.input.values`,
            `Track '${nodeId}' has a record input; omit 'row'.`,
          ),
        );
      const record: AuthoredRecord | undefined = isAuthoredTable(values) ? undefined : values;
      const fields = spec?.kind === "record" ? spec.fields : undefined;
      const known =
        fields !== undefined
          ? Object.hasOwn(fields, address.field)
          : Object.hasOwn(record ?? {}, address.field);
      if (!known)
        return refusedAddress(
          diagnostic(
            "cell-address-unknown",
            `setField(${nodeId}).field`,
            `Field '${address.field}' is not declared or authored for this track.`,
          ),
        );
      return {
        kind: "ok",
        values: freezeAuthored({ ...(record ?? {}), [address.field]: cell }),
      };
    }
    case "table": {
      if (address.row === undefined)
        return refusedAddress(
          diagnostic(
            "values-shape-invalid",
            `${nodeId}.input.values`,
            `Track '${nodeId}' has a table input; give 'row' (the row id).`,
          ),
        );
      const rows: readonly AuthoredRow[] = isAuthoredTable(values) ? values : [];
      const index = rows.findIndex((row) => row.id === address.row);
      const row = index < 0 ? undefined : rows[index];
      if (row === undefined)
        return refusedAddress(
          diagnostic(
            "cell-address-unknown",
            `setField(${nodeId}).row`,
            `Row '${address.row}' is not authored for this track.`,
          ),
        );
      const fields = spec?.kind === "table" ? spec.schema.row.fields : undefined;
      const known =
        fields !== undefined
          ? Object.hasOwn(fields, address.field)
          : rows.some((candidate) => Object.hasOwn(candidate.cells, address.field));
      if (!known)
        return refusedAddress(
          diagnostic(
            "cell-address-unknown",
            `setField(${nodeId}).field`,
            `Field '${address.field}' is not declared or authored for this track.`,
          ),
        );
      const cells = Object.freeze({ ...row.cells, [address.field]: cell });
      const next = rows.map((candidate, position) =>
        position === index ? Object.freeze({ ...candidate, cells }) : candidate,
      );
      return { kind: "ok", values: freezeAuthored(next) };
    }
    default:
      return unreachable(shape);
  }
}

function planSetValues(
  state: PlanState,
  edit: Extract<Edit, { kind: "set-values" }>,
  environment: PlanEnvironment,
): PlanOutcome {
  const current = requiredTrack(state, edit.nodeId);
  if (current.track.input?.values === edit.values) return accepted(state, undefined);
  const track = withInputValues(current.track, edit.values);
  const validated = validateAuthoredValues(
    track,
    `setValues(${edit.nodeId})`,
    edit.nodeId,
    current.contract,
    environment,
  );
  if (validated.kind === "refused") return refused(validated.diagnostics);
  const planned: PlannedTrack = { ...current, track: validated.value.track };
  const next = new Map(state.tracks);
  next.set(edit.nodeId, planned);
  return acceptedOutcome(
    {
      state: { tracks: next },
      change: { kind: "authored-values", track: planned, values: validated.value.values },
    },
    validated.diagnostics,
  );
}

function planSetField(
  state: PlanState,
  edit: Extract<Edit, { kind: "set-field" }>,
  environment: PlanEnvironment,
): PlanOutcome {
  const current = requiredTrack(state, edit.nodeId);
  const spec = committedInputSpec(current.track, current.contract, environment);
  const shape = authoredShape(current.track, spec);
  if (shape === undefined)
    return refused([
      diagnostic(
        "cell-address-unknown",
        `setField(${edit.nodeId})`,
        `Track '${edit.nodeId}' has no committed input shape.`,
      ),
    ]);
  const addressed = addressedValues(
    current.track,
    edit.address,
    shape,
    spec,
    edit.cell,
    edit.nodeId,
  );
  if (addressed.kind === "refused") return refused([addressed.diagnostic]);
  const track = withInputValues(current.track, addressed.values);
  const validated = validateAuthoredValues(
    track,
    `setField(${edit.nodeId})`,
    edit.nodeId,
    current.contract,
    environment,
  );
  if (validated.kind === "refused") return refused(validated.diagnostics);
  const planned: PlannedTrack = { ...current, track: validated.value.track };
  const next = new Map(state.tracks);
  next.set(edit.nodeId, planned);
  return acceptedOutcome(
    {
      state: { tracks: next },
      change: { kind: "authored-values", track: planned, values: validated.value.values },
    },
    validated.diagnostics,
  );
}

/**
 * Plans one edit against one committed view.
 *
 * The edit either changes nothing, in which case the original state is answered by identity, or it
 * produces a candidate view and the change that reaches it. A refusal carries the diagnostics and
 * leaves the state untouched; it is the caller's job to report the edit index that produced it.
 */
export function plan(state: PlanState, edit: Edit, environment: PlanEnvironment): PlanOutcome {
  switch (edit.kind) {
    case "replace-track":
      return planReplaceTrack(state, edit, environment);
    case "replace-input":
      return planReplaceInput(state, edit, environment);
    case "remove-track":
      return planRemoveTrack(state, edit, environment);
    case "bind":
    case "unbind":
      return planBinding(state, edit, environment);
    case "set-values":
      return planSetValues(state, edit, environment);
    case "set-field":
      return planSetField(state, edit, environment);
    default:
      return unreachable(edit);
  }
}
