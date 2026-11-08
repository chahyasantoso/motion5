export { createMicrotaskScheduler } from "./microtask-scheduler";
export type { MicrotaskSchedulerOptions, SchedulerHost } from "./microtask-scheduler";

export { createScrollTriggerPort } from "./scroll-trigger";
export type { ScrollSource } from "./scroll-trigger";
export { createGsapScrollSource } from "./scroll-trigger-gsap";
export type {
  GsapScrollSourceOptions,
  GsapScrollTriggerInstanceLike,
  GsapScrollTriggerLike,
} from "./scroll-trigger-gsap";

export { createDefaultTriggerFactory, createTriggerFactory } from "./trigger-factory/default";
export type {
  ScrollSourceResolver,
  ScrollSourceResolverContext,
  TriggerFactoryOptions,
} from "./trigger-factory/default";

export { createGsapInterpolator, createGsapOneTweenInterpolator } from "./interpolator/gsap";
export type { GsapLike, GsapTimelineLike, GsapTweenLike } from "./interpolator/gsap";
