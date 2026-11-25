import { unreachable } from "./unreachable";
import { blend, contrastNeeded, contrastRatio, parseColour, type Colour } from "./contrast";
import type { Box } from "./frames";
import {
  formatSize,
  parseSizes,
  readPageArgs,
  withPage,
  type PageTarget,
  type ViewportSize,
} from "./page";
import {
  SAFE_ZONE_USAGE,
  parseSafeZone,
  safeZone,
  unsafeEdges,
  type SafeEdge,
  type SafeZone,
  type SafeZoneName,
} from "./safe-zone";

/** What `gerak check` tolerates: `overlap` frames, final `hold` in ms, and centre `jump` between two frames in px. */
export interface Limits {
  /** Overlapping frames tolerated before an overlap is reported. */
  readonly overlap: number;
  /** Shortest final hold, in ms, after the last change. */
  readonly hold: number;
  /** Largest centre move between two frames, in px. */
  readonly jump: number;
}

/** The limits when no flag sets them: 12 overlapping frames, a 500 ms final hold, a 150 px jump. */
export const DEFAULT_LIMITS: Limits = Object.freeze({ overlap: 12, hold: 500, jump: 150 });

/** One thing `gerak check` found: overlap, jump, short-hold, still-moving, low-contrast,
 * cut-off, unsafe-zone, or media-short. */
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
  | { readonly kind: "short-hold"; readonly ms: number; readonly targets: readonly string[] }
  | { readonly kind: "still-moving"; readonly element: string }
  | {
      readonly kind: "low-contrast";
      readonly element: string;
      readonly ratio: number;
      readonly needs: number;
    }
  | { readonly kind: "cut-off"; readonly element: string; readonly shown: number }
  | {
      readonly kind: "unsafe-zone";
      readonly element: string;
      readonly zone: SafeZoneName;
      readonly edge: SafeEdge;
      readonly at: number;
    }
  | {
      readonly kind: "media-short";
      readonly element: string;
      readonly clipMs: number;
      readonly shownMs: number;
    };

/** One sample at `at` ms: each watched element's name and box, and the watched elements it may touch. */
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

/** What `gerak check` runs: the page, the `watch` selectors, end `to` in ms and `limits`, every 16 ms.
 * With `safeZone`, text and watched boxes in that platform's reserved margins are reported. */
export interface CheckRequest extends PageTarget {
  readonly watch: readonly string[];
  readonly to: number;
  readonly limits: Limits;
  readonly sizes?: readonly ViewportSize[];
  readonly safeZone?: SafeZoneName;
}

/** Parsed `gerak check` arguments, or the usage text. */
export type CheckArgs =
  | ({ readonly kind: "ok" } & CheckRequest)
  | { readonly kind: "usage"; readonly message: string };

/** One viewport's `gerak check` outcome when `--sizes` runs several viewports. */
export interface ViewportCheckResult {
  readonly size: string;
  readonly width: number;
  readonly height: number;
  readonly frames: number;
  readonly findings: readonly Finding[];
  readonly pageErrors: readonly string[];
}

/** What `gerak check` found: the `frames` sampled, the `findings` (none means clean) and the page's errors. */
export interface CheckResult {
  readonly kind: "checked";
  readonly frames: number;
  readonly findings: readonly Finding[];
  readonly pageErrors: readonly string[];
  readonly viewports?: readonly ViewportCheckResult[];
}

const STEP_MS = 16;
const USAGE =
  "usage: gerak check <page> --watch selector,selector --to ms [--size WxH | --sizes WxH,WxH] [--safe-zone tiktok|reels|shorts|youtube] [--overlap frames] [--hold ms] [--jump px]";

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
  if (!(settled > 0 && rest < hold)) return [];
  const targets = names.filter((name) =>
    ats.some(
      (at, index) =>
        index > 0 && (ats[lastIndex] ?? 0) - at < hold && !same(name, index - 1, index),
    ),
  );
  return [{ kind: "short-hold", ms: rest, targets }];
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
      return `${finding.targets.join(", ")} still ${finding.targets.length === 1 ? "changes" : "change"} ${finding.ms} ms before the end`;
    case "still-moving":
      return `${finding.element} is still moving on the last frame`;
    case "low-contrast":
      return `${finding.element} has contrast ${finding.ratio}:1 against what is behind it on the last frame, under ${finding.needs}:1`;
    case "cut-off":
      return `${finding.element} shows only ${Math.round(finding.shown * 100)}% of its glyphs on the last frame`;
    case "unsafe-zone":
      return `${finding.element} enters the ${finding.zone} ${finding.edge} margin at ${finding.at} ms`;
    case "media-short":
      return `${finding.element} plays a ${finding.clipMs} ms clip in a ${finding.shownMs} ms window, so it holds its last frame for the rest`;
    default:
      return unreachable(finding);
  }
}

