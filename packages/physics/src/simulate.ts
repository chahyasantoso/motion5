import { elapsedOf, type Events, type MotionEvent, type Time } from "@motion5/moves";
import type { BodySpec, BodyState, PhysicsWorld } from "./world";

export interface SimulateOptions {
  /** Seconds per step; default 1/120. The same step always gives the same result. */
  readonly dt?: number;
  /** A snapshot is kept this often, in ms of the simulation, so a seek back replays at most this much; default 250. */
  readonly checkpointMs?: number;
  /** For a clock with no ms, such as scroll, progress 1 is this many ms; default 0. */
  readonly durationMs?: number;
  /** Past this many snapshots, every other one goes and the gap doubles, so memory stays bounded; default 32. */
  readonly maxCheckpoints?: number;
}

/** A world played from time 0, seekable to any time, the same at the same time whatever came before. */
export interface Simulation {
  /** Every body's centre and speed at `time`. */
  at(time: Time): Readonly<Record<string, BodyState>>;
  /** How far a body has moved from where it started, and its turn: the pose for an element laid out at its start. */
  pose(
    id: string,
    time: Time,
  ): { readonly x: number; readonly y: number; readonly rotation: number };
  /** A `contact` event per body for every contact that started up to `time`, oldest first. */
  events(time: Time): Events;
}

/** Builds a world once with `build`, then steps it at a fixed `dt` as far as each question asks. */
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
  const starts = new Map<string, BodySpec>();
  build({
    addBody(body) {
      if (starts.has(body.id)) throw new RangeError(`simulate: body "${body.id}" is added twice.`);
      starts.set(body.id, body);
      world.addBody(body);
    },
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
  let head = 0;
  let reached = 0;
  let states: Readonly<Record<string, BodyState>> | undefined;

  const stepOf = (time: Time): number => {
    const ms = elapsedOf(time.clock) ?? time.progress * (options.durationMs ?? 0);
    return Math.max(0, Math.floor(ms / stepMs + 1e-9));
  };
  const seek = (target: number): void => {
    if (target < head) {
      let from = 0;
      for (const at of checkpoints.keys()) if (at <= target && at > from) from = at;
      const snapshot = checkpoints.get(from);
      if (snapshot === undefined) throw new Error("simulate: lost the snapshot at time 0.");
      world.restore(snapshot);
      head = from;
      states = undefined;
    }
    while (head < target) {
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
  const at = (time: Time): Readonly<Record<string, BodyState>> => {
    seek(stepOf(time));
    states ??= Object.fromEntries([...starts.keys()].map((id) => [id, world.body(id)]));
    return states;
  };
  return {
    at,
    pose(id, time) {
      const start = starts.get(id);
      const now = at(time)[id];
      if (start === undefined || now === undefined)
        throw new RangeError(`simulate: no body "${id}".`);
      return { x: now.x - start.x, y: now.y - start.y, rotation: now.rotation };
    },
    events(time) {
      seek(stepOf(time));
      const ms = head * stepMs;
      return recorded.filter((event) => event.at <= ms);
    },
  };
}
