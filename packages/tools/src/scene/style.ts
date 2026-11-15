import { existsSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { DESCRIPTOR_KEYS, VALUE_FIELDS, type StyleCard } from "@gerak/moves";
import { briefFolders, portabilityFindings } from "./briefs";
import { checkCatalog, loadCatalog } from "./catalog";
import { styleCards } from "./cards";
import { checkLocalParts } from "./parts";
import { measureShapes, parseSceneReviewArgs, reviewSceneFile, type Shape } from "./review";
import { readSceneModule, type SceneModule } from "./scene";

export type MeasureResult =
  | { readonly kind: "written"; readonly file: string; readonly card: StyleCard }
  | { readonly kind: "refused"; readonly message: string };

type DescriptorKey = (typeof DESCRIPTOR_KEYS)[number];

const WIDEN = 0.05;

/** The `.ts` files directly in a brief's `src/`, by name. */
function pieceFiles(root: string, brief: string): readonly string[] {
  const src = join(root, brief, "src");
  if (!existsSync(src)) return [];
  return readdirSync(src, { withFileTypes: true })
    .filter(
      (entry) => entry.isFile() && entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts"),
    )
    .map((entry) => join(src, entry.name))
    .sort();
}

async function sceneModuleOf(file: string): Promise<SceneModule | undefined> {
  try {
    const read = readSceneModule(await import(pathToFileURL(file).href));
    return "reason" in read ? undefined : read;
  } catch {
    return undefined;
  }
}

function kebab(field: string): string {
  return field.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

const down = (value: number): number => Math.floor(Number((value * 100).toFixed(6))) / 100;
const up = (value: number): number => Math.ceil(Number((value * 100).toFixed(6))) / 100;

function rangeOf(key: DescriptorKey, values: readonly number[]): readonly [number, number] {
  const low = Math.min(...values);
  const high = Math.max(...values);
  if (key === "rings") return [Math.max(0, Math.floor(low) - 1), Math.ceil(high) + 1];
  return [Math.max(0, down(low - WIDEN)), Math.min(1, up(high + WIDEN))];
}

const bare = (name: string): string =>
  /^[A-Za-z_$][\w$]*$/.test(name) ? name : JSON.stringify(name);

function cardText(
  brief: string,
  qualities: ReadonlyMap<string, readonly (readonly [DescriptorKey, readonly [number, number]])[]>,
  defaults: ReadonlyMap<string, string>,
): string {
  const lines = [...qualities].map(
    ([name, ranges]) =>
      `    ${bare(name)}: { ${ranges.map(([key, [low, high]]) => `${key}: [${low}, ${high}]`).join(", ")} },`,
  );
  const picks = [...defaults].map(
    ([field, quality]) => `${bare(field)}: ${JSON.stringify(quality)}`,
  );
  return [
    'import { defineStyle } from "@gerak/moves";',
    "",
    "export const card = defineStyle({",
    `  name: ${JSON.stringify(brief)},`,
    `  description: ${JSON.stringify(`Measured from ${brief}.`)},`,
    "  qualities: {",
    ...lines,
    "  },",
    `  defaults: { ${picks.join(", ")} },`,
    "  tokens: {},",
    "  habits: [],",
    "});",
    "",
  ].join("\n");
}

/** Writes `<brief>/style.ts`, a card whose qualities are the ranges of every field the brief's pieces
 * move, one quality per field, and the default of each field is its own quality. */
export async function measureStyle(root: string, brief: string): Promise<MeasureResult> {
  if (!briefFolders(root).includes(brief))
    return {
      kind: "refused",
      message: `${brief} is not a brief of ${root}; the briefs are ${briefFolders(root).join(", ") || "none"}.`,
    };
  const file = join(root, brief, "style.ts");
  if (existsSync(file))
    return { kind: "refused", message: `${file} already exists; it is never overwritten.` };
  const shapes: Shape[] = [];
  for (const piece of pieceFiles(root, brief)) {
    const module = await sceneModuleOf(piece);
    if (module !== undefined) shapes.push(...measureShapes(module));
  }
  const fields = [...new Set(shapes.map((shape) => shape.field))].filter((field) =>
    Object.hasOwn(VALUE_FIELDS, field),
  );
  if (fields.length === 0)
    return {
      kind: "refused",
      message: `${brief}/src holds no scene module that moves a field; there is nothing to measure.`,
    };
  const qualities = new Map<
    string,
    readonly (readonly [DescriptorKey, readonly [number, number]])[]
  >();
  const defaults = new Map<string, string>();
  for (const field of fields) {
    const own = shapes.filter((shape) => shape.field === field);
    const name = kebab(field);
    qualities.set(
      name,
      DESCRIPTOR_KEYS.map((key) => [
        key,
        rangeOf(
          key,
          own.map((shape) => shape.descriptors[key]),
        ),
      ]),
    );
    defaults.set(field, `${brief}/${name}`);
  }
  writeFileSync(file, cardText(brief, qualities, defaults));
  const { cards, problems } = await styleCards(root);
  const card = cards.find((each) => each.name === brief);
  if (card === undefined) {
    rmSync(file);
    return {
      kind: "refused",
      message: `The measured card did not load: ${problems.join(" ") || "no card"}.`,
    };
  }
  return { kind: "written", file, card };
}

const posix = (path: string): string => path.split(sep).join("/");

const inBrief = (line: string, brief: string): boolean =>
  posix(line).startsWith(`${brief}/`) || posix(line).includes(`/${brief}/src/moves/`);

/** What stops a brief from passing as a style: its card's own problems, its imports, parts and moves,
 * and the review of each piece that is in it or follows its card; none means it passes. */
export async function checkStyle(root: string, brief: string): Promise<readonly string[]> {
  if (!briefFolders(root).includes(brief))
    return [`${brief} is not a brief of ${root}; the briefs are ${briefFolders(root).join(", ")}.`];
  const out: string[] = [];
  const { cards, problems } = await styleCards(root);
  out.push(...problems.filter((line) => line.startsWith(`${brief}/style.ts`)));
  if (!existsSync(join(root, brief, "style.ts")))
    out.push(`${brief}/style.ts does not exist; run motion:style measure ${brief}.`);
  else if (!cards.some((card) => card.name === brief) && out.length === 0)
    out.push(`${brief}/style.ts holds no card.`);
  out.push(...portabilityFindings(root).filter((line) => inBrief(line, brief)));
  out.push(...(await checkLocalParts(root)).filter((line) => inBrief(line, brief)));
  const catalog = await loadCatalog(root);
  out.push(...catalog.problems.filter((line) => inBrief(line, brief)));
  const own = catalog.entries.filter(({ record }) => record.source === brief);
  out.push(...checkCatalog(catalog.entries, own, { root }));
  for (const piece of await pieceFilesFollowing(root, brief)) {
    const parsed = parseSceneReviewArgs([piece]);
    if (parsed.kind === "usage") continue;
    const result = await reviewSceneFile(parsed);
    const name = posix(relative(root, piece));
    const lines = result.kind === "usage" ? result.message.split("\n") : result.findings;
    out.push(...lines.map((line) => `${name}: ${line}`));
  }
  return out;
}

/** The scene modules in the brief, and in any brief, that export `style = "<brief>"`. */
async function pieceFilesFollowing(root: string, brief: string): Promise<readonly string[]> {
  const found: string[] = [];
  for (const other of briefFolders(root))
    for (const piece of pieceFiles(root, other)) {
      const module = await sceneModuleOf(piece);
      if (module !== undefined && (other === brief || module.style === brief)) found.push(piece);
    }
  return found;
}
