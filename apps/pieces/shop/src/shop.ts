import {
  ease,
  mix,
  span,
  timeAt,
  type Events,
  type MotionEvent,
  type Pose2d,
  type Time,
} from "@gerak/moves";
import { actor, carried, many, restOf, story, type Layouts, type Rest } from "@gerak/stage";

/** A small shop: six products, a price sort, and a detail view that the grid folds into a rail beside. */
export const brief = "shop";

const products = [
  {
    name: "Linen Throw",
    price: 68,
    colour: "#d9c9b0",
    text: "Washed Belgian linen, 130 by 170 cm.",
  },
  {
    name: "Stoneware Mug",
    price: 24,
    colour: "#b9806a",
    text: "Hand-thrown, holds 350 ml, dishwasher safe.",
  },
  {
    name: "Oak Side Table",
    price: 189,
    colour: "#a7845c",
    text: "Solid white oak with an oiled finish.",
  },
  {
    name: "Wool Cushion",
    price: 42,
    colour: "#c8c2b4",
    text: "Undyed wool cover with a feather insert.",
  },
  {
    name: "Brass Lamp",
    price: 126,
    colour: "#c9a54e",
    text: "Spun brass shade on a weighted base.",
  },
  {
    name: "Ceramic Vase",
    price: 36,
    colour: "#8f9e86",
    text: "Matte glaze, 24 cm tall, watertight.",
  },
] as const;

const COUNT = products.length;
const firstOrder: readonly number[] = products.map((_, index) => index);
const priceOrder: readonly number[] = [...firstOrder].sort(
  (a, b) => (products[a]?.price ?? 0) - (products[b]?.price ?? 0),
);

export const layouts = [
  "first-grid",
  "first-0",
  "first-1",
  "first-2",
  "first-3",
  "first-4",
  "first-5",
  "price-grid",
  "price-0",
  "price-1",
  "price-2",
  "price-3",
  "price-4",
  "price-5",
] as const;
type Layout = (typeof layouts)[number];

type ShopState = { readonly sorted: boolean; readonly open: number | undefined };
const START: ShopState = { sorted: false, open: undefined };

const tileIndex = (target: string | undefined): number | undefined => {
  const match = /^tile\.(\d)$/.exec(target ?? "");
  return match === null ? undefined : Number(match[1]);
};

/** The shop after one more event: the sort control flips the order, a card opens, Back closes. */
const after = (state: ShopState, event: MotionEvent): ShopState => {
  if (event.name !== "click") return state;
  if (event.target === "sort") return { ...state, sorted: !state.sorted };
  if (event.target === "back") return { ...state, open: undefined };
  const opened = tileIndex(event.target);
  return opened === undefined ? state : { ...state, open: opened };
};

const stateOf = (events: Events): ShopState => events.reduce(after, START);

const layoutName = (state: ShopState): Layout => {
  const order = state.sorted ? "price" : "first";
  const view = state.open === undefined ? "grid" : String(state.open);
  return layouts.find((name) => name === `${order}-${view}`) ?? "first-grid";
};

/** The layout in force, from the events alone. */
export const layout = (events: Events): Layout => layoutName(stateOf(events));

export const beats = story(7000, { browse: [0, 7000] });

const textOf = (make: (product: (typeof products)[number]) => string) =>
  many(products, (product) => actor({ text: make(product) }));

export const cast = {
  title: actor({ text: "Field & Fold", still: true }),
  sort: actor({ text: "Sort by price", watch: true, still: true }),
  tick: actor(),
  tile: many(COUNT, { watch: true }),
  swatch: many(COUNT),
  label: textOf((product) => product.name),
  price: textOf((product) => `$${product.price}`),
  note: textOf((product) => product.text),
  back: actor({ text: "← Back", watch: true }),
};

/* The skin: every layout's boxes, written out as CSS. */

type Place = {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
};
type CardLook = {
  readonly tile: Place;
  readonly swatch: Place;
  readonly label: readonly [number, number, number];
  readonly price: readonly [number, number, number];
  readonly note: readonly [number, number, number];
  readonly z: number;
};

const GRID_LEFT = 64;
const TOP = 124;
const AREA_WIDTH = 1152;
const AREA_HEIGHT = 556;

