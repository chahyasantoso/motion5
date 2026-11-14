import RAPIER from "@dimforge/rapier2d-deterministic-compat";
import { packSnapshot, unpackSnapshot } from "./snapshot";
import { unreachable } from "./unreachable";
import type { BodySpec, BodyState, Collider, Contact, PhysicsWorld, Surface } from "@gerak/physics";

/** Stage px per Rapier metre: Rapier's tolerances are tuned for bodies about a metre across. */
const SCALE = 100;
/** Half the thickness of a floor or wall, and half its length, in metres. */
const THICK = 10;
const LONG = 10_000;
const RADIANS = Math.PI / 180;

/** A Rapier world behind the port, with Rapier's own world for what the port leaves out. */
export interface RapierWorld extends PhysicsWorld {
  /** Rapier's world now; a restore replaces it, so read it again after one. */
  readonly native: RAPIER.World;
  /** The Rapier body a port body became, for joints, torques or anything else Rapier does. */
  rigidBody(id: string): RAPIER.RigidBody;
}

let ready: Promise<void> | undefined;

/** Loads Rapier's WASM once; the factory it gives makes worlds synchronously after that. */
export async function rapierEngine(): Promise<() => RapierWorld> {
  ready ??= RAPIER.init();
  await ready;
  return rapierWorld;
}

function rapierWorld(): RapierWorld {
  let world = new RAPIER.World({ x: 0, y: 0 });
  const queue = new RAPIER.EventQueue(true);
  const bodies = new Map<string, number>();
  const owners = new Map<number, string>();

  const place = (
    collider: RAPIER.ColliderDesc,
    surface: Surface,
    id: string,
    body?: RAPIER.RigidBody,
  ) => {
    collider
      .setRestitution(surface.restitution ?? 0)
      .setFriction(surface.friction ?? 0.5)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    owners.set(world.createCollider(collider, body).handle, id);
  };
  const handleOf = (id: string): number => {
    const handle = bodies.get(id);
    if (handle === undefined) throw new RangeError(`rapierWorld: no body "${id}".`);
    return handle;
  };

  return {
    get native() {
      return world;
    },
    rigidBody: (id) => world.getRigidBody(handleOf(id)),
    addBody(spec: BodySpec) {
      if (bodies.has(spec.id))
        throw new RangeError(`rapierWorld: body "${spec.id}" is added twice.`);
      const desc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(spec.x / SCALE, spec.y / SCALE)
        .setRotation((spec.angle ?? 0) * RADIANS)
        .setLinvel((spec.vx ?? 0) / SCALE, (spec.vy ?? 0) / SCALE)
        .setAngvel((spec.spin ?? 0) * RADIANS)
        .setLinearDamping(spec.drag ?? 0)
        .setAngularDamping(spec.drag ?? 0);
      if (spec.fixedRotation === true) desc.lockRotations();
      const body = world.createRigidBody(desc);
      bodies.set(spec.id, body.handle);
      const shape =
        spec.shape.kind === "circle"
          ? RAPIER.ColliderDesc.ball(spec.shape.radius / SCALE)
          : RAPIER.ColliderDesc.cuboid(spec.shape.width / 2 / SCALE, spec.shape.height / 2 / SCALE);
      if (spec.mass !== undefined) shape.setMass(spec.mass / SCALE ** 2);
      place(shape, spec, spec.id, body);
    },
    addCollider(id: string, collider: Collider, surface: Surface = {}) {
      switch (collider.kind) {
        case "floor":
          place(
            RAPIER.ColliderDesc.cuboid(LONG, THICK).setTranslation(0, collider.y / SCALE + THICK),
            surface,
            id,
          );
          return;
        case "wall": {
          const x = collider.x / SCALE + (collider.side === "left" ? -THICK : THICK);
          place(RAPIER.ColliderDesc.cuboid(THICK, LONG).setTranslation(x, 0), surface, id);
          return;
        }
        case "segment":
          place(
            RAPIER.ColliderDesc.segment(
              { x: collider.from.x / SCALE, y: collider.from.y / SCALE },
              { x: collider.to.x / SCALE, y: collider.to.y / SCALE },
            ),
            surface,
            id,
          );
          return;
        default:
          return unreachable(collider);
      }
    },
    setGravity(x, y) {
      world.gravity = { x: x / SCALE, y: y / SCALE };
    },
    step(seconds) {
      world.timestep = seconds;
      world.step(queue);
    },
    body(id): BodyState {
      const body = world.getRigidBody(handleOf(id));
      const at = body.translation();
      const speed = body.linvel();
      return {
        x: at.x * SCALE,
        y: at.y * SCALE,
        rotation: body.rotation() / RADIANS,
        vx: speed.x * SCALE,
        vy: speed.y * SCALE,
        spin: body.angvel() / RADIANS,
      };
    },
    drainContacts() {
      const started: Contact[] = [];
      queue.drainCollisionEvents((one, two, began) => {
        const a = owners.get(one);
        const b = owners.get(two);
        if (!began || a === undefined || b === undefined) return;
        const first = world.getCollider(one);
        const second = world.getCollider(two);
        let x = 0;
        let y = 0;
        let found = 0;
        world.contactPair(first, second, (manifold) => {
          for (let i = 0; i < manifold.numSolverContacts(); i += 1) {
            const point = manifold.solverContactPoint(i);
            if (point === null) continue;
            x += point.x;
            y += point.y;
            found += 1;
          }
        });
        if (found === 0) {
          const at = first.translation();
          x = at.x;
          y = at.y;
          found = 1;
        }
        started.push({ a, b, x: (x / found) * SCALE, y: (y / found) * SCALE });
      });
      return started;
    },
    snapshot() {
      return packSnapshot("2d", bodies, owners, world.takeSnapshot());
    },
    restore(snapshot) {
      const saved = unpackSnapshot("2d", snapshot, "rapierWorld");
      const restored = RAPIER.World.restoreSnapshot(saved.native);
      if (restored === null) throw new TypeError("rapierWorld: the snapshot did not restore.");
      world.free();
      world = restored;
      bodies.clear();
      for (const [id, handle] of saved.bodies) bodies.set(id, handle);
      owners.clear();
      for (const [handle, id] of saved.owners) owners.set(handle, id);
      queue.drainCollisionEvents(() => undefined);
    },
  };
}
