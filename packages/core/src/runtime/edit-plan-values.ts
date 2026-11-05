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
import { isModel, outputModelId, outputPluginId } from "../contract/v5";
import { diagnostic, hintDiagnostic, hintDiagnostics } from "../contract/diagnostics";
import { deriveSourceContract, type SpecOrigin } from "../contract/v5-infer";
import { parseTrackDefinition, type ParsedValues } from "../contract/v5-parse";
import { unknownNameMessage } from "../contract/registry-message";
import type { CommittedContract } from "../graph/committed-contract";
import { acceptedOutcome, refusedOutcomeFrom, type Outcome } from "../lang/outcome";
import { unreachable } from "../lang/exhaustive";
import type { PluginCapabilities } from "../ports/plugin-capabilities";
import { authoringValue } from "./authoring-value";
import { parseModel } from "./data-type-parse";
import { validateRuntimeValue } from "./value-validation";
import { authoredStaticView, runtimeStaticView, sameStaticView } from "./static-view";
import { AUTHORED, buildOwed, LIVE, type ValueState } from "./value-state";
import type { CheapEdit, LiveEdit } from "./edit-types";

/** Pure value tier: one node, one edit, one delta. `TrackLookup` cannot enumerate, so planning
 * never walks the project; structural edits, needing the whole graph, stay in `edit-plan.ts`. */

/** What a value edit reads about its target; `PlannedTrack` adds graph placement. */
export interface CheapTrack {
  readonly nodeId: string;
  readonly track: TrackDefinition;
  readonly valueState: ValueState;
  readonly contract: CommittedContract | undefined;
}

/** One-node read access; no iteration by design. */
export interface TrackLookup {
  get(nodeId: string): CheapTrack | undefined;
}

/** What a value plan may ask about plugins: total, no engine. */
export interface ValueEnvironment {
  readonly capabilities: PluginCapabilities;
  readonly isPluginRegistered?: (pluginId: string) => boolean;
}

/** One authored value edit, with the parsed values the compiled Track will evaluate. Parsed form
 * travels so runtime applies what this plan validated; `track` carries contract and value state. */
export interface AuthoredValuesChange {
  readonly kind: "authored-values";
  readonly channel: "values" | "param";
  readonly track: CheapTrack;
  readonly values: ParsedValues;
}

/** One live value edit, with the whole evaluated value the compiled Track must stand over.
 * `overlay` absent on release; a live write moves what is published, never what is authored. */
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

/** Remedy appended to every cheap-tier contract refusal. A cheap edit never re-infers, so only
 * the structural replacement that owns inference can move the contract. */
const REPLACE_HINT = " Use track.input.replace(...) or track.replace(...) to change the contract.";

function freezeAuthored<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  for (const child of Object.values(value)) freezeAuthored(child);
  return Object.freeze(value);
}

function withInputChannel(
  track: TrackDefinition,
  channel: InputChannel,
  values: AuthoredValues,
): TrackDefinition {
  const input: TrackInput = Object.freeze({
    ...(track.input ?? {}),
    [channel]: freezeAuthored(values),
  });
  return Object.freeze({ ...track, input });
}

/** Spec cheap edits validate against: the plugin's local spec, or the source model's spec. */
interface CommittedInputSpec {
  readonly spec: ValueSpec;
  readonly origin: SpecOrigin;
}

type InputChannel = "values" | "param";

function committedInputSpec(
  track: TrackDefinition,
  channel: InputChannel,
  contract: CommittedContract | undefined,
  environment: ValueEnvironment,
): CommittedInputSpec {
  const pluginId = outputPluginId(track.output);
  if (pluginId !== undefined) {
    const definition = environment.capabilities.pluginDefinition?.(pluginId);
    const raw = channel === "values" ? definition?.inputs.values : definition?.inputs.param;
    const spec =
      (isModel(raw) ? raw.spec : raw) ?? (channel === "values" ? contract?.input.spec : undefined);
    if (spec === undefined)
      throw new TypeError(`Track "${track.id}" has no committed ${channel} spec.`);
    return { spec, origin: "plugin" };
  }
  if (channel === "param")
    throw new TypeError(`Track "${track.id}" has a model output and no params.`);
  const modelId = outputModelId(track.output);
  const modelSpec =
    modelId === undefined ? undefined : environment.capabilities.model?.(modelId)?.spec;
  const spec = modelSpec ?? contract?.input.spec;
  if (spec === undefined) throw new TypeError(`Track "${track.id}" has no committed input spec.`);
  return { spec, origin: "model" };
}

