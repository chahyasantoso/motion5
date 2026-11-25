import { useEffect, useSyncExternalStore } from "react";
import type { FollowState } from "../protocol";
import type { Follow } from "./follow";
import { INPUT_EVENTS, type Playhead } from "./playhead";

/** Reads the follow state, and tells it when the person uses the canvas or the preview page with a real input. */
export function useFollow(follow: Follow, playhead: Playhead): FollowState {
  useEffect(() => {
    const heard = (event: Event): void => {
      if (event.isTrusted) follow.human();
    };
    for (const type of INPUT_EVENTS) window.addEventListener(type, heard, true);
    const stop = playhead.onInput(() => follow.human());
    return () => {
      stop();
      for (const type of INPUT_EVENTS) window.removeEventListener(type, heard, true);
    };
  }, [follow, playhead]);
  return useSyncExternalStore(follow.subscribe, follow.snapshot);
}
