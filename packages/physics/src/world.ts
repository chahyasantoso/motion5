/** A body's outline: a circle by its radius, or a box by its size, centred on the body. */
export type Shape =
  | { readonly kind: "circle"; readonly radius: number }
  | { readonly kind: "box"; readonly width: number; readonly height: number };

/** A collider that never moves: the line bodies rest on, a side that keeps them in, or a ramp. */
export type Collider =
  | { readonly kind: "floor"; readonly y: number }
  | { readonly kind: "wall"; readonly x: number; readonly side: "left" | "right" }
  | {
      readonly kind: "segment";
      readonly from: { readonly x: number; readonly y: number };
      readonly to: { readonly x: number; readonly y: number };
    };

/** How a surface answers a hit: bounce kept, from 0 to 1, and grip, from 0 up; the two sides' values average. */
export interface Surface {
  readonly restitution?: number;
  readonly friction?: number;
}

/** A body to add: where its centre starts in stage px, its turn in degrees, and how fast both change. */
export interface BodySpec extends Surface {
  readonly id: string;
  readonly shape: Shape;
  readonly x: number;
  readonly y: number;
  readonly vx?: number;
  readonly vy?: number;
  /** Degrees, clockwise on screen; default 0. */
  readonly angle?: number;
  /** Degrees a second, clockwise on screen; default 0. */
  readonly spin?: number;
  /** A body that never turns, however it is hit; default false. */
  readonly fixedRotation?: boolean;
  /** Share of speed lost to air each second; default 0. */
  readonly drag?: number;
  /** Default: the shape's area, so bigger bodies push harder. */
  readonly mass?: number;
}

/** Where a body's centre is in stage px and how it is turned in degrees, and how fast each changes a second. */
export interface BodyState {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly vx: number;
  readonly vy: number;
  readonly spin: number;
}

/** Two things that started touching during a step, and where: body ids, or a body id and a collider id, and the point in stage px. */
export interface Contact {
  readonly a: string;
  readonly b: string;
  readonly x: number;
  readonly y: number;
}

/** A 3D contact: the pair that started touching and the point where they met, in scene units. */
export interface Contact3d extends Contact {
  readonly z: number;
}

/** What every physics engine gives a scene, in stage px, degrees and seconds, y down and turns clockwise. */
export interface PhysicsWorld {
  addBody(body: BodySpec): void;
  addCollider(id: string, collider: Collider, surface?: Surface): void;
  /** Px a second squared; default `(0, 0)`. */
  setGravity(x: number, y: number): void;
  step(seconds: number): void;
  body(id: string): BodyState;
  /** Contacts that started since the last drain, in the order the engine found them. */
  drainContacts(): readonly Contact[];
  snapshot(): Uint8Array;
  restore(snapshot: Uint8Array): void;
}

/** A unit quaternion `{ w, x, y, z }` representing a 3D orientation. */
export interface Quaternion3d {
  readonly w: number;
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

/** A 3D body's shape: a sphere by radius, or a box by width, height and depth, centred on the body. */
export type Shape3d =
  | { readonly kind: "sphere"; readonly radius: number }
  | {
      readonly kind: "box";
      readonly width: number;
      readonly height: number;
      readonly depth: number;
    };

/** A fixed 3D collider: a horizontal floor at `y`, an `x`/`z` boundary wall, or a static box. */
export type Collider3d =
  | { readonly kind: "floor"; readonly y: number }
  | {
      readonly kind: "wall";
      readonly axis: "x" | "z";
      readonly at: number;
      readonly side: "min" | "max";
    }
  | {
      readonly kind: "box";
      readonly x: number;
      readonly y: number;
      readonly z: number;
      readonly width: number;
      readonly height: number;
      readonly depth: number;
    };

/** A 3D body to add: starting position in world units, initial quaternion, and velocities (degrees/s). */
export interface BodySpec3d extends Surface {
  readonly id: string;
  readonly shape: Shape3d;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly vx?: number;
  readonly vy?: number;
  readonly vz?: number;
  /** Starting orientation quaternion; identity when absent. */
  readonly rotation?: Quaternion3d;
  /** Angular velocity in degrees a second around X, Y and Z; default 0. */
  readonly wx?: number;
  readonly wy?: number;
  readonly wz?: number;
  /** A body that never rotates, however it is hit; default false. */
  readonly fixedRotation?: boolean;
  /** Linear and angular damping factor; default 0. */
  readonly drag?: number;
  /** Explicit body mass in kilograms; derived from collider volume when absent. */
  readonly mass?: number;
}

/** A 3D body's world position, orientation quaternion, linear velocity, and angular velocity (deg/s). */
export interface BodyState3d {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly rotation: Quaternion3d;
  readonly vx: number;
  readonly vy: number;
  readonly vz: number;
  readonly wx: number;
  readonly wy: number;
  readonly wz: number;
}

/** What a 3D physics engine gives a scene: world units, y up, quaternions and degrees a second. */
export interface PhysicsWorld3d {
  addBody(body: BodySpec3d): void;
  addCollider(id: string, collider: Collider3d, surface?: Surface): void;
  /** Gravity in world units a second squared; default `(0, 0, 0)`. */
  setGravity(x: number, y: number, z: number): void;
  step(seconds: number): void;
  body(id: string): BodyState3d;
  /** Contacts that started since the last drain, in the order the engine found them. */
  drainContacts(): readonly Contact3d[];
  snapshot(): Uint8Array;
  restore(snapshot: Uint8Array): void;
}
