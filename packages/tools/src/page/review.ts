import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseNumbers } from "./args";
import { DEFAULT_LIMITS, describeFinding, sampleMotion } from "./check";
import { captureFrames } from "./frames";
import { pickFrames, type PickReason } from "./pick";
import {
  formatSize,
  fromCaller,
  parseSizes,
  readPageArgs,
  type PageTarget,
  type ViewportSize,
} from "./page";
import { describeMotion, readMotion } from "./read";

/** What `gerak review` runs: `check` and `frames` at once on the `watch` selectors to `to` ms; `at`
 * names frames, `full` adds the moves. */
export interface ReviewRequest extends PageTarget {
  readonly watch: readonly string[];
  readonly to: number;
  /** Frame times; absent, they are picked from the motion. */
  readonly at?: readonly number[];
  readonly out?: string;
  /** Also read every move back with its ease. */
  readonly full: boolean;
  readonly sizes?: readonly ViewportSize[];
}

/** Parsed `gerak review` arguments, or the usage text. */
export type ReviewArgs =
  | ({ readonly kind: "ok" } & ReviewRequest)
  | { readonly kind: "usage"; readonly message: string };

/** Per-viewport findings, frames, sheet path, and page errors in a multi-viewport review. */
export interface ViewportReview {
  readonly size: string;
  readonly width: number;
  readonly height: number;
  readonly findings: readonly string[];
  readonly frames: readonly string[];
  readonly sheet: string;
  readonly pageErrors: readonly string[];
}

interface ReviewBase {
  readonly kind: "reviewed";
  /** What `gerak check` found, one line each; none means clean. */
  readonly findings: readonly string[];
  /** The frames photographed, each as its time and, when picked, why. */
  readonly frames: readonly string[];
  /** The labelled contact sheet of those frames. */
  readonly sheet: string;
  readonly sheets?: Readonly<Record<string, string>>;
  readonly viewports?: readonly ViewportReview[];
  readonly pageErrors: readonly string[];
}

/** The findings, the frames and the sheet path; with `full`, also the moves read back, cut to the first 40 per viewport. */
export type ReviewResult =
  | (ReviewBase & { readonly full: false })
  | (ReviewBase & {
      readonly full: true;
      /** What `gerak read` read, one line per move, cut to the first `MOTION_LINES` per viewport. */
      readonly motion: readonly string[];
    });

/** A review lists at most this many moves; the rest are counted in one closing line. */
const MOTION_LINES = 40;
const USAGE =
  "usage: gerak review <page> --watch selector,selector --to ms [--at ms,ms] [--out dir] [--full] [--action ...] [--size WxH | --sizes WxH,WxH] [--root dir | --url address]";

/** Reads `<page> --watch sel,sel --to ms [--at ms,ms] [--out dir] [--full]`, or answers the usage text. */
export function parseReviewArgs(argv: readonly string[]): ReviewArgs {
  const usage = (message: string): ReviewArgs => ({
    kind: "usage",
    message: `${message} ${USAGE}`,
  });
  const read = readPageArgs(
    argv.filter((arg) => arg !== "--full"),
    ["--watch", "--to", "--at", "--out", "--sizes"],
  );
  if (read.kind === "usage") return usage(read.message);
  if (read.flags.has("--sizes") && read.flags.has("--size"))
    return usage("Pass --size or --sizes, not both.");
  const sizes = read.flags.has("--sizes") ? parseSizes(read.flags.get("--sizes")) : undefined;
  if (typeof sizes === "string") return usage(sizes);
  const firstSize = sizes?.[0];
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
    ...(firstSize === undefined ? {} : { width: firstSize.width, height: firstSize.height }),
    ...(sizes === undefined ? {} : { sizes }),
    watch,
    to: end,
    ...(given === undefined ? {} : { at: given }),
    full: argv.includes("--full"),
    ...(out === undefined ? {} : { out: fromCaller(out) }),
  };
}

async function reviewSingleViewport(
  request: Omit<ReviewRequest, "sizes">,
  sheetOptions?: { readonly sheetPath: string; readonly sheetLabel: string },
): Promise<ReviewResult> {
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
      ...(sheetOptions ?? {}),
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
          `… ${lines.length - MOTION_LINES} more moves; run gerak read for all`,
        ];
  return { ...base, full: true, motion };
}

/** Checks and photographs the page in one call; reads the moves back too only when `full`. */
export async function reviewPage(request: ReviewRequest): Promise<ReviewResult> {
  if (request.sizes === undefined) return reviewSingleViewport(request);
  const { sizes, out, ...rest } = request;
  const baseOut = out ?? mkdtempSync(join(tmpdir(), "motion-review-"));
  const viewports: ViewportReview[] = [];
  const sheets: Record<string, string> = {};
  const findings: string[] = [];
  const frames: string[] = [];
  const pageErrors: string[] = [];
  const motion: string[] = [];

  for (const size of sizes) {
    const label = formatSize(size);
    const single = await reviewSingleViewport(
      {
        ...rest,
        width: size.width,
        height: size.height,
        out: join(baseOut, label),
      },
      { sheetPath: join(baseOut, `sheet-${label}.png`), sheetLabel: label },
    );
    viewports.push({
      size: label,
      width: size.width,
      height: size.height,
      findings: single.findings,
      frames: single.frames,
      sheet: single.sheet,
      pageErrors: single.pageErrors,
    });
    sheets[label] = single.sheet;
    findings.push(...single.findings.map((finding) => `[${label}] ${finding}`));
    frames.push(...single.frames.map((frame) => `[${label}] ${frame}`));
    pageErrors.push(...single.pageErrors.map((error) => `[${label}] ${error}`));
    if (single.full) motion.push(...single.motion.map((line) => `[${label}] ${line}`));
  }

  const base: ReviewBase = {
    kind: "reviewed",
    findings,
    frames,
    sheet: viewports[0]?.sheet ?? "",
    sheets,
    viewports,
    pageErrors,
  };
  return request.full ? { ...base, full: true, motion } : { ...base, full: false };
}

/** The review as a reader wants it: findings, then the sheet, then the moves when they were read. */
export function printReview(result: ReviewResult): string {
  const locationLines =
    result.viewports === undefined
      ? [`frames: ${result.frames.join(", ")}`, `sheet: ${result.sheet}`]
      : result.viewports.flatMap((vp) => [
          `frames (${vp.size}): ${vp.frames.join(", ")}`,
          `sheet (${vp.size}): ${vp.sheet}`,
        ]);
  const lines = [
    result.findings.length === 0 ? "findings: none" : `findings: ${result.findings.length}`,
    ...result.findings.map((finding) => `  ${finding}`),
    ...result.pageErrors.map((error) => `page error: ${error}`),
    ...locationLines,
  ];
  if (result.full) lines.push("moves:", ...result.motion.map((line) => `  ${line}`));
  return lines.join("\n");
}
