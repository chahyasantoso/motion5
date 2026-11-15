# Rigging artwork

Read this to animate a drawing: an SVG someone supplied, or one you draw first. The loop is in [the agent
guide](./agent-motion.md).

To animate a drawing someone else made, start from its SVG, not from shapes you draw. With no SVG, draw one first:
write `apps/pieces/references/<file>.svg` by hand, each part that moves its own shape with a clear `id` (`beak`,
`eyelidLeft`), then import it like any other, so a drawn character and a supplied one take one path.

1. `npm run motion:import-svg -- apps/pieces/references/<file>.svg --name <name> --margin 40` writes
   `apps/pieces/<name>/src/<name>.ts`: every shape a flat path member in the SVG's paint order, its colours and gradients in
   the skin. The frame is the `viewBox` with `--margin` px of room on every side; a drawing that touches its edges
   needs that room, or a part that turns outward is cut off by the frame. It prints what it could not carry; nothing
   else is left out.
2. **Name the parts by what moves.** Rename `path3806` to `flipperLeft` with one whole-word find-and-replace: the name
   is the cast key and the skin's `[data-cast]` and `[data-path]` selectors. A rename that misses the skin is a
   review finding.
3. **Set a pivot at each joint,** in frame px: `actor({ path, pivot: { x: 214, y: 188 } })`. The part turns and
   scales about it. Drop `still: true` from every part you move; the import marks them all still.
4. **Keep parts flat.** What carries what is a chain, not a group: a group paints as one layer, so grouping changes
   what is in front. Group only a rigid piece whose parts sit next to each other in paint order, such as an eye's
   white and pupil. `layer` in a value changes paint order while a part moves, such as a leg crossing behind; it does not add, so of two moves giving it the later one wins.
5. **Check the rig still looks like the drawing:** `npm run motion:compare -- "stage.html?piece=<name>" --reference
   apps/pieces/references/<file>.svg --margin 40`, with the margin the import was given, at rest. Its mean stays under
   2 out of 255 and no part over 15; read `difference.png` for the worst part.
6. **Animate the chain's joints and the free parts.**

```ts
import type { Time } from "@gerak/moves";
import { chainFromRest, chainThrough } from "@gerak/rig";

const arm = chainThrough([
  { id: "shoulder", x: 214, y: 188 },
  { id: "elbow", x: 262, y: 230 },
  { id: "tip", x: 290, y: 286 },
]);
const shoulderAtRest = arm.rest.rotations?.["shoulder"] ?? 0;

export const scene = (time: Time) => {
  const lift = -40 * Math.sin(Math.PI * Math.min(1, time.progress * 2));
  const now = { ...arm.rest, rotations: { ...arm.rest.rotations, shoulder: shoulderAtRest + lift } };
  const pose = chainFromRest(arm.chain, arm.rest, now);
  return { flipperUpper: pose.shoulder, flipperLower: pose.elbow };
};
```

`chainThrough` builds a chain through the joints as drawn, each bone named by the joint it starts at; `chainFromRest`
answers the pose that carries each part from where it was drawn, so a part whose `pivot` is its bone's start joint
follows it. A chain's pose is `{ rotations, base }`: `rotations` by bone id in degrees, `base` the root joint's
`{ x, y, rotation }`. Move the `base` to carry the whole arm with the body.

## Into a bigger scene

A drawing that is one thing in a scene goes into the scene's piece, not a piece of its own:

```sh
npm run motion:import-svg -- apps/pieces/references/<file>.svg --into <piece> --at 420,180 --scale 0.8 --prefix bird
```

It adds the drawing's parts to `apps/pieces/<brief>/src/<piece>.ts`, its `viewBox` top left at `--at` in the piece's frame px
and scaled by `--scale`, strokes too. Every part is named with the prefix (`birdBody`), and every gradient id too, so
two drawings, or one drawing twice, never collide; the new parts paint above what the piece has. Leave room round the
drawing inside the frame for what turns outward: the result lists in `outside` each new part that already crosses the
frame's edge. Pivots and joints are then set in the piece's frame px, where the parts now are. Compare each drawing
at rest against its own SVG on a page of its own (`--name`, `--margin`) before placing it.
