import { diagnostic } from "../contract/diagnostics";
import type { Diagnostic } from "../contract/v5";
import { asPluginName } from "../contract/address";
import { deepFreeze } from "./plugin-admission";
import type { TrackExecutionPlan } from "./execution-plan";
import {
  DerivationUndeclaredSourceError,
  type DerivationContext,
  type DerivationEntryInventoryItem,
  type DerivationHookResult,
  type DerivationTrackInventory,
  type StructuralDescriptor,
} from "../contract/derivation";
import type { PluginDefinition } from "./plugins";

export interface StructuralDerivationOptions {
  readonly order: readonly string[];
  readonly plans: ReadonlyMap<string, TrackExecutionPlan>;
  readonly cycleDiagnostics?: readonly Diagnostic[];
  readonly callCounter?: Map<string, number>;
}

export interface StructuralDerivationOutcome {
  readonly descriptors: ReadonlyMap<string, readonly StructuralDescriptor[]>;
  readonly diagnostics: readonly Diagnostic[];
  readonly kind: "accepted" | "refused";
}

export function buildDerivationInventory(plan: TrackExecutionPlan): DerivationTrackInventory {
  const entries: DerivationEntryInventoryItem[] = [];
  const entriesById = new Map<string, DerivationEntryInventoryItem>();
  const declaredSources = new Set<string>();

  for (const entry of plan.entries) {
    const item: DerivationEntryInventoryItem = {
      entryId: entry.entryId,
      plugin: asPluginName(entry.plugin.name),
      order: entry.order,
      valueKeys: Object.freeze(Object.keys(entry.schema.values)),
      bindings: entry.bindings,
      ...(entry.operations.collect !== undefined
        ? { collect: { output: entry.operations.collect.output } }
        : {}),
      ...(entry.operations.fold !== undefined
        ? { fold: { outputs: entry.operations.fold.outputs } }
        : {}),
    };
    entries.push(item);
    entriesById.set(entry.entryId, item);

    for (const binding of entry.bindings) {
      declaredSources.add(binding.qualifiedSource);
    }
  }

  return deepFreeze({
    ...(plan.trackId !== undefined ? { trackId: plan.trackId } : {}),
    entries: Object.freeze(entries),
    entriesById,
    declaredSources,
  });
}

function normalizeHookResult(
  result: DerivationHookResult,
  trackId: string,
  diagnostics: Diagnostic[],
): readonly StructuralDescriptor[] {
  if (result === undefined) return Object.freeze([]);
  const output: StructuralDescriptor[] = [];

  const addDescriptor = (desc: StructuralDescriptor): void => {
    if (
      typeof desc.capability !== "string" ||
      !desc.capability.trim() ||
      desc.capability.includes(":")
    ) {
      diagnostics.push(
        diagnostic(
          "composition-failure",
          trackId,
          `Structural descriptor on "${trackId}" must declare a non-empty capability token without ':'.`,
          [trackId],
        ),
      );
      return;
    }
    const normalized: StructuralDescriptor = {
      capability: desc.capability,
      source: desc.source || trackId,
      payload: deepFreeze(desc.payload),
      ...(desc.diagnostics !== undefined ? { diagnostics: deepFreeze(desc.diagnostics) } : {}),
    };
    output.push(Object.freeze(normalized));
    if (desc.diagnostics !== undefined) {
      diagnostics.push(...desc.diagnostics);
    }
  };

  if (Array.isArray(result)) {
    for (const item of result) addDescriptor(item);
  } else if ("capability" in result) {
    addDescriptor(result);
  } else if ("descriptors" in result || "diagnostics" in result) {
    if (result.diagnostics !== undefined) {
      diagnostics.push(...result.diagnostics);
    }
    if (result.descriptors !== undefined) {
      for (const item of result.descriptors) addDescriptor(item);
    }
  }

  return Object.freeze(output);
}

