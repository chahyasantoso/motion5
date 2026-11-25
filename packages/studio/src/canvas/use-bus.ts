import { unreachable } from "@gerak/core";
import { useEffect, useRef } from "react";
import type { StudioGraph } from "../graph";
import { COMMAND_EVENT, REPLY_EVENT, type FocusTarget, type StudioReply } from "../protocol";
import { parseCommand } from "../command";
import type { Problem, ZoneMargins } from "./api";
import { runCommand, type CanvasControl } from "./commands";
import type { PreviewChoice } from "./context";
import { inspectCard } from "./inspect";
import type { Playhead } from "./playhead";

/** What the bus reads and changes of the canvas: the same state the person's clicks reach. */
export interface BusInputs {
  readonly piece: string;
  readonly graph: StudioGraph;
  readonly zones: readonly ZoneMargins[];
  readonly playhead: Playhead;
  readonly preview: PreviewChoice;
  readonly problem: Problem | undefined;
  readonly selected: readonly string[];
  readonly focus: FocusTarget;
  setFocus(next: FocusTarget): void;
  setPreview(next: PreviewChoice): void;
  select(id: string): void;
  /** Frames the cards `ids`, or every card when none are given. */
  frame(ids: readonly string[] | undefined): void;
}

const FRAME_WAIT_MS = 100;

function nextFrame(): Promise<void> {
  return new Promise((done) => {
    const timer = setTimeout(done, FRAME_WAIT_MS);
    requestAnimationFrame(() => {
      clearTimeout(timer);
      setTimeout(done, 0);
    });
  });
}

function controlOf(latest: { readonly current: BusInputs }): CanvasControl {
  const status: CanvasControl["status"] = () => {
    const now = latest.current;
    const state = now.playhead.snapshot();
    return {
      piece: now.piece,
      follow: "idle",
      focus: now.focus,
      preset: now.preview.preset,
      safeZone: now.preview.safeZone,
      atMs: state.ms,
      scrollY: now.playhead.window()?.scrollY ?? 0,
      playing: state.playing,
      selected: now.selected,
      problem: now.problem?.message,
    };
  };
  return {
    cards: () => latest.current.graph.cards,
    zones: () => latest.current.zones.map((zone) => zone.name),
    status,
    focus(next, card) {
      const now = latest.current;
      now.setFocus(next);
      if (card?.kind === "shot" && card.span !== undefined)
        now.playhead.soloOn(card.id, card.span.from, card.span.to);
      else now.playhead.clearSolo();
      now.frame(card === undefined ? undefined : [card.id]);
    },
    viewport: (preset, safeZone) =>
      latest.current.setPreview({ preset, ...(safeZone === undefined ? {} : { safeZone }) }),
    seek(target) {
      const { playhead } = latest.current;
      switch (target.kind) {
        case "ms":
          playhead.seek(target.ms);
          return playhead.window() !== undefined;
        case "scroll":
          return playhead.scrollTo(target.px);
        case "selector":
          return playhead.scrollToSelector(target.selector);
        default:
          return unreachable(target);
      }
    },
    play: (from, to, speed) => latest.current.playhead.playRange(from, to, speed),
    select: (id) => latest.current.select(id),
    inspect(card) {
      const now = latest.current;
      return inspectCard(card, now.graph, now.playhead.window(), now.playhead.snapshot().ms);
    },
    settled: nextFrame,
  };
}

function failure(error: unknown): StudioReply {
  return { kind: "failed", message: error instanceof Error ? error.message : String(error) };
}

/** Answers every bus command addressed to this canvas's piece, once, through the canvas's own state. */
export function useBus(inputs: BusInputs): void {
  const latest = useRef(inputs);
  latest.current = inputs;
  const { piece } = inputs;
  useEffect(() => {
    const hot = import.meta.hot;
    if (hot === undefined) return undefined;
    const control = controlOf(latest);
    const received = (data: unknown): void => {
      const id: unknown = Reflect.get(Object(data), "id");
      const addressed: unknown = Reflect.get(Object(data), "piece");
      if (typeof id !== "string" || addressed !== piece) return;
      const command = parseCommand(Reflect.get(Object(data), "command"));
      const answer =
        command === undefined
          ? Promise.resolve<StudioReply>({ kind: "failed", message: "The command is not valid." })
          : runCommand(command, control).catch(failure);
      void answer.then((reply) => hot.send(REPLY_EVENT, { id, reply }));
    };
    hot.on(COMMAND_EVENT, received);
    return () => hot.off?.(COMMAND_EVENT, received);
  }, [piece]);
}
