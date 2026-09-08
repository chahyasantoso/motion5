import type { ScrollSource } from "./scroll-trigger";

export interface GsapScrollTriggerInstanceLike {
  readonly progress: number;
  scroll(): number;
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
 *
 * Progress is measured by GSAP, normalized by the trigger port and scheduled by Motion. This
 * source emits a deferred initial snapshot and subsequent actual-position changes. Refresh
 * recalculates geometry without driving a motion; the next scroll uses that refreshed range.
 * Initial delivery is deferred so a driver can finish subscribing before the snapshot arrives.
 */
export function createGsapScrollSource(
  scrollTrigger: GsapScrollTriggerLike,
  options: GsapScrollSourceOptions,
): ScrollSource {
  if (typeof scrollTrigger?.create !== "function") {
    throw new TypeError("createGsapScrollSource requires scrollTrigger.create(vars).");
  }
  const listeners = new Set<{ notify: (progress: number) => void; received: boolean }>();
  let instance: GsapScrollTriggerInstanceLike | undefined;
  let generation = 0;
  let previousPosition = 0;
  let currentProgress = 0;
  let refreshing = false;
  return {
    subscribe(onProgress) {
      const entry = { notify: onProgress, received: false };
      listeners.add(entry);
      if (instance === undefined) {
        const lifetime = ++generation;
        refreshing = false;
        try {
          instance = scrollTrigger.create({
            trigger: options.trigger,
            start: options.start,
            end: options.end,
            pin: options.pin,
            markers: options.markers ?? false,
            onRefreshInit() {
              if (generation === lifetime) refreshing = true;
            },
            onRefresh(self: GsapScrollTriggerInstanceLike) {
              if (generation !== lifetime) return;
              previousPosition = self.scroll();
              refreshing = false;
            },
            onUpdate(self: GsapScrollTriggerInstanceLike) {
              if (generation !== lifetime || instance === undefined || refreshing) return;
              const position = self.scroll();
              if (position === previousPosition) return;
              previousPosition = position;
              currentProgress = self.progress;
              for (const listener of [...listeners]) {
                if (generation !== lifetime) break;
                listener.received = true;
                listener.notify(currentProgress);
              }
            },
          });
          previousPosition = instance.scroll();
          currentProgress = instance.progress;
        } catch (error) {
          listeners.delete(entry);
          ++generation;
          throw error;
        }
      }
      const lifetime = generation;
      queueMicrotask(() => {
        if (generation !== lifetime || !listeners.has(entry) || entry.received) return;
        entry.received = true;
        entry.notify(currentProgress);
      });
      return () => {
        if (!listeners.delete(entry) || listeners.size !== 0) return;
        const released = instance;
        instance = undefined;
        ++generation;
        released?.kill();
      };
    },
  };
}
