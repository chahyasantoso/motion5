import type { Cubic2d } from "@gerak/moves";
import { pathOf, type ActorPath } from "./cast";
import type { Box, Rest } from "./rest";

/** What a path answered in its pass: its cubics, or what it threw. */
export type PathAnswer =
  | { readonly kind: "drawn"; readonly cubics: readonly Cubic2d[] }
  | { readonly kind: "failed"; readonly error: unknown };

/** The strokes no pass could draw: those reading each other in a loop, and those reading one of them. */
export interface StrokeLoop {
  readonly loop: readonly string[];
  readonly behind: readonly string[];
}

/** The box the control points of `cubics` span, from its top-left, never thinner than 1 so a
 * straight line still shows. */
export function boundsOf(cubics: readonly Cubic2d[]): Box {
  const xs = cubics.flatMap((c) => [c.x0, c.x1, c.x2, c.x3]);
  const ys = cubics.flatMap((c) => [c.y0, c.y1, c.y2, c.y3]);
  const span = (values: readonly number[]): readonly [number, number] => {
    const low = values.reduce((least, value) => Math.min(least, value), Infinity);
    const high = values.reduce((most, value) => Math.max(most, value), -Infinity);
    const size = values.length === 0 ? 0 : high - low;
    const from = values.length === 0 ? 0 : low;
    return size > 0 ? [from, size] : [from - 0.5, 1];
  };
  const [x, width] = span(xs);
  const [y, height] = span(ys);
  return { x, y, width, height };
}

/** Where a stroke of these bounds rests: their centre and size, as a rest box is. */
export function restOfBounds(bounds: Box): Box {
  return { ...bounds, x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
}

/** `boxes` as a rest that records every name read from it into `read`. */
function recording(boxes: Rest, read: Set<string>): Rest {
  return new Proxy(boxes, {
    get(target, key, receiver) {
      if (typeof key === "string") read.add(key);
      return Reflect.get(target, key, receiver);
    },
    getOwnPropertyDescriptor(target, key) {
      if (typeof key === "string") read.add(key);
      return Reflect.getOwnPropertyDescriptor(target, key);
    },
    has(target, key) {
      if (typeof key === "string") read.add(key);
      return Reflect.has(target, key);
    },
  });
}

/** Whether `from` reaches itself through what each waiting stroke reads. */
function inLoop(from: string, reads: ReadonlyMap<string, ReadonlySet<string>>): boolean {
  const seen = new Set<string>();
  const next = [...(reads.get(from) ?? [])];
  for (let name = next.pop(); name !== undefined; name = next.pop()) {
    if (name === from) return true;
    if (seen.has(name)) continue;
    seen.add(name);
    next.push(...(reads.get(name) ?? []));
  }
  return false;
}

/** Draws strokes in passes over `rest` and the strokes drawn so far; a path reading an undrawn stroke
 * waits, and `settle` answers a drawn one's box. Answers the loop when a pass draws none. */
export function drawInPasses(
  paths: readonly (readonly [string, ActorPath])[],
  rest: Rest,
  settle: (name: string, answer: PathAnswer, read: ReadonlySet<string>) => Box | undefined,
): StrokeLoop | undefined {
  const boxes: Record<string, Box> = { ...rest };
  const pending = new Map(paths);
  const reads = new Map<string, ReadonlySet<string>>();
  for (let drew = true; drew && pending.size > 0; ) {
    drew = false;
    for (const [name, path] of [...pending]) {
      const read = new Set<string>();
      let answer: PathAnswer;
      try {
        answer = {
          kind: "drawn",
          cubics: pathOf(path, recording(Object.freeze({ ...boxes }), read)),
        };
      } catch (error) {
        answer = { kind: "failed", error };
      }
      const waits = new Set([...read].filter((other) => other !== name && pending.has(other)));
      if (waits.size > 0) {
        reads.set(name, waits);
        continue;
      }
      pending.delete(name);
      reads.delete(name);
      drew = true;
      const box = settle(name, answer, read);
      if (box !== undefined) boxes[name] = box;
    }
  }
  if (pending.size === 0) return undefined;
  const names = [...pending.keys()];
  const loop = names.filter((name) => inLoop(name, reads));
  return { loop, behind: names.filter((name) => !loop.includes(name)) };
}

function listed(names: readonly string[]): string {
  const quoted = names.map((name) => `"${name}"`);
  const last = quoted.pop();
  return quoted.length === 0 ? (last ?? "") : `${quoted.join(", ")} and ${last ?? ""}`;
}

/** The loop said in one line: `paths "a" and "b" read each other`, and any stroke reading them. */
export function describeLoop({ loop, behind }: StrokeLoop): string {
  const after =
    behind.length === 0
      ? ""
      : `; ${listed(behind)} ${behind.length === 1 ? "reads" : "read"} them and ${behind.length === 1 ? "is" : "are"} not drawn either`;
  return `paths ${listed(loop)} read each other${after}`;
}
