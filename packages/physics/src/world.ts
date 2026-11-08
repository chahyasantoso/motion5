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

/** A body to add: where its centre starts in stage px, how fast it goes in px a second, and how air slows it. */
export interface BodySpec extends Surface {
  readonly id: string;
  readonly shape: Shape;
  readonly x: number;
  readonly y: number;
  readonly vx?: number;
  readonly vy?: number;
  /** Share of speed lost to air each second; default 0. */
  readonly drag?: number;
  /** Default: the shape's area, so bigger bodies push harder. */
  readonly mass?: number;
}

/** Where a body's centre is in stage px, and how fast it goes in px a second. */
export interface BodyState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
}

/** Two things that started touching during a step: body ids, or a body id and a collider id. */
export interface Contact {
  readonly a: string;
  readonly b: string;
}

/** What every physics engine gives a scene, in stage px and seconds with y down; bodies do not turn. */
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
