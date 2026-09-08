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
 * Each subscription receives a fresh measured snapshot in a microtask, never during
 * subscribe/create. A qualifying onUpdate supersedes pending initialization. Updates
 * require changed measured position; GSAP does not promise callbacks for movement at
 * clamped endpoints. Refresh holds existing consumers while late subscribers read
 * fresh measurements. This source never normalizes progress or schedules Motion.
 *
 * Subscriptions have independent identity, including repeated callback functions.
 * Detachment cancels pending delivery; the last detachment invalidates the generation
 * before killing its producer. Stale callbacks cannot reach a later generation.
 * Listener failures do not acknowledge acceptance or cause replay: remaining live
 * listeners are attempted, then one failure is rethrown unchanged or multiple failures
 * are aggregated in occurrence order. A reentrant qualifying update supersedes the
 * remainder of the older fan-out. New subscriptions are not in that older fan-out.
 *
 * Producer creation/read failures invalidate the generation and release an acquired
 * instance. The original failure is preserved, or aggregated first if kill also fails.
 * Deferred snapshot/read and listener failures surface from their microtask; synchronous
 * producer callback failures surface to its caller. A failed generation permits retry.
 */
export function createGsapScrollSource(
  scrollTrigger: GsapScrollTriggerLike,
  options: GsapScrollSourceOptions,
): ScrollSource {
  if (typeof scrollTrigger?.create !== "function") {
    throw new TypeError("createGsapScrollSource requires scrollTrigger.create(vars).");
  }
  type Subscription = { notify: (progress: number) => void; pending: boolean };
  type Generation = {
    live: boolean;
    instance: GsapScrollTriggerInstanceLike | undefined;
    listeners: Set<Subscription>;
    position: number;
    refreshing: boolean;
    revision: number;
  };
  let current: Generation | undefined;

  function retire(generation: Generation): void {
    if (!generation.live) return;
    generation.live = false;
    if (current === generation) current = undefined;
    const instance = generation.instance;
    generation.instance = undefined;
    generation.listeners.clear();
    instance?.kill();
  }

  function fail(generation: Generation, error: unknown): never {
    try {
      retire(generation);
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "Scroll source failure and cleanup failure.");
    }
    throw error;
  }

  function snapshot(generation: Generation) {
    try {
      const instance = generation.instance!;
      return { position: instance.scroll(), progress: instance.progress };
    } catch (error) {
      return fail(generation, error);
    }
  }

  return {
    subscribe(onProgress) {
      const generation = (current ??= {
        live: true,
        instance: undefined,
        listeners: new Set<Subscription>(),
        position: 0,
        refreshing: false,
        revision: 0,
      });
      const subscription: Subscription = { notify: onProgress, pending: true };
      generation.listeners.add(subscription);

      if (generation.instance === undefined) {
        try {
          generation.instance = scrollTrigger.create({
            trigger: options.trigger,
            start: options.start,
            end: options.end,
            pin: options.pin,
            markers: options.markers ?? false,
            onRefreshInit() {
              if (generation.live && generation.instance !== undefined)
                generation.refreshing = true;
            },
            onRefresh() {
              if (!generation.live || generation.instance === undefined) return;
              generation.position = snapshot(generation).position;
              generation.refreshing = false;
            },
            onUpdate() {
              // Real GSAP can call back from create(). Ownership is not acquired yet.
              if (!generation.live || generation.instance === undefined || generation.refreshing)
                return;
              const measured = snapshot(generation);
              if (measured.position === generation.position) return;
              generation.position = measured.position;
              const revision = ++generation.revision;
              const errors: unknown[] = [];
              for (const listener of [...generation.listeners]) {
                if (!generation.live || generation.revision !== revision) break;
                if (!generation.listeners.has(listener)) continue;
                listener.pending = false;
                try {
                  listener.notify(measured.progress);
                } catch (error) {
                  errors.push(error);
                }
              }
              if (errors.length === 1) throw errors[0];
              if (errors.length > 1)
                throw new AggregateError(errors, "Scroll source listener failures.");
            },
          });
          generation.position = snapshot(generation).position;
        } catch (error) {
          return fail(generation, error);
        }
      }

      queueMicrotask(() => {
        if (!generation.live || !generation.listeners.has(subscription) || !subscription.pending)
          return;
        subscription.pending = false;
        const measured = snapshot(generation);
        subscription.notify(measured.progress);
      });

      return () => {
        subscription.pending = false;
        if (!generation.listeners.delete(subscription)) return;
        if (generation.listeners.size === 0) retire(generation);
      };
    },
  };
}