const gridCard = (slot: number, z: number): CardLook => {
  const width = (AREA_WIDTH - 2 * 24) / 3;
  const height = (AREA_HEIGHT - 24) / 2;
  const left = GRID_LEFT + (slot % 3) * (width + 24);
  const top = TOP + Math.floor(slot / 3) * (height + 24);
  return {
    tile: { left, top, width, height },
    swatch: { left: left + 14, top: top + 14, width: width - 28, height: height - 96 },
    label: [left + 20, top + height - 70, 18],
    price: [left + 20, top + height - 40, 15],
    note: [left + 20, top + height - 40, 13],
    z,
  };
};

const RAIL_WIDTH = 248;
const railCard = (place: number, z: number): CardLook => {
  const height = (AREA_HEIGHT - 4 * 14) / 5;
  const left = GRID_LEFT;
  const top = TOP + place * (height + 14);
  return {
    tile: { left, top, width: RAIL_WIDTH, height },
    swatch: { left: left + 12, top: top + 12, width: height - 24, height: height - 24 },
    label: [left + height + 2, top + 28, 14],
    price: [left + height + 2, top + 54, 13],
    note: [left + height + 2, top + 54, 9],
    z,
  };
};

const DETAIL_LEFT = GRID_LEFT + RAIL_WIDTH + 24;
const DETAIL_WIDTH = GRID_LEFT + AREA_WIDTH - DETAIL_LEFT;
const DETAIL_TEXT = DETAIL_LEFT + 470;
const detailCard: CardLook = {
  tile: { left: DETAIL_LEFT, top: TOP, width: DETAIL_WIDTH, height: AREA_HEIGHT },
  swatch: { left: DETAIL_LEFT + 22, top: TOP + 22, width: 424, height: AREA_HEIGHT - 44 },
  label: [DETAIL_TEXT, TOP + 54, 36],
  price: [DETAIL_TEXT, TOP + 116, 24],
  note: [DETAIL_TEXT, TOP + 170, 17],
  z: 90,
};

const looksOf = (state: ShopState): readonly CardLook[] => {
  const order = state.sorted ? priceOrder : firstOrder;
  const rail = order.filter((index) => index !== state.open);
  return firstOrder.map((index) => {
    const z = 10 + index * 10;
    if (state.open === undefined) return gridCard(order.indexOf(index), z);
    return index === state.open ? detailCard : railCard(rail.indexOf(index), z);
  });
};

const box = (place: Place) =>
  `left: ${place.left}px; top: ${place.top}px; width: ${place.width}px; height: ${place.height}px;`;
const text = ([left, top, size]: readonly [number, number, number]) =>
  `left: ${left}px; top: ${top}px; font-size: ${size}px;`;

const layoutCss = (name: Layout, state: ShopState): string =>
  looksOf(state)
    .map((look, index) => {
      const scope = `[data-layout="${name}"] [data-cast`;
      return [
        `${scope}="tile.${index}"] { ${box(look.tile)} z-index: ${look.z}; }`,
        `${scope}="swatch.${index}"] { ${box(look.swatch)} z-index: ${look.z + 1}; }`,
        `${scope}="label.${index}"] { ${text(look.label)} z-index: ${look.z + 2}; }`,
        `${scope}="price.${index}"] { ${text(look.price)} z-index: ${look.z + 2}; }`,
        `${scope}="note.${index}"] { ${text(look.note)} z-index: ${look.z + 2}; }`,
      ].join("\n");
    })
    .join("\n");

const stateOfLayout = (name: Layout): ShopState => {
  const [order, view] = name.split("-");
  return { sorted: order === "price", open: view === "grid" ? undefined : Number(view) };
};

const swatches = products
  .map((product, index) => `[data-cast="swatch.${index}"] { background: ${product.colour}; }`)
  .join("\n");

