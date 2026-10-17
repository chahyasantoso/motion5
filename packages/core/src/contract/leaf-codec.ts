import {
  decodeEntryLeaf,
  encodeEntryLeaf,
  type AuthoredEntryId,
  type CompilerEntryKey,
  type GenerationToken,
} from "./address";
import {
  authoredLeafPartition,
  readAuthoredLeaf,
  type AuthoredLeafPartition,
} from "./authored-leaf";
import { compilePercentKeyframes, type CompiledKeyframes } from "./keyframe-compiler";
export interface TrackLeafPlanEntry {
  readonly entryId: AuthoredEntryId;
  readonly compilerKey: CompilerEntryKey;
  readonly authoredPath: string;
  readonly schema: {
    readonly values: Readonly<Record<string, unknown>>;
  };
  readonly contribution?: {
    readonly keyframes?: Readonly<Record<string, unknown>>;
    readonly tweenVars?: Readonly<Record<string, unknown>>;
  };
}

export interface TrackLeafPlanInput {
  readonly trackId?: string;
  readonly generation: GenerationToken;
  readonly entries: readonly TrackLeafPlanEntry[];
}

export interface PropertyAddress {
  readonly entryId: AuthoredEntryId;
  readonly compilerKey: CompilerEntryKey;
  readonly leaf: string;
  readonly authoredPath: string;
  readonly isStatic: boolean;
  readonly isContributed: boolean;
}

export function encodePropertyKey(compilerKey: string, leaf: string): string {
  return encodeEntryLeaf(compilerKey, leaf);
}

export function decodePropertyKey(
  propertyKey: string,
): readonly [compilerKey: string, leaf: string] {
  return decodeEntryLeaf(propertyKey);
}

export interface TrackLeafCodec {
  readonly trackId?: string;
  readonly generation: GenerationToken;
  encode(compilerKey: string, leaf: string): string;
  decode(propertyKey: string): readonly [compilerKey: string, leaf: string];
  hasProperty(propertyKey: string): boolean;
  getAddress(propertyKey: string): PropertyAddress | undefined;
  getStaticValues(): Readonly<Record<string, unknown>>;
  getAnimatedKeyframes(): Readonly<Record<string, unknown>>;
  compileTimelineKeyframes(): CompiledKeyframes;
  encodeOverlay(
    overlayByEntry: Readonly<Record<string, Readonly<Record<string, unknown>>>>,
  ): Readonly<Record<string, unknown>>;
  decodeEvaluatedState(
    evaluatedState: Readonly<Record<string, unknown>>,
  ): ReadonlyMap<string, Readonly<Record<string, unknown>>>;
  decodeEntryBag(
    evaluatedState: Readonly<Record<string, unknown>>,
    entryId: string,
  ): Readonly<Record<string, unknown>>;
}

class TrackLeafCodecImpl implements TrackLeafCodec {
  readonly trackId?: string;
  readonly generation: GenerationToken;
  readonly #propertyToAddress: ReadonlyMap<string, PropertyAddress>;
  readonly #addressToProperty: ReadonlyMap<string, string>;
  readonly #staticValues: Readonly<Record<string, unknown>>;
  readonly #animatedKeyframes: Readonly<Record<string, unknown>>;
  readonly #entryIdsToCompilerKeys: ReadonlyMap<string, string>;
  #compiledTimelineKeyframes?: CompiledKeyframes;

  constructor(
    plan: TrackLeafPlanInput,
    propertyToAddress: Map<string, PropertyAddress>,
    addressToProperty: Map<string, string>,
    staticValues: Record<string, unknown>,
    animatedKeyframes: Record<string, unknown>,
    entryIdsToCompilerKeys: Map<string, string>,
  ) {
    if (plan.trackId !== undefined) {
      this.trackId = plan.trackId;
    }
    this.generation = plan.generation;
    this.#propertyToAddress = propertyToAddress;
    this.#addressToProperty = addressToProperty;
    this.#staticValues = Object.freeze({ ...staticValues });
    this.#animatedKeyframes = Object.freeze({ ...animatedKeyframes });
    this.#entryIdsToCompilerKeys = entryIdsToCompilerKeys;
  }

  encode(compilerKey: string, leaf: string): string {
    const key = `${compilerKey}::${leaf}`;
    const propertyKey = this.#addressToProperty.get(key);
    if (propertyKey !== undefined) return propertyKey;
    return encodePropertyKey(compilerKey, leaf);
  }

  decode(propertyKey: string): readonly [compilerKey: string, leaf: string] {
    return decodePropertyKey(propertyKey);
  }

  hasProperty(propertyKey: string): boolean {
    return this.#propertyToAddress.has(propertyKey);
  }

  getAddress(propertyKey: string): PropertyAddress | undefined {
    return this.#propertyToAddress.get(propertyKey);
  }

  getStaticValues(): Readonly<Record<string, unknown>> {
    return this.#staticValues;
  }

