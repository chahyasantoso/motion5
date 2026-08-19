export { createBrowserClock } from "./browser-clock";
export type { FrameSource } from "./browser-clock";

export { createMicrotaskScheduler } from "./microtask-scheduler";
export type { MicrotaskSchedulerOptions, SchedulerHost } from "./microtask-scheduler";

export { createDomPatchAdapter } from "./dom";
export type {
  DomPatchAdapter,
  DomPatchWriter,
  DomTarget,
  DomTargetResolver,
  StageLike,
} from "./dom";

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
export * from "./graph-builder/default";
export type { GsapLike, GsapTimelineLike, GsapTweenLike } from "./interpolator/gsap";
