export const HAZARD_KINDS: readonly [
  "whitespace-only-line",
  "adjacent-to-hunk-header",
  "trailing-whitespace",
  "final-line",
  "non-ascii",
  "backtick-span",
];
export const VERDICT_KINDS: readonly ["match", "mismatch", "absent", "stray", "unsealed"];

export type TransportHazard =
  | { readonly kind: "whitespace-only-line"; readonly line: number; readonly bytes: string }
  | { readonly kind: "adjacent-to-hunk-header"; readonly line: number }
  | { readonly kind: "trailing-whitespace"; readonly line: number }
  | {
      readonly kind: "final-line";
      readonly line: number;
      readonly bytes: string;
      readonly newline: boolean;
    }
  | { readonly kind: "non-ascii"; readonly line: number; readonly codePoints: readonly number[] }
  | { readonly kind: "backtick-span"; readonly line: number; readonly count: number };

export type TransportVerdict =
  | { readonly kind: "match"; readonly path: string; readonly blob: string }
  | {
      readonly kind: "mismatch";
      readonly path: string;
      readonly expected: string;
      readonly observed: string;
    }
  | { readonly kind: "absent"; readonly path: string; readonly expected: string }
  | { readonly kind: "stray"; readonly path: string; readonly observed: string }
  | { readonly kind: "unsealed"; readonly path: string; readonly expected: string };

export type TransportDifference =
  | { readonly kind: "identical" }
  | {
      readonly kind: "differs";
      readonly line: number;
      readonly offset: number;
      readonly expected: Buffer | null;
      readonly observed: Buffer | null;
    };

export interface TransportFile {
  readonly path: string;
  readonly size: number;
  readonly blob: string;
  readonly sha256: string;
  readonly hazards: readonly TransportHazard[];
}

export interface TransportPlan {
  readonly checkpoint: string;
  readonly files: readonly TransportFile[];
}

export interface Observation {
  readonly path: string;
  readonly blob: string;
}

export interface CheckpointPatchEntry {
  readonly seq: number;
  readonly file: string;
  readonly sha256: string;
  readonly pre: Readonly<Record<string, string | null>>;
  readonly post: Readonly<Record<string, string | null>>;
}

export interface CheckpointManifest {
  readonly checkpoint: string;
  readonly allow: readonly string[];
  readonly patches: readonly CheckpointPatchEntry[];
}

export interface TransportIo {
  log(message: string): void;
  error(message: string): void;
}

export function transportHazards(bytes: Uint8Array, file?: string): TransportHazard[];
export function transportFile(file: string, bytes: Uint8Array): TransportFile;
export function transportPlan(
  manifest: CheckpointManifest,
  files: ReadonlyMap<string, Uint8Array>,
): TransportPlan;
export function renderHazard(hazard: TransportHazard): string;
export function renderPlan(plan: TransportPlan): string;
export function parseObservation(argument: string, checkpoint: string): Observation;
export function transportVerdicts(
  plan: TransportPlan,
  observations: readonly Observation[],
): TransportVerdict[];
export function verdictPasses(verdict: TransportVerdict): boolean;
export function renderVerdict(verdict: TransportVerdict): string;
export function transportDifference(
  expected: Uint8Array,
  observed: Uint8Array,
): TransportDifference;
export function renderDifference(difference: TransportDifference): string;
export function readStore(
  directory: string,
): Promise<{ manifest: CheckpointManifest; files: Map<string, Buffer> }>;
export function main(argv: readonly string[], io?: TransportIo): Promise<0 | 1 | 2>;
