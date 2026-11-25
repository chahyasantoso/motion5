import { useEffect, useSyncExternalStore } from "react";
import type { FollowState } from "../protocol";
import type { Follow } from "./follow";

const HUMAN_EVENTS = ["pointerdown", "keydown", "wheel"] as const;

/** Reads the follow state, and tells it when the person uses the canvas window with a real input. */
export function useFollow(follow: Follow): FollowState {
  useEffect(() => {
    const heard = (event: Event): void => {
      if (event.isTrusted) follow.human();
    };
    for (const type of HUMAN_EVENTS) window.addEventListener(type, heard, true);
    return () => {
      for (const type of HUMAN_EVENTS) window.removeEventListener(type, heard, true);
    };
  }, [follow]);
  return useSyncExternalStore(follow.subscribe, follow.snapshot);
}
