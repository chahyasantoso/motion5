import { unreachable } from "@motion5/core/plugin-api";
import type { Box } from "./frames";
import { readPageArgs, withPage, type PageTarget } from "./page";

export interface Limits {
  /** Overlapping frames tolerated before an overlap is reported. */
  readonly overlap: number;
  /** Shortest final hold, in ms, after the last change. */
  readonly hold: number;
  /** Largest centre move between two frames, in px. */
  readonly jump: number;
}

export const DEFAULT_LIMITS: Limits = Object.freeze({ overlap: 12, hold: 500, jump: 150 });

export type Finding =
  | {
      readonly kind: "overlap";
      readonly a: string;
      readonly b: string;
      readonly from: number;
      readonly to: number;
      readonly frames: number;
    }
  | { readonly kind: "jump"; readonly element: string; readonly at: number; readonly px: number }
  | { readonly kind: "short-hold"; readonly ms: number }
  | { readonly kind: "still-moving"; readonly element: string };

export interface Frame {
  readonly at: number;
  readonly elements: readonly { readonly name: string; readonly box: Box }[];
}

export interface CheckRequest extends PageTarget {
  readonly watch: readonly string[];
  readonly to: number;
  readonly limits: Limits;
}

export type CheckArgs =
  | ({ readonly kind: "ok" } & CheckRequest)
  | { readonly kind: "usage"; readonly message: string };

export interface CheckResult {
  readonly kind: "checked";
  readonly frames: number;
  readonly findings: readonly Finding[];
  readonly pageErrors: readonly string[];
}

const STEP_MS = 16;
const USAGE =
  "usage: motion:check <page> --watch selector,selector --to ms [--overlap frames] [--hold ms] [--jump px]";

function onStage(box: Box, stage: { readonly width: number; readonly height: number }): boolean {
  return (
    box.x + box.width > 0 && box.y + box.height > 0 && box.x < stage.width && box.y < stage.height
  );
}

function intersects(a: Box, b: Box): boolean {
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
}

