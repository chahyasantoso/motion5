import type {
  HandoverChain,
  HandoverManifest,
  HandoverRefusalValue,
  OwnedComponent,
} from "./handover-format.mjs";

export const OUTCOME_KINDS: readonly [
  "nothing-to-do",
  "refused",
  "conflict",
  "undeclared-change",
  "post-mismatch",
  "verified",
  "applied",
];

export const INBOX_STATES: readonly ["emptied", "kept", "cleanup-failed"];

export type InboxState = (typeof INBOX_STATES)[number];

export interface RunOptions {
  readonly cwd?: string;
  readonly encoding?: BufferEncoding;
  readonly env?: NodeJS.ProcessEnv;
}

export interface RunResult {
  readonly status: number | null;
  readonly stdout: string;
  readonly stderr: string;
}

export type Run = (command: string, args: readonly string[], options?: RunOptions) => RunResult;

export interface AppliedCommit {
  readonly sha: string;
  readonly subject: string;
}

export type HandoverOutcome =
  | { readonly kind: "nothing-to-do" }
  | { readonly kind: "refused"; readonly refusal: HandoverRefusalValue }
  | {
      readonly kind: "conflict";
      readonly name: string;
      readonly seq: number;
      readonly file: string;
      readonly paths: readonly string[];
      readonly patches: readonly string[];
    }
  | {
      readonly kind: "undeclared-change";
      readonly name: string;
      readonly seq: number;
      readonly paths: readonly string[];
    }
  | {
      readonly kind: "post-mismatch";
      readonly name: string;
      readonly seq: number;
      readonly path: string;
      readonly expected: string | null;
      readonly observed: string | null;
    }
  | {
      readonly kind: "verified";
      readonly name: string;
      readonly commits: readonly AppliedCommit[];
      readonly reconciled: readonly string[];
    }
  | {
      readonly kind: "applied";
      readonly name: string;
      readonly commits: readonly AppliedCommit[];
      readonly reconciled: readonly string[];
      readonly inbox: InboxState;
    };

export interface InspectedArchive {
  readonly root: string;
  readonly directory: string;
  readonly manifest: HandoverManifest;
  readonly chain: HandoverChain;
  readonly components: readonly OwnedComponent[];
}

export function runProcess(
  command: string,
  args: readonly string[],
  options?: RunOptions,
): RunResult;
export function inspectArchive(
  zip: string,
  options: { readonly run?: Run; readonly scratch: string },
): Promise<InspectedArchive>;
export function applyHandover(options: {
  readonly root: string;
  readonly dryRun?: boolean;
  readonly keep?: boolean;
  readonly run?: Run;
  readonly temporary?: string;
}): Promise<HandoverOutcome>;
export function describeOutcome(outcome: HandoverOutcome): {
  readonly status: 0 | 1;
  readonly lines: readonly string[];
};