export const skins = {
  dom: {
    css: `
[data-cast] { position: absolute; margin: 0; box-sizing: border-box; }
[data-cast="tile"], [data-cast="swatch"], [data-cast="label"], [data-cast="price"], [data-cast="note"] { left: 0; top: 0; width: 1280px; height: 720px; pointer-events: none; }
[data-cast="title"] { left: 64px; top: 46px; font: 600 26px/1.2 Georgia, "Times New Roman", serif; color: #2b2622; letter-spacing: 0.01em; }
[data-cast="sort"] { left: 1040px; top: 50px; width: 176px; height: 40px; padding: 0 14px 0 40px; border: 1px solid #cfc6ba; border-radius: 20px; font: 500 14px/38px system-ui, sans-serif; color: #2b2622; background: #fffdf9; cursor: pointer; user-select: none; }
[data-cast="tick"] { left: 1054px; top: 63px; width: 14px; height: 14px; border-radius: 7px; background: #2b2622; pointer-events: none; z-index: 2; }
[data-cast^="tile."] { background: #fffdf9; border: 1px solid #e3dcd1; border-radius: 10px; cursor: pointer; pointer-events: auto; }
[data-cast^="swatch."] { border-radius: 6px; pointer-events: none; }
[data-cast^="label."], [data-cast^="price."], [data-cast^="note."] { width: max-content; white-space: nowrap; line-height: 1.2; pointer-events: none; color: #2b2622; }
[data-cast^="label."] { font-family: Georgia, "Times New Roman", serif; font-weight: 600; }
[data-cast^="price."] { font-family: system-ui, sans-serif; color: #6b5f52; font-variant-numeric: tabular-nums; }
[data-cast^="note."] { font-family: system-ui, sans-serif; color: #5a5048; }
[data-cast="back"] { left: ${DETAIL_TEXT}px; top: ${TOP + AREA_HEIGHT - 82}px; width: 112px; height: 40px; border-radius: 20px; background: #2b2622; color: #fffdf9; font: 500 14px/40px system-ui, sans-serif; text-align: center; cursor: pointer; z-index: 95; user-select: none; }
${swatches}
${layouts.map((name) => layoutCss(name, stateOfLayout(name))).join("\n")}
`,
  },
};

/* The scene. */

const CARRY_MS = 420;
const parts = ["tile", "swatch", "label", "price", "note"] as const;
type Part = (typeof parts)[number];

/** How far a toggle is shown at `ms`: it eases from wherever it was when the events last changed it. */
const shownAt = (
  time: Time,
  events: Events,
  shown: (state: ShopState) => boolean,
  timing: { readonly delayMs: number; readonly inMs: number; readonly outMs: number },
): number => {
  let state = START;
  let from = shown(state) ? 1 : 0;
  let to = from;
  let stretch = span(0, 1);
  const at = (ms: number): number =>
    mix(from, to, stretch.of(timeAt(time, ms), ease.sineInOut).progress);
  for (const event of events) {
    state = after(state, event);
    const next = shown(state) ? 1 : 0;
    if (next === to) continue;
    from = at(event.at);
    to = next;
    const start = event.at + (next === 1 ? timing.delayMs : 0);
    stretch = span(start, start + (next === 1 ? timing.inMs : timing.outMs));
  }
  return mix(from, to, stretch.of(time, ease.sineInOut).progress);
};

export const scene = (time: Time, events: Events, rest: Rest, all: Layouts<Layout>) => {
  // A tool with no browser measures no layout; every card then rests where it is.
  const measured = Object.keys(all).length > 0;
  const carry = (part: Part, index: number): Pose2d => {
    if (!measured) return {};
    return carried({
      own: restOf(rest, `${part}.${index}`),
      at: (past) => restOf(all[layout(past)], `${part}.${index}`),
      events,
      time,
      ms: CARRY_MS,
      ease: ease.cubicOut,
      size: "scale",
    });
  };
  const row = (part: Part) => firstOrder.map((index) => carry(part, index));
  const detail = { delayMs: 260, inMs: 220, outMs: 120 };
  const notes = firstOrder.map((index) => {
    const pose: Pose2d = {
      ...carry("note", index),
      opacity: shownAt(time, events, (state) => state.open === index, detail),
    };
    return pose;
  });
  return {
    title: {} satisfies Pose2d,
    sort: {} satisfies Pose2d,
    tick: {
      opacity: shownAt(time, events, (state) => state.sorted, {
        delayMs: 0,
        inMs: 160,
        outMs: 160,
      }),
    },
    tile: row("tile"),
    swatch: row("swatch"),
    label: row("label"),
    price: row("price"),
    note: notes,
    back: { opacity: shownAt(time, events, (state) => state.open !== undefined, detail) },
  };
};

/** One visitor: sorts, changes their mind mid-flight, opens the third card, and comes back. */
export const cues: Events = [
  { name: "click", at: 1500, target: "sort" },
  { name: "click", at: 1700, target: "sort" },
  { name: "click", at: 3500, target: "tile.2" },
  { name: "click", at: 5500, target: "back" },
];
