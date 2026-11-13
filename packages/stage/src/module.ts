import type { Events, Time } from "@gerak/moves";
import { castNames, isCubics, type Cast, type Member } from "./cast";
import type { Box, Layouts, Rest } from "./rest";
import { frame, story, type Frame, type Story } from "./story";

/** How the cast looks on each renderer; a member a skin leaves out gets the renderer's default. */
export interface Skins {
  /** CSS scoped to the stage, styling each member by `[data-cast="<name>"]`. */
  readonly dom?: { readonly css?: string };
}

/** What a stage module exports: its story, its cast, their skins and a scene answering `V`. */
export interface StageModule<
  B extends string = string,
  V extends object = object,
  L extends string = string,
> {
  readonly beats: Story<B>;
  readonly cast: Cast;
  readonly skins: Skins;
  /** `rest` is the layout in force; `layouts` holds every declared layout's rest. */
  readonly scene: (time: Time, events: Events, rest: Rest, layouts: Layouts<L>) => V;
  /** The stage's size; 1280 by 720 when left out. */
  readonly frame?: Frame;
  /** Where things rest for a tool with no renderer to measure them; a module with `layouts` gives `rests`. */
  readonly rest?: Rest;
  /** Named layouts, each styled under `[data-layout="<name>"]`; the first is in force without `layout`. */
  readonly layouts?: readonly L[];
  /** The layout in force after the events so far; it reads no time, so a change is its event's moment. */
  readonly layout?: (events: Events) => L;
  /** Each layout's rest for a tool with no renderer to measure them. */
  readonly rests?: Layouts<L>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isOptional(value: unknown, test: (given: unknown) => boolean): boolean {
  return value === undefined || test(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isStretch(value: unknown): boolean {
  return isString(value) || (Array.isArray(value) && value.length === 2 && value.every(isString));
}

/** Fixed text, or a function of time answering it on each frame. */
function isText(value: unknown): boolean {
  return isString(value) || typeof value === "function";
}

/** A fixed list of cubics, or a function answering them once the stage has measured. */
function isPath(value: unknown): boolean {
  return typeof value === "function" || isCubics(value);
}

function isMember(value: unknown): value is Member {
  if (!isRecord(value) || "enters" in value || "leaves" in value) return false;
  const on = value["on"];
  if (!isOptional(on, (given) => Array.isArray(given) && given.every(isStretch))) return false;
  switch (value["kind"]) {
    case "actor":
      return isOptional(value["text"], isText) && isOptional(value["path"], isPath);
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

function isLayouts(value: unknown): value is Layouts {
  return isRecord(value) && Object.values(value).every(isRest);
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

interface ReadLayouts {
  readonly layouts?: readonly string[];
  readonly layout?: (events: Events) => string;
  readonly rests?: Layouts;
}

/** `layouts`, `layout` and `rests` as one module declares them, or why they do not fit together. */
function readLayouts(value: Record<string, unknown>): ReadLayouts | string {
  const names = value["layouts"];
  const pick = value["layout"];
  const rests = value["rests"];
  if (names === undefined) {
    if (pick !== undefined) return "`layout` needs `layouts`, the names it may answer.";
    if (rests !== undefined) return "`rests` needs `layouts`; a module without them gives `rest`.";
    return {};
  }
  if (!(Array.isArray(names) && names.length > 0 && names.every(isString)))
    return "`layouts` must be a list of one or more names.";
  const declared: readonly string[] = Object.freeze([...names]);
  if (new Set(declared).size !== declared.length) return "`layouts` names a layout twice.";
  if (value["rest"] !== undefined) return "a module with `layouts` gives `rests`, not `rest`.";
  if (pick !== undefined && typeof pick !== "function")
    return "`layout` must be a function of the events.";
  if (rests !== undefined) {
    if (!isLayouts(rests)) return "`rests` must hold one `rest` per layout.";
    const missing = declared.find((name) => !Object.hasOwn(rests, name));
    if (missing !== undefined) return `\`rests\` has no rest for the layout "${missing}".`;
  }
  const chosen =
    typeof pick === "function"
      ? (events: Events): string => {
          const answer: unknown = Reflect.apply(pick, undefined, [events]);
          if (typeof answer === "string" && declared.includes(answer)) return answer;
          throw new RangeError(
            `layout answered ${JSON.stringify(answer)}, which is not one of ${declared.join(", ")}.`,
          );
        }
      : undefined;
  if (chosen !== undefined) chosen([]);
  return {
    layouts: declared,
    ...(chosen === undefined ? {} : { layout: chosen }),
    ...(isLayouts(rests) ? { rests } : {}),
  };
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
    if (!isCast(cast))
      return reason(
        "`cast` must be made by `actor`, `many` and `group`, with `text` a string or a function of time, `path` cubics made by `toCubics` or a function of `rest` answering them, and `on` a list of beats or pairs of beats (`enters` and `leaves` are gone).",
      );
    for (const { name, on, kind, text } of castNames(cast, beats.order)) {
      if (kind === "item" && typeof text === "function")
        return reason(
          `"${name}" is an item of a list with text that follows time; a list's text is fixed, since its length is the scene's shape. Make it an \`actor\`.`,
        );
      for (const [from, to] of on ?? []) {
        const start = beats[from]?.from ?? 0;
        const end = beats[to]?.to ?? 0;
        if (end < start)
          return reason(`"${name}" is on from "${from}" to "${to}", which ends before it starts.`);
      }
    }
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
    const layouts = readLayouts(value);
    if (typeof layouts === "string") return reason(layouts);
    return {
      beats,
      cast,
      skins,
      ...layouts,
      scene: (time, events, at, measured) => {
        const values: unknown = Reflect.apply(scene, undefined, [time, events, at, measured]);
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
