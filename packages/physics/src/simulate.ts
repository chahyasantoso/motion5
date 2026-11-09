import { NO_EVENTS, elapsedOf, type Events, type MotionEvent, type Time } from "@motion5/moves";
import type { BodySpec, BodyState, PhysicsWorld } from "./world";

/** What a spawn may do to the world: add bodies, nothing else. */
export interface Spawner {
  addBody(body: BodySpec): void;
}

export interface SimulateOptions {
  /** Seconds per step; default 1/120. The same step always gives the same result. */
  readonly dt?: number;
  /** A snapshot is kept this often, in ms of the simulation, so a seek back replays at most this much; default 250. */
  readonly checkpointMs?: number;
  /** For a clock with no ms, such as scroll, progress 1 is this many ms; default 0. */
  readonly durationMs?: number;
  /** Past this many snapshots, every other one goes and the gap doubles, so memory stays bounded; default 32. */
  readonly maxCheckpoints?: number;
  /** Adds bodies when an event happens, such as confetti on a click; ids must be new, and the same for the same event. */
  readonly spawn?: (event: MotionEvent, world: Spawner) => void;
}

/** Where a body is for an element laid out centred on the stage's top left corner, and whether it exists yet. */
export interface Placed {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly opacity: number;
}

/** A world played from time 0, seekable to any time, the same at the same time and events whatever came before. */
export interface Simulation {
  /** Every body there at `time`, its centre and speed; pass the scene's events when a spawn reads them. */
  at(time: Time, events?: Events): Readonly<Record<string, BodyState>>;
  /** The ids of the bodies there at `time`, in the order they were added. */
  bodies(time: Time, events?: Events): readonly string[];
  /** How far a body has moved from where it started, and its turn: the pose for an element laid out at its start. */
  pose(
    id: string,
    time: Time,
    events?: Events,
  ): { readonly x: number; readonly y: number; readonly rotation: number };
  /** Where a body is on the stage, with opacity 0 until it exists: the pose for an element centred on the corner. */
  place(id: string, time: Time, events?: Events): Placed;
  /** A `contact` event per body for every contact that started up to `time`, oldest first. */
  events(time: Time, events?: Events): Events;
}

const NOWHERE: Placed = Object.freeze({ x: 0, y: 0, rotation: 0, opacity: 0 });

function sameEvent(a: MotionEvent | undefined, b: MotionEvent | undefined): boolean {
  return (
    a !== undefined &&
    b !== undefined &&
    a.name === b.name &&
    a.at === b.at &&
    a.target === b.target &&
    a.x === b.x &&
    a.y === b.y
  );
}

