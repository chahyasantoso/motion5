import { NO_EVENTS, elapsedOf, type Events, type MotionEvent, type Time } from "@gerak/moves";
import type {
  BodySpec,
  BodySpec3d,
  BodyState,
  BodyState3d,
  Collider,
  Collider3d,
  Contact,
  PhysicsWorld,
  PhysicsWorld3d,
  Quaternion3d,
  Surface,
} from "./world";

/** What a spawn may do to the world: add bodies, nothing else. */
export interface Spawner {
  addBody(body: BodySpec): void;
}

/** What a 3D spawn may do to the world: add 3D bodies, nothing else. */
export interface Spawner3d {
  addBody(body: BodySpec3d): void;
}

/** Settings of `simulate`: `dt` seconds a step (default 1/120), `checkpointMs` (250), `maxCheckpoints`
 * (32), `durationMs` (0) and `spawn`. */
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

/** Settings of 3D `simulate`: `dt` seconds a step (default 1/120), `checkpointMs` (250), `maxCheckpoints`
 * (32), `durationMs` (0) and `spawn`. */
export interface SimulateOptions3d {
  /** Seconds per step; default 1/120. The same step always gives the same result. */
  readonly dt?: number;
  /** A snapshot is kept this often, in ms of the simulation, so a seek back replays at most this much; default 250. */
  readonly checkpointMs?: number;
  /** For a clock with no ms, such as scroll, progress 1 is this many ms; default 0. */
  readonly durationMs?: number;
  /** Past this many snapshots, every other one goes and the gap doubles, so memory stays bounded; default 32. */
  readonly maxCheckpoints?: number;
  /** Adds 3D bodies when an event happens; ids must be new, and the same for the same event. */
  readonly spawn?: (event: MotionEvent, world: Spawner3d) => void;
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

/** A 3D world played from time 0, seekable to any time, deterministic across seeks. */
export interface Simulation3d {
  /** Every 3D body state at `time`; pass the scene's events when a spawn reads them. */
  at(time: Time, events?: Events): Readonly<Record<string, BodyState3d>>;
  /** The ids of the 3D bodies present at `time`, in the order they were added. */
  bodies(time: Time, events?: Events): readonly string[];
  /** How far a body has moved from where it spawned, and its absolute turn: the pose for an element laid out at its start. */
  pose(
    id: string,
    time: Time,
    events?: Events,
  ): {
    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly rotation: Quaternion3d;
  };
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
    a.y === b.y &&
    a.value === b.value
  );
}

function rotation2d(rotation: number | Quaternion3d): number {
  if (typeof rotation !== "number")
    throw new TypeError("simulate: place is for 2D bodies; use pose and bodyPose3d for 3D ones.");
  return rotation;
}

type Moved =
  | { readonly x: number; readonly y: number; readonly rotation: number }
  | {
      readonly x: number;
      readonly y: number;
      readonly z: number;
      readonly rotation: Quaternion3d;
    };

function moved(
  origin: { readonly x: number; readonly y: number; readonly z?: number },
  now: { readonly x: number; readonly y: number; readonly z?: number },
  rotation: number | Quaternion3d,
): Moved {
  switch (typeof rotation) {
    case "number":
      return { x: now.x - origin.x, y: now.y - origin.y, rotation };
    case "object":
      return {
        x: now.x - origin.x,
        y: now.y - origin.y,
        z: (now.z ?? 0) - (origin.z ?? 0),
        rotation,
      };
    default:
      throw new TypeError("simulate: a body's rotation is a number or a quaternion.");
  }
}

/** Builds a world once with `build`, then steps it at a fixed `dt`, spawning on events, as far as each question asks. */
export function simulate(
  world: PhysicsWorld,
  build: (world: PhysicsWorld) => void,
  options?: SimulateOptions,
): Simulation;
/** Builds a 3D world once with `build`, then steps it at a fixed `dt`, spawning on events, as far as each question asks. */
export function simulate(
  world: PhysicsWorld3d,
  build: (world: PhysicsWorld3d) => void,
  options?: SimulateOptions3d,
): Simulation3d;
export function simulate<
  Spec extends BodySpec | BodySpec3d,
  Col extends Collider | Collider3d,
  Grav extends readonly [number, number] | readonly [number, number, number],
  State extends BodyState | BodyState3d,
>(
  world: {
    addBody(body: Spec): void;
    addCollider(id: string, collider: Col, surface?: Surface): void;
    setGravity(...gravity: Grav): void;
    step(seconds: number): void;
    body(id: string): State;
    drainContacts(): readonly Contact[];
    snapshot(): Uint8Array;
    restore(snapshot: Uint8Array): void;
  },
  build: (world: {
    addBody(body: Spec): void;
    addCollider(id: string, collider: Col, surface?: Surface): void;
    setGravity(...gravity: Grav): void;
    step(seconds: number): void;
    body(id: string): State;
    drainContacts(): readonly Contact[];
    snapshot(): Uint8Array;
    restore(snapshot: Uint8Array): void;
  }) => void,
  options: {
    readonly dt?: number;
    readonly checkpointMs?: number;
    readonly durationMs?: number;
    readonly maxCheckpoints?: number;
    readonly spawn?: (event: MotionEvent, world: { addBody(body: Spec): void }) => void;
  } = {},
): {
  at(time: Time, events?: Events): Readonly<Record<string, State>>;
  bodies(time: Time, events?: Events): readonly string[];
  pose(id: string, time: Time, events?: Events): Moved;
  place?(id: string, time: Time, events?: Events): Placed;
  events(time: Time, events?: Events): Events;
} {
  const dt = options.dt ?? 1 / 120;
  const stepMs = dt * 1000;
  let every = Math.max(1, Math.round((options.checkpointMs ?? 250) / stepMs));
  const most = Math.max(2, options.maxCheckpoints ?? 32);
  if (!(dt > 0)) throw new RangeError("simulate: dt must be above 0.");
  /** Every body by id, where the engine put it when added, and the step it was added at: 0 for the built world. */
  const starts = new Map<string, { readonly origin: State; readonly step: number }>();
  let adding = 0;
  const addBody = (body: Spec): void => {
    if (starts.has(body.id)) throw new RangeError(`simulate: body "${body.id}" is added twice.`);
    world.addBody(body);
    starts.set(body.id, { origin: world.body(body.id), step: adding });
  };
  build({
    addBody,
    addCollider: (id, collider, surface) => world.addCollider(id, collider, surface),
    setGravity: (...gravity: Grav) => world.setGravity(...gravity),
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
  let states: Readonly<Record<string, State>> | undefined;

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
  const at = (time: Time, events: Events = known): Readonly<Record<string, State>> => {
    learn(events);
    seek(stepOf(time));
    states ??= Object.fromEntries([...starts.keys()].map((id) => [id, world.body(id)]));
    return states;
  };
  return {
    at,
    bodies: (time, events) => Object.keys(at(time, events)),
    pose(id, time, events) {
      const now = at(time, events)[id];
      const start = starts.get(id);
      if (start === undefined || now === undefined)
        throw new RangeError(`simulate: no body "${id}" at that time.`);
      return moved(start.origin, now, now.rotation);
    },
    place(id, time, events) {
      const now = at(time, events)[id];
      if (now === undefined) return NOWHERE;
      const rotation = rotation2d(now.rotation);
      return { x: now.x, y: now.y, rotation, opacity: 1 };
    },
    events(time, events) {
      learn(events ?? known);
      seek(stepOf(time));
      const ms = head * stepMs;
      return recorded.filter((event) => event.at <= ms);
    },
  };
}
