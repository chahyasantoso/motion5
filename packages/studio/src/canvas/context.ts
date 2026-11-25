import { createContext, useContext } from "react";
import type { Problem, ZoneMargins } from "./api";
import type { StudioGraph } from "../graph";
import type { Pin } from "../pins";
import type { PinRequest } from "./pin-view";
import type { Playhead } from "./playhead";

/** What the preview remembers: its size preset and its safe-zone profile when the overlay is on. */
export interface PreviewChoice {
  readonly preset: string;
  readonly safeZone?: string | undefined;
}

/** What every card and the timeline read of the canvas. */
export interface StudioValue {
  readonly piece: string;
  readonly graph: StudioGraph;
  readonly page: string | null;
  /** The scene length in ms. */
  readonly length: number;
  readonly playhead: Playhead;
  readonly zones: readonly ZoneMargins[];
  readonly preview: PreviewChoice;
  setPreview(next: PreviewChoice): void;
  readonly maximised: boolean;
  setMaximised(on: boolean): void;
  /** Where the maximised preview is drawn. */
  readonly host: HTMLElement | null;
  readonly problem: Problem | undefined;
  /** The pins of the piece as the pins file lists them. */
  readonly pins: readonly Pin[];
  readonly pinMode: boolean;
  setPinMode(on: boolean): void;
  /** Stores a pin for a click made in pin mode, then leaves pin mode. */
  placePin(request: PinRequest): void;
  /** Puts the canvas back where `pin` was left. */
  restorePin(pin: Pin): void;
}

export const StudioContext = createContext<StudioValue | undefined>(undefined);

export function useStudio(): StudioValue {
  const value = useContext(StudioContext);
  if (value === undefined) throw new Error("useStudio is used outside the canvas.");
  return value;
}
