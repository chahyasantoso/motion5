import RAPIER from "@dimforge/rapier3d-deterministic-compat";
import { packSnapshot, unpackSnapshot } from "./snapshot";
import { unreachable } from "./unreachable";
import type {
  BodySpec3d,
  BodyState3d,
  Collider3d,
  Contact3d,
  PhysicsWorld3d,
  Quaternion3d,
  Shape3d,
  Surface,
} from "@gerak/physics";

const THICK = 10;
const LONG = 10_000;
const RADIANS = Math.PI / 180;
const IDENTITY_QUATERNION: Quaternion3d = Object.freeze({ w: 1, x: 0, y: 0, z: 0 });

function assertPositive(value: number, label: string): number {
  if (!(Number.isFinite(value) && value > 0)) {
    throw new RangeError(`rapierWorld3d: ${label} must be finite and above 0.`);
  }
  return value;
}

function assertFinite(value: number, label: string): number {
  if (!Number.isFinite(value)) {
    throw new RangeError(`rapierWorld3d: ${label} must be finite.`);
  }
  return value;
}

function colliderForShape(shape: Shape3d): RAPIER.ColliderDesc {
  switch (shape.kind) {
    case "sphere":
      return RAPIER.ColliderDesc.ball(assertPositive(shape.radius, "shape.radius"));
    case "box":
      return RAPIER.ColliderDesc.cuboid(
        assertPositive(shape.width, "shape.width") / 2,
        assertPositive(shape.height, "shape.height") / 2,
        assertPositive(shape.depth, "shape.depth") / 2,
      );
    default:
      return unreachable(shape);
  }
}

function wallSideOffset(side: "min" | "max"): number {
  switch (side) {
    case "min":
      return -THICK;
    case "max":
      return THICK;
    default:
      return unreachable(side);
  }
}

function colliderForStatic(collider: Collider3d): RAPIER.ColliderDesc {
  switch (collider.kind) {
    case "floor":
      return RAPIER.ColliderDesc.cuboid(LONG, THICK, LONG).setTranslation(
        0,
        assertFinite(collider.y, "collider.y") - THICK,
        0,
      );
    case "wall": {
      const offset = assertFinite(collider.at, "collider.at") + wallSideOffset(collider.side);
      switch (collider.axis) {
        case "x":
          return RAPIER.ColliderDesc.cuboid(THICK, LONG, LONG).setTranslation(offset, 0, 0);
        case "z":
          return RAPIER.ColliderDesc.cuboid(LONG, LONG, THICK).setTranslation(0, 0, offset);
        default:
          return unreachable(collider.axis);
      }
    }
    case "box":
      return RAPIER.ColliderDesc.cuboid(
        assertPositive(collider.width, "collider.width") / 2,
        assertPositive(collider.height, "collider.height") / 2,
        assertPositive(collider.depth, "collider.depth") / 2,
      ).setTranslation(
        assertFinite(collider.x, "collider.x"),
        assertFinite(collider.y, "collider.y"),
        assertFinite(collider.z, "collider.z"),
      );
    default:
      return unreachable(collider);
  }
}

/** A 3D Rapier world behind `PhysicsWorld3d`, exposing Rapier's native world and rigid bodies. */
export interface RapierWorld3d extends PhysicsWorld3d {
  /** Rapier's 3D world now; a restore replaces it, so read it again after one. */
  readonly native: RAPIER.World;
  /** The Rapier 3D rigid body for `id`, for joints, impulses, or direct inspection. */
  rigidBody(id: string): RAPIER.RigidBody;
}

let ready3d: Promise<void> | undefined;

/** Loads Rapier 3D's WASM once; the factory it gives makes 3D worlds synchronously after that. */
export async function rapierEngine3d(): Promise<() => RapierWorld3d> {
  ready3d ??= RAPIER.init();
  await ready3d;
  return rapierWorld3d;
}

