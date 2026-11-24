import type { Page } from "playwright-core";
import { unreachable } from "./unreachable";

/** Where a scroll action scrolls: an absolute pixel offset, or a selector resolved in the active viewport. */
export type ScrollActionTarget =
  | { readonly kind: "px"; readonly px: number }
  | { readonly kind: "selector"; readonly selector: string; readonly offsetPx: number };

/** Something a person does to the page at `at` ms: point at, leave, click, press or release an element, or scroll. */
export type PageAction =
  | {
      readonly kind: "hover" | "leave" | "click" | "press" | "release";
      readonly selector: string;
      readonly at: number;
      /** Where on the element, in px from its top left corner; its middle when left out. */
      readonly point?: { readonly x: number; readonly y: number };
    }
  | { readonly kind: "scroll"; readonly target: ScrollActionTarget; readonly at: number };

const POINTER = ["hover", "leave", "click", "press", "release"] as const;

function isPointer(kind: string): kind is (typeof POINTER)[number] {
  return POINTER.some((known) => known === kind);
}

function parseScrollTarget(
  raw: string,
  part: string,
): ScrollActionTarget | { readonly reason: string } {
  const target = raw.trim();
  if (target === "")
    return { reason: `Action "${part}" needs a non-negative px offset or CSS selector.` };
  if (/^-?\d+(?:\.\d+)?$/.test(target)) {
    const px = Number(target);
    if (!Number.isFinite(px) || px < 0)
      return { reason: `Action "${part}" needs a non-negative scroll offset in px.` };
    return { kind: "px", px };
  }
  if (/^[+-]\d+(?:\.\d+)?$/.test(target))
    return { reason: `Action "${part}" needs a CSS selector before ${target}.` };
  const withPlus = /^(.+?)\+(\d+(?:\.\d+)?)$/.exec(target);
  if (withPlus !== null && withPlus[1] !== undefined && withPlus[2] !== undefined) {
    const selector = withPlus[1].trim();
    const offsetPx = Number(withPlus[2]);
    if (selector !== "" && Number.isFinite(offsetPx))
      return { kind: "selector", selector, offsetPx };
  }
  const withMinus = /^(.+?)-(\d+(?:\.\d+)?)$/.exec(target);
  if (
    withMinus !== null &&
    withMinus[1] !== undefined &&
    withMinus[2] !== undefined &&
    /(?:\s|[\])])$/.test(withMinus[1])
  ) {
    const selector = withMinus[1].trim();
    const n = Number(withMinus[2]);
    if (selector !== "" && Number.isFinite(n))
      return { kind: "selector", selector, offsetPx: n === 0 ? 0 : -n };
  }
  return { kind: "selector", selector: target, offsetPx: 0 };
}

/** `hover:.card@400,leave:.card@1200,click:.button@2000,scroll:600@3000` in time order, or why it is not one. */
export function parseActions(text: string): readonly PageAction[] | { readonly reason: string } {
  const actions: PageAction[] = [];
  for (const part of text.split(/,(?![^(]*\))/).map((piece) => piece.trim())) {
    const colon = part.indexOf(":");
    const at = part.lastIndexOf("@");
    const kind = part.slice(0, colon);
    const target = part.slice(colon + 1, at);
    const when = /^(\d+(?:\.\d+)?)(?:\((-?[\d.]+),(-?[\d.]+)\))?$/.exec(part.slice(at + 1));
    const ms = Number(when?.[1] ?? NaN);
    const point =
      when?.[2] === undefined || when[3] === undefined
        ? {}
        : { point: { x: Number(when[2]), y: Number(when[3]) } };
    if (colon <= 0 || at <= colon + 1 || !Number.isFinite(ms) || ms < 0)
      return { reason: `Action "${part}" needs kind:target@ms, like hover:.card@400.` };
    const previous = actions.at(-1);
    if (previous !== undefined && ms < previous.at)
      return {
        reason: `Action "${part}" comes before the one ahead of it; list actions in time order.`,
      };
    if (kind === "scroll") {
      const parsed = parseScrollTarget(target, part);
      if ("reason" in parsed) return parsed;
      actions.push({ kind, target: parsed, at: ms });
    } else if (isPointer(kind)) actions.push({ kind, selector: target, at: ms, ...point });
    else
      return { reason: `Action "${part}" is not hover, leave, click, press, release or scroll.` };
  }
  return actions;
}

/** The point to act on in the first element `selector` matches, its middle by default, and its box. */
async function place(
  page: Page,
  selector: string,
  point?: { readonly x: number; readonly y: number },
) {
  const box = await (await page.$(selector))?.boundingBox();
  if (box === undefined || box === null)
    throw new Error(`Action: nothing on the page matches ${selector}, or it has no box.`);
  return point === undefined
    ? { box, x: box.x + box.width / 2, y: box.y + box.height / 2 }
    : { box, x: box.x + point.x, y: box.y + point.y };
}

/** Does `action` to the page with the real mouse, so the page sees the same pointer events a person makes. */
export async function perform(page: Page, action: PageAction): Promise<void> {
  switch (action.kind) {
    case "scroll":
      switch (action.target.kind) {
        case "px":
          await page.evaluate((px) => {
            scrollTo({ top: px, behavior: "instant" });
            document.dispatchEvent(new Event("scroll", { bubbles: true }));
          }, action.target.px);
          return;
        case "selector": {
          const outcome = await page.evaluate(
            ({ selector, offsetPx }) => {
              let found: Element | null = null;
              try {
                found = document.querySelector(selector);
              } catch (error) {
                return {
                  ok: false as const,
                  reason: error instanceof Error ? error.message : String(error),
                };
              }
              if (found === null) return { ok: false as const, reason: "missing" };
              const top = Math.max(
                0,
                found.getBoundingClientRect().top + window.scrollY + offsetPx,
              );
              scrollTo({ top, behavior: "instant" });
              document.dispatchEvent(new Event("scroll", { bubbles: true }));
              return { ok: true as const };
            },
            { selector: action.target.selector, offsetPx: action.target.offsetPx },
          );
          if (!outcome.ok) {
            throw new Error(
              outcome.reason === "missing"
                ? `Action: nothing on the page matches ${action.target.selector}.`
                : `Action: invalid selector ${action.target.selector} (${outcome.reason}).`,
            );
          }
          return;
        }
        default:
          return unreachable(action.target);
      }
    case "hover": {
      const { x, y } = await place(page, action.selector, action.point);
      await page.mouse.move(x, y);
      return;
    }
    case "leave": {
      const { box } = await place(page, action.selector, action.point);
      const away =
        box.x > 1 || box.y > 1
          ? { x: 0, y: 0 }
          : { x: box.x + box.width + 2, y: box.y + box.height + 2 };
      await page.mouse.move(away.x, away.y);
      return;
    }
    case "click": {
      const { x, y } = await place(page, action.selector, action.point);
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.up();
      return;
    }
    case "press": {
      const { x, y } = await place(page, action.selector, action.point);
      await page.mouse.move(x, y);
      await page.mouse.down();
      return;
    }
    case "release":
      await page.mouse.up();
      return;
    default:
      return unreachable(action);
  }
}
