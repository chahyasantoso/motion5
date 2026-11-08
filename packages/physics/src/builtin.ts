import type { BodySpec, BodyState, Collider, Contact, PhysicsWorld, Shape, Surface } from "./world";

interface Body {
  readonly id: string;
  readonly shape: Shape;
  readonly inverseMass: number;
  readonly restitution: number;
  readonly friction: number;
  readonly drag: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Fixed {
  readonly id: string;
  readonly collider: Collider;
  readonly restitution: number;
  readonly friction: number;
}

/** Where two things overlap: the direction from the first to the second, and how deep. */
interface Overlap {
  readonly nx: number;
  readonly ny: number;
  readonly depth: number;
}

interface Pair {
  readonly key: string;
  readonly a: Body;
  /** The second party: a body, or a fixed collider with no mass. */
  readonly b: Body | Fixed;
  readonly overlap: Overlap;
}

const ITERATIONS = 6;
const SLOP = 0.5;
const PUSH = 0.8;

function half(shape: Shape): { readonly w: number; readonly h: number } {
  switch (shape.kind) {
    case "circle":
      return { w: shape.radius, h: shape.radius };
    case "box":
      return { w: shape.width / 2, h: shape.height / 2 };
    default:
      return unreachable(shape);
  }
}

function unreachable(value: never): never {
  throw new TypeError(`Unreachable value: ${JSON.stringify(value)}`);
}

function boxOverlap(dx: number, dy: number, w: number, h: number): Overlap | undefined {
  const ox = w - Math.abs(dx);
  const oy = h - Math.abs(dy);
  if (ox <= 0 || oy <= 0) return undefined;
  return ox < oy
    ? { nx: Math.sign(dx) || 1, ny: 0, depth: ox }
    : { nx: 0, ny: Math.sign(dy) || 1, depth: oy };
}

/** Overlap of a circle at `(cx, cy)` and a box at `(bx, by)`, as seen from the circle. */
function circleBox(
  cx: number,
  cy: number,
  r: number,
  bx: number,
  by: number,
  w: number,
  h: number,
) {
  const px = Math.max(bx - w, Math.min(cx, bx + w));
  const py = Math.max(by - h, Math.min(cy, by + h));
  const dx = px - cx;
  const dy = py - cy;
  const distance = Math.hypot(dx, dy);
  if (distance === 0) {
    const inside = boxOverlap(bx - cx, by - cy, w + r, h + r);
    return inside;
  }
  if (distance >= r) return undefined;
  return { nx: dx / distance, ny: dy / distance, depth: r - distance };
}

function between(a: Body, b: Body): Overlap | undefined {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (a.shape.kind === "circle" && b.shape.kind === "circle") {
    const distance = Math.hypot(dx, dy);
    const reach = a.shape.radius + b.shape.radius;
    if (distance >= reach) return undefined;
    return distance === 0
      ? { nx: 0, ny: 1, depth: reach }
      : { nx: dx / distance, ny: dy / distance, depth: reach - distance };
  }
  if (a.shape.kind === "circle") {
    const box = half(b.shape);
    return circleBox(a.x, a.y, a.shape.radius, b.x, b.y, box.w, box.h);
  }
  if (b.shape.kind === "circle") {
    const box = half(a.shape);
    const seen = circleBox(b.x, b.y, b.shape.radius, a.x, a.y, box.w, box.h);
    return seen && { nx: -seen.nx, ny: -seen.ny, depth: seen.depth };
  }
  const ha = half(a.shape);
  const hb = half(b.shape);
  return boxOverlap(dx, dy, ha.w + hb.w, ha.h + hb.h);
}

/** Overlap of a body with a fixed collider, as seen from the body. */
function against(body: Body, collider: Collider): Overlap | undefined {
  const { w, h } = half(body.shape);
  switch (collider.kind) {
    case "floor": {
      const depth = body.y + h - collider.y;
      return depth > 0 ? { nx: 0, ny: 1, depth } : undefined;
    }
    case "wall": {
      const depth = collider.side === "left" ? collider.x - (body.x - w) : body.x + w - collider.x;
      return depth > 0 ? { nx: collider.side === "left" ? -1 : 1, ny: 0, depth } : undefined;
    }
    case "segment": {
      const { from, to } = collider;
      const ex = to.x - from.x;
      const ey = to.y - from.y;
      const length = Math.hypot(ex, ey);
      if (length === 0) return undefined;
      if (body.shape.kind === "circle") {
        const t = Math.max(
          0,
          Math.min(1, ((body.x - from.x) * ex + (body.y - from.y) * ey) / (length * length)),
        );
        const dx = from.x + ex * t - body.x;
        const dy = from.y + ey * t - body.y;
        const distance = Math.hypot(dx, dy);
        const r = body.shape.radius;
        if (distance >= r || distance === 0) return undefined;
        return { nx: dx / distance, ny: dy / distance, depth: r - distance };
      }
      // A box against a segment: the shallowest of the box's two axes and the segment's normal.
      const axes = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -ey / length, y: ex / length },
      ];
      let best: Overlap | undefined;
      for (const axis of axes) {
        const centre = body.x * axis.x + body.y * axis.y;
        const reach = w * Math.abs(axis.x) + h * Math.abs(axis.y);
        const p1 = from.x * axis.x + from.y * axis.y;
        const p2 = to.x * axis.x + to.y * axis.y;
        const low = Math.min(p1, p2);
        const high = Math.max(p1, p2);
        const depth = Math.min(centre + reach - low, high - (centre - reach));
        if (depth <= 0) return undefined;
        const toward = (low + high) / 2 >= centre ? 1 : -1;
        if (best === undefined || depth < best.depth)
          best = { nx: axis.x * toward, ny: axis.y * toward, depth };
      }
      return best;
    }
    default:
      return unreachable(collider);
  }
}

