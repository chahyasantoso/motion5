import { existsSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { VALUE_FIELDS, isLively, type StyleCard } from "@gerak/moves";
import { briefFolders, portabilityFindings } from "./briefs";
import { checkCatalog, loadCatalog } from "./catalog";
import { styleCards } from "./cards";
import { checkLocalParts } from "./parts";
import { measureShapes, parseSceneReviewArgs, reviewSceneFile, type Shape } from "./review";
import { readSceneModule, type SceneModule } from "./scene";

export type MeasureResult =
  | { readonly kind: "written"; readonly file: string; readonly card: StyleCard }
  | { readonly kind: "refused"; readonly message: string };

const MOST_WIDTH = 0.5;
const MARGIN = 0.1;
const STEP = 0.05;
const MIN_MOTIONS = 3;

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

const bare = (name: string): string =>
  /^[A-Za-z_$][\w$]*$/.test(name) ? name : JSON.stringify(name);

const gridDown = (value: number): number => Math.floor(Number((value / STEP).toFixed(6))) * STEP;
const gridUp = (value: number): number => Math.ceil(Number((value / STEP).toFixed(6))) * STEP;
const tidy = (value: number): number => Number(value.toFixed(2));

function cardText(brief: string, lively: ReadonlyMap<string, readonly [number, number]>): string {
  const picks = [...lively].map(([field, [low, high]]) => `${bare(field)}: [${low}, ${high}]`);
  return [
    'import { defineStyle } from "@gerak/moves";',
    "",
    "export const card = defineStyle({",
    `  name: ${JSON.stringify(brief)},`,
    `  description: ${JSON.stringify(`Measured from ${brief}.`)},`,
    "  qualities: {},",
    `  lively: { ${picks.join(", ")} },`,
    "  tokens: {},",
    "  habits: [],",
    "});",
    "",
  ].join("\n");
}

/** The range of the shares of lively motion a field has across pieces, widened and put on a grid, or none
 * when too wide. */
function livelyRange(shares: readonly number[]): readonly [number, number] | undefined {
  const low = tidy(gridDown(Math.max(0, Math.min(...shares) - MARGIN)));
  const high = tidy(gridUp(Math.min(1, Math.max(...shares) + MARGIN)));
  return high - low > MOST_WIDTH ? undefined : [low, high];
}

/** Writes `<brief>/style.ts`, a card whose `lively` gives, for each field, the range of the share of lively
 * motions across the brief's pieces that move it at least three times. */
export async function measureStyle(root: string, brief: string): Promise<MeasureResult> {
  if (!briefFolders(root).includes(brief))
    return {
      kind: "refused",
      message: `${brief} is not a brief of ${root}; the briefs are ${briefFolders(root).join(", ") || "none"}.`,
    };
  const file = join(root, brief, "style.ts");
  if (existsSync(file))
    return { kind: "refused", message: `${file} already exists; it is never overwritten.` };
  const perPiece: (readonly Shape[])[] = [];
  for (const piece of pieceFiles(root, brief)) {
    const module = await sceneModuleOf(piece);
    if (module !== undefined) perPiece.push(measureShapes(module));
  }
  const fields = [...new Set(perPiece.flat().map((shape) => shape.field))].filter(
    (field) => field !== "custom" && Object.hasOwn(VALUE_FIELDS, field),
  );
  if (fields.length === 0)
    return {
      kind: "refused",
      message: `${brief}/src holds no scene module that moves a field; there is nothing to measure.`,
    };
  const lively = new Map<string, readonly [number, number]>();
  for (const field of fields) {
    const shares = perPiece.flatMap((shapes) => {
      const own = shapes.filter((shape) => shape.field === field);
      return own.length < MIN_MOTIONS
        ? []
        : [own.filter((shape) => isLively(shape.descriptors)).length / own.length];
    });
    const range = shares.length === 0 ? undefined : livelyRange(shares);
    if (range !== undefined) lively.set(field, range);
  }
  writeFileSync(file, cardText(brief, lively));
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
    // A piece's other review findings are its own; the card answers only for its lively share.
    const lines =
      result.kind === "usage"
        ? result.message.split("\n")
        : result.findings.filter((line) => line.endsWith("(style)"));
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
