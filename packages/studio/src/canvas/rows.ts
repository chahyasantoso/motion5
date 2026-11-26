import { groupOf, type Card, type StudioGraph } from "../graph";

/** The root scene card: the one scene with no parent. */
export function rootOf(graph: StudioGraph): Card | undefined {
  return graph.cards.find((card) => card.kind === "scene" && card.parent === undefined);
}

/** The sub-scenes and shots drawn as rows inside the root scene card, in graph order. */
export function rowsOf(graph: StudioGraph): readonly Card[] {
  const root = rootOf(graph);
  if (root === undefined) return [];
  return graph.cards.filter(
    (card) => (card.kind === "scene" || card.kind === "shot") && card.parent === root.id,
  );
}

/** How many cast members sit in the row's scene or shot. */
export function memberCount(graph: StudioGraph, row: Card): number {
  return graph.cards.filter((card) => card.parent === row.id && groupOf(card.kind) === "cast")
    .length;
}

/** The id of a row's source port. */
export function rowPort(row: Card): string {
  return `stage:${row.id}`;
}
