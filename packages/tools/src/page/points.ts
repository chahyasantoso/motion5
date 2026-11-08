export interface Point {
  readonly x: number;
  readonly y: number;
}

export type PointsArgs =
  | {
      readonly kind: "ok";
      readonly file: string;
      readonly spacing: number;
      readonly prefix: string;
    }
  | { readonly kind: "usage"; readonly message: string };

const USAGE = "usage: motion:points <points.json> --spacing px [--prefix p]";

export function parsePointsArgs(argv: readonly string[]): PointsArgs {
  const usage = (message: string): PointsArgs => ({
    kind: "usage",
    message: `${message} ${USAGE}`,
  });
  const [file, ...rest] = argv;
  if (file === undefined || file.startsWith("--")) return usage("Expected one points file.");
  const flags = new Map<string, string | undefined>();
  for (let i = 0; i < rest.length; i += 2) {
    const flag = rest[i]!;
    if (flag !== "--spacing" && flag !== "--prefix") return usage(`Unknown flag ${flag}.`);
    flags.set(flag, rest[i + 1]);
  }
  const spacing = Number(flags.get("--spacing"));
  if (!Number.isFinite(spacing) || spacing <= 0) return usage("--spacing needs a positive number.");
  const prefix = flags.get("--prefix") ?? "p";
  if (!/^[A-Za-z][\w-]*$/.test(prefix))
    return usage("--prefix needs a letter, then letters or digits.");
  return { kind: "ok", file, spacing, prefix };
}

/** Points along the polyline every `spacing` px, keeping both ends; the last gap may be shorter. */
export function resample(points: readonly Point[], spacing: number): readonly Point[] {
  const first = points[0];
  if (first === undefined) return [];
  const out: Point[] = [first];
  let carried = 0;
  for (let index = 1; index < points.length; index += 1) {
    const a = points[index - 1]!;
    const b = points[index]!;
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    let along = spacing - carried;
    while (along <= length) {
      const t = along / length;
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      along += spacing;
    }
    carried = length - (along - spacing);
  }
  const last = points[points.length - 1]!;
  const end = out[out.length - 1]!;
  if (end.x !== last.x || end.y !== last.y) out.push(last);
  return out;
}

/** Rows for a `values` table, ids `<prefix>0`, `<prefix>1`, with coordinates rounded to 0.01 px. */
export function toRows(
  points: readonly Point[],
  prefix: string,
): readonly { readonly id: string; readonly cells: Point }[] {
  const round = (value: number) => Math.round(value * 100) / 100;
  return points.map((point, index) => ({
    id: `${prefix}${index}`,
    cells: { x: round(point.x), y: round(point.y) },
  }));
}