function isBody(party: Body | Fixed): party is Body {
  return "inverseMass" in party;
}

/** The built-in engine: circles and boxes that do not turn, on floors, walls and segments; pure and synchronous. */
export function builtinWorld(): PhysicsWorld {
  const bodies: Body[] = [];
  const byId = new Map<string, Body>();
  const fixed: Fixed[] = [];
  let gx = 0;
  let gy = 0;
  let touching = new Set<string>();
  let started: Contact[] = [];

  const pairs = (): Pair[] => {
    const found: Pair[] = [];
    const size = Math.max(
      1,
      ...bodies.map(({ shape }) => 2 * Math.max(half(shape).w, half(shape).h)),
    );
    const cells = new Map<string, number[]>();
    bodies.forEach((body, index) => {
      const { w, h } = half(body.shape);
      for (let cx = Math.floor((body.x - w) / size); cx <= Math.floor((body.x + w) / size); cx += 1)
        for (
          let cy = Math.floor((body.y - h) / size);
          cy <= Math.floor((body.y + h) / size);
          cy += 1
        ) {
          const key = `${cx},${cy}`;
          const members = cells.get(key);
          if (members === undefined) cells.set(key, [index]);
          else members.push(index);
        }
    });
    const seen = new Set<string>();
    for (const members of cells.values())
      for (let i = 0; i < members.length; i += 1)
        for (let j = i + 1; j < members.length; j += 1) {
          const a = bodies[members[i] ?? 0];
          const b = bodies[members[j] ?? 0];
          if (a === undefined || b === undefined) continue;
          const key = `${a.id}|${b.id}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const overlap = between(a, b);
          if (overlap !== undefined) found.push({ key, a, b, overlap });
        }
    for (const body of bodies)
      for (const wall of fixed) {
        const overlap = against(body, wall.collider);
        if (overlap !== undefined)
          found.push({ key: `${body.id}|${wall.id}`, a: body, b: wall, overlap });
      }
    return found;
  };

  const resolve = ({ a, b, overlap }: Pair, seconds: number): void => {
    const bm = isBody(b) ? b.inverseMass : 0;
    const total = a.inverseMass + bm;
    if (total === 0) return;
    const bvx = isBody(b) ? b.vx : 0;
    const bvy = isBody(b) ? b.vy : 0;
    const rx = bvx - a.vx;
    const ry = bvy - a.vy;
    const closing = rx * overlap.nx + ry * overlap.ny;
    if (closing >= 0) return;
    const resting = Math.hypot(gx, gy) * seconds * 4 + 1;
    const bounce = -closing > resting ? (a.restitution + b.restitution) / 2 : 0;
    const push = (-(1 + bounce) * closing) / total;
    const tx = rx - closing * overlap.nx;
    const ty = ry - closing * overlap.ny;
    const slide = Math.hypot(tx, ty);
    const grip =
      slide === 0 ? 0 : Math.min(((a.friction + b.friction) / 2) * push, slide / total) / slide;
    const ix = push * overlap.nx + grip * tx;
    const iy = push * overlap.ny + grip * ty;
    a.vx -= ix * a.inverseMass;
    a.vy -= iy * a.inverseMass;
    if (isBody(b)) {
      b.vx += ix * b.inverseMass;
      b.vy += iy * b.inverseMass;
    }
  };

  return {
    addBody(spec: BodySpec) {
      const area =
        spec.shape.kind === "circle"
          ? Math.PI * spec.shape.radius ** 2
          : spec.shape.width * spec.shape.height;
      const mass = spec.mass ?? area;
      if (!(mass > 0))
        throw new RangeError(`builtinWorld: body "${spec.id}" needs a mass above 0.`);
      const body: Body = {
        id: spec.id,
        shape: spec.shape,
        inverseMass: 1 / mass,
        restitution: spec.restitution ?? 0,
        friction: spec.friction ?? 0.5,
        drag: spec.drag ?? 0,
        x: spec.x,
        y: spec.y,
        vx: spec.vx ?? 0,
        vy: spec.vy ?? 0,
      };
      bodies.push(body);
      byId.set(spec.id, body);
    },
    addCollider(id: string, collider: Collider, surface: Surface = {}) {
      fixed.push({
        id,
        collider,
        restitution: surface.restitution ?? 0,
        friction: surface.friction ?? 0.5,
      });
    },
    setGravity(x, y) {
      gx = x;
      gy = y;
    },
    step(seconds) {
      for (const body of bodies) {
        const keep = Math.max(0, 1 - body.drag * seconds);
        body.vx = (body.vx + gx * seconds) * keep;
        body.vy = (body.vy + gy * seconds) * keep;
        body.x += body.vx * seconds;
        body.y += body.vy * seconds;
      }
      const found = pairs();
      for (let i = 0; i < ITERATIONS; i += 1) for (const pair of found) resolve(pair, seconds);
      for (const { a, b, overlap } of found) {
        const bm = isBody(b) ? b.inverseMass : 0;
        const total = a.inverseMass + bm;
        const shift = (Math.max(0, overlap.depth - SLOP) / total) * PUSH;
        a.x -= overlap.nx * shift * a.inverseMass;
        a.y -= overlap.ny * shift * a.inverseMass;
        if (isBody(b)) {
          b.x += overlap.nx * shift * b.inverseMass;
          b.y += overlap.ny * shift * b.inverseMass;
        }
      }
      const now = new Set(found.map(({ key }) => key));
      for (const { key, a, b } of found) if (!touching.has(key)) started.push({ a: a.id, b: b.id });
      touching = now;
    },
    body(id): BodyState {
      const body = byId.get(id);
      if (body === undefined) throw new RangeError(`builtinWorld: no body "${id}".`);
      return { x: body.x, y: body.y, vx: body.vx, vy: body.vy };
    },
    drainContacts() {
      const drained = started;
      started = [];
      return drained;
    },
    snapshot() {
      const state = {
        gravity: [gx, gy],
        bodies: bodies.map(({ x, y, vx, vy }) => [x, y, vx, vy]),
        touching: [...touching],
      };
      return new TextEncoder().encode(JSON.stringify(state));
    },
    restore(snapshot) {
      const state: unknown = JSON.parse(new TextDecoder().decode(snapshot));
      const gravity: unknown = Reflect.get(Object(state), "gravity");
      const rows: unknown = Reflect.get(Object(state), "bodies");
      const keys: unknown = Reflect.get(Object(state), "touching");
      if (
        !Array.isArray(gravity) ||
        !Array.isArray(rows) ||
        !Array.isArray(keys) ||
        rows.length !== bodies.length
      )
        throw new TypeError("builtinWorld: the snapshot is not from this world.");
      gx = Number(gravity[0]);
      gy = Number(gravity[1]);
      rows.forEach((row: unknown, index) => {
        const body = bodies[index];
        if (body === undefined || !Array.isArray(row))
          throw new TypeError("builtinWorld: bad snapshot row.");
        body.x = Number(row[0]);
        body.y = Number(row[1]);
        body.vx = Number(row[2]);
        body.vy = Number(row[3]);
      });
      touching = new Set(keys.map(String));
      started = [];
    },
  };
}
