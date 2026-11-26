import type { StudioPromptContext } from "../agent-port";
import type { Card, StudioGraph } from "../graph";
import type { FocusTarget } from "../protocol";
import type { Problem } from "./api";
import { inspectCard } from "./inspect";
import { focusNames } from "./pin-view";
import type { Playhead } from "./playhead";

/** What the canvas holds about a place on it, besides the card. */
export interface ContextView {
  readonly piece: string;
  readonly graph: StudioGraph;
  readonly focus: FocusTarget;
  readonly preview: { readonly preset: string; readonly safeZone?: string | undefined };
  readonly playhead: Playhead;
  /** The chosen recorded preset, when one is. */
  readonly preset: string | undefined;
  readonly problem: Problem | undefined;
}

/** The one builder of a place's context; a pin is this context saved. */
export function contextOf(
  view: ContextView,
  at: {
    readonly card: Card | undefined;
    readonly atMs?: number;
    readonly prompt?: string;
  },
): StudioPromptContext {
  const { graph, playhead } = view;
  const win = playhead.window();
  const atMs = at.atMs ?? playhead.snapshot().ms;
  const seen = at.card === undefined ? undefined : inspectCard(at.card, graph, win, atMs);
  const names = focusNames(view.focus, graph.cards);
  return {
    piece: view.piece,
    card: at.card?.id,
    scene: names.scene,
    shot: names.shot,
    file: at.card?.site?.file,
    viewport: { preset: view.preview.preset, safeZone: view.preview.safeZone },
    atMs,
    scrollY: win?.scrollY ?? 0,
    preset: view.preset,
    target: { pose: seen?.pose, restBox: seen?.rest, steps: seen?.steps ?? [] },
    findings: [],
    problem: view.problem?.message,
    prompt: at.prompt ?? "",
  };
}