export function deriveStructuralDescriptors(
  options: StructuralDerivationOptions,
): StructuralDerivationOutcome {
  const diagnostics: Diagnostic[] = [];

  if (options.cycleDiagnostics !== undefined && options.cycleDiagnostics.length > 0) {
    diagnostics.push(...options.cycleDiagnostics);
    return {
      descriptors: new Map(),
      diagnostics: Object.freeze(diagnostics),
      kind: "refused",
    };
  }

  const order = [...options.order];
  for (const trackId of options.plans.keys()) {
    if (!order.includes(trackId)) {
      order.push(trackId);
    }
  }

  const descriptorsByTrack = new Map<string, readonly StructuralDescriptor[]>();

  for (const trackId of order) {
    const plan = options.plans.get(trackId);
    if (plan === undefined) continue;

    const inventory = buildDerivationInventory(plan);
    const trackDescriptors: StructuralDescriptor[] = [];

    // Validate capability requirements on slots for all entries on this track
    for (const entry of plan.entries) {
      if (entry.plugin.requirements !== undefined) {
        for (const binding of entry.bindings) {
          const reqDef = entry.plugin.requirements[binding.slot];
          if (reqDef?.capability !== undefined) {
            const cap = reqDef.capability;
            const sourceDescs = descriptorsByTrack.get(binding.qualifiedSource) ?? [];
            const matches = sourceDescs.filter((d) => d.capability === cap);
            if (matches.length === 0) {
              diagnostics.push(
                diagnostic(
                  "derivation-missing-capability",
                  `${trackId}.${entry.entryId}.${binding.slot}`,
                  `Bound source "${binding.qualifiedSource}" lacks required capability "${cap}".`,
                  [binding.qualifiedSource, cap],
                ),
              );
            } else if (matches.length > 1) {
              diagnostics.push(
                diagnostic(
                  "derivation-ambiguous-capability",
                  `${trackId}.${entry.entryId}.${binding.slot}`,
                  `Bound source "${binding.qualifiedSource}" has ambiguous capability "${cap}".`,
                  [binding.qualifiedSource, cap],
                ),
              );
            }
          }
        }
      }
    }

    // Find plugins that own entries on this track and provide a derivation hook
    const pluginsWithDerive = new Map<string, PluginDefinition>();
    for (const entry of plan.entries) {
      if (entry.plugin.derive !== undefined) {
        pluginsWithDerive.set(entry.plugin.name, entry.plugin);
      }
    }

    for (const plugin of pluginsWithDerive.values()) {
      const participatingEntries = inventory.entries.filter((e) => e.plugin === plugin.name);

      const readDescriptor = (sourceId: string, capability?: string): StructuralDescriptor => {
        if (!inventory.declaredSources.has(sourceId)) {
          const diag = diagnostic(
            "derivation-undeclared-source",
            `${trackId}.${plugin.name}`,
            `Plugin "${plugin.name}" on track "${trackId}" attempted to read undeclared source "${sourceId}".`,
            [sourceId, trackId],
          );
          diagnostics.push(diag);
          throw new DerivationUndeclaredSourceError(sourceId, trackId);
        }

        const sourceDescriptors = descriptorsByTrack.get(sourceId) ?? [];

        if (capability !== undefined) {
          const matching = sourceDescriptors.filter((d) => d.capability === capability);
          if (matching.length === 0) {
            const diag = diagnostic(
              "derivation-missing-capability",
              `${trackId}.${plugin.name}`,
              `Source "${sourceId}" does not provide required capability "${capability}".`,
              [sourceId, capability],
            );
            diagnostics.push(diag);
            throw new Error(`Missing capability "${capability}" from "${sourceId}".`);
          }
          if (matching.length > 1) {
            const diag = diagnostic(
              "derivation-ambiguous-capability",
              `${trackId}.${plugin.name}`,
              `Source "${sourceId}" provides ambiguous capability "${capability}".`,
              [sourceId, capability],
            );
            diagnostics.push(diag);
            throw new Error(`Ambiguous capability "${capability}" from "${sourceId}".`);
          }
          return matching[0]!;
        }

        if (sourceDescriptors.length === 0) {
          const diag = diagnostic(
            "derivation-missing-capability",
            `${trackId}.${plugin.name}`,
            `Source "${sourceId}" provides no structural capabilities.`,
            [sourceId],
          );
          diagnostics.push(diag);
          throw new Error(`No capabilities provided by "${sourceId}".`);
        }
        if (sourceDescriptors.length > 1) {
          const diag = diagnostic(
            "derivation-ambiguous-capability",
            `${trackId}.${plugin.name}`,
            `Source "${sourceId}" provides multiple descriptors and no capability was specified.`,
            [sourceId],
          );
          diagnostics.push(diag);
          throw new Error(`Ambiguous descriptors from "${sourceId}".`);
        }
        return sourceDescriptors[0]!;
      };

      const tryReadDescriptor = (
        sourceId: string,
        capability?: string,
      ): StructuralDescriptor | undefined => {
        try {
          return readDescriptor(sourceId, capability);
        } catch {
          return undefined;
        }
      };

      const context: DerivationContext = Object.freeze({
        trackId,
        participatingEntries: Object.freeze(participatingEntries),
        inventory,
        readDescriptor,
        tryReadDescriptor,
      });

      // Record derivation invocation count
      if (options.callCounter !== undefined) {
        const key = `${trackId}:${plugin.name}`;
        options.callCounter.set(key, (options.callCounter.get(key) ?? 0) + 1);
      }

      try {
        const result = plugin.derive!(context);
        const normalized = normalizeHookResult(result, trackId, diagnostics);
        trackDescriptors.push(...normalized);
      } catch (error) {
        if (error instanceof DerivationUndeclaredSourceError) {
          // Already recorded diagnostic
        } else if (
          error instanceof Error &&
          (error.message.includes("Missing capability") ||
            error.message.includes("Ambiguous capability"))
        ) {
          // Already recorded diagnostic
        } else {
          diagnostics.push(
            diagnostic(
              "derivation-failure",
              `${trackId}.${plugin.name}`,
              error instanceof Error ? error.message : "Derivation failed.",
              [trackId, plugin.name],
            ),
          );
        }
      }
    }

    descriptorsByTrack.set(trackId, Object.freeze(trackDescriptors));
  }

  const hasErrors = diagnostics.some((d) => d.severity === "error");

  return {
    descriptors: descriptorsByTrack,
    diagnostics: Object.freeze(diagnostics),
    kind: hasErrors ? "refused" : "accepted",
  };
}
