import { type AuthoredEntryId, type GenerationToken } from "../contract/address";
import {
  authoredLeafPartition,
  liveWriteChannel,
  readAuthoredLeaf,
  type AuthoredLeafPartition,
} from "../contract/authored-leaf";
import type { AuthoredProperty, AuthoredStaticValue, PatchBatch } from "../contract/v5";
import {
  StaleTrackHandleError,
  type AuthoredValues,
  type EntryAuthoredValues,
  type EntryLiveHandle,
  type EntryLiveValues,
  type LiveValues,
} from "../contract/track-handle";
import type { CompiledEntryPlan, TrackExecutionPlan } from "./execution-plan";
import { LiveValueKeyError } from "./track";
import { unreachable } from "../lang/exhaustive";

export type { EntryLiveHandle };

const STRUCTURAL_FIELD_NAMES: ReadonlySet<string> = new Set([
  "id",
  "entryId",
  "order",
  "index",
  "plugin",
  "requires",
]);

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function validateValueBatch(
  plan: TrackExecutionPlan,
  nodeId: string,
  values: unknown,
  expectedGeneration?: GenerationToken | number,
): AuthoredValues {
  if (expectedGeneration !== undefined && plan.generation !== undefined) {
    if (String(plan.generation) !== String(expectedGeneration)) {
      throw new StaleTrackHandleError(nodeId);
    }
  }

  if (!isPlainRecord(values)) {
    throw new LiveValueKeyError(nodeId, "", "unknown");
  }

  const validated: Record<string, EntryAuthoredValues> = {};

  for (const [entryId, entryWrites] of Object.entries(values)) {
    if (entryId.includes("::") || entryId.includes("/") || !plan.entriesById.has(entryId)) {
      throw new LiveValueKeyError(nodeId, entryId, "unknown");
    }

    const entryPlan = plan.entriesById.get(entryId)!;

    if (
      expectedGeneration !== undefined &&
      entryPlan.lifecycle.generation !== undefined &&
      String(entryPlan.lifecycle.generation) !== String(expectedGeneration)
    ) {
      throw new StaleTrackHandleError(nodeId);
    }

    if (!isPlainRecord(entryWrites)) {
      throw new LiveValueKeyError(nodeId, entryId, "unknown");
    }

    const validatedLeaves: Record<string, AuthoredProperty> = {};

    for (const [leaf, property] of Object.entries(entryWrites)) {
      if (STRUCTURAL_FIELD_NAMES.has(leaf)) {
        throw new LiveValueKeyError(nodeId, leaf, "unknown");
      }

      if (entryPlan.bindings.some((b) => b.memberKey === leaf)) {
        throw new LiveValueKeyError(nodeId, leaf, "unknown");
      }

      if (
        entryPlan.contribution?.keyframes &&
        Object.hasOwn(entryPlan.contribution.keyframes, leaf)
      ) {
        throw new LiveValueKeyError(nodeId, leaf, "prepared");
      }

      if (!Object.hasOwn(entryPlan.schema.values, leaf)) {
        throw new LiveValueKeyError(nodeId, leaf, "unknown");
      }

      const authoredProperty = entryPlan.schema.values[leaf]!;
      const authoredChannel = liveWriteChannel(readAuthoredLeaf(authoredProperty));
      const incomingPartition = authoredLeafPartition(
        readAuthoredLeaf(property as AuthoredProperty),
      );
      const incomingChannel = liveWriteChannel(readAuthoredLeaf(property as AuthoredProperty));

      if (authoredChannel !== incomingChannel) {
        throw new LiveValueKeyError(nodeId, leaf, "kind");
      }

      switch (incomingPartition.kind) {
        case "value": {
          const val = incomingPartition.value;
          if (typeof val === "number" && !Number.isFinite(val)) {
            throw new LiveValueKeyError(nodeId, leaf, "kind");
          }
          validatedLeaves[leaf] = property as AuthoredProperty;
          break;
        }
        case "stops":
        case "none": {
          validatedLeaves[leaf] = property as AuthoredProperty;
          break;
        }
        default:
          return unreachable(incomingPartition);
      }
    }

    validated[entryId] = Object.freeze(validatedLeaves);
  }

  return Object.freeze(validated);
}

