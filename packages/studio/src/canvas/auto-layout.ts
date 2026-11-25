import { unreachable } from "@gerak/core";
import { groupOf, type Card, type CardGroup, type StudioGraph } from "../graph";

/** Where a card sits on the canvas. */
export interface Place {
  readonly x: number;
  readonly y: number;
}

export const COLUMN_WIDTH = 320;
export const ROW_GAP = 24;
export const PREVIEW_SIZE = { width: 720, height: 560 } as const;

function groupColumn(group: CardGroup, outputColumn: number): number {
  switch (group) {
    case "source":
      return 0;
    case "tool":
      return 1;
    case "timing":
    case "look":
      return 2;
    case "cast":
      return 4;
    case "move":
      return 5;
    case "output":
      return outputColumn;
    default:
      return unreachable(group);
  }
}

/** The column of a card: source, tool, timing, beats beside it, cast, moves, output. */
export function columnOf(card: Card, outputColumn = 6): number {
  return card.kind === "beat" ? 3 : groupColumn(groupOf(card.kind), outputColumn);
}

/** The height a card is laid out with, before the canvas measures it. */
export function heightOf(card: Card): number {
  if (card.kind === "preview") return PREVIEW_SIZE.height;
  return groupOf(card.kind) === "timing" ? 96 : 88;
}

const isCast = (card: Card): boolean => groupOf(card.kind) === "cast";

/** Places each card in a column by group; beats and cast sit level with the shot that owns them. */
export function autoLayout(graph: StudioGraph): ReadonlyMap<string, Place> {
  const placed = new Map<string, Place>();
  const bottom = new Map<number, number>();
  const stack = (card: Card, column: number, from: number): void => {
    if (placed.has(card.id)) return;
    const y = Math.max(bottom.get(column) ?? 0, from);
    placed.set(card.id, { x: column * COLUMN_WIDTH, y });
    bottom.set(column, y + heightOf(card) + ROW_GAP);
  };
  const cards = graph.cards;
  const counts = new Map<string, number>();
  for (const card of cards)
    if (card.step !== undefined)
      counts.set(card.step.member, (counts.get(card.step.member) ?? 0) + 1);
  const outputColumn = 5 + Math.max(1, ...counts.values());
  const root = cards.find((card) => card.kind === "scene" && card.parent === undefined);
  if (root !== undefined) stack(root, columnOf(root), 0);
  for (const owner of cards) {
    if (owner === root || (owner.kind !== "scene" && owner.kind !== "shot")) continue;
    stack(owner, 2, bottom.get(2) ?? 0);
    const top = placed.get(owner.id)?.y ?? 0;
    for (const card of cards)
      if (card.parent === owner.id && (card.kind === "beat" || isCast(card)))
        stack(card, columnOf(card), top);
    const band = Math.max(bottom.get(2) ?? 0, bottom.get(3) ?? 0, bottom.get(4) ?? 0);
    for (const column of [2, 3, 4]) bottom.set(column, band);
  }
  const rows = new Map<string, { readonly y: number; used: number }>();
  let movesBottom = 0;
  for (const card of cards) {
    if (card.step === undefined) continue;
    const owner = `member:${card.step.member}`;
    const row = rows.get(owner) ?? { y: Math.max(movesBottom, placed.get(owner)?.y ?? 0), used: 0 };
    if (row.used === 0) movesBottom = row.y + heightOf(card) + ROW_GAP;
    placed.set(card.id, { x: (5 + row.used) * COLUMN_WIDTH, y: row.y });
    row.used += 1;
    rows.set(owner, row);
  }
  for (const card of cards) stack(card, columnOf(card, outputColumn), 0);
  return placed;
}
