export const HANDOVER_FORMAT: "motion5-handover";
export const HANDOVER_VERSION: 1;
export const HANDOVER_MANIFEST: "handover.json";
export const HANDOVER_INBOX: ".handover";
export const PATCH_DIRECTORY: "patches";
export const MAX_ENTRIES: number;
export const MAX_UNCOMPRESSED_BYTES: number;
export const COMPONENT_KINDS: readonly ["notes", "checkpoint", "bundle", "opaque"];
export const DISCOVERY_KINDS: readonly ["empty", "one", "ambiguous", "foreign"];
export const ENTRY_KINDS: readonly ["file", "directory", "symlink", "other"];
export const REFUSAL_KINDS: readonly [
  "ambiguous-inbox",
  "foreign-entry",
  "tool-missing",
  "identity-missing",
  "detached-head",
  "operation-in-progress",
  "dirty-tree",
  "unreadable-archive",
  "unsafe-entry",
  "archive-too-large",
  "missing-file",
  "stray-file",
  "invalid-manifest",
  "unsupported-version",
  "digest-mismatch",
  "broken-chain",
  "base-missing",
  "base-not-ancestor",
  "base-disagrees",
  "checkpoint-disagrees",
  "bundle-invalid",
  "bundle-prerequisite",
];

export type ComponentKind = (typeof COMPONENT_KINDS)[number];
export type EntryKind = (typeof ENTRY_KINDS)[number];

export type HandoverRefusalValue =
  | { readonly kind: "ambiguous-inbox"; readonly zips: readonly string[] }
  | { readonly kind: "foreign-entry"; readonly entries: readonly string[] }
  | { readonly kind: "tool-missing"; readonly tool: string }
  | { readonly kind: "identity-missing" }
  | { readonly kind: "detached-head" }
  | { readonly kind: "operation-in-progress"; readonly operation: string }
  | { readonly kind: "dirty-tree"; readonly paths: readonly string[] }
  | { readonly kind: "unreadable-archive"; readonly reason: string }
  | { readonly kind: "unsafe-entry"; readonly entry: string; readonly reason: string }
  | { readonly kind: "archive-too-large"; readonly entries: number; readonly bytes: number }
  | { readonly kind: "missing-file"; readonly path: string }
  | { readonly kind: "stray-file"; readonly path: string }
  | { readonly kind: "invalid-manifest"; readonly reason: string }
  | { readonly kind: "unsupported-version"; readonly format: unknown; readonly version: unknown }
  | {
      readonly kind: "digest-mismatch";
      readonly file: string;
      readonly expected: string;
      readonly observed: string;
    }
  | { readonly kind: "broken-chain"; readonly reason: string }
  | {
      readonly kind: "base-missing";
      readonly base: string;
      readonly path: string;
      readonly expected: string | null;
      readonly observed: string | null;
    }
  | { readonly kind: "base-not-ancestor"; readonly base: string; readonly head: string }
  | {
      readonly kind: "base-disagrees";
      readonly path: string;
      readonly expected: string | null;
      readonly observed: string | null;
    }
  | { readonly kind: "checkpoint-disagrees"; readonly reason: string }
  | { readonly kind: "bundle-invalid"; readonly reason: string }
  | {
      readonly kind: "bundle-prerequisite";
      readonly expected: string;
      readonly observed: readonly string[];
    };

export type InboxDiscovery =
  | { readonly kind: "empty" }
  | { readonly kind: "one"; readonly zip: string }
  | { readonly kind: "ambiguous"; readonly zips: readonly string[] }
  | { readonly kind: "foreign"; readonly entries: readonly string[] };

export interface ZipEntry {
  readonly name: string;
  readonly kind: EntryKind;
  readonly size: number;
}

export interface InboxEntry {
  readonly name: string;
  readonly kind: "file" | "other";
}

export type ImageMap = Readonly<Record<string, string | null>>;

export interface HandoverPatch {
  readonly seq: number;
  readonly file: string;
  readonly sha256: string;
  readonly pre: ImageMap;
  readonly post: ImageMap;
}

export interface HandoverComponent {
  readonly kind: ComponentKind;
  readonly path: string;
}

export interface HandoverManifest {
  readonly format: typeof HANDOVER_FORMAT;
  readonly version: typeof HANDOVER_VERSION;
  readonly name: string;
  readonly issue: number;
  readonly base: string;
  readonly patches: readonly HandoverPatch[];
  readonly components: readonly HandoverComponent[];
}

export interface HandoverChain {
  readonly base: ReadonlyMap<string, string | null>;
  readonly tip: ReadonlyMap<string, string | null>;
  readonly paths: readonly string[];
}

export interface OwnedComponent extends HandoverComponent {
  readonly files: readonly string[];
}

export interface BundleHeader {
  readonly prerequisites: readonly string[];
  readonly references: readonly { readonly sha: string; readonly name: string }[];
}

export class HandoverRefusal extends Error {
  constructor(refusal: HandoverRefusalValue);
  readonly refusal: HandoverRefusalValue;
}

export function refuse(refusal: HandoverRefusalValue): never;
export function unreachable(value: never, union: string): never;
export function unsafePath(path: unknown): string | null;
export function zipListing(text: string): ZipEntry[];
export function handoverListing(entries: readonly ZipEntry[]): {
  readonly root: string;
  readonly files: readonly string[];
};
export function handoverManifest(
  value: unknown,
  root: string,
): { readonly manifest: HandoverManifest; readonly chain: HandoverChain };
export function handoverContents(
  files: readonly string[],
  manifest: HandoverManifest,
): OwnedComponent[];
export function checkpointAgreement(
  value: unknown,
  component: OwnedComponent,
  digests: ReadonlyMap<string, string>,
  chain: HandoverChain,
  base: string,
): unknown;
export function bundleHeader(text: string): BundleHeader;
export function bundleAgreement(header: BundleHeader, base: string): BundleHeader;
export function discoverInbox(entries: readonly InboxEntry[]): InboxDiscovery;
export function describeRefusal(refusal: HandoverRefusalValue): string;