/** Finding lines for a check result, prefixed with `[WIDTHxHEIGHT]` on multi-viewport runs. */
export function describeCheckLines(result: CheckResult): readonly string[] {
  if (result.viewports === undefined) return result.findings.map(describeFinding);
  return result.viewports.flatMap((vp) =>
    vp.findings.map((finding) => `[${vp.size}] ${describeFinding(finding)}`),
  );
}

/** Consecutive sampled frames a box must stay in a margin band, beyond, before it counts as resting there. */
const ZONE_FRAMES = 12;

/** One finding per element and edge: its first run in the platform's margin over 12 frames, or lasting to the last frame. */
export function zoneFindings(
  frames: readonly Frame[],
  zone: SafeZone,
  stage: { readonly width: number; readonly height: number },
): readonly Finding[] {
  const done = new Set<string>();
  const open = new Map<string, { name: string; edge: SafeEdge; at: number; length: number }>();
  const found: { readonly at: number; readonly finding: Finding }[] = [];
  const close = (key: string, atEnd: boolean) => {
    const run = open.get(key);
    open.delete(key);
    if (run === undefined || done.has(key) || !(atEnd || run.length > ZONE_FRAMES)) return;
    done.add(key);
    found.push({
      at: run.at,
      finding: {
        kind: "unsafe-zone",
        element: run.name,
        zone: zone.name,
        edge: run.edge,
        at: run.at,
      },
    });
  };
  for (const frame of frames) {
    const active = new Map<string, { name: string; edge: SafeEdge }>();
    for (const { name, box } of frame.elements)
      for (const edge of unsafeEdges(box, zone, stage))
        active.set(`${edge} ${name}`, { name, edge });
    for (const key of [...open.keys()]) if (!active.has(key)) close(key, false);
    for (const [key, entry] of active) {
      const run = open.get(key);
      if (run === undefined) open.set(key, { ...entry, at: frame.at, length: 1 });
      else run.length += 1;
    }
  }
  for (const key of [...open.keys()]) close(key, true);
  return found.sort((a, b) => a.at - b.at).map(({ finding }) => finding);
}

/** Reads `<page> --watch sel,sel --to ms [--size WxH | --sizes WxH,WxH] [--safe-zone name] [--overlap n]
 * [--hold ms] [--jump px]`, or usage. Without a size, `--safe-zone` sets its own. */
export function parseCheckArgs(argv: readonly string[]): CheckArgs {
  const usage = (message: string): CheckArgs => ({ kind: "usage", message: `${message} ${USAGE}` });
  const read = readPageArgs(argv, [
    "--watch",
    "--to",
    "--overlap",
    "--hold",
    "--jump",
    "--sizes",
    "--safe-zone",
  ]);
  if (read.kind === "usage") return usage(read.message);
  if (read.flags.has("--sizes") && read.flags.has("--size"))
    return usage("Pass --size or --sizes, not both.");
  const sizes = read.flags.has("--sizes") ? parseSizes(read.flags.get("--sizes")) : undefined;
  if (typeof sizes === "string") return usage(sizes);
  const zoneName = read.flags.has("--safe-zone")
    ? parseSafeZone(read.flags.get("--safe-zone"))
    : undefined;
  if (read.flags.has("--safe-zone") && zoneName === undefined) return usage(SAFE_ZONE_USAGE);
  const firstSize =
    sizes?.[0] ??
    (zoneName === undefined || read.flags.has("--size") ? undefined : safeZone(zoneName));
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
  return {
    kind: "ok",
    ...read.target,
    ...(firstSize === undefined ? {} : { width: firstSize.width, height: firstSize.height }),
    ...(sizes === undefined ? {} : { sizes }),
    ...(zoneName === undefined ? {} : { safeZone: zoneName }),
    watch,
    to,
    limits: { overlap, hold, jump },
  };
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
  if (request.sizes === undefined) return (await sampleMotion(request)).result;
  const { sizes, ...base } = request;
  const viewports: ViewportCheckResult[] = [];
  for (const size of sizes) {
    const { result } = await sampleMotion({
      ...base,
      width: size.width,
      height: size.height,
    });
    viewports.push({
      size: formatSize(size),
      width: size.width,
      height: size.height,
      frames: result.frames,
      findings: result.findings,
      pageErrors: result.pageErrors,
    });
  }
  return {
    kind: "checked",
    frames: viewports.reduce((sum, entry) => sum + entry.frames, 0),
    findings: viewports.flatMap((entry) => entry.findings),
    pageErrors: viewports.flatMap((entry) =>
      entry.pageErrors.map((error) => `[${entry.size}] ${error}`),
    ),
    viewports,
  };
}

