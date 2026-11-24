# Rigging artwork

Read this to animate a drawing: an SVG someone supplied, or one you draw first. The loop is in [the agent
guide](../../stage/docs/stage.md).

To animate a drawing someone else made, start from its SVG, not from shapes you draw. With no SVG, draw one first:
write it by hand, each part that moves its own element, so a drawn character and a supplied one take one path.

1. **Put the SVG in the piece's page.** The page is the look: paste the `<svg>` into `<pieces>/<name>/<name>.html`
   inside the element the page mounts on, and size that element to the scene's `frame`.
2. **Tag the parts by what moves.** Each part that moves gets `data-cast="<name>"` (`flipperLeft`, not `path3806`),
   and the scene names it with an element of the same name: `box("flipperLeft")`. A part with no motion stays untagged
   and static.
3. **Set where each part turns** in CSS: `transform-box: fill-box` and `transform-origin` at its joint, or
   `transform-box: view-box` with `transform-origin` in the `viewBox`'s units.
4. **Keep parts flat.** What carries what is a chain, not nesting: a parent `<g>` paints its children as one layer, so
   nesting changes what is in front. Nest only a rigid piece whose parts sit next to each other in paint order, such
   as an eye's white and pupil. `layer` in a value changes paint order while a part moves, such as a leg crossing
   behind; it does not add, so of two moves giving it the later one wins.
5. **Check the rig still looks like the drawing:** `npx gerak compare "<name>/<name>.html" --reference <file>.svg` at
   rest. Its mean stays under 2 out of 255 and no part over 15; read `difference.png` for the worst part.
6. **Animate the chain's joints and the free parts.**

```ts
import type { Time } from "@gerak/core";
import { chainFromRest, chainThrough } from "@gerak/rig";

const arm = chainThrough([
  { id: "shoulder", x: 214, y: 188 },
  { id: "elbow", x: 262, y: 230 },
  { id: "tip", x: 290, y: 286 },
]);
const shoulderAtRest = arm.rest.rotations?.["shoulder"] ?? 0;

export const scene = ({ time }: { readonly time: Time }) => {
  const lift = -40 * Math.sin(Math.PI * Math.min(1, time.progress * 2));
  const now = { ...arm.rest, rotations: { ...arm.rest.rotations, shoulder: shoulderAtRest + lift } };
  const pose = chainFromRest(arm.chain, arm.rest, now);
  return { flipperUpper: pose.shoulder, flipperLower: pose.elbow };
};
```

`chainThrough` builds a chain through the joints as drawn, each bone named by the joint it starts at; `chainFromRest`
answers the pose that carries each part from where it was drawn, so a part whose `transform-origin` is its bone's start
joint follows it. A chain's pose is `{ rotations, base }`: `rotations` by bone id in degrees, `base` the root joint's
`{ x, y, rotation }`. Move the `base` to carry the whole arm with the body.

## Into a bigger scene

A drawing that is one thing in a scene goes into that scene's page, inside its own `<svg>` or `<g>` placed where it
belongs; its parts are tagged and named like any others, and every name in a page is one element.
