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

export { createGsapInterpolator } from "./interpolator/gsap";
export type { GsapLike, GsapTimelineLike } from "./interpolator/gsap";
