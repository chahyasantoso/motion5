import type { Diagnostic, SourceBinding, TrackDefinition, TrackInput } from "../contract/v5";
import { diagnostic } from "../contract/diagnostics";
import { validateTrackDefinition } from "../contract/validate-v5";
import type { CommittedContract } from "../graph/committed-contract";
import { withRequires } from "../graph/committed-contract";
import { collectTrack, finalizeGraph, type GraphNode } from "../graph/ir";
import { qualifyFreeTrack, qualifyMotionTrack } from "../graph/ids";
import { acceptedOutcome, refusedOutcomeFrom, type Outcome } from "../lang/outcome";
import { unreachable } from "../lang/exhaustive";
import type { PluginCapabilities } from "../ports/plugin-capabilities";
import { AUTHORED, type ValueState } from "./value-state";
import {
  clearsOverlay,
  type CheapEdit,
  type Edit,
  type LiveEdit,
  type StructuralEdit,
} from "./edit-types";
import {
  planValueEdit,
  type CheapTrack,
  type ValueChange,
  type ValueEnvironment,
} from "./edit-plan-values";

function valueStateAfter(edit: StructuralEdit, current: ValueState): ValueState {
  return clearsOverlay(edit) ? AUTHORED : current;
}

/** One committed track in the graph: a `CheapTrack` plus owner and authored index. Structural edits
 * plan the whole candidate graph; a bind may close a cycle, a removal strand a binding. */
export interface PlannedTrack extends CheapTrack {
  readonly owner: "motion" | "free";
  readonly ownerId: string;
  readonly authoredIndex: number;
}

/** Every committed track a plan can see, by node id. */
export interface PlanState {
  readonly tracks: ReadonlyMap<string, PlannedTrack>;
}

/** What a plan may ask about plugins: total, no engine. */
export type PlanEnvironment = ValueEnvironment;

interface UpdateTrackChange {
  readonly kind: "update-track";
  readonly track: PlannedTrack;
  readonly bindingOnly: boolean;
}

interface RemoveTrackChange {
  readonly kind: "remove-track";
  readonly nodeId: string;
}

/** What one edit changes; absent when nothing changed. */
export type PlannedChange = UpdateTrackChange | RemoveTrackChange | ValueChange;

export interface PlanAccepted {
  readonly state: PlanState;
  readonly change: PlannedChange | undefined;
}

export type PlanOutcome = Outcome<PlanAccepted, Diagnostic>;

type MutableInput = { -readonly [K in keyof TrackInput]: TrackInput[K] };
type MutableTrack = { -readonly [K in keyof TrackDefinition]: TrackDefinition[K] };

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

function withInput(track: TrackDefinition, input: TrackInput | undefined): TrackDefinition {
  const next: MutableTrack = { ...track };
  if (input === undefined) delete next.input;
  else next.input = input;
  return next;
}

function withRequiresInput(
  track: TrackDefinition,
  requires: Readonly<Record<string, SourceBinding>>,
): TrackDefinition {
  const input: MutableInput = { ...track.input, requires };
  return { ...track, input };
}

/** Parser holds no registry, so only the declared input kind is compared here; composition owns
 * the full value check. */
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
  // Absent predicate refuses every plugin; the graph admitted these already, so admit all.
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

// A carried contract survives cheap value edits; absent means a replacement, which derives fresh.
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
    valueState: valueStateAfter(edit, current.valueState),
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
  if (current.track.input === edit.input && current.valueState === AUTHORED)
    return accepted(state, undefined);
  const track = withInput(current.track, edit.input);
  const validated = validateTrack(track, `replaceInput(${edit.nodeId})`, edit.nodeId, environment);
  if (validated.kind === "refused") return refused(validated.diagnostics);
  const next = new Map(state.tracks);
  next.set(edit.nodeId, {
    ...current,
    track: validated.value,
    valueState: valueStateAfter(edit, current.valueState),
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
  track: TrackDefinition,
  slot: string,
  source: string,
  memberKey: string | undefined,
): TrackDefinition | undefined {
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
  track: TrackDefinition,
  slot: string,
  memberKey: string | undefined,
): TrackDefinition | undefined {
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
  next.set(edit.nodeId, {
    ...current,
    track: validated.value,
    contract,
  });
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

// The value tier's reference answer: `planValueEdit`'s change applied to a whole next view.
function planValueAsState(
  state: PlanState,
  edit: CheapEdit | LiveEdit,
  environment: PlanEnvironment,
): PlanOutcome {
  const planned = planValueEdit(state.tracks, edit, environment);
  if (planned.kind === "refused") return refused(planned.diagnostics);
  const { change } = planned.value;
  if (change === undefined)
    return acceptedOutcome({ state, change: undefined }, planned.diagnostics);
  const current = requiredTrack(state, edit.nodeId);
  const next = new Map(state.tracks);
  next.set(edit.nodeId, { ...current, ...change.track });
  return acceptedOutcome({ state: { tracks: next }, change }, planned.diagnostics);
}

/** Plans one edit against one committed view. Nothing to change answers the same state by identity;
 * a refusal answers diagnostics and leaves that state untouched. */
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
    case "set-field":
    case "write-live":
    case "release-live":
      return planValueAsState(state, edit, environment);
    default:
      return unreachable(edit);
  }
}
