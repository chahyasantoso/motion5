/** Where a member rests once laid out: its centre and size in px, in the frame's own space. */
export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** Each member's rest box by its cast name, as a renderer measured it after layout. */
export type Rest = Readonly<Record<string, Box>>;

/** The rest a tool with no renderer passes: no boxes. */
export const NO_REST: Rest = Object.freeze({});

const ZERO: Box = Object.freeze({ x: 0, y: 0, width: 0, height: 0 });

/** The box `name` rests in, or a zero box when nothing measured it, so a scene never throws on a tool's run. */
export function restOf(rest: Rest, name: string): Box {
  return Object.hasOwn(rest, name) ? (rest[name] ?? ZERO) : ZERO;
}

/** Each named layout's `Rest`, as a renderer measured every one. */
export type Layouts<L extends string = string> = Readonly<Record<L, Rest>>;

/** The layouts a module with none passes: no layout, no boxes. */
export const NO_LAYOUTS: Layouts<never> = Object.freeze({});
