import { useSyncExternalStore } from "react";
import type { Playhead, PlayheadState } from "./playhead";

/** The playhead's whole state; a component that reads it renders on every ms. */
export function usePlayhead(playhead: Playhead): PlayheadState {
  return useSyncExternalStore(playhead.subscribe, playhead.snapshot);
}

/** The id of the soloed shot; a component that reads it renders only when that changes. */
export function useSoloId(playhead: Playhead): string | undefined {
  return useSyncExternalStore(playhead.subscribe, () => playhead.snapshot().solo);
}