type AuthoredShape = "table" | "record";

function isAuthoredTable(values: AuthoredValues | undefined): values is readonly AuthoredRow[] {
  return Array.isArray(values);
}

function authoredShape(
  track: TrackDefinition,
  spec: ValueSpec,
  channel: InputChannel,
): AuthoredShape {
  const values = channel === "values" ? track.input?.values : track.input?.param;
  if (isAuthoredTable(values)) return "table";
  if (values !== undefined) return "record";
  return spec.kind;
}

/** Stops on a field the model or plugin declares static. The parser checks the authored channel
 * against that spec, so its own stop rule is repeated here for the replacement path. */
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
  channel: InputChannel,
  path: string,
  nodeId: string,
  contract: CommittedContract | undefined,
  environment: ValueEnvironment,
): Outcome<ValidatedAuthored, Diagnostic> {
  // Absent predicate admits every id: the graph already admitted this plugin, while the parser
  // would read absence as "nothing is registered".
  const context = {
    isPluginRegistered: environment.isPluginRegistered ?? (() => true),
    ...(environment.capabilities.pluginDefinition === undefined
      ? {}
      : {
          pluginDefinition: (pluginId: string) =>
            environment.capabilities.pluginDefinition?.(pluginId),
        }),
    ...(environment.capabilities.model === undefined
      ? {}
      : { model: (modelId: string) => environment.capabilities.model?.(modelId) }),
    ...(environment.capabilities.modelIds === undefined
      ? {}
      : { modelIds: () => environment.capabilities.modelIds?.() }),
    ...(environment.capabilities.pluginIds === undefined
      ? {}
      : { pluginIds: () => environment.capabilities.pluginIds?.() }),
  };
  const parsed = parseTrackDefinition(track, path, context);
  if (parsed.kind === "refused") {
    return refusedOutcomeFrom(hintDiagnostics(parsed.diagnostics, REPLACE_HINT));
  }
  const values = channel === "values" ? parsed.value.input.values : parsed.value.input.param;
  if (values === undefined)
    throw new TypeError(`Authored ${channel} edit at "${nodeId}" carries no ${channel}.`);
  const committed = committedInputSpec(track, channel, contract, environment);
  const checked = deriveSourceContract(
    values,
    committed.spec,
    `${nodeId}.input.${channel}`,
    committed.origin,
  );
  if (checked.kind === "refused")
    return refusedOutcomeFrom(hintDiagnostics(checked.diagnostics, REPLACE_HINT));
  if (outputPluginId(track.output) !== undefined) {
    const staticStops = staticStopDiagnostics(values, committed.spec, `${nodeId}.input.${channel}`);
    if (staticStops.length > 0)
      return refusedOutcomeFrom(hintDiagnostics(staticStops, REPLACE_HINT));
  } else if (environment.capabilities.model !== undefined) {
    const modelId = outputModelId(track.output);
    if (modelId === undefined) throw new TypeError(`Track "${nodeId}" names no model output.`);
    const model = environment.capabilities.model(modelId);
    if (model === undefined)
      return refusedOutcomeFrom([
        diagnostic(
          "model-unknown",
          `${nodeId}.output.model`,
          unknownNameMessage("model", modelId, environment.capabilities.modelIds?.()),
        ),
      ]);
    const structure = parseModel(
      model,
      authoringValue(values, model.spec),
      `${nodeId}.input.${channel}`,
    );
    if (structure.kind === "refused")
      return refusedOutcomeFrom([...parsed.diagnostics, ...structure.diagnostics]);
  }
  return acceptedOutcome({ track, values }, parsed.diagnostics);
}

type AddressedValues =
  | { readonly kind: "ok"; readonly values: AuthoredValues }
  | { readonly kind: "refused"; readonly diagnostic: Diagnostic };

function refusedAddress(diagnostic: Diagnostic): AddressedValues {
  return { kind: "refused", diagnostic };
}

