import { useLayoutEffect, useRef, useState } from "react";
import {
  Engine,
  createMicrotaskScheduler,
  validateV5,
  type Diagnostic,
  type Interpolator,
  type PluginCatalog,
  type ProjectHandle,
} from "@motion5/core";
import { createBrowserClock } from "@motion5/core/adapters/browser-clock";
import { unreachable } from "@motion5/core/internal";

/** What a page renders from: nothing yet, a live project, or the reasons it was refused. */
export type MotionProjectState =
  | { readonly kind: "loading" }
  | { readonly kind: "ready"; readonly handle: ProjectHandle; replay(): void }
  | { readonly kind: "refused"; readonly diagnostics: readonly Diagnostic[] };

const LOADING: MotionProjectState = Object.freeze({ kind: "loading" });

/**
 * Validates, loads and mounts `project` on the browser clock, and disposes it on unmount or replay.
 * `plugins` and `interpolator` are read at each load, so their identity never reloads the project.
 */
export function useMotionProject(
  project: unknown,
  plugins: PluginCatalog,
  interpolator: Interpolator,
): MotionProjectState {
  const [state, setState] = useState<MotionProjectState>(LOADING);
  const [run, setRun] = useState(0);
  const ports = useRef({ plugins, interpolator });
  useLayoutEffect(() => {
    ports.current = { plugins, interpolator };
  });

  useLayoutEffect(() => {
    const validated = validateV5(project, ports.current.plugins);
    switch (validated.kind) {
      case "refused":
        setState({ kind: "refused", diagnostics: validated.diagnostics });
        return undefined;
      case "accepted":
        break;
      default:
        return unreachable(validated);
    }
    const clock = createBrowserClock({
      requestFrame: (callback: FrameRequestCallback) => requestAnimationFrame(callback),
      cancelFrame: (frame: number) => cancelAnimationFrame(frame),
    });
    let handle: ProjectHandle;
    try {
      handle = new Engine({
        clock,
        interpolator: ports.current.interpolator,
        scheduler: createMicrotaskScheduler(),
        plugins: ports.current.plugins,
      }).load(validated.value);
      for (const motionId of handle.motionIds())
        for (const node of handle.motion(motionId).trackIds) handle.mount(node);
      for (const node of handle.freeTrackIds()) handle.mount(node);
    } catch (error) {
      clock.dispose();
      throw error;
    }
    setState({ kind: "ready", handle, replay: () => setRun((current) => current + 1) });
    return () => {
      setState(LOADING);
      handle.dispose();
      clock.dispose();
    };
  }, [project, run]);

  return state;
}
