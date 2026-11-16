# @gerak/rig: calls

Examples of the calls a scene makes; every export with its signature is in [the reference](./reference/README.md).

Joint chains: `buildChain` checks a bone tree, `ik` solves it to goals, `fk` and `chainPoses` read it back as poses.
Exports below that no scene calls (matrices, quaternions, 3D chain solving) are there for other packages.

```ts
const arm = buildChain([{ id: "upper", length: 170 }, { id: "lower", parentId: "upper", length: 150 }]);
const { rotations } = ik(arm, { lower: { x: 486, y: 412 } }, { base, flip: true });
const tips = fk(arm, { rotations, base });
const { bones, tips } = chainPoses(arm, { rotations, base });
```
