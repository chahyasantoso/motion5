# @gerak/three: calls

Examples of the calls a scene makes; every export with its signature is in [the reference](./reference/README.md).

Writes poses onto Three.js objects; its React hook comes from `@gerak/three/react`, listed after it.

```tsx
player.subscribe("ball", (pose) => applyPose2d(mesh, pose));
player.subscribe("ball", (pose) => applyPose3d(mesh, pose));
const ball = useTarget3d(playing?.player, "ball");
return <mesh ref={ball} />;
```
