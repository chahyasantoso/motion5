import { unreachable } from "./unreachable";
import { blend, contrastNeeded, contrastRatio, parseColour, type Colour } from "./contrast";
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
  | { readonly kind: "still-moving"; readonly element: string }
  | {
      readonly kind: "low-contrast";
      readonly element: string;
      readonly ratio: number;
      readonly needs: number;
    }
  | { readonly kind: "cut-off"; readonly element: string; readonly shown: number };

export interface Frame {
  readonly at: number;
  readonly elements: readonly {
    readonly name: string;
    readonly box: Box;
    /** Watched elements this one is meant to touch, marked on the page with `data-motion-touch`. */
    readonly touches?: readonly string[];
  }[];
}

/** A piece of text on the last frame: where its glyphs are, how much of them shows, and how it is painted. */
export interface FinalText {
  readonly name: string;
  readonly box: Box;
  readonly shown: number;
  readonly colour: string;
  readonly opacity: number;
  readonly fontSize: number;
  readonly fontWeight: number;
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

/** Two frames show an element alike: the same box, or gone from both, removed or faded out. */
function sameBox(a: Box | undefined, b: Box | undefined): boolean {
  if (a === undefined || b === undefined) return a === b;
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

/** Names still changing between the last two samples, else a short-hold when the final rest is under `hold` ms. */
export function restFindings(
  ats: readonly number[],
  names: readonly string[],
  same: (name: string, before: number, after: number) => boolean,
  hold: number,
): readonly Finding[] {
  const lastIndex = ats.length - 1;
  if (lastIndex < 0) return [];
  const moving = names.filter((name) => !same(name, lastIndex - 1, lastIndex));
  if (moving.length > 0) return moving.map((element) => ({ kind: "still-moving", element }));
  let settled = lastIndex;
  while (settled > 0 && names.every((name) => same(name, settled - 1, settled))) settled -= 1;
  const rest = (ats[lastIndex] ?? 0) - (ats[settled] ?? 0);
  return settled > 0 && rest < hold ? [{ kind: "short-hold", ms: rest }] : [];
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
  const meant = (a: string, b: string) =>
    frames.some(({ elements }) =>
      elements.some(
        ({ name, touches }) =>
          (name === a && touches?.includes(b) === true) ||
          (name === b && touches?.includes(a) === true),
      ),
    );

  for (const [i, a] of names.entries())
    for (const b of names.slice(i + 1)) {
      if (meant(a, b)) continue;
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

  findings.push(
    ...restFindings(
      frames.map(({ at }) => at),
      names,
      (name, before, after) => sameBox(boxAt(frames[before], name), boxAt(frames[after], name)),
      limits.hold,
    ),
  );
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
    case "low-contrast":
      return `${finding.element} has contrast ${finding.ratio}:1 against what is behind it on the last frame, under ${finding.needs}:1`;
    case "cut-off":
      return `${finding.element} shows only ${Math.round(finding.shown * 100)}% of its glyphs on the last frame`;
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

/** Text on the last frame too faint against what is behind it, or cut off by the stage or a clipping parent. */
export function auditText(
  texts: readonly FinalText[],
  behind: readonly (Colour | undefined)[],
): readonly Finding[] {
  const findings: Finding[] = [];
  texts.forEach((text, index) => {
    if (text.shown < CUT_OFF)
      findings.push({
        kind: "cut-off",
        element: text.name,
        shown: Math.round(text.shown * 100) / 100,
      });
    const ink = parseColour(text.colour);
    const ground = behind[index];
    if (ink === undefined || ground === undefined) return;
    const ratio = contrastRatio(blend(ink, ground, text.opacity), ground);
    const needs = contrastNeeded(text.fontSize, text.fontWeight);
    if (ratio < needs)
      findings.push({
        kind: "low-contrast",
        element: text.name,
        ratio: Math.round(ratio * 10) / 10,
        needs,
      });
  });
  return findings;
}

/** Less of a text's line box than this on the page is cut off; the box runs past the ink, so a little is spare. */
const CUT_OFF = 0.9;

const HIDE_TEXT = `*{color:transparent!important;-webkit-text-fill-color:transparent!important;
text-shadow:none!important;text-decoration-color:transparent!important}
text,tspan{fill:transparent!important;stroke:transparent!important}`;

/** Samples every watched element each 16 ms up to `to`, then reports what `analyse` finds. */
export async function checkMotion(request: CheckRequest): Promise<CheckResult> {
  const { value, pageErrors } = await withPage(request, async ({ page, advanceTo }) => {
    const frames: Frame[] = [];
    let texts: FinalText[] = [];
    for (let at = 0; at <= request.to; at += STEP_MS) {
      await advanceTo(at);
      const final = at + STEP_MS > request.to;
      const sampled = await page.evaluate(
        ({ selectors, final }) => {
          const found: {
            name: string;
            box: { x: number; y: number; width: number; height: number };
            touches: string[];
          }[] = [];
          // The part of an element a viewer can see: none when hidden or transparent, else its box cut by clipping ancestors.
          const visible = (element: Element) => {
            if (getComputedStyle(element).visibility !== "visible") return undefined;
            return visiblePart(element, element.getBoundingClientRect());
          };
          const visiblePart = (element: Element, rect: DOMRect) => {
            let { left, top, right, bottom } = rect;
            for (let node: Element | null = element; node !== null; node = node.parentElement) {
              const style = getComputedStyle(node);
              if (Number(style.opacity) === 0) return undefined;
              if (node === element) continue;
              const clip = node.getBoundingClientRect();
              if (style.overflowX !== "visible")
                [left, right] = [Math.max(left, clip.left), Math.min(right, clip.right)];
              if (style.overflowY !== "visible")
                [top, bottom] = [Math.max(top, clip.top), Math.min(bottom, clip.bottom)];
            }
            if (right <= left || bottom <= top) return undefined;
            return { x: left, y: top, width: right - left, height: bottom - top };
          };
          const named: { element: Element; name: string }[] = [];
          for (const selector of selectors)
            document.querySelectorAll(selector).forEach((element, index) => {
              const text = (element.textContent ?? "").trim().slice(0, 12);
              named.push({
                element,
                name: `${selector}[${index}]${text === "" ? "" : ` "${text}"`}`,
              });
            });
          for (const { element, name } of named) {
            const box = visible(element);
            if (box === undefined) continue;
            const mark = element.getAttribute("data-motion-touch");
            const touches =
              mark === null
                ? []
                : named
                    .filter((other) => other.element !== element)
                    .filter((other) => mark.trim() === "" || other.element.matches(mark))
                    .map((other) => other.name);
            found.push({ name, box, touches });
          }
          const texts: {
            name: string;
            box: { x: number; y: number; width: number; height: number };
            shown: number;
            colour: string;
            opacity: number;
            fontSize: number;
            fontWeight: number;
          }[] = [];
          if (final)
            for (const element of document.body.querySelectorAll("*")) {
              const own = [...element.childNodes].filter(
                (node) =>
                  node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim() !== "",
              );
              const first = own[0];
              const last = own.at(-1);
              if (first === undefined || last === undefined || visible(element) === undefined)
                continue;
              const range = document.createRange();
              range.setStartBefore(first);
              range.setEndAfter(last);
              const glyphs = range.getBoundingClientRect();
              const area = glyphs.width * glyphs.height;
              const part = visiblePart(element, glyphs);
              if (part === undefined || area === 0) continue;
              const left = Math.max(part.x, 0);
              const top = Math.max(part.y, 0);
              const right = Math.min(part.x + part.width, innerWidth);
              const bottom = Math.min(part.y + part.height, innerHeight);
              if (right <= left || bottom <= top) continue;
              // A parent clipping text is usually a mask; only the page's own edge cuts text off.
              const onPage =
                (Math.min(glyphs.right, innerWidth) - Math.max(glyphs.left, 0)) *
                (Math.min(glyphs.bottom, innerHeight) - Math.max(glyphs.top, 0));
              let opacity = 1;
              for (let node: Element | null = element; node !== null; node = node.parentElement)
                opacity *= Number(getComputedStyle(node).opacity);
              const style = getComputedStyle(element);
              const tag = element.tagName.toLowerCase();
              const kind =
                element.classList[0] === undefined ? tag : `${tag}.${element.classList[0]}`;
              texts.push({
                name: `${kind} "${(element.textContent ?? "").trim().slice(0, 12)}"`,
                box: { x: left, y: top, width: right - left, height: bottom - top },
                shown: onPage / area,
                colour: style.color,
                opacity,
                fontSize: Number.parseFloat(style.fontSize),
                fontWeight: Number(style.fontWeight),
              });
            }
          return { found, texts };
        },
        { selectors: request.watch, final },
      );
      frames.push({ at, elements: sampled.found });
      if (final) texts = sampled.texts;
    }
    if (texts.length === 0) return { frames, texts, behind: [] };
    const hidden = await page.addStyleTag({ content: HIDE_TEXT });
    const shot = (await page.screenshot()).toString("base64");
    await hidden.evaluate((node) => node.parentNode?.removeChild(node));
    const behind = await page.evaluate(
      async ({ shot, boxes }) => {
        const image = new Image();
        image.src = `data:image/png;base64,${shot}`;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        if (context === null) return boxes.map(() => undefined);
        context.drawImage(image, 0, 0);
        const scale = image.width / innerWidth;
        // The median colour of a grid of points inside the box: what the text is read against.
        return boxes.map((box) => {
          const samples: number[][] = [];
          for (let i = 1; i <= 7; i += 1)
            for (let j = 1; j <= 5; j += 1) {
              const x = Math.floor((box.x + (box.width * i) / 8) * scale);
              const y = Math.floor((box.y + (box.height * j) / 6) * scale);
              samples.push([...context.getImageData(x, y, 1, 1).data.slice(0, 3)]);
            }
          const median = (channel: number) =>
            samples.map((sample) => sample[channel] ?? 0).sort((a, b) => a - b)[
              Math.floor(samples.length / 2)
            ] ?? 0;
          return { r: median(0), g: median(1), b: median(2), a: 1 };
        });
      },
      { shot, boxes: texts.map(({ box }) => box) },
    );
    return { frames, texts, behind };
  });
  return {
    kind: "checked",
    frames: value.frames.length,
    findings: [
      ...analyse(value.frames, request, request.limits),
      ...auditText(value.texts, value.behind),
    ],
    pageErrors,
  };
}
