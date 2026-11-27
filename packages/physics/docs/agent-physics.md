# Physics

Read this when motion should follow forces: many bodies, collisions, a pile. For a designed bounce or squash, a move is
simpler. Names are in [the reference](./reference/README.md).

```ts
import { builtinWorld, simulate } from "@gerak/physics";

const sim = simulate(builtinWorld(), (world) => {
  world.setGravity(0, 2600);
  world.addCollider("floor", { kind: "floor", y: 600 }, { restitution: 0.35 });
  world.addBody({ id: "ball", shape: { kind: "circle", radius: 20 }, x: 640, y: -40, restitution: 0.5 });
});

export const scene = (time: Time, input: Input) => ({ ball: sim.pose("ball", time, input) });
```

- Units: stage px, degrees and seconds, y down, turns clockwise; a body's `x` and `y` are its centre. Bodies turn
  when hit off centre; `fixedRotation: true` stops that.
- `simulate` steps at a fixed 1/120 s with checkpoints, so any time gives the same world however play got there. Pass
  the scene's input to every question.
- `sim.pose(id, time)` is the move from the body's start: lay its element out where the body starts, centred and
  upright, with its anchor at the centre; put a squash on a child element.
- Bodies from input: `simulate(world, build, { spawn })` calls `spawn(entry, world)` as play reaches each entry, and
  `spawn` adds bodies with ids that are new and the same for the same entry, such as `` `bit${entry.at}-${i}` ``.
  Every entry's bodies share one world. Render a fixed pool of elements centred on the stage's top left corner, and
  move each with `sim.place(id, time, input)`, which is at opacity 0 until its body exists; `sim.bodies` lists ids.
- Contacts are triggers: `sim.events(time, input)` holds a `contact` per body. Merge them with
  `mergeInput(input, sim.events(time, input))` and answer with `react`, since rigid bodies never squash. A
  `contact` names the body (`target`), its time (`at`), where it touched (`point`, `{ x, y }` in px, with `z` in 3D
  in world units) and what it hit (`other`, a body or collider id). Place a mark at a landing from the entry itself;
  never seek the simulation back to learn where a body was. Its first contact may be with anything, so pick the one
  whose `other` you mean.
- `sim.pose(id, time)` throws for a body not spawned yet at `time`: check `sim.bodies(time, input)` first, or in 2D
  use `sim.place`, which answers opacity 0. `sim.at` answers every body in one call, cheaper than many `pose` calls.
- A seek back replays the world from its last checkpoint, and a spawn entry the seek passes rewinds further. When the
  review reports a seek over budget, a coarser `dt` (`1 / 60`) halves the steps each seek replays.
- A body that stays within 1 px for half a second sleeps, so a heap comes to rest. Mark bodies that rest on each other
  `data-motion-touch` with their own selector so `gerak check` reads the heap as meant.
- Scatter with `seeded(seed)`, never `Math.random()`.
- Engines: `builtinWorld()` has no dependency and suits a few hundred bodies. For more, or for joints, `const rapier =
  await rapierEngine()` from `@gerak/rapier` at the top of the module, then pass `rapier()` instead.
