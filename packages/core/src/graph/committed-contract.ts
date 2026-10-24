import type {
  DependencySpec,
  GroupedTrackDefinition,
  PluginDefinition,
  SourceBinding,
} from "../contract/v5";
import { deriveSourceContract, type SourceContract } from "../contract/v5-infer";
import { parseTrackDefinition } from "../contract/v5-parse";
import type { PluginCapabilities } from "../ports/plugin-capabilities";

/**
 * What a node committed to at its last structural commit, independent of its authored values now.
 *
 * The distinction matters because cheap edits move `input.values` without re-inferring: after
 * `values.set([])` on an inferred table source the authored snapshot observes nothing, and a graph
 * rebuilt from that snapshot alone would call the source unproven and refuse every typed consumer
 * of it. Slot checks therefore read this contract rather than re-deriving one from the current
 * values. `replace-track`, `replace-input` and a plugin change recompute it; bind and unbind
 * recompute only `requires`; every other edit carries all of it unchanged.
 *
 * `input` is the local input contract the node owns (the declared schema or the inferred one for a
 * no-plugin track, the plugin's declared local values for a plugin track). `outputs` is what
 * consumers can read, and for a no-plugin source it is exactly `{ values: input }`. `requires` and
 * `slots` are the authored bindings and the plugin's declared slots, kept here so dependency
 * admission reads the committed shape rather than the authored track.
 */
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

/**
 * The same contract with its authored bindings replaced.
 *
 * A binding edit moves `input.requires` and nothing else, so the local input, the published outputs
 * and the declared slots are carried by identity. Re-deriving the whole contract here would read the
 * authored values a cheap edit may have emptied and would turn a binding edit into the one operation
 * this contract exists to prevent. See ADR-062.
 */
export function withRequires(
  contract: CommittedContract,
  requires: Readonly<Record<string, SourceBinding>>,
): CommittedContract {
  return freeze({ ...contract, requires: freeze({ ...requires }) });
}

function pluginContract(
  track: GroupedTrackDefinition,
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

/**
 * The committed contract one track derives, or `undefined` when the graph cannot answer.
 *
 * A plugin id the catalog does not admit has no declared values, outputs or slots, so it has no
 * contract; dependency admission names the unknown plugin and slot checks stay unjudged for it. A
 * no-plugin track that the parser refuses has no usable authored input either, and the schema layer
 * has already reported why.
 */
export function deriveCommittedContract(
  track: GroupedTrackDefinition,
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
  );
  if (input.kind === "refused") return undefined;
  return freeze({
    input: input.value,
    outputs: freeze({ values: input.value }),
    requires: freeze({ ...parsed.value.input.requires }),
    slots: NO_SLOTS,
  });
}
