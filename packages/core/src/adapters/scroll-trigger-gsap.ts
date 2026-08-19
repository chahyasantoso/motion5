import type { ScrollSource } from "./scroll-trigger";

export interface GsapScrollTriggerInstanceLike {
  kill(): void;
}

export interface GsapScrollTriggerLike {
  create(vars: Record<string, unknown>): GsapScrollTriggerInstanceLike;
}

export interface GsapScrollSourceOptions {
  readonly trigger: string | object;
  readonly start?: string;
  readonly end?: string;
  readonly pin?: boolean | string | object;
  readonly markers?: boolean;
}

/**
 * GSAP ScrollTrigger-backed ScrollSource producer.
 *
 * Core never imports GSAP. The real `ScrollTrigger` is injected by the app layer,
 * which also owns `gsap.registerPlugin(ScrollTrigger)`. Real `ScrollTrigger`
 * satisfies `GsapScrollTriggerLike` structurally, the same way real `gsap`
 * satisfies `GsapLike` in the interpolator seam.
 */
export function createGsapScrollSource(
  scrollTrigger: GsapScrollTriggerLike,
  options: GsapScrollSourceOptions,
): ScrollSource {
  if (typeof scrollTrigger?.create !== "function") {
    throw new TypeError("createGsapScrollSource requires scrollTrigger.create(vars).");
  }
  const listeners = new Set<(progress: number) => void>();
  let instance: GsapScrollTriggerInstanceLike | undefined;
  return {
    subscribe(onProgress) {
      listeners.add(onProgress);

      // Created on the first subscriber so it is torn down exactly when the last one leaves.
      if (instance === undefined) {
        instance = scrollTrigger.create({
          trigger: options.trigger,
          start: options.start,
          end: options.end,
          pin: options.pin,
          markers: options.markers ?? false,
          onUpdate(self: { readonly progress: number }) {
            const progress = self.progress;
            // Iterate a copy: a listener may unsubscribe from inside the callback.
            for (const listener of [...listeners]) listener(progress);
          },
        });
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
