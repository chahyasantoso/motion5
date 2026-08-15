export { createBrowserClock } from "./browser-clock";
export type { FrameSource } from "./browser-clock";

export { createDomPatchAdapter } from "./dom";
export type {
  DomPatchAdapter,
  DomPatchWriter,
  DomTarget,
  DomTargetResolver,
  StageLike,
} from "./dom";

export { createGsapInterpolator, createGsapOneTweenInterpolator } from "./interpolator/gsap";
export * from "./graph-builder/default";
export type { GsapLike, GsapTimelineLike, GsapTweenLike } from "./interpolator/gsap";
