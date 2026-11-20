# @gerak/physics: calls

Examples of the calls a scene makes; every export with its signature is in [the reference](./reference/README.md).

The pure engine and `simulate`, which makes a seekable simulation from a world and a build function.

```ts
world.addBody({ id: "ball", shape: { kind: "circle", radius: 20 }, x: 640, y: 0, restitution: 0.5 });
const sim = simulate(builtinWorld(), (world) => {
  world.setGravity(0, 2600);
  world.addCollider("floor", { kind: "floor", y: 600 });
}, {
  spawn: (event, world) => {
    if (event.name === "click")
      world.addBody({ id: `bit${event.at}`, shape: { kind: "box", width: 14, height: 8 }, x: event.x ?? 0, y: event.y ?? 0 });
  },
});
sim.place(`bit${click.at}`, time, events);
```