function centre(box: Box): { readonly x: number; readonly y: number } {
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

function sameBox(a: Box | undefined, b: Box | undefined): boolean {
  return (
    a !== undefined &&
    b !== undefined &&
    a.x === b.x &&
    a.y === b.y &&
    a.width === b.width &&
    a.height === b.height
  );
}

/** Findings over frames sampled at a fixed step: long overlaps, jumps, a short final hold, no rest. */
export function analyse(
  frames: readonly Frame[],
  stage: { readonly width: number; readonly height: number },
  limits: Limits,
): readonly Finding[] {
  const findings: Finding[] = [];
  const names = [...new Set(frames.flatMap(({ elements }) => elements.map(({ name }) => name)))];
  const boxAt = (frame: Frame | undefined, name: string) =>
    frame?.elements.find((element) => element.name === name)?.box;

  for (const [i, a] of names.entries())
    for (const b of names.slice(i + 1)) {
      let run: number[] = [];
      const close = () => {
        const first = run[0];
        const last = run.at(-1);
        if (run.length > limits.overlap && first !== undefined && last !== undefined)
          findings.push({ kind: "overlap", a, b, from: first, to: last, frames: run.length });
        run = [];
      };
      for (const frame of frames) {
        const boxA = boxAt(frame, a);
        const boxB = boxAt(frame, b);
        const both =
          boxA !== undefined &&
          boxB !== undefined &&
          onStage(boxA, stage) &&
          onStage(boxB, stage) &&
          intersects(boxA, boxB);
        if (both) run.push(frame.at);
        else close();
      }
      close();
    }

  for (const name of names)
    for (let index = 1; index < frames.length; index += 1) {
      const before = boxAt(frames[index - 1], name);
      const after = boxAt(frames[index], name);
      if (before === undefined || after === undefined) continue;
      if (!onStage(before, stage) && !onStage(after, stage)) continue;
      const px = Math.hypot(centre(after).x - centre(before).x, centre(after).y - centre(before).y);
      if (px > limits.jump)
        findings.push({
          kind: "jump",
          element: name,
          at: frames[index]?.at ?? 0,
          px: Math.round(px),
        });
    }

  const last = frames.at(-1);
  const previous = frames.at(-2);
  const moving = names.filter((name) => !sameBox(boxAt(previous, name), boxAt(last, name)));
  for (const element of moving) findings.push({ kind: "still-moving", element });
  if (moving.length === 0 && last !== undefined) {
    let settled = frames.length - 1;
    while (
      settled > 0 &&
      names.every((name) => sameBox(boxAt(frames[settled - 1], name), boxAt(frames[settled], name)))
    )
      settled -= 1;
    const hold = last.at - (frames[settled]?.at ?? 0);
    if (settled > 0 && hold < limits.hold) findings.push({ kind: "short-hold", ms: hold });
  }
  return findings;
}

/** One line per finding, for a reader who wants prose rather than JSON. */
export function describeFinding(finding: Finding): string {
  switch (finding.kind) {
    case "overlap":
      return `${finding.a} overlaps ${finding.b} for ${finding.frames} frames, ${finding.from}-${finding.to} ms`;
    case "jump":
      return `${finding.element} jumps ${finding.px} px at ${finding.at} ms`;
    case "short-hold":
      return `the final pose holds only ${finding.ms} ms`;
    case "still-moving":
      return `${finding.element} is still moving on the last frame`;
    default:
      return unreachable(finding);
  }
}

export function parseCheckArgs(argv: readonly string[]): CheckArgs {
  const usage = (message: string): CheckArgs => ({ kind: "usage", message: `${message} ${USAGE}` });
  const read = readPageArgs(argv, ["--watch", "--to", "--overlap", "--hold", "--jump"]);
  if (read.kind === "usage") return usage(read.message);
  const watch =
    read.flags
      .get("--watch")
      ?.split(",")
      .filter((part) => part !== "") ?? [];
  if (watch.length === 0) return usage("--watch needs CSS selectors.");
  const number = (flag: string, fallback?: number): number | undefined => {
    const text = read.flags.get(flag);
    if (text === undefined) return fallback;
    const value = Number(text);
    return text !== "" && Number.isFinite(value) && value >= 0 ? value : undefined;
  };
  const to = number("--to");
  const overlap = number("--overlap", DEFAULT_LIMITS.overlap);
  const hold = number("--hold", DEFAULT_LIMITS.hold);
  const jump = number("--jump", DEFAULT_LIMITS.jump);
  if (to === undefined) return usage("--to needs the run's end, in ms.");
  if (overlap === undefined || hold === undefined || jump === undefined)
    return usage("--overlap, --hold and --jump need non-negative numbers.");
  return { kind: "ok", ...read.target, watch, to, limits: { overlap, hold, jump } };
}

/** Samples every watched element each 16 ms up to `to`, then reports what `analyse` finds. */
export async function checkMotion(request: CheckRequest): Promise<CheckResult> {
  const { value, pageErrors } = await withPage(request, async ({ page, advanceTo }) => {
    const frames: Frame[] = [];
    for (let at = 0; at <= request.to; at += STEP_MS) {
      await advanceTo(at);
      const elements = await page.evaluate((selectors) => {
        const found: {
          name: string;
          box: { x: number; y: number; width: number; height: number };
        }[] = [];
        for (const selector of selectors)
          document.querySelectorAll(selector).forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            const text = (element.textContent ?? "").trim().slice(0, 12);
            found.push({
              name: `${selector}[${index}]${text === "" ? "" : ` "${text}"`}`,
              box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            });
          });
        return found;
      }, request.watch);
      frames.push({ at, elements });
    }
    return frames;
  });
  return {
    kind: "checked",
    frames: value.length,
    findings: analyse(value, request, request.limits),
    pageErrors,
  };
}
