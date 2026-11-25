import { createContext, useContext } from "react";
import type { Problem, ZoneMargins } from "./api";
import type { StudioGraph } from "../graph";
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
}

export const StudioContext = createContext<StudioValue | undefined>(undefined);

export function useStudio(): StudioValue {
  const value = useContext(StudioContext);
  if (value === undefined) throw new Error("useStudio is used outside the canvas.");
  return value;
}
