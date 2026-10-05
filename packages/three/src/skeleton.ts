/** Pure skeleton adapter. Loading files belongs to the application, never this package. */
export {
  captureSkeleton,
  type CapturedBone,
  type SkeletonBinding,
  type SkeletonBindingOptions,
} from "./skeleton-capture";
export { skeletonTracks, type SkeletonTracksOptions } from "./skeleton-tracks";
export {
  createSkeletonDriver,
  describeBoneOutcome,
  rigFrameSource,
  type BoneDrive,
  type BoneOutcome,
  type FrameSource,
  type SkeletonDriver,
  type SkeletonDriverOptions,
} from "./skeleton-driver";