function rapierWorld3d(): RapierWorld3d {
  let world = new RAPIER.World({ x: 0, y: 0, z: 0 });
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
    if (handle === undefined) throw new RangeError(`rapierWorld3d: no body "${id}".`);
    return handle;
  };

  return {
    get native() {
      return world;
    },
    rigidBody: (id) => world.getRigidBody(handleOf(id)),
    addBody(spec: BodySpec3d) {
      if (bodies.has(spec.id)) {
        throw new RangeError(`rapierWorld3d: body "${spec.id}" is added twice.`);
      }
      const rot = spec.rotation ?? IDENTITY_QUATERNION;
      const desc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(
          assertFinite(spec.x, "x"),
          assertFinite(spec.y, "y"),
          assertFinite(spec.z, "z"),
        )
        .setRotation({
          w: assertFinite(rot.w, "rotation.w"),
          x: assertFinite(rot.x, "rotation.x"),
          y: assertFinite(rot.y, "rotation.y"),
          z: assertFinite(rot.z, "rotation.z"),
        })
        .setLinvel(
          assertFinite(spec.vx ?? 0, "vx"),
          assertFinite(spec.vy ?? 0, "vy"),
          assertFinite(spec.vz ?? 0, "vz"),
        )
        .setAngvel({
          x: assertFinite(spec.wx ?? 0, "wx") * RADIANS,
          y: assertFinite(spec.wy ?? 0, "wy") * RADIANS,
          z: assertFinite(spec.wz ?? 0, "wz") * RADIANS,
        })
        .setLinearDamping(assertFinite(spec.drag ?? 0, "drag"))
        .setAngularDamping(assertFinite(spec.drag ?? 0, "drag"));
      if (spec.fixedRotation === true) desc.lockRotations();
      const body = world.createRigidBody(desc);
      bodies.set(spec.id, body.handle);
      const shape = colliderForShape(spec.shape);
      if (spec.mass !== undefined) shape.setMass(assertPositive(spec.mass, "mass"));
      place(shape, spec, spec.id, body);
    },
    addCollider(id: string, collider: Collider3d, surface: Surface = {}) {
      place(colliderForStatic(collider), surface, id);
    },
    setGravity(x, y, z) {
      world.gravity = {
        x: assertFinite(x, "gravity.x"),
        y: assertFinite(y, "gravity.y"),
        z: assertFinite(z, "gravity.z"),
      };
    },
    step(seconds) {
      world.timestep = assertPositive(seconds, "seconds");
      world.step(queue);
    },
    body(id): BodyState3d {
      const body = world.getRigidBody(handleOf(id));
      const at = body.translation();
      const rot = body.rotation();
      const speed = body.linvel();
      const spin = body.angvel();
      return {
        x: at.x,
        y: at.y,
        z: at.z,
        rotation: { w: rot.w, x: rot.x, y: rot.y, z: rot.z },
        vx: speed.x,
        vy: speed.y,
        vz: speed.z,
        wx: spin.x / RADIANS,
        wy: spin.y / RADIANS,
        wz: spin.z / RADIANS,
      };
    },
    drainContacts() {
      const started: Contact3d[] = [];
      queue.drainCollisionEvents((one, two, began) => {
        const a = owners.get(one);
        const b = owners.get(two);
        if (!began || a === undefined || b === undefined) return;
        const first = world.getCollider(one);
        const second = world.getCollider(two);
        let x = 0;
        let y = 0;
        let z = 0;
        let found = 0;
        world.contactPair(first, second, (manifold) => {
          for (let i = 0; i < manifold.numSolverContacts(); i += 1) {
            const point = manifold.solverContactPoint(i);
            if (point === null) continue;
            x += point.x;
            y += point.y;
            z += point.z;
            found += 1;
          }
        });
        if (found === 0) {
          const at = first.translation();
          x = at.x;
          y = at.y;
          z = at.z;
          found = 1;
        }
        started.push({ a, b, x: x / found, y: y / found, z: z / found });
      });
      return started;
    },
    snapshot() {
      return packSnapshot("3d", bodies, owners, world.takeSnapshot());
    },
    restore(snapshot) {
      const saved = unpackSnapshot("3d", snapshot, "rapierWorld3d");
      const restored = RAPIER.World.restoreSnapshot(saved.native);
      if (restored === null) throw new TypeError("rapierWorld3d: the snapshot did not restore.");
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
