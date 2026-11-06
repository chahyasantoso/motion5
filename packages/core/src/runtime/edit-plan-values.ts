import type {
  AdmittedPlugin,
  AuthoredCell,
  AuthoredRecord,
  AuthoredRow,
  AuthoredValues,
  CellAddress,
  Diagnostic,
  TrackDefinition,
  TrackInput,
  Value,
  ValueChannel,
  ValueSpec,
} from "../contract/v5";
import { outputRef } from "../contract/v5";
import { diagnostic, hintDiagnostic, hintDiagnostics } from "../contract/diagnostics";
import { deriveSourceContract, type SpecOrigin } from "../contract/v5-infer";
import {
  parseTrackDefinition,
  type ParseContext,
  type ParsedInput,
  type ParsedValues,
} from "../contract/v5-parse";
import { parseContextOf, type PluginCapabilities } from "../ports/plugin-capabilities";
import type { CommittedContract } from "../graph/committed-contract";
import { acceptedOutcome, refusedOutcomeFrom, type Outcome } from "../lang/outcome";
import { unreachable } from "../lang/exhaustive";
import { extraFieldsPolicy, validateRuntimeValue } from "./value-validation";
import { authoredStaticView, runtimeStaticView, sameStaticView } from "./static-view";
import { liveOn, withLiveChannel, withoutLiveChannel, type ValueState } from "./value-state";
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

/** Parse context for a value plan. Absent predicate admits every id: the graph already admitted
 * this plugin, while the parser would read absence as "nothing is registered". */
export function planParseContext(environment: ValueEnvironment): ParseContext {
  return {
    ...parseContextOf(environment.capabilities),
    isPluginRegistered: environment.isPluginRegistered ?? (() => true),
  };
}

/** One authored value edit, with the parsed values the compiled Track will evaluate. Parsed form
 * travels so runtime applies what this plan validated; `track` carries contract and value state. */
export interface AuthoredValuesChange {
  readonly kind: "authored-values";
  readonly channel: ValueChannel;
  readonly track: CheapTrack;
  readonly values: ParsedValues;
}

/** One live channel edit, with the whole evaluated channel the compiled Track must stand over.
 * `overlay` absent on release; a live write moves what is published, never what is authored. */
export interface LiveValuesChange {
  readonly kind: "live-values";
  readonly channel: ValueChannel;
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
  channel: ValueChannel,
  values: AuthoredValues,
): TrackDefinition {
  const input: TrackInput = Object.freeze({
    ...(track.input ?? {}),
    [channel]: freezeAuthored(values),
  });
  return Object.freeze({ ...track, input });
}

function channelInput(track: TrackDefinition, channel: ValueChannel): AuthoredValues | undefined {
  switch (channel) {
    case "values":
      return track.input?.values;
    case "param":
      return track.input?.param;
    default:
      return unreachable(channel);
  }
}

function parsedChannel(input: ParsedInput, channel: ValueChannel): ParsedValues | undefined {
  switch (channel) {
    case "values":
      return input.values;
    case "param":
      return input.param;
    default:
      return unreachable(channel);
  }
}

function declaredChannel(
  definition: AdmittedPlugin | undefined,
  channel: ValueChannel,
): ValueSpec | undefined {
  switch (channel) {
    case "values":
      return definition?.inputs.values?.spec;
    case "param":
      return definition?.inputs.param;
    default:
      return unreachable(channel);
  }
}

/** Spec cheap edits validate against: the plugin's local spec, or the source model's spec. */
interface CommittedInputSpec {
  readonly spec: ValueSpec;
  readonly origin: SpecOrigin;
}

function committedInputSpec(
  track: TrackDefinition,
  channel: ValueChannel,
  contract: CommittedContract | undefined,
  environment: ValueEnvironment,
): CommittedInputSpec {
  const ref = outputRef(track.output);
  switch (ref.kind) {
    case "plugin":
      return pluginInputSpec(track, ref.id, channel, contract, environment);
    case "model":
      return modelInputSpec(track, ref.id, channel, contract, environment);
    default:
      return unreachable(ref);
  }
}