/** Builds a world once with `build`, then steps it at a fixed `dt`, spawning on events, as far as each question asks. */
export function simulate(
  world: PhysicsWorld,
  build: (world: PhysicsWorld) => void,
  options: SimulateOptions = {},
): Simulation {
  const dt = options.dt ?? 1 / 120;
  const stepMs = dt * 1000;
  let every = Math.max(1, Math.round((options.checkpointMs ?? 250) / stepMs));
  const most = Math.max(2, options.maxCheckpoints ?? 32);
  if (!(dt > 0)) throw new RangeError("simulate: dt must be above 0.");
  /** Every body by id, with the step it was added at: 0 for the built world. */
  const starts = new Map<string, { readonly spec: BodySpec; readonly step: number }>();
  let adding = 0;
  const addBody = (body: BodySpec): void => {
    if (starts.has(body.id)) throw new RangeError(`simulate: body "${body.id}" is added twice.`);
    starts.set(body.id, { spec: body, step: adding });
    world.addBody(body);
  };
  build({
    addBody,
    addCollider: (id, collider, surface) => world.addCollider(id, collider, surface),
    setGravity: (x, y) => world.setGravity(x, y),
    step: (seconds) => world.step(seconds),
    body: (id) => world.body(id),
    drainContacts: () => world.drainContacts(),
    snapshot: () => world.snapshot(),
    restore: (snapshot) => world.restore(snapshot),
  });
  world.drainContacts();
  const checkpoints = new Map<number, Uint8Array>([[0, world.snapshot()]]);
  const recorded: MotionEvent[] = [];
  let known: Events = NO_EVENTS;
  let head = 0;
  let reached = 0;
  let stale = false;
  let states: Readonly<Record<string, BodyState>> | undefined;

  const stepOf = (time: Time): number => {
    const ms = elapsedOf(time.clock) ?? time.progress * (options.durationMs ?? 0);
    return Math.max(0, Math.floor(ms / stepMs + 1e-9));
  };
  /** Takes the scene's events; one that changes the past rewinds to before it, so the next seek replays it. */
  const learn = (events: Events): void => {
    if (options.spawn === undefined || events === known) return;
    let same = 0;
    while (same < known.length && sameEvent(known[same], events[same])) same += 1;
    const changed = [...known.slice(same), ...events.slice(same)];
    known = events;
    if (changed.length === 0) return;
    const from = Math.floor(Math.min(...changed.map(({ at }) => at)) / stepMs + 1e-9);
    if (from >= head && from >= reached) return;
    for (const at of [...checkpoints.keys()]) if (at > from) checkpoints.delete(at);
    for (let i = recorded.length - 1; i >= 0; i -= 1)
      if ((recorded[i]?.at ?? 0) > from * stepMs) recorded.splice(i, 1);
    reached = Math.min(reached, from);
    stale = true;
  };
  const spawnAt = (step: number): void => {
    const spawn = options.spawn;
    if (spawn === undefined) return;
    adding = step;
    for (const event of known)
      if (Math.floor(event.at / stepMs + 1e-9) === step) spawn(event, { addBody });
  };
  const seek = (target: number): void => {
    if (target < head || stale) {
      let from = 0;
      for (const at of checkpoints.keys()) if (at <= target && at > from) from = at;
      const snapshot = checkpoints.get(from);
      if (snapshot === undefined) throw new Error("simulate: lost the snapshot at time 0.");
      world.restore(snapshot);
      for (const [id, { step }] of [...starts])
        if (!built.has(id) && step >= from) starts.delete(id);
      head = from;
      stale = false;
      states = undefined;
    }
    while (head < target) {
      spawnAt(head);
      world.step(dt);
      head += 1;
      states = undefined;
      const contacts = world.drainContacts();
      if (head > reached) {
        const at = head * stepMs;
        for (const { a, b } of contacts)
          for (const target of [a, b])
            if (starts.has(target)) recorded.push({ name: "contact", at, target });
        reached = head;
      }
      if (head % every === 0 && !checkpoints.has(head)) {
        checkpoints.set(head, world.snapshot());
        if (checkpoints.size > most) {
          every *= 2;
          for (const at of [...checkpoints.keys()]) if (at % every !== 0) checkpoints.delete(at);
        }
      }
    }
  };
  const built = new Set(starts.keys());
  const at = (time: Time, events: Events = known): Readonly<Record<string, BodyState>> => {
    learn(events);
    seek(stepOf(time));
    states ??= Object.fromEntries([...starts.keys()].map((id) => [id, world.body(id)]));
    return states;
  };
  return {
    at,
    bodies: (time, events) => Object.keys(at(time, events)),
    pose(id, time, events) {
      const start = starts.get(id);
      const now = at(time, events)[id];
      if (start === undefined || now === undefined)
        throw new RangeError(`simulate: no body "${id}" at that time.`);
      return { x: now.x - start.spec.x, y: now.y - start.spec.y, rotation: now.rotation };
    },
    place(id, time, events) {
      const now = at(time, events)[id];
      return now === undefined
        ? NOWHERE
        : { x: now.x, y: now.y, rotation: now.rotation, opacity: 1 };
    },
    events(time, events) {
      learn(events ?? known);
      seek(stepOf(time));
      const ms = head * stepMs;
      return recorded.filter((event) => event.at <= ms);
    },
  };
}
