import { diagnostic } from "../contract/diagnostics";
import type { Diagnostic } from "../contract/v5";
import { asPluginName } from "../contract/address";
import { deepFreeze } from "./plugin-admission";
import type { CompiledEntryPlan, TrackExecutionPlan } from "./execution-plan";
import {
  CapabilityReadError,
  type DerivationEntryInventoryItem,
  type DerivationTrackInventory,
  type DeriveResult,
  type ErasedDeriveResult,
  type RequirementContext,
  type StructuralDescriptor,
} from "../contract/derivation";
import { isCapabilityToken } from "../contract/capability";
import { unreachable } from "../lang/exhaustive";
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

type Settlement = "settled" | "refused";

const toErased = (result: DeriveResult): ErasedDeriveResult => result;
const readKey = (source: string, capability: string): string => `${source}\u0000${capability}`;
const isError = (d: Diagnostic): boolean => d.severity === "error";

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
      ...(entry.operations.collect === true ? { collect: true as const } : {}),
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

function derivationOrder(options: StructuralDerivationOptions): readonly string[] {
  const order = [...options.order];
  for (const trackId of options.plans.keys()) {
    if (!order.includes(trackId)) {
      order.push(trackId);
    }
  }
  return order;
}

function groupEntriesByPlugin(plan: TrackExecutionPlan): ReadonlyMap<string, CompiledEntryPlan[]> {
  const groups = new Map<string, CompiledEntryPlan[]>();
  for (const entry of plan.entries) {
    const list = groups.get(entry.plugin.name);
    if (list === undefined) {
      groups.set(entry.plugin.name, [entry]);
    } else {
      list.push(entry);
    }
  }
  return groups;
}

function findMissingCapabilities(
  trackId: string,
  plugin: PluginDefinition,
  entries: readonly CompiledEntryPlan[],
  store: ReadonlyMap<string, readonly StructuralDescriptor[]>,
): readonly Diagnostic[] {
  const diags: Diagnostic[] = [];
  if (plugin.requirements === undefined) return diags;
  for (const entry of entries) {
    for (const binding of entry.bindings) {
      const reqDef = plugin.requirements[binding.slot];
      if (reqDef?.capability !== undefined) {
        const cap = reqDef.capability;
        const sourceDescs = store.get(binding.qualifiedSource) ?? [];
        const matches = sourceDescs.filter((d) => d.capability === cap);
        if (matches.length === 0) {
          diags.push(
            diagnostic(
              "derivation-missing-capability",
              `${trackId}.${entry.entryId}.${binding.slot}`,
              `Bound source "${binding.qualifiedSource}" lacks required capability "${cap}".`,
              [binding.qualifiedSource, cap],
            ),
          );
        }
      }
    }
  }
  return diags;
}

function readableCapabilities(
  plugin: PluginDefinition,
  entries: readonly CompiledEntryPlan[],
): ReadonlySet<string> {
  const readable = new Set<string>();
  if (plugin.requirements === undefined) return readable;
  for (const entry of entries) {
    for (const binding of entry.bindings) {
      const reqDef = plugin.requirements[binding.slot];
      if (reqDef?.capability !== undefined) {
        readable.add(readKey(binding.qualifiedSource, reqDef.capability));
      }
    }
  }
  return readable;
}

function createRequirementContext(
  trackId: string,
  entries: readonly DerivationEntryInventoryItem[],
  readable: ReadonlySet<string>,
  store: ReadonlyMap<string, readonly StructuralDescriptor[]>,
): RequirementContext {
  const read = (capability: string, source: string): unknown => {
    if (!readable.has(readKey(source, capability))) {
      throw new CapabilityReadError(trackId, source, capability);
    }
    const found = store.get(source)?.find((d) => d.capability === capability);
    if (found === undefined) throw new CapabilityReadError(trackId, source, capability);
    return found.payload;
  };
  return Object.freeze({ trackId, entries, read }) as unknown as RequirementContext;
}

function runHook<T>(
  trackId: string,
  pluginName: string,
  diagnostics: Diagnostic[],
  fn: () => T,
): T | undefined {
  try {
    return fn();
  } catch (error) {
    if (error instanceof CapabilityReadError) {
      diagnostics.push(
        diagnostic(
          "derivation-undeclared-source",
          `${trackId}.${pluginName}`,
          `Plugin "${pluginName}" on track "${trackId}" attempted to read undeclared source "${error.source}".`,
          [error.source, trackId],
        ),
      );
    } else {
      diagnostics.push(
        diagnostic(
          "derivation-failure",
          `${trackId}.${pluginName}`,
          error instanceof Error ? error.message : "Derivation failed.",
          [trackId, pluginName],
        ),
      );
    }
    return undefined;
  }
}