function pluginInputSpec(
  track: TrackDefinition,
  pluginId: string,
  channel: ValueChannel,
  contract: CommittedContract | undefined,
  environment: ValueEnvironment,
): CommittedInputSpec {
  const definition = environment.capabilities.pluginDefinition(pluginId);
  const declared = declaredChannel(definition, channel);
  let spec: ValueSpec | undefined;
  switch (channel) {
    case "values":
      spec = declared ?? contract?.input.spec;
      break;
    case "param":
      spec = declared;
      break;
    default:
      return unreachable(channel);
  }
  if (spec === undefined)
    throw new TypeError(`Track "${track.id}" has no committed ${channel} spec.`);
  return { spec, origin: "plugin" };
}

function modelInputSpec(
  track: TrackDefinition,
  modelId: string,
  channel: ValueChannel,
  contract: CommittedContract | undefined,
  environment: ValueEnvironment,
): CommittedInputSpec {
  switch (channel) {
    case "param":
      throw new TypeError(`Track "${track.id}" has a model output and no params.`);
    case "values":
      break;
    default:
      return unreachable(channel);
  }
  const modelSpec = environment.capabilities.model(modelId)?.spec;
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
  channel: ValueChannel,
): AuthoredShape {
  const values = channelInput(track, channel);
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
  channel: ValueChannel,
  path: string,
  nodeId: string,
  contract: CommittedContract | undefined,
  environment: ValueEnvironment,
): Outcome<ValidatedAuthored, Diagnostic> {
  const parsed = parseTrackDefinition(track, path, planParseContext(environment));
  if (parsed.kind === "refused") {
    return refusedOutcomeFrom(hintDiagnostics(parsed.diagnostics, REPLACE_HINT));
  }
  const values = parsedChannel(parsed.value.input, channel);
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
  const ref = outputRef(track.output);
  switch (ref.kind) {
    case "plugin": {
      const staticStops = staticStopDiagnostics(
        values,
        committed.spec,
        `${nodeId}.input.${channel}`,
      );
      if (staticStops.length > 0)
        return refusedOutcomeFrom(hintDiagnostics(staticStops, REPLACE_HINT));
      break;
    }
    case "model":
      break;
    default:
      return unreachable(ref);
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
  channel: ValueChannel,
  address: CellAddress,
  shape: AuthoredShape,
  spec: ValueSpec | undefined,
  cell: AuthoredCell,
  nodeId: string,
): AddressedValues {
  const values = channelInput(track, channel);
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
  channel: ValueChannel,
  spec: ValueSpec,
  nodeId: string,
): Diagnostic | undefined {
  const before = channelInput(current, channel);
  const after = channelInput(next, channel);
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
  channel: ValueChannel,
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
  channel: ValueChannel,
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
  const refusal = channelRefusal(current.track, "values", current.nodeId, environment);
  if (refusal !== undefined) return refusal;
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
  const refusal = channelRefusal(current.track, "values", current.nodeId, environment);
  if (refusal !== undefined) return refusal;
  return planAuthoredField(
    current,
    "values",
    edit.address,
    edit.cell,
    `values.setField(${edit.nodeId})`,
    environment,
  );
}

function channelRefusal(
  track: TrackDefinition,
  channel: ValueChannel,
  nodeId: string,
  environment: ValueEnvironment,
): ValueOutcome | undefined {
  const ref = outputRef(track.output);
  switch (channel) {
    case "values": {
      switch (ref.kind) {
        case "model":
          return undefined;
        case "plugin":
          return pluginChannelRefusal(ref.id, channel, nodeId, environment);
        default:
          return unreachable(ref);
      }
    }
    case "param": {
      switch (ref.kind) {
        case "model":
          return refused([
            diagnostic(
              "param-not-allowed",
              `${nodeId}.input.param`,
              "A model output has no processor and takes no params.",
            ),
          ]);
        case "plugin":
          return pluginChannelRefusal(ref.id, channel, nodeId, environment);
        default:
          return unreachable(ref);
      }
    }
    default:
      return unreachable(channel);
  }
}

function pluginChannelRefusal(
  pluginId: string,
  channel: ValueChannel,
  nodeId: string,
  environment: ValueEnvironment,
): ValueOutcome | undefined {
  switch (channel) {
    case "values": {
      const definition = environment.capabilities.pluginDefinition(pluginId);
      if (definition === undefined) return undefined;
      if (definition.inputs.values === undefined)
        return refused([
          diagnostic(
            "values-not-allowed",
            `${nodeId}.input.values`,
            `Plugin '${pluginId}' declares no local values.`,
          ),
        ]);
      return undefined;
    }
    case "param": {
      const definition = environment.capabilities.pluginDefinition(pluginId);
      if (definition === undefined) return undefined;
      if (definition.inputs.param === undefined)
        return refused([
          diagnostic(
            "param-not-allowed",
            `${nodeId}.input.param`,
            `Plugin '${pluginId}' declares no params.`,
          ),
        ]);
      return undefined;
    }
    default:
      return unreachable(channel);
  }
}

function planSetParam(
  view: TrackLookup,
  edit: Extract<CheapEdit, { kind: "set-param" }>,
  environment: ValueEnvironment,
): ValueOutcome {
  const current = requiredTrack(view, edit.nodeId);
  const refusal = channelRefusal(current.track, "param", current.nodeId, environment);
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
  const refusal = channelRefusal(current.track, "param", current.nodeId, environment);
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

function liveWriteChannel(
  edit: Extract<LiveEdit, { kind: "write-live" | "write-live-param" }>,
): ValueChannel {
  switch (edit.kind) {
    case "write-live":
      return "values";
    case "write-live-param":
      return "param";
    default:
      return unreachable(edit);
  }
}

function liveReleaseChannel(
  edit: Extract<LiveEdit, { kind: "release-live" | "release-live-param" }>,
): ValueChannel {
  switch (edit.kind) {
    case "release-live":
      return "values";
    case "release-live-param":
      return "param";
    default:
      return unreachable(edit);
  }
}

/** One whole-channel live write, validated against the committed contract, never inferred. Every
 * fault — shape, fields, kinds, row ids, finiteness, reserved names — is `live-values-invalid`. */
function planWriteLive(
  view: TrackLookup,
  edit: Extract<LiveEdit, { kind: "write-live" | "write-live-param" }>,
  environment: ValueEnvironment,
): ValueOutcome {
  const channel = liveWriteChannel(edit);
  const current = requiredTrack(view, edit.nodeId);
  const refusal = channelRefusal(current.track, channel, current.nodeId, environment);
  if (refusal !== undefined) return refusal;
  const committed = committedInputSpec(current.track, channel, current.contract, environment);
  const authoredView = authoredStaticView(channelInput(current.track, channel), committed.spec);
  const expected = authoredView.kind === "absent" ? emptyStaticView(committed.spec) : authoredView;
  const incoming = runtimeStaticView(edit.value, committed.spec);
  if (!sameStaticView(expected, incoming))
    return refused([
      hintDiagnostic(
        diagnostic(
          "live-values-invalid",
          `${edit.nodeId}.input.${channel}`,
          "A live write cannot modify static cells.",
        ),
        REPLACE_HINT,
      ),
    ]);
  const issues = validateRuntimeValue(
    edit.value,
    committed.spec,
    `${edit.nodeId}.input.${channel}`,
    { extraFields: extraFieldsPolicy(committed.spec) },
  );
  if (issues.length > 0)
    return refused(
      issues.map((issue) => diagnostic("live-values-invalid", issue.path, issue.message)),
    );
  const planned: CheapTrack = {
    ...current,
    valueState: withLiveChannel(current.valueState, channel),
  };
  return acceptedOutcome(
    {
      change: {
        kind: "live-values",
        channel,
        track: planned,
        overlay: freezeAuthored(edit.value),
      },
    },
    Object.freeze([]),
  );
}

/** One release: drop the channel's overlay, resume authored evaluation at current progress. */
function planReleaseLive(
  view: TrackLookup,
  edit: Extract<LiveEdit, { kind: "release-live" | "release-live-param" }>,
): ValueOutcome {
  const channel = liveReleaseChannel(edit);
  const current = requiredTrack(view, edit.nodeId);
  if (!liveOn(current.valueState, channel)) return unchanged();
  const planned: CheapTrack = {
    ...current,
    valueState: withoutLiveChannel(current.valueState, channel),
  };
  return acceptedOutcome(
    { change: { kind: "live-values", channel, track: planned, overlay: undefined } },
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
    case "write-live-param":
      return planWriteLive(view, edit, environment);
    case "release-live":
    case "release-live-param":
      return planReleaseLive(view, edit);
    default:
      return unreachable(edit);
  }
}