/** `checkMotion` that also hands back the 16 ms samples it judged. */
export async function sampleMotion(
  request: CheckRequest,
): Promise<{ readonly result: CheckResult; readonly samples: readonly Frame[] }> {
  const { value, pageErrors } = await withPage(request, async ({ page, advanceTo }) => {
    const frames: Frame[] = [];
    const zoneFrames: Frame[] = [];
    let texts: FinalText[] = [];
    let mediaFindings: Finding[] = [];
    for (let at = 0; at <= request.to; at += STEP_MS) {
      await advanceTo(at);
      const final = at + STEP_MS > request.to;
      const sampled = await page.evaluate(
        ({ selectors, final, zone }) => {
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
          // The glyph box of an element's own text, cut to what shows and to the page, with how it is painted.
          const glyphsOf = (element: Element) => {
            const own = [...element.childNodes].filter(
              (node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim() !== "",
            );
            const first = own[0];
            const last = own.at(-1);
            if (first === undefined || last === undefined || visible(element) === undefined)
              return undefined;
            const range = document.createRange();
            range.setStartBefore(first);
            range.setEndAfter(last);
            const glyphs = range.getBoundingClientRect();
            const area = glyphs.width * glyphs.height;
            const part = visiblePart(element, glyphs);
            if (part === undefined || area === 0) return undefined;
            const left = Math.max(part.x, 0);
            const top = Math.max(part.y, 0);
            const right = Math.min(part.x + part.width, innerWidth);
            const bottom = Math.min(part.y + part.height, innerHeight);
            if (right <= left || bottom <= top) return undefined;
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
            return {
              name: `${kind} "${(element.textContent ?? "").trim().slice(0, 12)}"`,
              box: { x: left, y: top, width: right - left, height: bottom - top },
              shown: onPage / area,
              colour: style.color,
              opacity,
              fontSize: Number.parseFloat(style.fontSize),
              fontWeight: Number(style.fontWeight),
            };
          };
          const glyphBoxes: {
            name: string;
            box: { x: number; y: number; width: number; height: number };
          }[] = [];
          const seen = new Map<string, number>();
          const media: { name: string; clipMs: number; from: number; to: number }[] = [];
          if (final || zone)
            for (const element of document.body.querySelectorAll("*")) {
              const glyphs = glyphsOf(element);
              if (glyphs === undefined) continue;
              const count = (seen.get(glyphs.name) ?? 0) + 1;
              seen.set(glyphs.name, count);
              const text = count === 1 ? glyphs : { ...glyphs, name: `${glyphs.name} #${count}` };
              if (final) texts.push(text);
              if (zone) glyphBoxes.push({ name: text.name, box: text.box });
            }
          if (final) {
            const listed: unknown = Reflect.get(globalThis, Symbol.for("@gerak/dom/mounts"));
            if (Array.isArray(listed)) {
              for (const mounted of listed) {
                if (mounted === null || typeof mounted !== "object") continue;
                const readMedia: unknown = Reflect.get(mounted, "media");
                if (typeof readMedia !== "function") continue;
                const entries: unknown = Reflect.apply(readMedia, mounted, []);
                if (!Array.isArray(entries)) continue;
                for (const entry of entries) {
                  if (entry === null || typeof entry !== "object") continue;
                  const name: unknown = Reflect.get(entry, "name");
                  const clipMs: unknown = Reflect.get(entry, "clipMs");
                  const from: unknown = Reflect.get(entry, "from");
                  const to: unknown = Reflect.get(entry, "to");
                  if (
                    typeof name === "string" &&
                    typeof clipMs === "number" &&
                    Number.isFinite(clipMs) &&
                    typeof from === "number" &&
                    typeof to === "number"
                  ) {
                    media.push({ name, clipMs, from, to });
                  }
                }
              }
            }
          }
          return { found, texts, glyphBoxes, media };
        },
        { selectors: request.watch, final, zone: request.safeZone !== undefined },
      );
      frames.push({ at, elements: sampled.found });
      if (request.safeZone !== undefined)
        zoneFrames.push({ at, elements: [...sampled.found, ...sampled.glyphBoxes] });
      if (final) {
        texts = sampled.texts;
        mediaFindings = sampled.media
          .filter(({ clipMs, from, to }) => clipMs < to - from)
          .map(({ name, clipMs, from, to }) => ({
            kind: "media-short" as const,
            element: name,
            clipMs: Math.round(clipMs),
            shownMs: Math.round(to - from),
          }));
      }
    }
    if (texts.length === 0) return { frames, zoneFrames, texts, behind: [], mediaFindings };
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
    return { frames, zoneFrames, texts, behind, mediaFindings };
  });
  return {
    samples: value.frames,
    result: {
      kind: "checked",
      frames: value.frames.length,
      findings: [
        ...analyse(value.frames, request, request.limits),
        ...auditText(value.texts, value.behind),
        ...(request.safeZone === undefined
          ? []
          : zoneFindings(value.zoneFrames, safeZone(request.safeZone), request)),
        ...value.mediaFindings,
      ],
      pageErrors,
    },
  };
}
