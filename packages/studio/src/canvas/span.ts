import { groupOf, type Card, type StudioGraph } from "../graph";
import { rootOf } from "./rows";

/** A range of the piece's clock in ms. */
export interface Span {
  readonly from: number;
  readonly to: number;
}

/** A cast element's extent in the page document, in px from its top. */
export interface Bounds {
  readonly top: number;
  readonly bottom: number;
}

/** What a preview's page tells about itself: how it is driven, its scroll and its cast's extents. */
export interface PageFacts {
  /** Whether the Studio handed the page its driver, so its time sweeps the scroll. */
  readonly driven: boolean;
  /** Whether a take is wired in, which plays the whole timeline. */
  readonly take: boolean;
  /** The driver's timeline length in ms. */
  readonly length: number;
  /** How far the page can scroll, in px. */
  readonly maxScroll: number;
  /** The page window's height in px. */
  readonly viewport: number;
  /** The extents of the `data-cast` elements of the part's cast. */
  readonly bounds: readonly Bounds[];
}

/** The names of the cast members that sit in `row`. */
export function castNamesOf(graph: StudioGraph, row: string): readonly string[] {
  return graph.cards
    .filter((card) => card.parent === row && groupOf(card.kind) === "cast")
    .map((card) => card.name);
}

function unionOf(spans: readonly Span[]): Span | undefined {
  if (spans.length === 0) return undefined;
  return {
    from: Math.min(...spans.map((each) => each.from)),
    to: Math.max(...spans.map((each) => each.to)),
  };
}

function timedSpan(graph: StudioGraph, card: Card): Span | undefined {
  if (card.span !== undefined) return card.span;
  const beats = graph.cards.filter((each) => each.kind === "beat" && each.parent === card.id);
  return unionOf(beats.flatMap((each) => (each.span === undefined ? [] : [each.span])));
}

function sweptSpan(facts: PageFacts): Span | undefined {
  if (facts.take || facts.maxScroll <= 0 || facts.bounds.length === 0) return undefined;
  const top = Math.min(...facts.bounds.map((each) => each.top));
  const bottom = Math.max(...facts.bounds.map((each) => each.bottom));
  const from = Math.max(0, top - facts.viewport);
  const to = Math.min(facts.maxScroll, bottom);
  const toMs = (px: number): number => Math.round((px / facts.maxScroll) * facts.length);
  return toMs(to) > toMs(from) ? { from: toMs(from), to: toMs(to) } : undefined;
}

/** The span a preview of `source` plays on a page; `undefined` plays the whole piece. */
export function spanOf(
  graph: StudioGraph,
  source: string,
  facts: PageFacts | undefined,
): Span | undefined {
  const card = graph.cards.find((each) => each.id === source);
  if (card === undefined || card.id === rootOf(graph)?.id) return undefined;
  if (card.kind !== "scene" && card.kind !== "shot") return undefined;
  return facts?.driven === true ? sweptSpan(facts) : timedSpan(graph, card);
}
