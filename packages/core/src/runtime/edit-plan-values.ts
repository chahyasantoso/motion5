import type {
  AuthoredCell,
  AuthoredRecord,
  AuthoredRow,
  AuthoredValues,
  CellAddress,
  Diagnostic,
  TrackDefinition,
  TrackInput,
  Value,
  ValueSpec,
} from "../contract/v5";
import { diagnostic, hintDiagnostic, hintDiagnostics } from "../contract/diagnostics";
import { deriveSourceContract, type SpecOrigin } from "../contract/v5-infer";
import { parseTrackDefinition, type ParsedValues } from "../contract/v5-parse";
import type { CommittedContract } from "../graph/committed-contract";
import { acceptedOutcome, refusedOutcomeFrom, type Outcome } from "../lang/outcome";
import { unreachable } from "../lang/exhaustive";
import type { PluginCapabilities } from "../ports/plugin-capabilities";
import { validateRuntimeValue } from "./value-validation";
import { AUTHORED, buildOwed, LIVE, type ValueState } from "./value-state";
import type { CheapEdit, LiveEdit } from "./edit-types";

/**
 * The pure half of the value tier: one target node, one edit, one delta.
 *
 * A value edit reads exactly one node through a `TrackLookup` and answers the change that reaches
 * it. The lookup has no way to enumerate, so planning cannot walk or copy the project: that is the
 * claim of the cheap tier, and the type is what enforces it. Structural edits stay in
 * `edit-plan.ts`, which plans against a whole candidate graph.
 */

/** What a value edit reads about its one target. `PlannedTrack` extends it with graph placement. */
export interface CheapTrack {
  readonly nodeId: string;
  readonly track: TrackDefinition;
  readonly valueState: ValueState;
  readonly contract: CommittedContract | undefined;
}

/** One-node read access. Deliberately has no iteration. */
export interface TrackLookup {
  get(nodeId: string): CheapTrack | undefined;
}

/** What a value plan may ask about plugins, total and without an engine. */
export interface ValueEnvironment {
  readonly capabilities: PluginCapabilities;
  readonly isPluginRegistered?: (pluginId: string) => boolean;
}

/**
 * One authored value edit, with the parsed values the compiled Track will evaluate.
 *
 * The parsed form travels with the change so the runtime applies exactly what this plan validated
 * and the parser stays the only reader of an authored cell. The committed contract and value state
 * travel unchanged on `track`, which is the whole claim of the cheap tier.
 */
export interface AuthoredValuesChange {
  readonly kind: "authored-values";
  readonly track: CheapTrack;
  readonly values: ParsedValues;
}

/**
 * One live value edit, with the whole evaluated value the compiled Track must stand over.
 *
 * `overlay` is absent for a release, which is the only live edit that carries no value. The track's
 * authored definition is carried unchanged: a live write moves what is published, never what is
 * authored.
 */
export interface LiveValuesChange {
  readonly kind: "live-values";
  readonly track: CheapTrack;
  readonly overlay: Value | undefined;
}

export type ValueChange = AuthoredValuesChange | LiveValuesChange;

export interface ValuePlanAccepted {
  readonly change: ValueChange | undefined;
}

export type ValueOutcome = Outcome<ValuePlanAccepted, Diagnostic>;

function refused(diagnostics: readonly Diagnostic[]): ValueOutcome {
  return refusedOutcomeFrom<ValuePlanAccepted, Diagnostic>(diagnostics);
}

function unchanged(): ValueOutcome {
  return acceptedOutcome<ValuePlanAccepted, Diagnostic>({ change: undefined }, Object.freeze([]));
}

