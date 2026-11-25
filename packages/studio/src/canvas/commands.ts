import { unreachable } from "@gerak/core";
import type { Card } from "../graph";
import type {
  FocusTarget,
  Inspection,
  SeekTarget,
  StudioCommand,
  StudioReply,
  StudioStatus,
} from "../protocol";
import { PRESETS } from "./presets";

/** What a bus command may do to the canvas: the same operations the person's clicks reach. */
export interface CanvasControl {
  cards(): readonly Card[];
  /** The names of the loaded safe-zone profiles. */
  zones(): readonly string[];
  status(): StudioStatus;
  /** Frames `card` (the whole piece when none) and solos it when it is a shot. */
  focus(next: FocusTarget, card: Card | undefined): void;
  viewport(preset: string, safeZone: string | undefined): void;
  /** Moves the page; `false` when a selector matches nothing. */
  seek(target: SeekTarget): boolean;
  /** Plays the page clock; `false` when the page has no timed clock. */
  play(from: number | undefined, to: number | undefined, speed: number | undefined): boolean;
  select(id: string): void;
  inspect(card: Card): Inspection;
  /** Resolves once the page has had a frame to show the last change. */
  settled(): Promise<void>;
}

function failed(message: string): StudioReply {
  return { kind: "failed", message };
}

function names(cards: readonly Card[], kind: Card["kind"]): string {
  const found = cards.filter((card) => card.kind === kind).map((card) => card.name);
  return found.length === 0 ? "none" : found.join(", ");
}

async function done(control: CanvasControl): Promise<StudioReply> {
  await control.settled();
  return { kind: "done", status: control.status() };
}

function focusCard(
  target: FocusTarget,
  cards: readonly Card[],
): { readonly card: Card | undefined } | string {
  switch (target.kind) {
    case "all":
      return { card: undefined };
    case "scene": {
      const card = cards.find((each) => each.id === `scene:${target.name}`);
      return card === undefined
        ? `No scene named "${target.name}". Scenes: ${names(cards, "scene")}.`
        : { card };
    }
    case "shot": {
      const card = cards.find((each) => each.id === `shot:${target.name}`);
      return card === undefined
        ? `No shot named "${target.name}". Shots: ${names(cards, "shot")}.`
        : { card };
    }
    case "shot-index": {
      const card = cards.filter((each) => each.kind === "shot")[target.index];
      return card === undefined
        ? `No shot at index ${target.index}. Shots: ${names(cards, "shot")}.`
        : { card };
    }
    default:
      return unreachable(target);
  }
}

/** Runs one bus command against the canvas and answers it. */
export async function runCommand(
  command: StudioCommand,
  control: CanvasControl,
): Promise<StudioReply> {
  switch (command.kind) {
    case "status":
      return { kind: "status", status: control.status() };
    case "graph":
    case "check":
      return failed(`${command.kind} is answered by the server.`);
    case "focus": {
      const found = focusCard(command.target, control.cards());
      if (typeof found === "string") return failed(found);
      control.focus(command.target, found.card);
      return done(control);
    }
    case "viewport": {
      if (!PRESETS.some((preset) => preset.id === command.preset))
        return failed(
          `No size preset "${command.preset}". Presets: ${PRESETS.map((preset) => preset.id).join(", ")}.`,
        );
      const zone = command.safeZone;
      if (zone !== undefined && !control.zones().includes(zone))
        return failed(`No safe zone "${zone}". Safe zones: ${control.zones().join(", ")}.`);
      control.viewport(command.preset, zone);
      return done(control);
    }
    case "seek": {
      if (!control.seek(command.target)) {
        const target = command.target;
        return failed(
          target.kind === "selector"
            ? `No element matches "${target.selector}".`
            : "The page cannot seek.",
        );
      }
      return done(control);
    }
    case "play": {
      if (!control.play(command.from, command.to, command.speed))
        return failed("The page has no timed clock to play.");
      return done(control);
    }
    case "select": {
      if (!control.cards().some((card) => card.id === command.card))
        return failed(`No card "${command.card}".`);
      control.select(command.card);
      return done(control);
    }
    case "inspect": {
      const cards = control.cards();
      const id = command.card ?? control.status().selected[0];
      if (command.card === undefined && control.status().selected.length !== 1)
        return failed("Name a card, or select exactly one.");
      const card = cards.find((each) => each.id === id);
      if (card === undefined) return failed(`No card "${id ?? ""}".`);
      return { kind: "inspect", inspection: control.inspect(card) };
    }
    default:
      return unreachable(command);
  }
}
