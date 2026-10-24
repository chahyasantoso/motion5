// Docs: ./dependency-edges.md
import type { Diagnostic, GroupedTrackDefinition, PluginRequiresBinding } from "../contract/v5";
import { diagnostic } from "../contract/diagnostics";
import { acceptedOutcome, readOutcome, refusedOutcome, type Outcome } from "../lang/outcome";
import { qualifyFreeTrack, qualifyMotionTrack } from "./ids";
import type { EdgeRequirement, GraphEdge } from "./ir";

export type ResolvedEdge = Outcome<GraphEdge, Diagnostic>;

export function qualifySource(source: string, motionId: string): string {
  if (source.startsWith("~/")) return qualifyFreeTrack(source.slice(2)).value;
  if (source.includes("/"))
    return qualifyMotionTrack(
      source.slice(0, source.indexOf("/")),
      source.slice(source.indexOf("/") + 1),
    ).value;
  return qualifyMotionTrack(motionId, source).value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function resolveRequirementEdge(
  binding: PluginRequiresBinding,
  observerNodeId: string,
  ownerId: string,
  path: string,
): ResolvedEdge {
  let sourceId: string;
  try {
    sourceId = qualifySource(binding.source, ownerId);
  } catch (error) {
    const message = String(error instanceof Error ? error.message : error);
    return refusedOutcome<GraphEdge, Diagnostic>([
      diagnostic("requirement-source", path, message, [binding.source]),
    ]);
  }
  // The member key is copied when the binding carries one and omitted when it does not, rather than
  // written as an explicit `undefined`. An absent field and a field holding `undefined` encode the
  // same identity, but only the first says "this slot takes one source" to a reader of the IR.
  const requirement: EdgeRequirement = Object.freeze({
    plugin: binding.plugin,
    slot: binding.slot,
    ...(binding.memberKey === undefined ? {} : { memberKey: binding.memberKey }),
  });
  const edge: GraphEdge = Object.freeze({
    observerId: observerNodeId,
    sourceId,
    role: "input",
    requirement,
  });
  return acceptedOutcome<GraphEdge, Diagnostic>(edge, Object.freeze([]));
}

/**
 * Adds the edges one identified-table plugin track authors under `input.requires`.
 *
 * The parser has already proved the binding shape when this runs from `validateV5`; the guards stay
 * because graph construction is callable directly and a malformed binding must be refused rather
 * than silently producing no dependency. A no-plugin track contributes no demand and therefore no
 * edges here.
 */
export function collectDependencyEdges(
  track: GroupedTrackDefinition,
  observerId: string,
  ownerId: string,
  edges: GraphEdge[],
  diagnostics: Diagnostic[],
): void {
  const plugin = track.plugin;
  const requires = track.input?.requires;
  if (plugin === undefined || requires === undefined) return;
  if (!isRecord(requires)) {
    diagnostics.push(
      diagnostic(
        "requirement-source",
        `${observerId}.input.requires`,
        "Track requires must be an object of slot bindings.",
        [observerId],
      ),
    );
    return;
  }
  for (const [slot, binding] of Object.entries(requires)) {
    const slotPath = `${observerId}.input.requires.${slot}`;
    if (slot.length === 0 || slot.includes(":") || /[[\]]/.test(slot)) {
      diagnostics.push(
        diagnostic(
          "requirement-source",
          slotPath,
          "A dependency slot must be non-empty and must not contain ':', '[' or ']'.",
          [slot],
        ),
      );
      continue;
    }
    if (typeof binding === "string") {
      addDependencyEdge(
        { plugin, slot, source: binding, authoredPath: slot },
        observerId,
        ownerId,
        slotPath,
        edges,
        diagnostics,
      );
      continue;
    }
    if (!isRecord(binding)) {
      diagnostics.push(
        diagnostic(
          "requirement-source",
          slotPath,
          "A slot binding must name one source or a map of member keys to sources.",
          [slot],
        ),
      );
      continue;
    }
    for (const [memberKey, source] of Object.entries(binding)) {
      const memberPath = `${slotPath}.${memberKey}`;
      if (memberKey.length === 0 || memberKey.includes(":") || /[[\]]/.test(memberKey)) {
        diagnostics.push(
          diagnostic(
            "requirement-source",
            memberPath,
            "A map member key must be non-empty and must not contain ':', '[' or ']'.",
            [memberKey],
          ),
        );
        continue;
      }
      if (typeof source !== "string" || source.length === 0) {
        diagnostics.push(
          diagnostic(
            "requirement-source",
            memberPath,
            "A map binding must name a non-empty source id for each member.",
            [memberKey],
          ),
        );
        continue;
      }
      addDependencyEdge(
        { plugin, slot, source, memberKey, authoredPath: `${slot}.${memberKey}` },
        observerId,
        ownerId,
        memberPath,
        edges,
        diagnostics,
      );
    }
  }
}

function addDependencyEdge(
  binding: PluginRequiresBinding,
  observerId: string,
  ownerId: string,
  path: string,
  edges: GraphEdge[],
  diagnostics: Diagnostic[],
): void {
  const resolved = resolveRequirementEdge(binding, observerId, ownerId, path);
  readOutcome(
    resolved,
    (edge) => edges.push(edge),
    (resolvedDiagnostics) => diagnostics.push(...resolvedDiagnostics),
  );
}
