import type { Diagnostic } from "../contract/v5";
import { outputPluginId } from "../contract/v5";
import { diagnostic } from "../contract/diagnostics";
import { isOptionalSlot } from "../contract/slot-declaration";
import type { GraphNode } from "./node";
import type { PluginCapabilities } from "../ports/plugin-capabilities";
import { isObjectRecord } from "../lang/plain-record";

/** Graph-layer dependency admission: the plugin declares slots, and bindings are checked against them. */

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
    diagnostics.push(
      diagnostic(
        "plugin-unknown",
        `${node.id}.output.plugin`,
        `Plugin '${pluginId}' is not admitted.`,
      ),
    );
    return;
  }
  const bindings = isObjectRecord(authored) ? authored : {};
  const slots = new Map(Object.entries(declared));
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
      typeof binding === "string" ? "single" : isObjectRecord(binding) ? "map" : undefined;
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
