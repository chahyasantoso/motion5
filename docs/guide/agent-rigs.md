# Rigs

Read this when bones reach: an arm, a leg, a figure. Names are in [the reference](./agent-reference.md#gerakrig).

```ts
import { buildChain, chainPoses, ik } from "@gerak/rig";

const base = { x: 250, y: 300, rotation: 0 };
const arm = buildChain([
  { id: "upper", length: 170 },
  { id: "lower", parentId: "upper", length: 150 },
]);

export const scene = (time: Time) => {
  const { rotations } = ik(arm, { lower: handGoal(time) }, { base, flip: true });
  const { bones, tips } = chainPoses(arm, { rotations, base });
  return { upper: bones.upper, lower: bones.lower, hand: tips.lower };
};
```

- Angles are degrees, clockwise on screen. A bone at 0 points right, so a base at `rotation: -90` points up.
- `buildChain` keeps its ids, so `rotations.upper` and `tips.lower` are always there.
- Goals are in stage px, like `base`. Move a goal with `mixPoint` and an ease, and solve every frame.
- The elbow bends clockwise of the line from base to goal, below it when reaching right; `flip: true` bends it the
  other way. `minRotation` and `maxRotation` limit a bone against its parent.
- A goal out of reach points the chain straight at it, and `ik`'s `quality.kind` is `"too-far"`.
- Lay every rig element out at the base: a bone pointing right from it, left end vertically centred, width its length;
  a joint or hand centred on it. `chainPoses` gives bone poses turning on their left end and tip offsets.
- To carry something in a hand, add the hand's move since the catch to its pose, as `catch-scene.ts` does.
