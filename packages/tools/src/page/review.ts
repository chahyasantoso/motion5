import { parseNumbers } from "./args";
import { DEFAULT_LIMITS, describeFinding, sampleMotion } from "./check";
import { captureFrames } from "./frames";
import { pickFrames, type PickReason } from "./pick";
import { fromCaller, readPageArgs, type PageTarget } from "./page";
import { describeMotion, readMotion } from "./read";

/** What `motion:review` runs: `check` and `frames` at once on the `watch` selectors to `to` ms; `at`
 * names frames, `full` adds the moves. */
export interface ReviewRequest extends PageTarget {
  readonly watch: readonly string[];
  readonly to: number;
  /** Frame times; absent, they are picked from the motion. */
  readonly at?: readonly number[];
  readonly out?: string;
  /** Also read every move back with its ease. */
  readonly full: boolean;
}

/** Parsed `motion:review` arguments, or the usage text. */
export type ReviewArgs =
  | ({ readonly kind: "ok" } & ReviewRequest)
  | { readonly kind: "usage"; readonly message: string };

interface ReviewBase {
  readonly kind: "reviewed";
  /** What `motion:check` found, one line each; none means clean. */
  readonly findings: readonly string[];
  /** The frames photographed, each as its time and, when picked, why. */
  readonly frames: readonly string[];
  /** The labelled contact sheet of those frames. */
  readonly sheet: string;
  readonly pageErrors: readonly string[];
}

/** The findings, the frames and the sheet path; with `full`, also the moves read back, cut to the first 40. */
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

/** Reads `<page> --watch sel,sel --to ms [--at ms,ms] [--out dir] [--full]`, or answers the usage text. */
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
  const out = read.flags.get("--out");
  return {
    kind: "ok",
    ...read.target,
    watch,
    to: end,
    ...(given === undefined ? {} : { at: given }),
    full: argv.includes("--full"),
    ...(out === undefined ? {} : { out: fromCaller(out) }),
  };
}

/** Checks and photographs the page in one call; reads the moves back too only when `full`. */
export async function reviewPage(request: ReviewRequest): Promise<ReviewResult> {
  const { watch, to, at, out, full, ...target } = request;
  const sampled = sampleMotion({ ...target, watch, to, limits: DEFAULT_LIMITS });
  const photographed = sampled.then(async ({ samples }) => {
    const picks: readonly { readonly at: number; readonly reason?: PickReason }[] =
      at === undefined ? pickFrames(samples) : at.map((time) => ({ at: time }));
    const captured = await captureFrames({
      ...target,
      at: picks.map((pick) => pick.at),
      labels: picks.map((pick) => pick.reason ?? ""),
      ...(out === undefined ? {} : { out }),
    });
    return { captured, picks };
  });
  const [{ result: checked }, read, { captured: frames, picks }] = await Promise.all([
    sampled,
    full ? readMotion({ ...target, select: watch, to }) : undefined,
    photographed,
  ]);
  const base = {
    kind: "reviewed" as const,
    findings: checked.findings.map(describeFinding),
    frames: picks.map((pick) =>
      pick.reason === undefined ? `${pick.at}` : `${pick.at} ${pick.reason}`,
    ),
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
    `frames: ${result.frames.join(", ")}`,
    `sheet: ${result.sheet}`,
  ];
  if (result.full) lines.push("moves:", ...result.motion.map((line) => `  ${line}`));
  return lines.join("\n");
}
