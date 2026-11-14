# Physics

Read this when motion should follow forces: many bodies, collisions, a pile. For a designed bounce or squash, a move is
simpler. Names are in [the reference](./agent-reference.md#gerakphysics).

```ts
import { builtinWorld, simulate } from "@gerak/physics";

const sim = simulate(builtinWorld(), (world) => {
  world.setGravity(0, 2600);
  world.addCollider("floor", { kind: "floor", y: 600 }, { restitution: 0.35 });
  world.addBody({ id: "ball", shape: { kind: "circle", radius: 20 }, x: 640, y: -40, restitution: 0.5 });
});

export const scene = (time: Time, events: Events) => ({ ball: sim.pose("ball", time, events) });
```

- Units: stage px, degrees and seconds, y down, turns clockwise; a body's `x` and `y` are its centre. Bodies turn
  when hit off centre; `fixedRotation: true` stops that.
- `simulate` steps at a fixed 1/120 s with snapshots, so any time gives the same world however play got there. Pass
  the scene's events to every question.
- `sim.pose(id, time)` is the move from the body's start: lay its element out where the body starts, centred and
  upright, with its anchor at the centre; put a squash on a child element.
- Bodies from events: `simulate(world, build, { spawn })` calls `spawn(event, world)` as play reaches each event, and
  `spawn` adds bodies with ids that are new and the same for the same event, such as `` `bit${event.at}-${i}` ``.
  Every event's bodies share one world. Render a fixed pool of elements centred on the stage's top left corner, and
  move each with `sim.place(id, time, events)`, which is at opacity 0 until its body exists; `sim.bodies` lists ids.
- Contacts are events: `sim.events(time, events)` holds a `contact` per body. Merge them with
  `mergeEvents(events, sim.events(time, events))` and answer with `react`, since rigid bodies never squash. A
  `contact` names the body (`target`), its time (`at`), where it touched (`point`, `{ x, y }` in px, with `z` in 3D
  in world units) and what it hit (`other`, a body or collider id). Place a mark at a landing from the event itself;
  never seek the simulation back to learn where a body was. Its first contact may be with anything, so pick the one
  whose `other` you mean.
- A body that stays within 1 px for half a second sleeps, so a heap comes to rest. Mark bodies that rest on each other
  `data-motion-touch` with their own selector so `motion:check` reads the heap as meant.
- Scatter with `seeded(seed)`, never `Math.random()`.
- Engines: `builtinWorld()` has no dependency and suits a few hundred bodies. For more, or for joints, `const rapier =
  await rapierEngine()` from `@gerak/rapier` at the top of the module, then pass `rapier()` instead.
