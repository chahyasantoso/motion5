import type { Cubic2d } from "./shapes";

type Cubic = readonly [number, number, number, number, number, number, number, number];

/** The outlines of path data: each outline is the cubics of one subpath, and `error` says why reading stopped early when the data is malformed. */
export type PathRead = {
  readonly outlines: readonly (readonly Cubic2d[])[];
  readonly error?: string;
};

/** The options of an elliptical arc between two points, as the SVG `A` command takes them. */
export type ArcOptions = {
  readonly x0: number;
  readonly y0: number;
  readonly x1: number;
  readonly y1: number;
  readonly rx: number;
  readonly ry: number;
  /** The ellipse's turn in degrees; 0 when omitted. */
  readonly degrees?: number;
  readonly large?: boolean;
  readonly sweep?: boolean;
};

const COMMAND_ARITY: Readonly<Record<string, number>> = {
  m: 2,
  l: 2,
  h: 1,
  v: 1,
  c: 6,
  s: 4,
  q: 4,
  t: 2,
  a: 7,
  z: 0,
};

/** A straight line as a cubic. */
function line(x0: number, y0: number, x3: number, y3: number): Cubic {
  return [
    x0,
    y0,
    x0 + (x3 - x0) / 3,
    y0 + (y3 - y0) / 3,
    x0 + ((x3 - x0) * 2) / 3,
    y0 + ((y3 - y0) * 2) / 3,
    x3,
    y3,
  ];
}

/** A quadratic raised to the cubic that draws the same curve. */
function raised(x0: number, y0: number, qx: number, qy: number, x2: number, y2: number): Cubic {
  return [
    x0,
    y0,
    x0 + ((qx - x0) * 2) / 3,
    y0 + ((qy - y0) * 2) / 3,
    x2 + ((qx - x2) * 2) / 3,
    y2 + ((qy - y2) * 2) / 3,
    x2,
    y2,
  ];
}

/** An elliptical arc as tuples of at most a quarter turn each. */
function arcTuples(
  x0: number,
  y0: number,
  rxIn: number,
  ryIn: number,
  degrees: number,
  large: boolean,
  sweep: boolean,
  x1: number,
  y1: number,
): readonly Cubic[] {
  if (x0 === x1 && y0 === y1) return [];
  let rx = Math.abs(rxIn);
  let ry = Math.abs(ryIn);
  if (rx === 0 || ry === 0) return [line(x0, y0, x1, y1)];
  const phi = (degrees * Math.PI) / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  const dx = (x0 - x1) / 2;
  const dy = (y0 - y1) / 2;
  const px = cos * dx + sin * dy;
  const py = -sin * dx + cos * dy;
  const grown = (px / rx) ** 2 + (py / ry) ** 2;
  if (grown > 1) {
    rx *= Math.sqrt(grown);
    ry *= Math.sqrt(grown);
  }
  const numerator = (rx * ry) ** 2 - (rx * py) ** 2 - (ry * px) ** 2;
  const denominator = (rx * py) ** 2 + (ry * px) ** 2;
  const factor = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0, numerator / denominator));
  const cxp = (factor * rx * py) / ry;
  const cyp = (-factor * ry * px) / rx;
  const cx = cos * cxp - sin * cyp + (x0 + x1) / 2;
  const cy = sin * cxp + cos * cyp + (y0 + y1) / 2;
  const angle = (ux: number, uy: number, vx: number, vy: number) =>
    Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const start = angle(1, 0, (px - cxp) / rx, (py - cyp) / ry);
  let sweepBy = angle((px - cxp) / rx, (py - cyp) / ry, (-px - cxp) / rx, (-py - cyp) / ry);
  if (!sweep && sweepBy > 0) sweepBy -= 2 * Math.PI;
  if (sweep && sweepBy < 0) sweepBy += 2 * Math.PI;
  const count = Math.max(1, Math.ceil(Math.abs(sweepBy) / (Math.PI / 2) - 1e-9));
  const step = sweepBy / count;
  const k = (4 / 3) * Math.tan(step / 4);
  const at = (theta: number): readonly [number, number, number, number] => {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return [
      cx + rx * c * cos - ry * s * sin,
      cy + rx * c * sin + ry * s * cos,
      -rx * s * cos - ry * c * sin,
      -rx * s * sin + ry * c * cos,
    ];
  };
  const out: Cubic[] = [];
  let [ax, ay, adx, ady] = at(start);
  for (let index = 0; index < count; index += 1) {
    const [bx, by, bdx, bdy] = at(start + step * (index + 1));
    // The last cubic ends exactly where the arc was asked to end.
    const ex = index === count - 1 ? x1 : bx;
    const ey = index === count - 1 ? y1 : by;
    out.push([
      index === 0 ? x0 : ax,
      index === 0 ? y0 : ay,
      ax + k * adx,
      ay + k * ady,
      bx - k * bdx,
      by - k * bdy,
      ex,
      ey,
    ]);
    [ax, ay, adx, ady] = [bx, by, bdx, bdy];
  }
  return out;
}

