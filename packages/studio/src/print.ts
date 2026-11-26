import { groupOf, type Card, type StudioGraph } from "./graph";

function ms(card: Card): string {
  if (card.span === undefined) return "";
  const overlap = card.overlap === undefined ? "" : `, overlap ${card.overlap}`;
  return `  ${card.span.from}–${card.span.to} ms${overlap}`;
}

function extra(card: Card): string {
  const parts: string[] = [];
  if (card.site !== undefined) parts.push(`${card.site.file}:${card.site.line}`);
  if (card.wrappers !== undefined)
    parts.push(`via ${card.wrappers.map((each) => each.name).join(", ")}`);
  if (card.knobs !== undefined && card.knobs.length > 0)
    parts.push(card.knobs.map((knob) => `${knob.name} ${String(knob.value)}`).join(", "));
  if (card.cast !== undefined && !card.cast.page) parts.push("no page element");
  if (card.note !== undefined) parts.push(card.note);
  return parts.length === 0 ? "" : `  (${parts.join(", ")})`;
}

/** The graph as an indented outline: scenes, shots, beats and casts with their moves, then the rest. */
export function printGraph(graph: StudioGraph): string {
  const byId = new Map(graph.cards.map((card) => [card.id, card]));
  const into = (id: string, type?: string): readonly string[] =>
    graph.wires
      .filter((wire) => wire.to === id && (type === undefined || wire.type === type))
      .map((wire) => byId.get(wire.from)?.name ?? wire.from);
  const out = (id: string): readonly string[] =>
    graph.wires
      .filter((wire) => wire.from === id)
      .map((wire) => byId.get(wire.to)?.name ?? wire.to);
  const lines = [`${graph.piece}  ${graph.cards.length} cards, ${graph.wires.length} wires`];
  const children = (parent: string): readonly Card[] =>
    graph.cards.filter((card) => card.parent === parent);
  const moves = (member: string): readonly Card[] =>
    graph.cards.filter((card) => card.step?.member === member && card.id.startsWith("move:"));
  const walk = (card: Card, depth: number): void => {
    const pad = "  ".repeat(depth);
    lines.push(`${pad}${card.kind} ${card.name}${ms(card)}${extra(card)}`);
    for (const child of children(card.id)) walk(child, depth + 1);
    if (card.id.startsWith("member:"))
      for (const move of moves(card.name)) {
        const time = into(move.id, "time");
        const from = time.length === 0 ? "" : `  ← ${time.join(", ")}`;
        lines.push(`${pad}  ${move.kind} ${move.name}${from}${extra(move)}`);
      }
  };
  for (const card of graph.cards)
    if (card.kind === "scene" && card.parent === undefined) walk(card, 0);
  for (const group of ["source", "tool", "output"] as const) {
    const cards = graph.cards.filter((card) => groupOf(card.kind) === group);
    if (cards.length === 0) continue;
    lines.push(`${group}s`);
    for (const card of cards) {
      const from = into(card.id);
      const to = out(card.id);
      lines.push(
        `  ${card.kind} ${card.path ?? card.name}${from.length === 0 ? "" : `  ← ${from.join(", ")}`}${to.length === 0 ? "" : `  → ${to.join(", ")}`}`,
      );
    }
  }
  const loose = graph.cards.filter((card) => card.id.startsWith("code:"));
  if (loose.length > 0) {
    lines.push("set in code");
    for (const card of loose) lines.push(`  ${card.name}${extra(card)}`);
  }
  return lines.join("\n");
}