  getAnimatedKeyframes(): Readonly<Record<string, unknown>> {
    return this.#animatedKeyframes;
  }

  compileTimelineKeyframes(): CompiledKeyframes {
    if (this.#compiledTimelineKeyframes === undefined) {
      this.#compiledTimelineKeyframes = compilePercentKeyframes(this.#animatedKeyframes);
    }
    return this.#compiledTimelineKeyframes;
  }

  encodeOverlay(
    overlayByEntry: Readonly<Record<string, Readonly<Record<string, unknown>>>>,
  ): Readonly<Record<string, unknown>> {
    const encoded: Record<string, unknown> = {};
    for (const [entryIdOrCompilerKey, leaves] of Object.entries(overlayByEntry)) {
      if (!leaves || typeof leaves !== "object") continue;
      const compilerKey =
        this.#entryIdsToCompilerKeys.get(entryIdOrCompilerKey) ?? entryIdOrCompilerKey;
      for (const [leaf, value] of Object.entries(leaves)) {
        const propKey = this.encode(compilerKey, leaf);
        encoded[propKey] = value;
      }
    }
    return Object.freeze(encoded);
  }

  decodeEvaluatedState(
    evaluatedState: Readonly<Record<string, unknown>>,
  ): ReadonlyMap<string, Readonly<Record<string, unknown>>> {
    const bags = new Map<string, Record<string, unknown>>();

    // Merge static baseline with evaluated state
    const merged: Record<string, unknown> = { ...this.#staticValues, ...evaluatedState };

    for (const [propKey, value] of Object.entries(merged)) {
      const address = this.#propertyToAddress.get(propKey);
      if (address === undefined) continue;

      let entryBag = bags.get(address.entryId);
      if (entryBag === undefined) {
        entryBag = {};
        bags.set(address.entryId, entryBag);
      }
      entryBag[address.leaf] = value;
    }

    const frozenBags = new Map<string, Readonly<Record<string, unknown>>>();
    for (const [entryId, bag] of bags) {
      frozenBags.set(entryId, Object.freeze(bag));
    }
    return frozenBags;
  }

  decodeEntryBag(
    evaluatedState: Readonly<Record<string, unknown>>,
    entryId: string,
  ): Readonly<Record<string, unknown>> {
    const allBags = this.decodeEvaluatedState(evaluatedState);
    return allBags.get(entryId) ?? Object.freeze({});
  }
}

export function createTrackLeafCodec(plan: TrackLeafPlanInput): TrackLeafCodec {
  const propertyToAddress = new Map<string, PropertyAddress>();
  const addressToProperty = new Map<string, string>();
  const staticValues: Record<string, unknown> = {};
  const animatedKeyframes: Record<string, unknown> = {};
  const entryIdsToCompilerKeys = new Map<string, string>();

  for (const entry of plan.entries) {
    entryIdsToCompilerKeys.set(entry.entryId, entry.compilerKey);
    entryIdsToCompilerKeys.set(entry.compilerKey, entry.compilerKey);

    // 1. Authored schema leaves
    for (const [leaf, property] of Object.entries(entry.schema.values)) {
      const propKey = encodePropertyKey(entry.compilerKey, leaf);
      const partition: AuthoredLeafPartition = authoredLeafPartition(readAuthoredLeaf(property));
      const isStatic = partition.kind === "value";

      const address: PropertyAddress = Object.freeze({
        entryId: entry.entryId,
        compilerKey: entry.compilerKey,
        leaf,
        authoredPath: `${entry.authoredPath}.values.${leaf}`,
        isStatic,
        isContributed: false,
      });

      propertyToAddress.set(propKey, address);
      addressToProperty.set(`${entry.compilerKey}::${leaf}`, propKey);

      if (isStatic) {
        staticValues[propKey] = partition.value;
      } else if (partition.kind === "stops") {
        animatedKeyframes[propKey] = property;
      }
    }

    // 2. Contributed leaves from prepare hook
    if (entry.contribution?.keyframes) {
      for (const [leaf, property] of Object.entries(entry.contribution.keyframes)) {
        const propKey = encodePropertyKey(entry.compilerKey, leaf);
        const partition = authoredLeafPartition(readAuthoredLeaf(property));
        const isStatic = partition.kind === "value";

        const address: PropertyAddress = Object.freeze({
          entryId: entry.entryId,
          compilerKey: entry.compilerKey,
          leaf,
          authoredPath: `${entry.authoredPath}.contributions.${leaf}`,
          isStatic,
          isContributed: true,
        });

        propertyToAddress.set(propKey, address);
        addressToProperty.set(`${entry.compilerKey}::${leaf}`, propKey);

        if (isStatic) {
          staticValues[propKey] = partition.value;
        } else if (partition.kind === "stops") {
          animatedKeyframes[propKey] = property;
        }
      }
    }
  }

  return new TrackLeafCodecImpl(
    plan,
    propertyToAddress,
    addressToProperty,
    staticValues,
    animatedKeyframes,
    entryIdsToCompilerKeys,
  );
}
