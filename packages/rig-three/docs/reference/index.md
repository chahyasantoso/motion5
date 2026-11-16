# @gerak/rig-three: index

- **`applyBones`** `(skeleton: CapturedSkeleton, poses: Readonly<Record<string, Pose3d>>): void`: Applies per-bone `Pose3d` deltas (from `bonesOf3d` or hand-keyed) relative to rest, resetting omitted bones.
- **`attach`** `(skeleton: CapturedSkeleton, bone: string, object: Object3D<Object3DEventMap>, options: { readonly at: Vector3; readonly turn?: Quaternion;…`: Parents `object` to a bone at model-space `at`, turned by model-space `turn`, from captured rest only.
- **`captureSkeleton`** `(source: Object3D<Object3DEventMap> | Skeleton): CapturedSkeleton`: Captures rest poses and world joints of a Three.js `Object3D` or `Skeleton`; throws on scaled or unnamed bones.
- **`CapturedBone`** `type CapturedBone`: A captured Three.js bone with its rest local and world transforms and its world rest joint.
- **`CapturedSkeleton`** `type CapturedSkeleton`: A Three.js skeleton captured at rest: bones parent-before-child, lookup by name, and world rest joints.