export function splitValidatedValueBatch(values: AuthoredValues): {
  readonly statics: LiveValues;
  readonly animated: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
} {
  const statics: Record<string, Record<string, AuthoredStaticValue>> = {};
  const animated: Record<string, Record<string, unknown>> = {};

  for (const [entryId, entryWrites] of Object.entries(values)) {
    if (!isPlainRecord(entryWrites)) continue;

    for (const [leaf, property] of Object.entries(entryWrites)) {
      const partition: AuthoredLeafPartition = authoredLeafPartition(
        readAuthoredLeaf(property as AuthoredProperty),
      );
      switch (partition.kind) {
        case "value": {
          let bag = statics[entryId];
          if (bag === undefined) {
            bag = {};
            statics[entryId] = bag;
          }
          bag[leaf] = partition.value;
          break;
        }
        case "stops":
        case "none": {
          let bag = animated[entryId];
          if (bag === undefined) {
            bag = {};
            animated[entryId] = bag;
          }
          bag[leaf] = property;
          break;
        }
        default:
          return unreachable(partition);
      }
    }
  }

  const frozenStatics: Record<string, EntryLiveValues> = {};
  for (const [id, bag] of Object.entries(statics)) {
    frozenStatics[id] = Object.freeze(bag);
  }

  const frozenAnimated: Record<string, Readonly<Record<string, unknown>>> = {};
  for (const [id, bag] of Object.entries(animated)) {
    frozenAnimated[id] = Object.freeze(bag);
  }

  return {
    statics: Object.freeze(frozenStatics),
    animated: Object.freeze(frozenAnimated),
  };
}

export function mergeEntryBag<T>(
  base: Readonly<Record<string, Readonly<Record<string, T>>>> | undefined,
  overlay: Readonly<Record<string, Readonly<Record<string, T>>>> | undefined,
): Readonly<Record<string, Readonly<Record<string, T>>>> {
  const result: Record<string, Record<string, T>> = {};

  if (base) {
    for (const [id, bag] of Object.entries(base)) {
      result[id] = { ...bag };
    }
  }

  if (overlay) {
    for (const [id, bag] of Object.entries(overlay)) {
      const existing = result[id] ?? {};
      result[id] = { ...existing, ...bag };
    }
  }

  const frozen: Record<string, Readonly<Record<string, T>>> = {};
  for (const [id, bag] of Object.entries(result)) {
    frozen[id] = Object.freeze(bag);
  }
  return Object.freeze(frozen);
}

export interface ValueTransactionResult {
  readonly statics: LiveValues;
  readonly overlays: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
  readonly effectiveValues: ReadonlyMap<string, Readonly<Record<string, unknown>>>;
}

export function applyValueTransaction(
  plan: TrackExecutionPlan,
  nodeId: string,
  currentStatics: LiveValues | undefined,
  currentOverlays: Readonly<Record<string, Readonly<Record<string, unknown>>>> | undefined,
  writes: AuthoredValues,
  expectedGeneration?: GenerationToken | number,
): ValueTransactionResult {
  const validated = validateValueBatch(plan, nodeId, writes, expectedGeneration);
  const { statics, animated } = splitValidatedValueBatch(validated);

  const nextStatics = mergeEntryBag(
    currentStatics as Readonly<Record<string, Readonly<Record<string, AuthoredStaticValue>>>>,
    statics as Readonly<Record<string, Readonly<Record<string, AuthoredStaticValue>>>>,
  );
  const nextOverlays = mergeEntryBag(currentOverlays, animated);

  const effective = new Map<string, Record<string, unknown>>();

  for (const entry of plan.entries) {
    const entryValues: Record<string, unknown> = {};

    for (const [leaf, prop] of Object.entries(entry.schema.values)) {
      const part = authoredLeafPartition(readAuthoredLeaf(prop));
      if (part.kind === "value") {
        entryValues[leaf] = part.value;
      }
    }

    const staticOverrides = (nextStatics as Record<string, Record<string, unknown>>)[entry.entryId];
    if (staticOverrides) {
      for (const [leaf, val] of Object.entries(staticOverrides)) {
        entryValues[leaf] = val;
      }
    }

    const animatedOverrides = (nextOverlays as Record<string, Record<string, unknown>>)[
      entry.entryId
    ];
    if (animatedOverrides) {
      for (const [leaf, val] of Object.entries(animatedOverrides)) {
        entryValues[leaf] = val;
      }
    }

    effective.set(entry.entryId, Object.freeze(entryValues));
  }

  return {
    statics: nextStatics as LiveValues,
    overlays: nextOverlays,
    effectiveValues: effective,
  };
}

export interface EntryLiveHandleHost {
  writeEntryValues(
    entryId: string,
    values: EntryAuthoredValues,
    rebase: boolean,
    generation: GenerationToken | number,
  ): PatchBatch;
}

export function createEntryLiveHandle(
  host: EntryLiveHandleHost,
  nodeId: string,
  entryId: string,
  generation: GenerationToken | number,
): EntryLiveHandle {
  return Object.freeze({
    get entryId() {
      return entryId;
    },
    get generation() {
      return String(generation);
    },
    setValues(values: EntryAuthoredValues): PatchBatch {
      return host.writeEntryValues(entryId, values, true, generation);
    },
    overrideValues(values: EntryAuthoredValues): PatchBatch {
      return host.writeEntryValues(entryId, values, false, generation);
    },
  });
}
