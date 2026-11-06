import type { Diagnostic } from "../contract/v5";
import { outputPluginId } from "../contract/v5";
import { diagnostic } from "../contract/diagnostics";
import { isOptionalSlot, slotDeclaration } from "../contract/slot-declaration";
import type { GraphNode } from "./ir";
import type { PluginCapabilities } from "../ports/plugin-capabilities";

/**
 * The graph-layer half of dependency admission.
 *
 * The graph owns references and topology. The registry owns which slots a plugin declares and
 * whether a slot takes one source or a map, which is why the graph asks the narrow capability port
 * rather than importing a registry. A capability source with no identified-table answer is the
 * retired grouped registry, and contributes no diagnostics here.
 */

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function checkNode(
  node: GraphNode,
  capabilities: PluginCapabilities,
  diagnostics: Diagnostic[],
): void {
  const contract = node.contract;
  const pluginId = contract?.plugin ?? outputPluginId(node.track.output);
  const authored = contract?.requires ?? node.track.input?.requires;
  const path = `${node.id}.input.requires`;
  if (pluginId === undefined) return;
  const declared = contract?.slots ?? capabilities.pluginDefinition(pluginId)?.inputs.requires;
  if (declared === undefined) {
    // A registry that answers the identified-table question but does not know this id is the
    // authoritative unknown. A registry with no answer at all is the grouped one, and the parser
    // above already refused the id where it could.
    if (capabilities.pluginDefinition !== undefined)
      diagnostics.push(
        diagnostic(
          "plugin-unknown",
          `${node.id}.output.plugin`,
          `Plugin '${pluginId}' is not admitted.`,
        ),
      );
    return;
  }
  const bindings = isRecord(authored) ? authored : {};
  const slots = new Map(
    Object.entries(declared).map(
      ([slot, requirement]) => [slot, slotDeclaration(requirement)] as const,
    ),
  );
  for (const [slot, spec] of slots) {
    if (isOptionalSlot(spec)) continue;
    if (!Object.hasOwn(bindings, slot))
      diagnostics.push(
        diagnostic(
          "slot-required-missing",
          `${path}.${slot}`,
          `Required slot '${slot}' is not bound.`,
        ),
      );
  }
  for (const [slot, binding] of Object.entries(bindings)) {
    const slotPath = `${path}.${slot}`;
    const spec = slots.get(slot);
    if (spec === undefined) {
      diagnostics.push(
        diagnostic("slot-unknown", slotPath, `Plugin '${pluginId}' declares no slot '${slot}'.`),
      );
      continue;
    }
    const mode = spec.binding ?? "single";
    const authoredMode =
      typeof binding === "string" ? "single" : isRecord(binding) ? "map" : undefined;
    if (authoredMode === undefined) continue;
    if (authoredMode !== mode)
      diagnostics.push(
        diagnostic(
          "slot-binding-mode",
          slotPath,
          `Slot '${slot}' takes a ${mode} binding but was authored as ${authoredMode}.`,
        ),
      );
  }
}

/** Every dependency admission question the graph can answer from the admitted definitions. */
export function checkDependencyBindings(
  nodes: readonly GraphNode[],
  capabilities: PluginCapabilities,
): readonly Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  for (const node of nodes) checkNode(node, capabilities, diagnostics);
  return Object.freeze(diagnostics);
}
