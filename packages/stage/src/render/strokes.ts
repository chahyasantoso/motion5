import { pathBounds, unreachable, type Cubic2d } from "@gerak/core";
import type { Content, Path } from "../author/cast";
import { ZERO_BOX, restReader, type Box, type RestReader } from "../author/layout";
import type { Stage } from "../run/compile";
import type { StageError } from "../run/errors";
import { blendShapes } from "../run/outlines";

/** Every stroke and morph drawn in order, the rest with their boxes added, and what failed to draw. */
export interface Strokes {
  readonly cubics: ReadonlyMap<string, readonly Cubic2d[]>;
  readonly rest: RestReader;
  readonly failures: readonly { readonly name: string; readonly error: unknown }[];
  /** Paths that read their own box. */
  readonly selfReads: readonly string[];
}

/** The outline a morph shows at a pose's `shape`: 0 its base, 1 its first target, 1.5 halfway on. */
export function morphAt(
  content: Extract<Content, { readonly kind: "morph" }>,
  pose: { readonly shape?: number | undefined } | undefined,
): readonly Cubic2d[] {
  return blendShapes(content.shapes, pose?.shape ?? 0);
}

/** Bounds grown to 1 px where thinner, centred on the edge, so straight lines stay visible. */
function thickened(box: Box): Box {
  const side = (from: number, size: number): readonly [number, number] =>
    size >= 1 ? [from, size] : [from + size / 2 - 0.5, 1];
  const [x, width] = side(box.x, box.width);
  const [y, height] = side(box.y, box.height);
  return { x, y, width, height };
}

/** The SVG view box of an outline: its bounds, thickened, top-left origin. */
export function strokeBox(cubics: readonly Cubic2d[]): Box {
  return thickened(pathBounds(cubics));
}

/** A top-left box as a centre-origin rest box. */
export function restOfBounds(bounds: Box): Box {
  return { ...bounds, x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
}

function recording(boxes: Readonly<Record<string, Box>>, read: Set<string>): RestReader {
  const keys = Object.freeze(Object.keys(boxes));
  return Object.freeze({
    get(name: string): Box {
      read.add(name);
      return Object.hasOwn(boxes, name) ? (boxes[name] ?? ZERO_BOX) : ZERO_BOX;
    },
    has(name: string): boolean {
      read.add(name);
      return Object.hasOwn(boxes, name);
    },
    keys: (): readonly string[] => keys,
  });
}

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

/** The paths of a stage's strokes and morph bases, list items named `<list>.<index>`. */
function pathsOf(stage: Stage): readonly (readonly [string, Path])[] {
  const paths: (readonly [string, Path])[] = [];
  const add = (name: string, content: Content): void => {
    if (content.kind === "stroke") paths.push([name, content.path]);
    else if (content.kind === "morph") paths.push([name, content.shapes[0] ?? []]);
  };
  for (const member of stage.members)
    switch (member.kind) {
      case "actor":
        add(member.name, member.content);
        break;
      case "list":
        member.items.forEach((item, index) => add(`${member.name}.${index}`, item));
        break;
      case "group":
        break;
      default:
        unreachable(member);
    }
  return paths;
}

/** Draws every stroke and morph base against `rest`, each once the boxes it reads are drawn, or the loop of paths that read each other. */
export function drawStrokes(
  stage: Stage,
  rest: RestReader,
):
  | { readonly ok: true; readonly strokes: Strokes }
  | { readonly ok: false; readonly error: Extract<StageError, { kind: "stroke_loop" }> } {
  const cubics = new Map<string, readonly Cubic2d[]>();
  const boxes: Record<string, Box> = {};
  for (const key of rest.keys()) boxes[key] = rest.get(key);
  const failures: { readonly name: string; readonly error: unknown }[] = [];
  const selfReads: string[] = [];
  const pending = new Map(pathsOf(stage));
  const reads = new Map<string, ReadonlySet<string>>();
  for (let drew = true; drew && pending.size > 0; ) {
    drew = false;
    for (const [name, path] of [...pending]) {
      const read = new Set<string>();
      let drawn: readonly Cubic2d[] | undefined;
      let error: unknown;
      try {
        drawn = typeof path === "function" ? path(recording(boxes, read)) : path;
      } catch (thrown) {
        error = thrown;
      }
      const waits = new Set([...read].filter((other) => other !== name && pending.has(other)));
      if (waits.size > 0) {
        reads.set(name, waits);
        continue;
      }
      pending.delete(name);
      reads.delete(name);
      drew = true;
      if (read.has(name)) selfReads.push(name);
      if (drawn === undefined) failures.push({ name, error });
      else {
        cubics.set(name, drawn);
        boxes[name] = restOfBounds(strokeBox(drawn));
      }
    }
  }
  if (pending.size > 0) {
    const names = [...pending.keys()];
    const loop = names.filter((name) => inLoop(name, reads));
    const behind = names.filter((name) => !loop.includes(name));
    return { ok: false, error: { kind: "stroke_loop", loop, behind } };
  }
  return { ok: true, strokes: { cubics, rest: restReader(boxes), failures, selfReads } };
}