function runValidate(
  validate: (ctx: RequirementContext) => readonly Diagnostic[],
  context: RequirementContext,
  pluginName: string,
  diagnostics: Diagnostic[],
): boolean {
  const found = runHook(context.trackId, pluginName, diagnostics, () => validate(context));
  if (found === undefined) return false;
  diagnostics.push(...found);
  return !found.some(isError);
}

function settleDeriveResult(
  result: ErasedDeriveResult,
  trackId: string,
  pluginName: string,
  produced: StructuralDescriptor[],
  diagnostics: Diagnostic[],
): Settlement {
  switch (result.status) {
    case "none":
      return "settled";
    case "refused":
      if (result.diagnostics.length === 0) {
        diagnostics.push(
          diagnostic(
            "derivation-failure",
            `${trackId}.${pluginName}`,
            `Plugin "${pluginName}" refused without a diagnostic.`,
            [trackId, pluginName],
          ),
        );
      }
      diagnostics.push(...result.diagnostics);
      return "refused";
    case "derived": {
      if (!isCapabilityToken(result.capability)) {
        throw new TypeError(`Plugin "${pluginName}" derived an invalid capability token.`);
      }
      if (produced.some((d) => d.capability === result.capability)) {
        diagnostics.push(
          diagnostic(
            "derivation-ambiguous-capability",
            `${trackId}`,
            `Track "${trackId}" has ambiguous capability "${result.capability}".`,
            [trackId, result.capability],
          ),
        );
        return "refused";
      }
      produced.push(
        Object.freeze({
          capability: result.capability,
          source: trackId,
          payload: deepFreeze(result.payload),
        }),
      );
      return "settled";
    }
    default:
      return unreachable(result);
  }
}

function countDerivation(
  counter: Map<string, number> | undefined,
  trackId: string,
  pluginName: string,
): void {
  if (counter === undefined) return;
  const key = `${trackId}:${pluginName}`;
  counter.set(key, (counter.get(key) ?? 0) + 1);
}

export function deriveStructuralDescriptors(
  options: StructuralDerivationOptions,
): StructuralDerivationOutcome {
  if (options.cycleDiagnostics !== undefined && options.cycleDiagnostics.length > 0) {
    return {
      descriptors: new Map(),
      diagnostics: Object.freeze([...options.cycleDiagnostics]),
      kind: "refused",
    };
  }
  const store = new Map<string, readonly StructuralDescriptor[]>();
  const diagnostics: Diagnostic[] = [];
  let pluginRefused = false;

  for (const trackId of derivationOrder(options)) {
    const plan = options.plans.get(trackId);
    if (plan === undefined) continue;
    const inventory = buildDerivationInventory(plan);
    const produced: StructuralDescriptor[] = [];
    for (const [pluginName, entries] of groupEntriesByPlugin(plan)) {
      const plugin = entries[0]!.plugin;
      const missing = findMissingCapabilities(trackId, plugin, entries, store);
      diagnostics.push(...missing);
      if (missing.length > 0) continue;
      if (plugin.validate === undefined && plugin.derive === undefined) continue;
      const context = createRequirementContext(
        trackId,
        inventory.entries.filter((item) => item.plugin === pluginName),
        readableCapabilities(plugin, entries),
        store,
      );
      if (plugin.validate !== undefined) {
        if (!runValidate(plugin.validate, context, pluginName, diagnostics)) continue;
      }
      if (plugin.derive === undefined) continue;
      countDerivation(options.callCounter, trackId, pluginName);
      const derive = plugin.derive;
      const settlement = runHook(trackId, pluginName, diagnostics, () =>
        settleDeriveResult(
          toErased(derive(Object.freeze({ ...context, inventory }))),
          trackId,
          pluginName,
          produced,
          diagnostics,
        ),
      );
      if (settlement !== "settled") pluginRefused = true;
    }
    store.set(trackId, Object.freeze(produced));
  }

  return {
    descriptors: store,
    diagnostics: Object.freeze(diagnostics),
    kind: pluginRefused || diagnostics.some(isError) ? "refused" : "accepted",
  };
}
