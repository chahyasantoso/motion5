// Docs: ../../../docs/skeldata/CONTRACT.md
import { unreachable } from "../lang/exhaustive";

/** Distinct branded nominal tags to prevent accidental identifier conflation. */
declare const BrandTag: unique symbol;
export type Branded<T, B> = T & { readonly [BrandTag]: B };

/** Qualified track identifier (`motion/track` or `~/track`). */
export type QualifiedTrackId = Branded<string, "QualifiedTrackId">;

/** Authored entry instance identifier within a track keyframes array. */
export type AuthoredEntryId = Branded<string, "AuthoredEntryId">;

/** Registered plugin name. */
export type PluginName = Branded<string, "PluginName">;

/** Internal compiler entry key. */
export type CompilerEntryKey = Branded<string, "CompilerEntryKey">;

/** Evaluator generation token identifying private evaluator/table residency. */
export type GenerationToken = Branded<number, "GenerationToken">;

/** Authored property leaf name within an entry's values section. */
export type LeafPath = Branded<string, "LeafPath">;

/** Plugin output channel name. */
export type OutputName = Branded<string, "OutputName">;

/** Point member identifier in a resolved skeleton. Equals its authored entry ID. */
export type PointMemberId = Branded<string, "PointMemberId">;

/** Join link identifier in a joined skeleton layout. Stamped by compiler. */
export type LinkId = Branded<string, "LinkId">;

/** Render adapter target binding key. */
export type AdapterTarget = Branded<string, "AdapterTarget">;

/** Derived skeleton structural layout identity token. */
export type LayoutIdentity = Branded<string, "LayoutIdentity">;

/** Root binding source and path provenance token. */
export type RootBindingProvenance = Branded<string, "RootBindingProvenance">;

export const RESERVED_DELIMITERS = ["/", ":"] as const;

export function isReservedDelimiter(char: string): boolean {
  return char === "/" || char === ":";
}

export function assertValidIdentifier(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${label} must be a non-empty string.`);
  }
  for (const delimiter of RESERVED_DELIMITERS) {
    if (value.includes(delimiter)) {
      throw new TypeError(`${label} cannot contain reserved delimiter "${delimiter}".`);
    }
  }
}

export function asAuthoredEntryId(value: string): AuthoredEntryId {
  assertValidIdentifier(value, "Entry ID");
  return value as AuthoredEntryId;
}

export function asLeafPath(value: string): LeafPath {
  assertValidIdentifier(value, "Leaf path");
  return value as LeafPath;
}

export function asPointMemberId(entryId: AuthoredEntryId): PointMemberId {
  return entryId as string as PointMemberId;
}

export function asLinkId(value: string): LinkId {
  assertValidIdentifier(value, "Link ID");
  return value as LinkId;
}

export function asPluginName(value: string): PluginName {
  assertValidIdentifier(value, "Plugin name");
  return value as PluginName;
}

export function asCompilerEntryKey(value: string): CompilerEntryKey {
  assertValidIdentifier(value, "Compiler entry key");
  return value as CompilerEntryKey;
}

export function asGenerationToken(value: number): GenerationToken {
  if (!Number.isInteger(value) || value <= 0) {
    throw new TypeError("Generation token must be a positive integer.");
  }
  return value as GenerationToken;
}

export function asLayoutIdentity(value: string): LayoutIdentity {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError("Layout identity must be a non-empty string.");
  }
  return value as LayoutIdentity;
}

export function asRootBindingProvenance(value: string): RootBindingProvenance {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError("Root binding provenance must be a non-empty string.");
  }
  return value as RootBindingProvenance;
}

let nextCompilerKeyCounter = 0;
export function createCompilerEntryKey(
  entryId: string,
  instanceToken?: string | number,
): CompilerEntryKey {
  assertValidIdentifier(entryId, "Entry ID");
  const token = instanceToken !== undefined ? instanceToken : ++nextCompilerKeyCounter;
  return `${entryId}#${token}` as CompilerEntryKey;
}

/**
 * Length-prefixed tuple encoding: `<len>:<entryId>:<leaf>`
 * Collision-free across all unicode strings, including empty or adversarial inputs.
 */
export function encodeEntryLeaf(entryId: string, leaf: string): string {
  return `${entryId.length}:${entryId}:${leaf}`;
}

export function decodeEntryLeaf(encoded: string): readonly [entryId: string, leaf: string] {
  const firstColon = encoded.indexOf(":");
  if (firstColon <= 0) {
    throw new TypeError(`Malformed encoded entry-leaf address: "${encoded}".`);
  }
  const lenStr = encoded.slice(0, firstColon);
  const len = Number.parseInt(lenStr, 10);
  if (!Number.isInteger(len) || len < 0) {
    throw new TypeError(`Malformed length prefix in encoded address: "${encoded}".`);
  }
  const entryStart = firstColon + 1;
  const entryEnd = entryStart + len;
  if (entryEnd > encoded.length || encoded[entryEnd] !== ":") {
    throw new TypeError(`Length mismatch or missing separator in address: "${encoded}".`);
  }
  const entryId = encoded.slice(entryStart, entryEnd);
  const leaf = encoded.slice(entryEnd + 1);
  return Object.freeze([entryId, leaf] as const);
}

/** Creates a prototype-safe dictionary resistant to __proto__ key collisions. */
export function createSafeRecord<V>(): Record<string, V> {
  return Object.create(null) as Record<string, V>;
}

/** Safely queries key presence without prototype lookup. */
export function hasSafeProperty<V>(record: Record<string, V>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

/** Encapsulates entry lifecycle states: active, replaced in-place, or removed. */
export type EntryLifecycleState =
  | { readonly kind: "active"; readonly generation: GenerationToken }
  | { readonly kind: "replaced"; readonly generation: GenerationToken }
  | { readonly kind: "removed" };

export function isHandleUsable(state: EntryLifecycleState, handleGen: GenerationToken): boolean {
  switch (state.kind) {
    case "active":
    case "replaced":
      return state.generation === handleGen;
    case "removed":
      return false;
    default:
      return unreachable(state);
  }
}

/**
 * Qualify a source reference according to motion5 address semantics:
 * - Free track: `~/trackId` remains `~/trackId`
 * - Motion track: `motionId/trackId` remains `motionId/trackId`
 * - Local track: `trackId` becomes `${ownerMotionId}/${trackId}` if ownerMotionId provided
 */
export function qualifySourceAddress(source: string, ownerMotionId?: string): string {
  if (source.startsWith("~/")) return source;
  if (source.includes("/")) return source;
  if (ownerMotionId !== undefined && ownerMotionId.length > 0) {
    return `${ownerMotionId}/${source}`;
  }
  return source;
}

/**
 * Centralized collision-free length-prefixed tuple encoding for binding identities:
 * `<sourceLen>:<qualifiedSource>:<entryLen>:<entryId>:<slotLen>:<slot>[:<memberLen>:<memberKey>]`
 */
export function encodeBindingTuple(
  qualifiedSource: string,
  entryId: string,
  slot: string,
  memberKey?: string,
): string {
  const base = `${qualifiedSource.length}:${qualifiedSource}:${entryId.length}:${entryId}:${slot.length}:${slot}`;
  return memberKey !== undefined ? `${base}:${memberKey.length}:${memberKey}` : base;
}
