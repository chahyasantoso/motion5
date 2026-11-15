import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  QUALITIES,
  isStyleCard,
  qualityOf,
  type DescriptorRanges,
  type StyleCard,
} from "@gerak/moves";
import { briefFolders } from "./briefs";

/** The style cards of the briefs under `root`, each read from `<brief>/style.ts`, and a line for each
 * brief whose file is not a good card. */
export async function styleCards(
  root: string,
): Promise<{ readonly cards: readonly StyleCard[]; readonly problems: readonly string[] }> {
  const cards: StyleCard[] = [];
  const problems: string[] = [];
  for (const brief of briefFolders(root)) {
    const file = join(root, brief, "style.ts");
    if (!existsSync(file)) continue;
    try {
      const loaded: unknown = await import(pathToFileURL(file).href);
      const card: unknown = Reflect.get(Object(loaded), "card");
      if (card === undefined) problems.push(`${brief}/style.ts exports no \`card\`.`);
      else if (!isStyleCard(card))
        problems.push(`${brief}/style.ts: \`card\` was not made by \`defineStyle\`.`);
      else if (card.name !== brief)
        problems.push(`${brief}/style.ts: the card is named "${card.name}", not "${brief}".`);
      else cards.push(card);
    } catch (error) {
      problems.push(`${brief}/style.ts: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return { cards, problems };
}

/** The ranges of a quality: a library name, or `<brief>/<name>` from that brief's card. */
export function rangesOf(
  quality: string,
  cards: readonly StyleCard[],
): DescriptorRanges | undefined {
  const slash = quality.indexOf("/");
  if (slash < 0) return qualityOf(quality);
  const card = cards.find((each) => each.name === quality.slice(0, slash));
  const own = quality.slice(slash + 1);
  return card !== undefined && Object.hasOwn(card.qualities, own) ? card.qualities[own] : undefined;
}

/** Every quality a design may name: the library's, then each card's as `<brief>/<name>`. */
export function qualityNames(cards: readonly StyleCard[]): readonly string[] {
  return [
    ...Object.keys(QUALITIES),
    ...cards.flatMap((card) => Object.keys(card.qualities).map((name) => `${card.name}/${name}`)),
  ];
}
