# @gerak/core: path

Motion along a curve or through the air: a point and tangent along a path, its length, and a ballistic arc. Reach for it to send something along a line or to throw it.

- **`ballistic`** `(progress: number, options: BallisticOptions): { x: number; y: number; }`: Where a thrown thing is at progress 0 to 1: from (dx, dy) to (0, 0) under constant gravity, peaking `apex` px above the higher end.
- **`BallisticOptions`** `type BallisticOptions = { dx: number; dy: number; apex: number }`: The throw's shape: start offset `dx` and `dy`, and how many px above the higher end it peaks.
- **`along`** `(cubics: readonly Cubic2d[], share: number, options?: { readonly turn?: boolean; }): Pose2d`: The `{ x, y }` point `share` of the way along a path by distance, in the path's coordinates; `turn: true` adds `rotation`, the heading in degrees (down is 90).
- **`along3d`** `(cubics: readonly Cubic3d[], share: number, options?: { readonly face?: boolean; }): Pose3d`: The pose `share` of the way along a 3D path by distance; `face` adds the turn of local +x onto the tangent, no roll.
- **`pathLength`** `(cubics: readonly Cubic2d[]): number`: The length of a path of cubics, sampled; 0 for an empty path.
