import type {
  DependencySpec,
  TrackDefinition,
  PluginDefinition,
  SourceBinding,
} from "../contract/v5";
import { deriveSourceContract, type SourceContract } from "../contract/v5-infer";
import { parseTrackDefinition } from "../contract/v5-parse";
import type { PluginCapabilities } from "../ports/plugin-capabilities";

/** Committed shape of a node at its last structural commit; slot and dependency checks read it because cheap edits move values without re-inferring. */
export interface CommittedContract {
  readonly plugin?: string;
  readonly input: SourceContract;
  readonly outputs: Readonly<Record<string, SourceContract>>;
  readonly requires: Readonly<Record<string, SourceBinding>>;
  readonly slots: Readonly<Record<string, DependencySpec>>;
}

const NO_SLOTS: Readonly<Record<string, DependencySpec>> = Object.freeze({});

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
  for (const [name, spec] of Object.entries(definition.outputs))
    outputs[name] = freeze({ spec, proven: true });
  return freeze({
    plugin,
    input: freeze({ spec: definition.inputs.values, proven: true }),
    outputs: freeze(outputs),
    requires: freeze({ ...track.input?.requires }),
    slots: freeze({ ...definition.inputs.requires }),
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
  const input = deriveSourceContract(
    parsed.value.input.values,
    parsed.value.input.schema,
    `${nodeId}.input.values`,
    "declared",
  );
  if (input.kind === "refused") return undefined;
  return freeze({
    input: input.value,
    outputs: freeze({ values: input.value }),
    requires: freeze({ ...parsed.value.input.requires }),
    slots: NO_SLOTS,
  });
}
