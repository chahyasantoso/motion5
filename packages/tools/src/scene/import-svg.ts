import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { withPage } from "../page/page";
import {
  extractSvg,
  type Box,
  type Extracted,
  type LeftOut,
  type RawGradient,
  type RawPaint,
  type RawPattern,
} from "./svg-extract";
import {
  isEven,
  isIdentity,
  lengthScale,
  multiply,
  outlinesOf,
  transformed,
  type Matrix,
} from "./svg-geometry";

/** The module written and what it holds, or `refused` with why; nothing is written then. */
export type ImportResult =
  | {
      readonly kind: "written";
      readonly file: string;
      readonly members: readonly string[];
      readonly defs: number;
      readonly frame: { readonly width: number; readonly height: number };
      readonly leftOut: readonly LeftOut[];
    }
  | { readonly kind: "refused"; readonly message: string };

const NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

/** A number to a thousandth, with no `-0`. */
function thousandth(value: number): number {
  const rounded = Math.round(value * 1000) / 1000;
  return rounded === 0 ? 0 : rounded;
}

/** A number with seven significant digits, so a tiny matrix term survives. */
function precise(value: number): string {
  return String(Number(value.toPrecision(7)));
}

function escaped(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

/** `text` as the body of a template literal. */
function templateText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

/** A name from words of any kind in camelCase, or an empty string when there is none to make. */
function identifier(text: string | null): string {
  const words = (text ?? "").split(/[^A-Za-z0-9]+/).filter((word) => word !== "");
  const joined = words
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toLowerCase() + word.slice(1)
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join("");
  return /^[A-Za-z]/.test(joined) ? joined : "";
}

/** A CSS colour, `rgb(r, g, b)` written as hex. */
function colour(css: string): string {
  const match = /^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/.exec(css.trim());
  if (match === null) return css.trim();
  const hex = (text: string | undefined) => Number(text).toString(16).padStart(2, "0");
  return `#${hex(match[1])}${hex(match[2])}${hex(match[3])}`;
}

/** ` name="matrix(...)"`, or nothing for a matrix that moves nothing. */
function transformAttribute(name: string, matrix: Matrix): string {
  const flat = matrix.every(
    (value, index) => Math.abs(value - (index === 0 || index === 3 ? 1 : 0)) < 1e-9,
  );
  return flat ? "" : ` ${name}="matrix(${matrix.map(precise).join(" ")})"`;
}

/** The paint servers a module needs: one `<defs>` child per server and shape placement. */
class Defs {
  readonly markup = new Map<string, string>();

  private readonly viewBox: Box;

  constructor(viewBox: Box) {
    this.viewBox = viewBox;
  }

  private readonly keys = new Map<string, string>();

  /** The id a server is written under for one placement; the same placement shares one id. */
  private idFor(base: string, key: string): { readonly id: string; readonly fresh: boolean } {
    for (const [id, known] of this.keys) if (known === key) return { id, fresh: false };
    let id = base;
    for (let count = 2; this.keys.has(id); count += 1) id = `${base}-${count}`;
    this.keys.set(id, key);
    return { id, fresh: true };
  }

  /** `url(#id)` for a gradient or pattern as it lands on one shape, or why it cannot. */
  place(
    paint: Extract<RawPaint, { kind: "server" }>,
    frame: Matrix,
  ): { readonly css: string } | { readonly why: string } {
    const { server } = paint;
    switch (server.kind) {
      case "linear":
      case "radial":
        return this.gradient(server, paint.box, frame);
      case "pattern":
        return this.pattern(server, frame);
      default: {
        const unknown: never = server;
        throw new TypeError(`Unknown paint server: ${JSON.stringify(unknown)}`);
      }
    }
  }

  private gradient(
    server: RawGradient,
    box: Box,
    frame: Matrix,
  ): { readonly css: string } | { readonly why: string } {
    const boxed = server.units === "objectBoundingBox";
    if (boxed && !(box.width > 0 && box.height > 0))
      return { why: `gradient #${server.id} on a shape with no width or height` };
    const along = (key: string, axis: "x" | "y" | "r", fallback: string): number => {
      const text = (server.attributes[key] ?? fallback).trim();
      const value = Number.parseFloat(text);
      if (!text.endsWith("%")) return value;
      const reference = boxed
        ? 1
        : axis === "x"
          ? this.viewBox.width
          : axis === "y"
            ? this.viewBox.height
            : Math.sqrt((this.viewBox.width ** 2 + this.viewBox.height ** 2) / 2);
      return (value / 100) * reference;
    };
    const fields: [string, number][] =
      server.kind === "linear"
        ? [
            ["x1", along("x1", "x", "0%")],
            ["y1", along("y1", "y", "0%")],
            ["x2", along("x2", "x", "100%")],
            ["y2", along("y2", "y", "0%")],
          ]
        : [
            ["cx", along("cx", "x", "50%")],
            ["cy", along("cy", "y", "50%")],
            ["r", along("r", "r", "50%")],
            ...(server.attributes["fx"] === undefined
              ? []
              : [["fx", along("fx", "x", "50%")] as [string, number]]),
            ...(server.attributes["fy"] === undefined
              ? []
              : [["fy", along("fy", "y", "50%")] as [string, number]]),
          ];
    // Everything lands in the shape's frame px at once: its matrix, then the box's, then the gradient's own.
    const reach = multiply(
      isIdentity(frame) ? [1, 0, 0, 1, 0, 0] : frame,
      multiply(
        boxed ? [box.width, 0, 0, box.height, box.x, box.y] : [1, 0, 0, 1, 0, 0],
        server.transform,
      ),
    );
    const key = JSON.stringify([server.id, reach.map(precise)]);
    const { id, fresh } = this.idFor(server.id, key);
    if (fresh) {
      const tag = server.kind === "linear" ? "linearGradient" : "radialGradient";
      const stops = server.stops
        .map(
          (stop) =>
            `<stop offset="${precise(stop.offset)}" stop-color="${escaped(colour(stop.color))}"${stop.opacity === 1 ? "" : ` stop-opacity="${precise(stop.opacity)}"`}/>`,
        )
        .join("");
      const attributes = fields.map(([name, value]) => ` ${name}="${precise(value)}"`).join("");
      const transform = transformAttribute("gradientTransform", reach);
      const spread = server.spread === null ? "" : ` spreadMethod="${escaped(server.spread)}"`;
      this.markup.set(
        id,
        `<${tag} id="${escaped(id)}" gradientUnits="userSpaceOnUse"${attributes}${transform}${spread}>${stops}</${tag}>`,
      );
    }
    return { css: `url(#${id})` };
  }

  private pattern(
    server: RawPattern,
    frame: Matrix,
  ): { readonly css: string } | { readonly why: string } {
    if (
      server.units !== "userSpaceOnUse" ||
      server.contentUnits !== "userSpaceOnUse" ||
      server.hasViewBox
    )
      return { why: `pattern #${server.id} uses bounding-box units or a viewBox` };
    if (server.markup.includes("url(#"))
      return { why: `pattern #${server.id} holds content that refers to other paint` };
    const sizes = ["x", "y", "width", "height"].map((key) => server.attributes[key] ?? "0");
    if (sizes.some((text) => !/^[-+]?[\d.]+(?:e[-+]?\d+)?(?:px)?$/i.test(text.trim())))
      return { why: `pattern #${server.id} has sizes this cannot place` };
    const reach = multiply(isIdentity(frame) ? [1, 0, 0, 1, 0, 0] : frame, server.transform);
    const key = JSON.stringify([server.id, reach.map(precise)]);
    const { id, fresh } = this.idFor(server.id, key);
    if (fresh) {
      const [x, y, width, height] = sizes.map((text) => precise(Number.parseFloat(text)));
      const transform = transformAttribute("patternTransform", reach);
      this.markup.set(
        id,
        `<pattern id="${escaped(id)}" patternUnits="userSpaceOnUse" x="${x}" y="${y}" width="${width}" height="${height}"${transform}>${server.markup}</pattern>`,
      );
    }
    return { css: `url(#${id})` };
  }
}

/** One part ready to write: its name, outlines as source text, and the two skin rules. */
interface Part {
  readonly name: string;
  readonly cubics: readonly string[];
  readonly box: string;
  readonly path: string;
}

/** The parts, defs and leftovers of an extracted SVG. */
function build(extracted: Extract<Extracted, { kind: "ok" }>): {
  readonly parts: readonly Part[];
  readonly defs: readonly string[];
  readonly leftOut: readonly LeftOut[];
} {
  const { viewBox } = extracted;
  const leftOut = [...extracted.leftOut];
  const defs = new Defs(viewBox);
  const toFrame: Matrix = [1, 0, 0, 1, -viewBox.x, -viewBox.y];
  const used = new Set<string>();
  let unnamed = 0;
  const parts: Part[] = [];

  for (const shape of extracted.shapes) {
    const matrix = multiply(toFrame, shape.matrix);
    const parsed = outlinesOf(shape.geometry);
    if (parsed.error !== undefined)
      leftOut.push({ element: shape.element, reason: `path data stops early: ${parsed.error}` });
    const cubics = parsed.outlines.flatMap((outline) =>
      outline.cubics.map((cubic) => transformed(cubic, matrix).map(thousandth)),
    );
    if (cubics.length === 0) {
      leftOut.push({ element: shape.element, reason: "no outline to draw" });
      continue;
    }
    const scale = lengthScale(matrix);
    const width = shape.strokeWidth * scale;

    const css = (paint: RawPaint): string => {
      switch (paint.kind) {
        case "none":
          return "none";
        case "color":
          return colour(paint.css);
        case "server": {
          const placed = defs.place(paint, matrix);
          if ("css" in placed) return placed.css;
          leftOut.push({ element: shape.element, reason: placed.why });
          return paint.fallback === null ? "none" : colour(paint.fallback);
        }
        default: {
          const unknown: never = paint;
          throw new TypeError(`Unknown paint: ${JSON.stringify(unknown)}`);
        }
      }
    };
    const fill = css(shape.fill);
    const stroke = width > 0 ? css(shape.stroke) : "none";
    if (fill === "none" && stroke === "none") {
      leftOut.push({ element: shape.element, reason: "draws nothing (no fill and no stroke)" });
      continue;
    }
    if (stroke !== "none" && !isEven(matrix))
      leftOut.push({ element: shape.element, reason: "stroke scaled unevenly" });

    const given = identifier(shape.label) || identifier(shape.id);
    let name = given;
    if (name === "") {
      do {
        unnamed += 1;
        name = `part${unnamed}`;
      } while (used.has(name));
    }
    for (let count = 2; used.has(name); count += 1) name = `${given}${count}`;
    used.add(name);

    const rule: string[] = [`fill: ${fill}`];
    if (fill !== "none" && shape.fillOpacity !== 1)
      rule.push(`fill-opacity: ${precise(shape.fillOpacity)}`);
    if (fill !== "none" && shape.fillRule === "evenodd") rule.push("fill-rule: evenodd");
    rule.push(`stroke: ${stroke}`);
    if (stroke !== "none") {
      rule.push(`stroke-width: ${precise(Math.round(width * 1e4) / 1e4)}`);
      if (shape.strokeOpacity !== 1) rule.push(`stroke-opacity: ${precise(shape.strokeOpacity)}`);
      if (shape.linecap !== "butt") rule.push(`stroke-linecap: ${shape.linecap}`);
      if (shape.linejoin !== "miter") rule.push(`stroke-linejoin: ${shape.linejoin}`);
      if (shape.miterlimit !== 4) rule.push(`stroke-miterlimit: ${precise(shape.miterlimit)}`);
      if (shape.dashes.length > 0 && shape.dashes.some((dash) => dash > 0)) {
        rule.push(
          `stroke-dasharray: ${shape.dashes.map((dash) => precise(dash * scale)).join(", ")}`,
        );
        if (shape.dashOffset !== 0)
          rule.push(`stroke-dashoffset: ${precise(shape.dashOffset * scale)}`);
      }
    }
    const order = parts.length + 1;
    const box = [
      `z-index: ${order}`,
      ...(shape.opacity === 1 ? [] : [`opacity: ${precise(shape.opacity)}`]),
    ];
    parts.push({
      name,
      cubics: cubics.map(
        ([x0, y0, x1, y1, x2, y2, x3, y3], index) =>
          `{ id: "c${index}", x0: ${x0}, y0: ${y0}, x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}, x3: ${x3}, y3: ${y3} },`,
      ),
      box: `[data-cast="${name}"] { ${box.join("; ")}; }`,
      path: `[data-path="${name}"] { ${rule.join("; ")}; }`,
    });
  }
  return { parts, defs: [...defs.markup.values()], leftOut };
}

/** The module's source text. */
function moduleSource(
  source: string,
  piece: string,
  frame: { readonly width: number; readonly height: number },
  built: ReturnType<typeof build>,
): string {
  const cast = built.parts
    .map(
      ({ name, cubics }) =>
        `  "${name}": actor({\n    still: true,\n    path: [\n${cubics.map((line) => `      ${line}`).join("\n")}\n    ],\n  }),`,
    )
    .join("\n");
  const css = built.parts.map(({ box, path }) => `${box}\n${path}`).join("\n");
  const defs =
    built.defs.length === 0 ? "" : `\n    defs: \`${templateText(built.defs.join("\n"))}\`,`;
  return `// Imported from ${basename(source)} by motion:import-svg: flat parts in paint order; rename a part by replacing its quoted name.
import type { Time } from "@gerak/moves";
import { actor, story } from "@gerak/stage";

export const brief = ${JSON.stringify(piece)};

export const beats = story(1000, { show: [0, 1000] });

export const frame = { width: ${frame.width}, height: ${frame.height} };

export const cast = {
${cast}
};

export const skins = {
  dom: {
    css: \`
${templateText(css)}
\`,${defs}
  },
};

export const scene = (_time: Time) => ({});
`;
}

/** The SVG file read in a browser: its shapes, resolved paint, and what it cannot carry. */
async function readSvg(file: string): Promise<Extracted> {
  const folder = mkdtempSync(join(tmpdir(), "motion-import-svg-"));
  try {
    copyFileSync(file, join(folder, "art.svg"));
    const { value } = await withPage(
      { page: "art.svg", width: 1280, height: 720, source: { kind: "serve", root: folder } },
      ({ page }) => page.evaluate(extractSvg),
    );
    return value;
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
}

/** Writes `<root>/src/<name>.ts`, a stage module of the SVG's shapes as flat parts in frame px, or
 * nothing at all. An existing file is overwritten only with `force`. */
export async function importSvg(
  file: string,
  name: string,
  root: string,
  options: { readonly force?: boolean } = {},
): Promise<ImportResult> {
  if (!NAME.test(name))
    return { kind: "refused", message: `Name "${name}" must be lowercase words joined by "-".` };
  if (!existsSync(file)) return { kind: "refused", message: `No file at ${file}.` };
  const target = join(root, "src", `${name}.ts`);
  if (existsSync(target) && options.force !== true)
    return {
      kind: "refused",
      message: `Already exists, nothing written: ${target}. Pass --force to replace it.`,
    };
  const extracted = await readSvg(file);
  if (extracted.kind === "error") return { kind: "refused", message: extracted.message };
  const built = build(extracted);
  if (built.parts.length === 0)
    return { kind: "refused", message: "The SVG holds no shape this can draw." };
  const frame = {
    width: thousandth(extracted.viewBox.width),
    height: thousandth(extracted.viewBox.height),
  };
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, moduleSource(file, name, frame, built));
  return {
    kind: "written",
    file: target,
    members: built.parts.map((part) => part.name),
    defs: built.defs.length,
    frame,
    leftOut: built.leftOut,
  };
}
