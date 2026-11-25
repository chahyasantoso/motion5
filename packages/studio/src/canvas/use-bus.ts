import { unreachable } from "@gerak/core";
import { useCallback, useEffect, useRef } from "react";
import type { StudioGraph } from "../graph";
import { COMMAND_EVENT, REPLY_EVENT, type FocusTarget, type StudioReply } from "../protocol";
import { parseCommand } from "../command";
import type { Problem, ZoneMargins } from "./api";
import { runCommand, type CanvasControl } from "./commands";
import type { PreviewChoice } from "./context";
import type { Follow } from "./follow";
import { inspectCard } from "./inspect";
import type { Playhead } from "./playhead";
import { WorkerFrame, type Surface } from "./worker-frame";

/** What the bus reads and changes of the canvas: the same state the person's clicks reach. */
export interface BusInputs {
  readonly piece: string;
  readonly page: string | null;
  readonly length: number;
  readonly follow: Follow;
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

function visibleSurface(now: BusInputs): Surface {
  return {
    playhead: now.playhead,
    preview: now.preview,
    focus: now.focus,
    selected: now.selected,
    focusOn(next, card) {
      now.setFocus(next);
      if (card?.kind === "shot" && card.span !== undefined)
        now.playhead.soloOn(card.id, card.span.from, card.span.to);
      else now.playhead.clearSolo();
      now.frame(card === undefined ? undefined : [card.id]);
    },
    previewOn: now.setPreview,
    select: now.select,
  };
}

function controlOf(latest: { readonly current: BusInputs }, surface: () => Surface): CanvasControl {
  return {
    cards: () => latest.current.graph.cards,
    zones: () => latest.current.zones.map((zone) => zone.name),
    status() {
      const now = latest.current;
      const on = surface();
      const state = on.playhead.snapshot();
      return {
        piece: now.piece,
        follow: now.follow.snapshot(),
        focus: on.focus,
        preset: on.preview.preset,
        safeZone: on.preview.safeZone,
        atMs: state.ms,
        scrollY: on.playhead.window()?.scrollY ?? 0,
        playing: state.playing,
        selected: on.selected,
        problem: now.problem?.message,
      };
    },
    focus: (next, card) => surface().focusOn(next, card),
    viewport: (preset, safeZone) =>
      surface().previewOn({ preset, ...(safeZone === undefined ? {} : { safeZone }) }),
    seek(target) {
      const { playhead } = surface();
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
    play: (from, to, speed) => surface().playhead.playRange(from, to, speed),
    select: (id) => surface().select(id),
    inspect(card) {
      const { playhead } = surface();
      return inspectCard(card, latest.current.graph, playhead.window(), playhead.snapshot().ms);
    },
    settled: nextFrame,
  };
}

function failure(error: unknown): StudioReply {
  return { kind: "failed", message: error instanceof Error ? error.message : String(error) };
}

function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Answers every bus command addressed to this canvas's piece, once; returns how the person takes the canvas back. */
export function useBus(inputs: BusInputs): { readonly resume: () => void } {
  const latest = useRef(inputs);
  latest.current = inputs;
  const worker = useRef<WorkerFrame | undefined>(undefined);
  const starting = useRef<Promise<void>>(Promise.resolve());
  const { piece } = inputs;

  const resume = useCallback((): void => {
    const now = latest.current;
    if (!now.follow.resume()) return;
    const held = worker.current;
    worker.current = undefined;
    if (held === undefined) return;
    const visible = visibleSurface(now);
    if (!same(held.focus, now.focus)) visible.focusOn(held.focus, held.card);
    if (!same(held.preview, now.preview)) visible.previewOn(held.preview);
    const picked = held.selected[held.selected.length - 1];
    if (picked !== undefined && !same(held.selected, now.selected)) visible.select(picked);
    now.playhead.seek(held.playhead.snapshot().ms);
    held.close();
  }, []);

  useEffect(() => {
    const hot = import.meta.hot;
    if (hot === undefined) return undefined;
    const visible = controlOf(latest, () => visibleSurface(latest.current));
    const hidden = controlOf(latest, () => worker.current ?? visibleSurface(latest.current));
    const received = (data: unknown): void => {
      const id: unknown = Reflect.get(Object(data), "id");
      const addressed: unknown = Reflect.get(Object(data), "piece");
      if (typeof id !== "string" || addressed !== piece) return;
      const command = parseCommand(Reflect.get(Object(data), "command"));
      const answer = async (): Promise<StudioReply> => {
        if (command === undefined) return { kind: "failed", message: "The command is not valid." };
        const now = latest.current;
        now.follow.command();
        if (now.follow.snapshot() !== "detached" || now.page === null)
          return runCommand(command, visible);
        if (worker.current === undefined) {
          const started = new WorkerFrame(now.page, visibleSurface(now), now.length);
          const at = now.playhead.snapshot().ms;
          worker.current = started;
          starting.current = started.ready().then(() => started.playhead.seek(at));
        }
        await starting.current;
        return runCommand(command, hidden);
      };
      void answer()
        .catch(failure)
        .then((reply) => hot.send(REPLY_EVENT, { id, reply }));
    };
    hot.on(COMMAND_EVENT, received);
    return () => {
      hot.off?.(COMMAND_EVENT, received);
      worker.current?.close();
      worker.current = undefined;
    };
  }, [piece]);

  return { resume };
}