function requiredTrack(view: TrackLookup, nodeId: string): CheapTrack {
  const track = view.get(nodeId);
  if (track === undefined) throw new TypeError(`Unknown graph node "${nodeId}".`);
  return track;
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

function withInputValues(track: TrackDefinition, values: AuthoredValues): TrackDefinition {
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
interface CommittedInputSpec {
  readonly spec: ValueSpec;
  readonly origin: SpecOrigin;
}

function committedInputSpec(
  track: TrackDefinition,
  contract: CommittedContract | undefined,
  environment: ValueEnvironment,
): CommittedInputSpec {
  if (track.plugin !== undefined) {
    const spec =
      environment.capabilities.pluginDefinition?.(track.plugin)?.inputs.values ??
      contract?.input.spec;
    if (spec === undefined) throw new TypeError(`Track "${track.id}" has no committed input spec.`);
    return { spec, origin: "plugin" };
  }
  if (track.input?.schema !== undefined) {
    return { spec: track.input.schema, origin: "declared" };
  }
  const spec = contract?.input.spec;
  if (spec === undefined) throw new TypeError(`Track "${track.id}" has no committed input spec.`);
  return { spec, origin: "inferred" };
}

type AuthoredShape = "table" | "record";

function isAuthoredTable(values: AuthoredValues | undefined): values is readonly AuthoredRow[] {
  return Array.isArray(values);
}

function authoredShape(track: TrackDefinition, spec: ValueSpec): AuthoredShape {
  const values = track.input?.values;
  if (isAuthoredTable(values)) return "table";
  if (values !== undefined) return "record";
  return spec.kind;
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
  readonly track: TrackDefinition;
  readonly values: ParsedValues;
}

function validateAuthoredValues(
  track: TrackDefinition,
  path: string,
  nodeId: string,
  contract: CommittedContract | undefined,
  environment: ValueEnvironment,
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
  const committed = committedInputSpec(track, contract, environment);
  const checked = deriveSourceContract(
    values,
    committed.spec,
    `${nodeId}.input.values`,
    committed.origin,
  );
  if (checked.kind === "refused")
    return refusedOutcomeFrom(hintDiagnostics(checked.diagnostics, REPLACE_HINT));
  if (track.plugin !== undefined) {
    const staticStops = staticStopDiagnostics(values, committed.spec, `${nodeId}.input.values`);
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
  track: TrackDefinition,
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
  view: TrackLookup,
  edit: Extract<CheapEdit, { kind: "set-values" }>,
  environment: ValueEnvironment,
): ValueOutcome {
  const current = requiredTrack(view, edit.nodeId);
  if (current.track.input?.values === edit.values) return unchanged();
  const track = withInputValues(current.track, edit.values);
  const validated = validateAuthoredValues(
    track,
    `values.set(${edit.nodeId})`,
    edit.nodeId,
    current.contract,
    environment,
  );
  if (validated.kind === "refused") return refused(validated.diagnostics);
  const planned: CheapTrack = { ...current, track: validated.value.track };
  return acceptedOutcome(
    { change: { kind: "authored-values", track: planned, values: validated.value.values } },
    validated.diagnostics,
  );
}

function planSetField(
  view: TrackLookup,
  edit: Extract<CheapEdit, { kind: "set-field" }>,
  environment: ValueEnvironment,
): ValueOutcome {
  const current = requiredTrack(view, edit.nodeId);
  const committed = committedInputSpec(current.track, current.contract, environment);
  const shape = authoredShape(current.track, committed.spec);
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
    committed.spec,
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
  const planned: CheapTrack = { ...current, track: validated.value.track };
  return acceptedOutcome(
    { change: { kind: "authored-values", track: planned, values: validated.value.values } },
    validated.diagnostics,
  );
}

function liveExtraFields(spec: ValueSpec): "reject" | "allow-scalar" {
  if (spec.kind === "table")
    return spec.schema.row.additionalProperties === true ? "allow-scalar" : "reject";
  return spec.additionalProperties === true ? "allow-scalar" : "reject";
}

/**
 * One whole-value live write, validated against the committed contract and never inferred.
 *
 * The authored definition is carried by identity: the overlay is what the compiled Track publishes,
 * and a write must not rename an authored row or change an authored field. Shape, required and
 * unknown fields, scalar kinds, row ids, finiteness and reserved names are all
 * `live-values-invalid`, with the path the value would occupy in an authored document.
 */
function planWriteLive(
  view: TrackLookup,
  edit: Extract<LiveEdit, { kind: "write-live" }>,
  environment: ValueEnvironment,
): ValueOutcome {
  const current = requiredTrack(view, edit.nodeId);
  const committed = committedInputSpec(current.track, current.contract, environment);
  const issues = validateRuntimeValue(edit.value, committed.spec, `${edit.nodeId}.input.values`, {
    extraFields: liveExtraFields(committed.spec),
  });
  if (issues.length > 0)
    return refused(
      issues.map((issue) => diagnostic("live-values-invalid", issue.path, issue.message)),
    );
  const planned: CheapTrack = { ...current, valueState: LIVE };
  return acceptedOutcome(
    { change: { kind: "live-values", track: planned, overlay: freezeAuthored(edit.value) } },
    Object.freeze([]),
  );
}

/** One release: drop the overlay and resume authored evaluation at the current progress. */
function planReleaseLive(
  view: TrackLookup,
  edit: Extract<LiveEdit, { kind: "release-live" }>,
): ValueOutcome {
  const current = requiredTrack(view, edit.nodeId);
  if (!buildOwed(current.valueState)) return unchanged();
  const planned: CheapTrack = { ...current, valueState: AUTHORED };
  return acceptedOutcome(
    { change: { kind: "live-values", track: planned, overlay: undefined } },
    Object.freeze([]),
  );
}

/**
 * Plans one value edit against one target node. Never reads any other node.
 *
 * The edit either changes nothing, answered as `change: undefined`, or answers the change that
 * reaches the target. A refusal carries the diagnostics; the caller reports the edit index.
 */
export function planValueEdit(
  view: TrackLookup,
  edit: CheapEdit | LiveEdit,
  environment: ValueEnvironment,
): ValueOutcome {
  switch (edit.kind) {
    case "set-values":
      return planSetValues(view, edit, environment);
    case "set-field":
      return planSetField(view, edit, environment);
    case "write-live":
      return planWriteLive(view, edit, environment);
    case "release-live":
      return planReleaseLive(view, edit);
    default:
      return unreachable(edit);
  }
}
