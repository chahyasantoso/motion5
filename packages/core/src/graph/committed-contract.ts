import type {
  AdmittedPlugin,
  Model,
  SlotSpec,
  TrackDefinition,
  SourceBinding,
} from "../contract/v5";
import { outputRef } from "../contract/v5";
import { unreachable } from "../lang/exhaustive";
import { deriveSourceContract, type SourceContract } from "../contract/v5-infer";
import { parseTrackDefinition } from "../contract/v5-parse";
import type { PluginCapabilities } from "../ports/plugin-capabilities";

/** Committed shape of a node at its last structural commit; slot and dependency checks read it because cheap edits move values without re-inferring. */
export interface CommittedContract {
  readonly modelId?: string;
  readonly plugin?: string;
  readonly input: SourceContract;
  readonly outputs: Readonly<Record<string, SourceContract>>;
  readonly requires: Readonly<Record<string, SourceBinding>>;
  readonly slots: Readonly<Record<string, SlotSpec>>;
}

const NO_SLOTS: Readonly<Record<string, SlotSpec>> = Object.freeze({});
const EMPTY_RECORD_SPEC = freeze({ kind: "record" as const, fields: freeze({}) });

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

/** Contract with authored bindings replaced; input, outputs and slots carried by identity, never re-derived. */
export function withRequires(
  contract: CommittedContract,
  requires: Readonly<Record<string, SourceBinding>>,
): CommittedContract {
  return freeze({ ...contract, requires: freeze({ ...requires }) });
}

function pluginContract(
  track: TrackDefinition,
  plugin: string,
  definition: AdmittedPlugin,
): CommittedContract {
  const outputs: Record<string, SourceContract> = {};
  for (const [name, output] of Object.entries(definition.outputs)) {
    switch (output.kind) {
      case "model":
        outputs[name] = freeze({ spec: output.model.spec, modelId: output.model.id, proven: true });
        break;
      case "spec":
        outputs[name] = freeze({ spec: output.spec, proven: true });
        break;
      default:
        return unreachable(output);
    }
  }
  const slots: Record<string, SlotSpec> = { ...definition.inputs.requires };
  const values = definition.inputs.values;
  return freeze({
    plugin,
    input: freeze({
      spec: values?.spec ?? EMPTY_RECORD_SPEC,
      proven: values !== undefined,
    }),
    outputs: freeze(outputs),
    requires: freeze({ ...track.input?.requires }),
    slots: freeze(slots),
  });
}

/** Contract one track derives; undefined when the catalog does not admit the plugin or no input contract can be derived. */
export function deriveCommittedContract(
  track: TrackDefinition,
  nodeId: string,
  capabilities: PluginCapabilities,
): CommittedContract | undefined {
  const ref = outputRef(track.output);
  switch (ref.kind) {
    case "plugin": {
      const definition = capabilities.pluginDefinition(ref.id);
      return definition === undefined ? undefined : pluginContract(track, ref.id, definition);
    }
    case "model":
      return modelContract(track, nodeId, ref.id, capabilities);
    default:
      return unreachable(ref);
  }
}

function modelContract(
  track: TrackDefinition,
  nodeId: string,
  modelId: string,
  capabilities: PluginCapabilities,
): CommittedContract | undefined {
  const parsed = parseTrackDefinition(track, nodeId, {
    isPluginRegistered: (pluginId) => capabilities.isPluginAdmitted(pluginId),
    pluginDefinition: (pluginId) => capabilities.pluginDefinition(pluginId),
    model: (modelId) => capabilities.model(modelId),
    modelIds: () => capabilities.modelIds(),
    pluginIds: () => capabilities.pluginIds(),
  });
  if (parsed.kind === "refused") return undefined;
  const model = capabilities.model(modelId);
  const input = deriveSourceContract(
    parsed.value.input.values,
    model?.spec,
    `${nodeId}.input.values`,
    "model",
  );
  if (input.kind === "refused") return undefined;
  const sourceContract =
    model !== undefined ? freeze({ ...input.value, modelId: model.id }) : input.value;
  return freeze({
    ...(model === undefined ? {} : { modelId: model.id }),
    input: sourceContract,
    outputs: freeze({ values: sourceContract }),
    requires: freeze({ ...parsed.value.input.requires }),
    slots: NO_SLOTS,
  });
}