/** Whole values with the addressed cell written, or the missing address; row order and untouched
 * cells travel by identity. Table row found by id; record field must be declared or authored. */
function addressedValues(
  track: TrackDefinition,
  channel: InputChannel,
  address: CellAddress,
  shape: AuthoredShape,
  spec: ValueSpec | undefined,
  cell: AuthoredCell,
  nodeId: string,
): AddressedValues {
  const values = channel === "values" ? track.input?.values : track.input?.param;
  switch (shape) {
    case "record": {
      if (address.row !== undefined)
        return refusedAddress(
          diagnostic(
            "values-shape-invalid",
            `${nodeId}.input.${channel}`,
            `Track '${nodeId}' has a record input; omit 'row'.`,
          ),
        );
      const record: AuthoredRecord | undefined = isAuthoredTable(values) ? undefined : values;
      const fields = spec?.kind === "record" ? spec.fields : undefined;
      const open = spec?.kind === "record" && spec.additionalProperties === true;
      const known =
        fields !== undefined
          ? Object.hasOwn(fields, address.field) ||
            (open && Object.hasOwn(record ?? {}, address.field))
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
            `${nodeId}.input.${channel}`,
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
      const open = spec?.kind === "table" && spec.schema.row.additionalProperties === true;
      const known =
        fields !== undefined
          ? Object.hasOwn(fields, address.field) ||
            (open && rows.some((candidate) => Object.hasOwn(candidate.cells, address.field)))
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

function emptyStaticView(spec: ValueSpec) {
  return spec.kind === "table"
    ? { kind: "table" as const, rows: [] as const }
    : { kind: "record" as const, fields: {} as const };
}

function staticChangeDiagnostic(
  current: TrackDefinition,
  next: TrackDefinition,
  channel: InputChannel,
  spec: ValueSpec,
  nodeId: string,
): Diagnostic | undefined {
  const before = channel === "values" ? current.input?.values : current.input?.param;
  const after = channel === "values" ? next.input?.values : next.input?.param;
  const beforeView = authoredStaticView(before, spec);
  const afterView = authoredStaticView(after, spec);
  if (
    sameStaticView(
      beforeView.kind === "absent" ? emptyStaticView(spec) : beforeView,
      afterView.kind === "absent" ? emptyStaticView(spec) : afterView,
    )
  )
    return undefined;
  return hintDiagnostic(
    diagnostic(
      "live-values-invalid",
      `${nodeId}.input.${channel}`,
      "A cheap write cannot modify static cells.",
    ),
    REPLACE_HINT,
  );
}

function planAuthoredChannel(
  current: CheapTrack,
  channel: InputChannel,
  values: AuthoredValues,
  path: string,
  environment: ValueEnvironment,
): ValueOutcome {
  const track = withInputChannel(current.track, channel, values);
  const committed = committedInputSpec(current.track, channel, current.contract, environment);
  const validated = validateAuthoredValues(
    track,
    channel,
    path,
    current.nodeId,
    current.contract,
    environment,
  );
  if (validated.kind === "refused") return refused(validated.diagnostics);
  const staticChange = staticChangeDiagnostic(
    current.track,
    track,
    channel,
    committed.spec,
    current.nodeId,
  );
  if (staticChange !== undefined) return refused([staticChange]);
  const planned: CheapTrack = { ...current, track: validated.value.track };
  return acceptedOutcome(
    {
      change: {
        kind: "authored-values",
        channel,
        track: planned,
        values: validated.value.values,
      },
    },
    validated.diagnostics,
  );
}

function planAuthoredField(
  current: CheapTrack,
  channel: InputChannel,
  address: CellAddress,
  cell: AuthoredCell,
  path: string,
  environment: ValueEnvironment,
): ValueOutcome {
  const committed = committedInputSpec(current.track, channel, current.contract, environment);
  const shape = authoredShape(current.track, committed.spec, channel);
  const addressed = addressedValues(
    current.track,
    channel,
    address,
    shape,
    committed.spec,
    cell,
    current.nodeId,
  );
  if (addressed.kind === "refused") return refused([addressed.diagnostic]);
  return planAuthoredChannel(current, channel, addressed.values, path, environment);
}

function planSetValues(
  view: TrackLookup,
  edit: Extract<CheapEdit, { kind: "set-values" }>,
  environment: ValueEnvironment,
): ValueOutcome {
  const current = requiredTrack(view, edit.nodeId);
  if (current.track.input?.values === edit.values) return unchanged();
  return planAuthoredChannel(
    current,
    "values",
    edit.values,
    `values.set(${edit.nodeId})`,
    environment,
  );
}

function planSetField(
  view: TrackLookup,
  edit: Extract<CheapEdit, { kind: "set-field" }>,
  environment: ValueEnvironment,
): ValueOutcome {
  const current = requiredTrack(view, edit.nodeId);
  return planAuthoredField(
    current,
    "values",
    edit.address,
    edit.cell,
    `values.setField(${edit.nodeId})`,
    environment,
  );
}

function paramRefusal(
  track: TrackDefinition,
  nodeId: string,
  environment: ValueEnvironment,
): ValueOutcome | undefined {
  const pluginId = outputPluginId(track.output);
  if (pluginId === undefined)
    return refused([
      diagnostic(
        "param-not-allowed",
        `${nodeId}.input.param`,
        "A model output has no processor and takes no params.",
      ),
    ]);
  const definition = environment.capabilities.pluginDefinition?.(pluginId);
  if (definition !== undefined && definition.inputs.param === undefined)
    return refused([
      diagnostic(
        "param-not-allowed",
        `${nodeId}.input.param`,
        `Plugin '${pluginId}' declares no params.`,
      ),
    ]);
  return undefined;
}

function planSetParam(
  view: TrackLookup,
  edit: Extract<CheapEdit, { kind: "set-param" }>,
  environment: ValueEnvironment,
): ValueOutcome {
  const current = requiredTrack(view, edit.nodeId);
  const refusal = paramRefusal(current.track, current.nodeId, environment);
  if (refusal !== undefined) return refusal;
  if (current.track.input?.param === edit.param) return unchanged();
  return planAuthoredChannel(
    current,
    "param",
    edit.param,
    `param.set(${edit.nodeId})`,
    environment,
  );
}

function planSetParamField(
  view: TrackLookup,
  edit: Extract<CheapEdit, { kind: "set-param-field" }>,
  environment: ValueEnvironment,
): ValueOutcome {
  const current = requiredTrack(view, edit.nodeId);
  const refusal = paramRefusal(current.track, current.nodeId, environment);
  if (refusal !== undefined) return refusal;
  return planAuthoredField(
    current,
    "param",
    edit.address,
    edit.cell,
    `param.setField(${edit.nodeId})`,
    environment,
  );
}

function liveExtraFields(spec: ValueSpec): "reject" | "allow-scalar" {
  if (spec.kind === "table")
    return spec.schema.row.additionalProperties === true ? "allow-scalar" : "reject";
  return spec.additionalProperties === true ? "allow-scalar" : "reject";
}

/** One whole-value live write, validated against the committed contract, never inferred. Every
 * fault — shape, fields, kinds, row ids, finiteness, reserved names — is `live-values-invalid`. */
function planWriteLive(
  view: TrackLookup,
  edit: Extract<LiveEdit, { kind: "write-live" }>,
  environment: ValueEnvironment,
): ValueOutcome {
  const current = requiredTrack(view, edit.nodeId);
  const committed = committedInputSpec(current.track, "values", current.contract, environment);
  const expected = authoredStaticView(current.track.input?.values, committed.spec);
  const incoming = runtimeStaticView(edit.value, committed.spec);
  if (!sameStaticView(expected, incoming))
    return refused([
      hintDiagnostic(
        diagnostic(
          "live-values-invalid",
          `${edit.nodeId}.input.values`,
          "A live write cannot modify static cells.",
        ),
        REPLACE_HINT,
      ),
    ]);
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

/** One release: drop the overlay, resume authored evaluation at current progress. */
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

/** Plans one value edit against one target node; reads no other. Nothing changed answers
 * `change: undefined`; else the change reaching the target; refusals carry diagnostics. */
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
    case "set-param":
      return planSetParam(view, edit, environment);
    case "set-param-field":
      return planSetParamField(view, edit, environment);
    case "write-live":
      return planWriteLive(view, edit, environment);
    case "release-live":
      return planReleaseLive(view, edit);
    default:
      return unreachable(edit);
  }
}
