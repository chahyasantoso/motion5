import type { AppliedCommit, Run } from "./handover-apply.mjs";
import type { HandoverAddress, HandoverReview, HandoverTarget } from "./handover-format.mjs";

export const PUBLICATION_KINDS: readonly [
  "opted-out",
  "unaddressed",
  "deferred",
  "failed",
  "published",
];
export const DEFERRAL_KINDS: readonly [
  "remote-missing",
  "gh-missing",
  "gh-unauthenticated",
  "branch-not-local",
  "branch-diverged",
  "pull-request-elsewhere",
];
export const BRANCH_STATES: readonly ["up-to-date", "absent", "behind", "diverged"];
export const BRANCH_SYNC_KINDS: readonly ["up-to-date", "created", "fast-forwarded"];
export const PUBLICATION_PARTS: readonly ["pull-request", "notes", "review"];
export const MAX_BODY_CHARACTERS: number;

export type PublicationPart = (typeof PUBLICATION_PARTS)[number];
export type CommentPart = Exclude<PublicationPart, "pull-request">;

/** What `applyHandover` hands a publisher once the series is in; also the pending payload. */
export interface AppliedHandover {
  readonly identity: string;
  readonly name: string;
  readonly issue: number;
  readonly address: HandoverAddress;
  readonly notes: string;
  readonly review: HandoverReview | null;
  readonly tip: string;
  readonly commits: readonly AppliedCommit[];
}

export type Deferral =
  | { readonly kind: "remote-missing"; readonly repository: string }
  | { readonly kind: "gh-missing" }
  | { readonly kind: "gh-unauthenticated" }
  | { readonly kind: "branch-not-local"; readonly branch: string; readonly tip: string }
  | {
      readonly kind: "branch-diverged";
      readonly remote: string;
      readonly branch: string;
      readonly tip: string;
      readonly remoteTip: string;
    }
  | {
      readonly kind: "pull-request-elsewhere";
      readonly number: number;
      readonly head: string;
      readonly branch: string;
    };

/** What publishing did to the remote branch so it holds the applied tip before any post. */
export type BranchSync =
  | { readonly kind: "up-to-date" }
  | { readonly kind: "created" }
  | { readonly kind: "fast-forwarded"; readonly from: string };

export interface PublishedDestination {
  readonly kind: "pull-request" | "issue";
  readonly number: number;
  readonly url: string;
}

export type Publication =
  | { readonly kind: "opted-out" }
  | { readonly kind: "unaddressed" }
  | { readonly kind: "deferred"; readonly reason: Deferral; readonly pending: string }
  | {
      readonly kind: "failed";
      readonly step: string;
      readonly reason: string;
      readonly pending: string | null;
    }
  | {
      readonly kind: "published";
      readonly destination: PublishedDestination;
      readonly created: boolean;
      readonly branch: BranchSync;
      readonly posted: readonly CommentPart[];
      readonly skipped: readonly CommentPart[];
    };

/** The subset of `gh pr list --json` fields the publisher reads. */
export interface ListedPullRequest {
  readonly number: number;
  readonly url: string;
  readonly state: string;
  readonly body?: string;
  readonly baseRefName: string;
  readonly headRefName: string;
  readonly headRepository: { readonly name: string } | null;
  readonly headRepositoryOwner: { readonly login: string } | null;
}

export function marker(identity: string, part: PublicationPart): string;
export function bounded(body: string): string;
export function branchPullRequest<T extends ListedPullRequest>(
  pulls: readonly T[],
  target: HandoverTarget,
): T | undefined;
export function reviewLine(review: HandoverReview | null): string;
export function pullRequestBody(handover: AppliedHandover): string;
export function notesComment(handover: AppliedHandover): string;
/** Only for a handover that carries a review; `commentParts` names when that is. */
export function reviewComment(handover: AppliedHandover): string;
export function commentParts(handover: AppliedHandover): CommentPart[];
export function remoteRepository(url: string): string | null;
export function publishHandover(
  handover: AppliedHandover,
  options: { readonly root: string; readonly run: Run; readonly temporary?: string },
): Promise<Publication>;
export function publishPending(options: {
  readonly root: string;
  readonly run: Run;
  readonly temporary?: string;
}): Promise<readonly { readonly name: string; readonly publication: Publication }[]>;
export function describePublication(publication: Publication): string[];
export function isSettled(publication: Publication): boolean;
