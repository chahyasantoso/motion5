/**
 * GSAP ScrollTrigger-backed ScrollSource.
 *
 * This is the ONLY file in the demo that imports gsap. The adapter
 * (packages/core/src/adapters/scroll-trigger.ts) knows nothing about gsap.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ScrollSource } from "@motion5/core/adapters/scroll-trigger";

gsap.registerPlugin(ScrollTrigger);

export interface GsapScrollSourceOptions {
  /** The element (or CSS selector) that triggers the scroll animation. */
  trigger: string | Element;
  /** ScrollTrigger start position, e.g. "top top". */
  start?: string;
  /** ScrollTrigger end position, e.g. "bottom bottom". */
  end?: string;
  /** Pinned element while scrolling, defaults to trigger. */
  pin?: boolean | string | Element;
  /** ScrollTrigger markers for debugging. */
  markers?: boolean;
}

/**
 * Creates a ScrollSource backed by GSAP ScrollTrigger.
 * Pass the result to createScrollTriggerPort() in the adapter.
 *
 * @example
 * const source = createGsapScrollSource({ trigger: "#hero", start: "top top", end: "+=2000" });
 * const port   = createScrollTriggerPort(source);
 * port.subscribe(p => { handle.signal("walk", { type: "scroll", progress: p }); scheduler.flush(); updateDOM(); });
 */
export function createGsapScrollSource(options: GsapScrollSourceOptions): ScrollSource {
  const listeners = new Set<(progress: number) => void>();
  let instance: ReturnType<typeof ScrollTrigger.create> | undefined;

  return {
    subscribe(onProgress) {
      listeners.add(onProgress);

      // Create the ScrollTrigger instance on first subscriber so it can be
      // torn down precisely when the port is disposed.
      if (instance === undefined) {
        instance = ScrollTrigger.create({
          trigger: options.trigger,
          start: options.start ?? "top top",
          end: options.end ?? "+=2000",
          pin: options.pin,
          markers: options.markers ?? false,
          onUpdate(self) {
            const p = self.progress;
            for (const fn of [...listeners]) fn(p);
          },
        });
        //ScrollTrigger.refresh();
      }

      return () => {
        listeners.delete(onProgress);
        if (listeners.size === 0) {
          instance?.kill();
          instance = undefined;
        }
      };
    },
  };
}
