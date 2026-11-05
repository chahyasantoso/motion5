import type {
  Model,
  OptionalModel,
  SlotSpec,
  TrackDefinition,
  PluginDefinition,
  SourceBinding,
} from "../contract/v5";
import { isModel, isOptionalModel } from "../contract/v5";
import { GENERIC_DATA_TYPE_ID } from "../contract/generic-data";
import { deriveSourceContract, type SourceContract } from "../contract/v5-infer";
import { parseTrackDefinition } from "../contract/v5-parse";
import type { PluginCapabilities } from "../ports/plugin-capabilities";

/** Committed shape of a node at its last structural commit; slot and dependency checks read it because cheap edits move values without re-inferring. */
export interface CommittedContract {
  readonly typeId?: string;
  readonly plugin?: string;
  readonly input: SourceContract;
  readonly outputs: Readonly<Record<string, SourceContract>>;
  readonly requires: Readonly<Record<string, SourceBinding>>;
  readonly slots: Readonly<Record<string, SlotSpec>>;
}

const NO_SLOTS: Readonly<Record<string, SlotSpec>> = Object.freeze({});

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
    if (isModel(spec)) {
      slots[slot] = freeze({ kind: "model", model: spec, binding: "single" });
    } else if (isOptionalModel(spec)) {
      slots[slot] = freeze({
        kind: "model",
        model: spec.model,
        optional: true,
        binding: spec.binding ?? "single",
      });
    } else {
      slots[slot] = spec;
    }
  }
  return freeze({
    plugin,
    input: freeze({ spec: definition.inputs.values, proven: true }),
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
  const plugin = track.plugin;
  if (plugin !== undefined) {
    const definition = capabilities.pluginDefinition?.(plugin);
    return definition === undefined ? undefined : pluginContract(track, plugin, definition);
  }
  const parsed = parseTrackDefinition(track, nodeId);
  if (parsed.kind === "refused") return undefined;
  const declared =
    parsed.value.type === undefined
      ? parsed.value.input.schema
      : capabilities.dataType?.(parsed.value.type)?.spec;
  const input = deriveSourceContract(
    parsed.value.input.values,
    declared,
    `${nodeId}.input.values`,
    "declared",
  );
  if (input.kind === "refused") return undefined;
  return freeze({
    typeId: parsed.value.type ?? GENERIC_DATA_TYPE_ID,
    input: input.value,
    outputs: freeze({ values: input.value }),
    requires: freeze({ ...parsed.value.input.requires }),
    slots: NO_SLOTS,
  });
}
