import type {
  Model,
  SlotSpec,
  TrackDefinition,
  PluginDefinition,
  SourceBinding,
} from "../contract/v5";
import { isModel, outputModelId, outputPluginId } from "../contract/v5";
import { slotDeclaration } from "../contract/slot-declaration";
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
  definition: PluginDefinition,
): CommittedContract {
  const outputs: Record<string, SourceContract> = {};
  for (const [name, output] of Object.entries(definition.outputs)) {
    if (isModel(output)) {
      outputs[name] = freeze({ spec: output.spec, modelId: output.id, proven: true });
    } else {
      outputs[name] = freeze({ spec: output, proven: true });
    }
  }
  const slots: Record<string, SlotSpec> = {};
  for (const [slot, spec] of Object.entries(definition.inputs.requires ?? {})) {
    slots[slot] = slotDeclaration(spec);
  }
  return freeze({
    plugin,
    input: freeze({
      spec: isModel(definition.inputs.values)
        ? definition.inputs.values.spec
        : (definition.inputs.values ?? EMPTY_RECORD_SPEC),
      proven: true,
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
  const pluginId = outputPluginId(track.output);
  if (pluginId !== undefined) {
    const definition = capabilities.pluginDefinition(pluginId);
    return definition === undefined ? undefined : pluginContract(track, pluginId, definition);
  }
  const modelId = outputModelId(track.output);
  if (modelId === undefined) return undefined;
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
