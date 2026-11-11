import { parseNumbers } from "./args";
import { DEFAULT_LIMITS, checkMotion, describeFinding } from "./check";
import { captureFrames } from "./frames";
import { fromCaller, readPageArgs, type PageTarget } from "./page";
import { describeMotion, readMotion } from "./read";

export interface ReviewRequest extends PageTarget {
  readonly watch: readonly string[];
  readonly to: number;
  readonly at: readonly number[];
  readonly out?: string;
  /** Also read every move back with its ease. */
  readonly full: boolean;
}

export type ReviewArgs =
  | ({ readonly kind: "ok" } & ReviewRequest)
  | { readonly kind: "usage"; readonly message: string };

interface ReviewBase {
  readonly kind: "reviewed";
  /** What `motion:check` found, one line each; none means clean. */
  readonly findings: readonly string[];
  /** The labelled contact sheet of frames at `at`. */
  readonly sheet: string;
  readonly pageErrors: readonly string[];
}

export type ReviewResult =
  | (ReviewBase & { readonly full: false })
  | (ReviewBase & {
      readonly full: true;
      /** What `motion:read` read, one line per move, cut to the first `MOTION_LINES`. */
      readonly motion: readonly string[];
    });

/** A review lists at most this many moves; the rest are counted in one closing line. */
const MOTION_LINES = 40;
const USAGE =
  "usage: motion:review <page> --watch selector,selector --to ms [--at ms,ms] [--out dir] [--full] [--action ...] [--size WxH] [--root dir | --url address]";

export function parseReviewArgs(argv: readonly string[]): ReviewArgs {
  const usage = (message: string): ReviewArgs => ({
    kind: "usage",
    message: `${message} ${USAGE}`,
  });
  const read = readPageArgs(
    argv.filter((arg) => arg !== "--full"),
    ["--watch", "--to", "--at", "--out"],
  );
  if (read.kind === "usage") return usage(read.message);
  const watch = (read.flags.get("--watch") ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part !== "");
  if (watch.length === 0) return usage("--watch needs CSS selectors.");
  const to = parseNumbers(read.flags.get("--to"));
  if (to?.length !== 1 || to[0] === undefined) return usage("--to needs one time in ms.");
  const end = to[0];
  const given = read.flags.has("--at") ? parseNumbers(read.flags.get("--at")) : undefined;
  if (read.flags.has("--at") && given === undefined)
    return usage("--at needs ascending times in ms.");
  const at =
    given ??
    [0, 1, 2, 3, 4, 5].map((index) => Math.min(end, Math.round((end * index) / 5 / 16) * 16));
  const out = read.flags.get("--out");
  return {
    kind: "ok",
    ...read.target,
    watch,
    to: end,
    at,
    full: argv.includes("--full"),
    ...(out === undefined ? {} : { out: fromCaller(out) }),
  };
}

/** Checks and photographs the page in one call; reads the moves back too only when `full`. */
export async function reviewPage(request: ReviewRequest): Promise<ReviewResult> {
  const { watch, to, at, out, full, ...target } = request;
  const [checked, read, frames] = await Promise.all([
    checkMotion({ ...target, watch, to, limits: DEFAULT_LIMITS }),
    full ? readMotion({ ...target, select: watch, to }) : undefined,
    captureFrames({ ...target, at, ...(out === undefined ? {} : { out }) }),
  ]);
  const base = {
    kind: "reviewed" as const,
    findings: checked.findings.map(describeFinding),
    sheet: frames.sheet,
    pageErrors: [
      ...new Set([...checked.pageErrors, ...(read?.pageErrors ?? []), ...frames.pageErrors]),
    ],
  };
  if (read === undefined) return { ...base, full: false };
  const lines = read.elements.flatMap(describeMotion);
  const motion =
    lines.length <= MOTION_LINES
      ? lines
      : [
          ...lines.slice(0, MOTION_LINES),
          `… ${lines.length - MOTION_LINES} more moves; run motion:read for all`,
        ];
  return { ...base, full: true, motion };
}

/** The review as a reader wants it: findings, then the sheet, then the moves when they were read. */
export function printReview(result: ReviewResult): string {
  const lines = [
    result.findings.length === 0 ? "findings: none" : `findings: ${result.findings.length}`,
    ...result.findings.map((finding) => `  ${finding}`),
    ...result.pageErrors.map((error) => `page error: ${error}`),
    `sheet: ${result.sheet}`,
  ];
  if (result.full) lines.push("moves:", ...result.motion.map((line) => `  ${line}`));
  return lines.join("\n");
}
