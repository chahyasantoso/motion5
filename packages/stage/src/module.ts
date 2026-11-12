import type { Events, Time } from "@gerak/moves";
import { castNames, type Cast, type Member } from "./cast";
import type { Box, Rest } from "./rest";
import { frame, story, type Frame, type Story } from "./story";

/** How the cast looks on each renderer; a member a skin leaves out gets the renderer's default. */
export interface Skins {
  /** CSS scoped to the stage, styling each member by `[data-cast="<name>"]`. */
  readonly dom?: { readonly css?: string };
}

/** What a stage module exports: its story, its cast, their skins and a scene answering `V`. */
export interface StageModule<B extends string = string, V extends object = object> {
  readonly beats: Story<B>;
  readonly cast: Cast;
  readonly skins: Skins;
  readonly scene: (time: Time, events: Events, rest: Rest) => V;
  /** The stage's size; 1280 by 720 when left out. */
  readonly frame?: Frame;
  /** Where things rest for a tool with no renderer to measure them. */
  readonly rest?: Rest;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isMember(value: unknown): value is Member {
  if (!isRecord(value)) return false;
  switch (value["kind"]) {
    case "actor":
      return true;
    case "many": {
      const items = value["items"];
      return Array.isArray(items) && items.every(isMember);
    }
    case "group":
      return isCast(value["members"]);
    default:
      return false;
  }
}

function isCast(value: unknown): value is Cast {
  return isRecord(value) && Object.values(value).every(isMember);
}

function isBox(value: unknown): value is Box {
  return isRecord(value) && ["x", "y", "width", "height"].every((key) => isNumber(value[key]));
}

function isRest(value: unknown): value is Rest {
  return isRecord(value) && Object.values(value).every(isBox);
}

function readStory(value: unknown): Story<string> | string {
  const fail = "`beats` must be made by `story`.";
  if (!isRecord(value) || !isNumber(value["durationMs"]) || !Array.isArray(value["order"]))
    return fail;
  const spans: Record<string, readonly [number, number]> = {};
  for (const name of value["order"]) {
    const span: unknown = typeof name === "string" ? value[name] : undefined;
    if (
      typeof name !== "string" ||
      !isRecord(span) ||
      !isNumber(span["from"]) ||
      !isNumber(span["to"])
    )
      return fail;
    spans[name] = [span["from"], span["to"]];
  }
  return story(value["durationMs"], spans);
}

function readSkins(value: unknown): Skins | string {
  const fail = "`skins` must be an object, with `dom.css` a string when given.";
  if (!isRecord(value)) return fail;
  const dom = value["dom"];
  if (dom === undefined) return {};
  if (!isRecord(dom)) return fail;
  const css = dom["css"];
  if (css === undefined) return { dom: {} };
  return typeof css === "string" ? { dom: { css } } : fail;
}

/** A stage module read from what a file exports, or why it is not one; it never throws. */
export function readStageModule(value: unknown): StageModule | { readonly reason: string } {
  const reason = (why: string) => ({ reason: `The module is not a stage module: ${why}` });
  if (!isRecord(value)) return reason("it exports nothing.");
  const scene = value["scene"];
  if (typeof scene !== "function") return reason("`scene` must be a function.");
  try {
    const beats = readStory(value["beats"]);
    if (typeof beats === "string") return reason(beats);
    const cast = value["cast"];
    if (!isCast(cast)) return reason("`cast` must be made by `actor`, `many` and `group`.");
    castNames(cast, beats.order);
    const skins = readSkins(value["skins"]);
    if (typeof skins === "string") return reason(skins);
    const size = value["frame"];
    if (
      size !== undefined &&
      !(isRecord(size) && isNumber(size["width"]) && isNumber(size["height"]))
    )
      return reason("`frame` must be made by `frame`.");
    const rest = value["rest"];
    if (rest !== undefined && !isRest(rest))
      return reason("`rest` must hold { x, y, width, height } boxes by name.");
    return {
      beats,
      cast,
      skins,
      scene: (time, events, at) => {
        const values: unknown = Reflect.apply(scene, undefined, [time, events, at]);
        if (!(typeof values === "object" && values !== null))
          throw new TypeError("The scene returned no targets.");
        return values;
      },
      ...(isRecord(size) && isNumber(size["width"]) && isNumber(size["height"])
        ? { frame: frame({ width: size["width"], height: size["height"] }) }
        : {}),
      ...(isRest(rest) ? { rest } : {}),
    };
  } catch (error) {
    return reason(error instanceof Error ? error.message : String(error));
  }
}