/** Reads numbers and arc flags from path data one token at a time. */
class Scanner {
  index = 0;
  readonly text: string;

  constructor(text: string) {
    this.text = text;
  }

  skip(): void {
    while (this.index < this.text.length && /[\s,]/.test(this.text.charAt(this.index)))
      this.index += 1;
  }

  number(): number | undefined {
    this.skip();
    const match = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/.exec(this.text.slice(this.index));
    if (match === null) return undefined;
    this.index += match[0].length;
    return Number(match[0]);
  }

  flag(): boolean | undefined {
    this.skip();
    const char = this.text.charAt(this.index);
    if (char !== "0" && char !== "1") return undefined;
    this.index += 1;
    return char === "1";
  }
}

/** The outlines of SVG path data in the path's own units: every command, absolute and relative,
 * with arcs and quadratics made cubic and each closing line explicit. */
export function pathFrom(data: string): PathRead {
  const scanner = new Scanner(data);
  const outlines: Cubic[][] = [];
  let cubics: Cubic[] = [];
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  let control: readonly [number, number] | undefined;
  let quadratic: readonly [number, number] | undefined;
  let command = "";
  let started = false;
  const finish = (closed: boolean) => {
    if (cubics.length > 0 || closed) outlines.push(cubics);
    cubics = [];
  };
  const fail = (why: string): PathRead => {
    finish(false);
    return { outlines: named(outlines), error: why };
  };
  for (;;) {
    scanner.skip();
    if (scanner.index >= data.length) break;
    const char = data.charAt(scanner.index);
    if (/[a-zA-Z]/.test(char)) {
      if (COMMAND_ARITY[char.toLowerCase()] === undefined) return fail(`unknown command "${char}"`);
      command = char;
      scanner.index += 1;
    } else if (command === "" || command.toLowerCase() === "z") {
      return fail("numbers with no command to take them");
    }
    if (!started && command.toLowerCase() !== "m") return fail("data does not start with a move");
    const lower = command.toLowerCase();
    const relative = command !== command.toUpperCase();
    if (lower === "z") {
      if (cubics.length > 0 && (x !== startX || y !== startY))
        cubics.push(line(x, y, startX, startY));
      finish(true);
      x = startX;
      y = startY;
      control = undefined;
      quadratic = undefined;
      // Anything but a move after a close starts from the same point.
      continue;
    }
    const values: number[] = [];
    const arity = COMMAND_ARITY[lower] ?? 0;
    for (let at = 0; at < arity; at += 1) {
      const isFlag = lower === "a" && (at === 3 || at === 4);
      if (isFlag) {
        const flag = scanner.flag();
        if (flag === undefined) return fail("bad arc flag");
        values.push(flag ? 1 : 0);
      } else {
        const value = scanner.number();
        if (value === undefined) return fail(`missing number for "${command}"`);
        values.push(value);
      }
    }
    const [v0 = 0, v1 = 0, v2 = 0, v3 = 0, v4 = 0, v5 = 0, v6 = 0] = values;
    const ox = relative ? x : 0;
    const oy = relative ? y : 0;
    switch (lower) {
      case "m": {
        finish(false);
        x = ox + v0;
        y = oy + v1;
        startX = x;
        startY = y;
        started = true;
        control = undefined;
        quadratic = undefined;
        // More pairs after a move are lines.
        command = relative ? "l" : "L";
        break;
      }
      case "l": {
        const nx = ox + v0;
        const ny = oy + v1;
        cubics.push(line(x, y, nx, ny));
        x = nx;
        y = ny;
        control = undefined;
        quadratic = undefined;
        break;
      }
      case "h": {
        const nx = ox + v0;
        cubics.push(line(x, y, nx, y));
        x = nx;
        control = undefined;
        quadratic = undefined;
        break;
      }
      case "v": {
        const ny = oy + v0;
        cubics.push(line(x, y, x, ny));
        y = ny;
        control = undefined;
        quadratic = undefined;
        break;
      }
      case "c": {
        const cubic: Cubic = [x, y, ox + v0, oy + v1, ox + v2, oy + v3, ox + v4, oy + v5];
        cubics.push(cubic);
        control = [cubic[4], cubic[5]];
        quadratic = undefined;
        x = cubic[6];
        y = cubic[7];
        break;
      }
      case "s": {
        const [cx, cy] = control === undefined ? [x, y] : [2 * x - control[0], 2 * y - control[1]];
        const cubic: Cubic = [x, y, cx, cy, ox + v0, oy + v1, ox + v2, oy + v3];
        cubics.push(cubic);
        control = [cubic[4], cubic[5]];
        quadratic = undefined;
        x = cubic[6];
        y = cubic[7];
        break;
      }
      case "q": {
        const qx = ox + v0;
        const qy = oy + v1;
        cubics.push(raised(x, y, qx, qy, ox + v2, oy + v3));
        quadratic = [qx, qy];
        control = undefined;
        x = ox + v2;
        y = oy + v3;
        break;
      }
      case "t": {
        const [qx, qy] =
          quadratic === undefined ? [x, y] : [2 * x - quadratic[0], 2 * y - quadratic[1]];
        cubics.push(raised(x, y, qx, qy, ox + v0, oy + v1));
        quadratic = [qx, qy];
        control = undefined;
        x = ox + v0;
        y = oy + v1;
        break;
      }
      case "a": {
        const nx = ox + v5;
        const ny = oy + v6;
        cubics.push(...arcTuples(x, y, v0, v1, v2, v3 === 1, v4 === 1, nx, ny));
        x = nx;
        y = ny;
        control = undefined;
        quadratic = undefined;
        break;
      }
      default:
        return fail(`unknown command "${command}"`);
    }
  }
  finish(false);
  return { outlines: named(outlines) };
}

/** Tuples named `p0`, `p1`, … across every outline in reading order. */
function named(outlines: readonly (readonly Cubic[])[]): readonly (readonly Cubic2d[])[] {
  let count = 0;
  return outlines.map((outline) => outline.map((cubic) => fromTuple(cubic, `p${count++}`)));
}

function fromTuple(c: Cubic, id: string): Cubic2d {
  return { id, x0: c[0], y0: c[1], x1: c[2], y1: c[3], x2: c[4], y2: c[5], x3: c[6], y3: c[7] };
}

/** An elliptical arc as cubics of at most a quarter turn each, named `arc0`, `arc1`, …; nothing when it starts where it ends. */
export function arcPath(options: ArcOptions): readonly Cubic2d[] {
  const { x0, y0, x1, y1, rx, ry } = options;
  return arcTuples(
    x0,
    y0,
    rx,
    ry,
    options.degrees ?? 0,
    options.large ?? false,
    options.sweep ?? false,
    x1,
    y1,
  ).map((cubic, index) => fromTuple(cubic, `arc${index}`));
}
