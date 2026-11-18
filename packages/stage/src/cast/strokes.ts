import { pathBounds, unreachable, type Cubic2d } from "@gerak/core";
import {
  NO_REST_READER,
  ZERO_BOX,
  restReader,
  type Box,
  type Rest,
  type RestReader,
} from "../layout/index";
import { isCubics, type ActorPath, type CompiledMembers } from "./cast";

/** Outcome of evaluating one stroke path function in a dependency pass. */
export type PathAnswer =
  | { readonly kind: "drawn"; readonly cubics: readonly Cubic2d[] }
  | { readonly kind: "failed"; readonly error: unknown };

/** Cycle details when stroke path functions depend on one another without resolving. */
export interface StrokeLoop {
  readonly loop: readonly string[];
  readonly behind: readonly string[];
}

/** Resolved geometry and bounding rest box for one stroke or morph member. */
export interface ResolvedStroke {
  readonly name: string;
  readonly cubics: readonly Cubic2d[];
  readonly box: Box;
}

/** Result of resolving all stroke and morph outlines against a `RestReader`. */
export type StrokeResolution =
  | {
      readonly ok: true;
      readonly strokes: ReadonlyMap<string, ResolvedStroke>;
      readonly rest: RestReader;
      readonly failures: readonly { readonly name: string; readonly error: unknown }[];
      readonly selfReads: readonly string[];
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly kind: "stroke_loop";
        readonly loop: readonly string[];
        readonly behind: readonly string[];
      };
    };

/** Grows bounds below 1 px to 1 px centered on the edge so straight lines stay visible. */
export function thickened(box: Box): Box {
  const side = (from: number, size: number): readonly [number, number] =>
    size >= 1 ? [from, size] : [from + size / 2 - 0.5, 1];
  const [x, width] = side(box.x, box.width);
  const [y, height] = side(box.y, box.height);
  return { x, y, width, height };
}

/** Computes the thickened SVG viewBox bounds of a cubic outline. */
export function strokeBox(cubics: readonly Cubic2d[]): Box {
  return thickened(pathBounds(cubics));
}

/** Converts top-left bounds `{ x, y, width, height }` into a center-origin `Box`. */
export function restOfBounds(bounds: Box): Box {
  return { ...bounds, x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
}

/** Resolves fixed or layout-dependent `ActorPath` cubics against `rest`, validating and freezing. */
export function pathOf(path: ActorPath, rest: RestReader): readonly Cubic2d[] {
  if (typeof path !== "function") return path;
  const answer: unknown = path(rest);
  if (!isCubics(answer))
    throw new TypeError("A path function must answer cubics made by `toCubics`, at least one.");
  return Object.freeze(answer.map((cubic) => Object.freeze({ ...cubic })));
}

function recordingReader(boxes: Rest, read: Set<string>): RestReader {
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
    keys(): readonly string[] {
      return keys;
    },
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

/** Resolves stroke paths in dependency order; returns `StrokeLoop` if any form a cycle. */
export function drawInPasses(
  paths: readonly (readonly [string, ActorPath])[],
  rest: RestReader,
  settle: (name: string, answer: PathAnswer, read: ReadonlySet<string>) => Box | undefined,
): StrokeLoop | undefined {
  const boxes: Record<string, Box> = {};
  for (const key of rest.keys()) boxes[key] = rest.get(key);
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
          cubics: pathOf(path, recordingReader(boxes, read)),
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

/** Formats a `StrokeLoop` as a concise single-line dependency cycle description. */
export function describeLoop({ loop, behind }: StrokeLoop): string {
  const after =
    behind.length === 0
      ? ""
      : `; ${listed(behind)} ${behind.length === 1 ? "reads" : "read"} them and ${behind.length === 1 ? "is" : "are"} not drawn either`;
  return `paths ${listed(loop)} read each other${after}`;
}

/** Resolves all stroke and morph base outlines against `rest`, returning cubics or `stroke_loop`. */
export function resolveStaticStrokes(
  stage: { readonly members: CompiledMembers },
  rest: RestReader = NO_REST_READER,
): StrokeResolution {
  const paths: (readonly [string, ActorPath])[] = [];
  for (const entry of stage.members.entries) {
    if (entry.content?.kind === "stroke") paths.push([entry.name, entry.content.path]);
    else if (entry.content?.kind === "morph")
      paths.push([entry.name, entry.content.matched[0] ?? entry.content.base]);
  }

  const resolved = new Map<string, ResolvedStroke>();
  const boxes: Record<string, Box> = {};
  for (const key of rest.keys()) boxes[key] = rest.get(key);
  const failures: { readonly name: string; readonly error: unknown }[] = [];
  const selfReads: string[] = [];

  const loop = drawInPasses(paths, rest, (name, answer, read) => {
    if (read.has(name)) selfReads.push(name);
    switch (answer.kind) {
      case "drawn": {
        const box = restOfBounds(strokeBox(answer.cubics));
        resolved.set(name, Object.freeze({ name, cubics: answer.cubics, box }));
        boxes[name] = box;
        return box;
      }
      case "failed":
        failures.push({ name, error: answer.error });
        return undefined;
      default:
        return unreachable(answer);
    }
  });

  if (loop !== undefined) {
    return {
      ok: false,
      error: { kind: "stroke_loop", loop: loop.loop, behind: loop.behind },
    };
  }
  return {
    ok: true,
    strokes: resolved,
    rest: restReader(boxes),
    failures: Object.freeze(failures),
    selfReads: Object.freeze(selfReads),
  };
}
