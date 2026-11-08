import type { BodySpec, BodyState, Collider, Contact, PhysicsWorld, Shape, Surface } from "./world";

interface Vec {
  readonly x: number;
  readonly y: number;
}

interface Body {
  readonly id: string;
  readonly shape: Shape;
  readonly inverseMass: number;
  readonly inverseInertia: number;
  readonly restitution: number;
  readonly friction: number;
  readonly drag: number;
  readonly reach: number;
  x: number;
  y: number;
  angle: number;
  vx: number;
  vy: number;
  spin: number;
  asleep: boolean;
  still: number;
}

interface Fixed {
  readonly id: string;
  readonly collider: Collider;
  readonly restitution: number;
  readonly friction: number;
}

/** A convex outline in stage px: its corners in order, and the outward normal of the face from each to the next. */
interface Polygon {
  readonly corners: readonly Vec[];
  readonly normals: readonly Vec[];
}

/** Where two things touch: the normal from the first to the second, and each point with its depth. */
interface Manifold {
  readonly key: string;
  readonly a: Body;
  readonly b: Body | Fixed;
  readonly n: Vec;
  readonly points: readonly { readonly p: Vec; readonly depth: number }[];
}

/** One contact point readied for the solver, with the impulses it has taken so far this step. */
interface Point {
  readonly a: Body;
  readonly b: Body | undefined;
  readonly n: Vec;
  readonly ra: Vec;
  readonly rb: Vec;
  readonly normalMass: number;
  readonly tangentMass: number;
  readonly target: number;
  readonly friction: number;
  pushed: number;
  rubbed: number;
}

const ITERATIONS = 10;
const SLOP = 0.5;
const BIAS = 0.2;
const SLEEP_SPEED = 4;
const SLEEP_AFTER = 0.5;
const WAKE_SPEED = 30;

const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y;
const cross = (a: Vec, b: Vec) => a.x * b.y - a.y * b.x;
const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
const along = (a: Vec, b: Vec, t: number): Vec => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

function unreachable(value: never): never {
  throw new TypeError(`Unreachable value: ${JSON.stringify(value)}`);
}

function isBody(party: Body | Fixed): party is Body {
  return "inverseMass" in party;
}

const outlines = new WeakMap<Body, { x: number; y: number; angle: number; polygon: Polygon }>();

/** A box body's outline, built once for each place it stands in. */
function outline(body: Body, width: number, height: number): Polygon {
  const cached = outlines.get(body);
  if (
    cached !== undefined &&
    cached.x === body.x &&
    cached.y === body.y &&
    cached.angle === body.angle
  )
    return cached.polygon;
  const polygon = boxPolygon(body, width, height);
  outlines.set(body, { x: body.x, y: body.y, angle: body.angle, polygon });
  return polygon;
}

/** A box's corners and face normals where the body is now; faces right, bottom, left, top before turning. */
function boxPolygon(body: Body, width: number, height: number): Polygon {
  const c = Math.cos(body.angle);
  const s = Math.sin(body.angle);
  const turn = (x: number, y: number): Vec => ({ x: x * c - y * s, y: x * s + y * c });
  const w = width / 2;
  const h = height / 2;
  const local = [turn(w, -h), turn(w, h), turn(-w, h), turn(-w, -h)];
  return {
    corners: local.map((v) => ({ x: body.x + v.x, y: body.y + v.y })),
    normals: [turn(1, 0), turn(0, 1), turn(-1, 0), turn(0, -1)],
  };
}

function segmentPolygon(from: Vec, to: Vec): Polygon | undefined {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  if (length === 0) return undefined;
  const n = { x: (to.y - from.y) / length, y: -(to.x - from.x) / length };
  return { corners: [from, to], normals: [n, { x: -n.x, y: -n.y }] };
}

/** The face of `poly` that the other's corners lie furthest outside of, and how far. */
function deepestFace(
  poly: Polygon,
  other: Polygon,
): { readonly face: number; readonly separation: number } {
  let face = 0;
  let separation = -Infinity;
  poly.normals.forEach((n, index) => {
    const corner = poly.corners[index] ?? { x: 0, y: 0 };
    const offset = dot(n, corner);
    let nearest = Infinity;
    for (const v of other.corners) nearest = Math.min(nearest, dot(n, v) - offset);
    if (nearest > separation) {
      separation = nearest;
      face = index;
    }
  });
  return { face, separation };
}

/** Contacts of two convex outlines, the normal from `one` to `two`: the incident face clipped to the reference face. */
function polygons(one: Polygon, two: Polygon) {
  const a = deepestFace(one, two);
  if (a.separation > 0) return undefined;
  const b = deepestFace(two, one);
  if (b.separation > 0) return undefined;
  const flip = b.separation > a.separation + 0.01;
  const ref = flip ? two : one;
  const inc = flip ? one : two;
  const face = flip ? b.face : a.face;
  const n = ref.normals[face] ?? { x: 0, y: 1 };
  const r1 = ref.corners[face] ?? { x: 0, y: 0 };
  const r2 = ref.corners[(face + 1) % ref.corners.length] ?? r1;
  let incident = 0;
  inc.normals.forEach((m, index) => {
    if (dot(m, n) < dot(inc.normals[incident] ?? m, n)) incident = index;
  });
  let edge: Vec[] = [
    inc.corners[incident] ?? { x: 0, y: 0 },
    inc.corners[(incident + 1) % inc.corners.length] ?? { x: 0, y: 0 },
  ];
  const side = sub(r2, r1);
  const length = Math.hypot(side.x, side.y) || 1;
  const t = { x: side.x / length, y: side.y / length };
  for (const [plane, offset] of [
    [{ x: -t.x, y: -t.y }, -dot(t, r1)],
    [t, dot(t, r2)],
  ] as const) {
    const kept: Vec[] = [];
    const [p, q] = edge;
    if (p === undefined || q === undefined) return undefined;
    const dp = dot(plane, p) - offset;
    const dq = dot(plane, q) - offset;
    if (dp <= 0) kept.push(p);
    if (dq <= 0) kept.push(q);
    if (dp * dq < 0) kept.push(along(p, q, dp / (dp - dq)));
    if (kept.length < 2) return undefined;
    edge = kept;
  }
  const points = edge
    .map((p) => ({ p, depth: -dot(n, sub(p, r1)) }))
    .filter(({ depth }) => depth > 0);
  if (points.length === 0) return undefined;
  return { n: flip ? { x: -n.x, y: -n.y } : n, points };
}

/** Contact of a circle with a convex outline, the normal from the circle to the outline. */
function circlePolygon(centre: Vec, radius: number, poly: Polygon) {
  let face = 0;
  let separation = -Infinity;
  poly.normals.forEach((n, index) => {
    const s = dot(n, sub(centre, poly.corners[index] ?? centre));
    if (s > separation) {
      separation = s;
      face = index;
    }
  });
  if (separation > radius) return undefined;
  const n = poly.normals[face] ?? { x: 0, y: -1 };
  if (separation < 0)
    return { n: { x: -n.x, y: -n.y }, points: [{ p: centre, depth: radius - separation }] };
  const v1 = poly.corners[face] ?? centre;
  const v2 = poly.corners[(face + 1) % poly.corners.length] ?? v1;
  const edge = sub(v2, v1);
  const t = Math.max(0, Math.min(1, dot(sub(centre, v1), edge) / (dot(edge, edge) || 1)));
  const closest = along(v1, v2, t);
  const away = sub(centre, closest);
  const distance = Math.hypot(away.x, away.y);
  if (distance >= radius) return undefined;
  const normal = distance === 0 ? n : { x: away.x / distance, y: away.y / distance };
  return { n: { x: -normal.x, y: -normal.y }, points: [{ p: closest, depth: radius - distance }] };
}

/** Contacts of a body with a half plane through `at` whose free side `up` points to. */
function halfPlane(body: Body, at: Vec, up: Vec) {
  const n = { x: -up.x, y: -up.y };
  switch (body.shape.kind) {
    case "circle": {
      const depth = body.shape.radius - dot(up, sub(body, at));
      if (depth <= 0) return undefined;
      const p = { x: body.x - up.x * body.shape.radius, y: body.y - up.y * body.shape.radius };
      return { n, points: [{ p, depth }] };
    }
    case "box": {
      const points = outline(body, body.shape.width, body.shape.height)
        .corners.map((p) => ({ p, depth: -dot(up, sub(p, at)) }))
        .filter(({ depth }) => depth > 0)
        .sort((x, y) => y.depth - x.depth)
        .slice(0, 2);
      return points.length === 0 ? undefined : { n, points };
    }
    default:
      return unreachable(body.shape);
  }
}

function between(a: Body, b: Body) {
  const reach = a.reach + b.reach;
  if ((a.x - b.x) ** 2 + (a.y - b.y) ** 2 >= reach * reach) return undefined;
  if (a.shape.kind === "circle" && b.shape.kind === "circle") {
    const d = sub(b, a);
    const distance = Math.hypot(d.x, d.y);
    const reach = a.shape.radius + b.shape.radius;
    if (distance >= reach) return undefined;
    const n = distance === 0 ? { x: 0, y: 1 } : { x: d.x / distance, y: d.y / distance };
    const p = { x: a.x + n.x * a.shape.radius, y: a.y + n.y * a.shape.radius };
    return { n, points: [{ p, depth: reach - distance }] };
  }
  if (a.shape.kind === "circle" && b.shape.kind === "box")
    return circlePolygon(a, a.shape.radius, outline(b, b.shape.width, b.shape.height));
  if (a.shape.kind === "box" && b.shape.kind === "circle") {
    const seen = circlePolygon(b, b.shape.radius, outline(a, a.shape.width, a.shape.height));
    return seen && { n: { x: -seen.n.x, y: -seen.n.y }, points: seen.points };
  }
  if (a.shape.kind === "box" && b.shape.kind === "box")
    return polygons(
      outline(a, a.shape.width, a.shape.height),
      outline(b, b.shape.width, b.shape.height),
    );
  return undefined;
}

function against(body: Body, collider: Collider) {
  switch (collider.kind) {
    case "floor":
      return halfPlane(body, { x: 0, y: collider.y }, { x: 0, y: -1 });
    case "wall":
      return halfPlane(
        body,
        { x: collider.x, y: 0 },
        { x: collider.side === "left" ? 1 : -1, y: 0 },
      );
    case "segment": {
      const segment = segmentPolygon(collider.from, collider.to);
      if (segment === undefined) return undefined;
      switch (body.shape.kind) {
        case "circle":
          return circlePolygon(body, body.shape.radius, segment);
        case "box":
          return polygons(outline(body, body.shape.width, body.shape.height), segment);
        default:
          return unreachable(body.shape);
      }
    }
    default:
      return unreachable(collider);
  }
}

/** The built-in engine: circles and boxes that turn, on floors, walls and segments; pure and synchronous. */
export function builtinWorld(): PhysicsWorld {
  const bodies: Body[] = [];
  const byId = new Map<string, Body>();
  const fixed: Fixed[] = [];
  let gx = 0;
  let gy = 0;
  let touching = new Set<string>();
  let started: Contact[] = [];

  const manifolds = (resting: Set<string>): Manifold[] => {
    const found: Manifold[] = [];
    let size = 1;
    for (const { reach } of bodies) size = Math.max(size, 2 * reach);
    const cells = new Map<number, number[]>();
    bodies.forEach((body, index) => {
      for (
        let cx = Math.floor((body.x - body.reach) / size);
        cx <= Math.floor((body.x + body.reach) / size);
        cx += 1
      )
        for (
          let cy = Math.floor((body.y - body.reach) / size);
          cy <= Math.floor((body.y + body.reach) / size);
          cy += 1
        ) {
          const key = cx * 100_003 + cy;
          const members = cells.get(key);
          if (members === undefined) cells.set(key, [index]);
          else members.push(index);
        }
    });
    const seen = new Set<number>();
    for (const members of cells.values())
      for (let i = 0; i < members.length; i += 1)
        for (let j = i + 1; j < members.length; j += 1) {
          const low = members[i] ?? 0;
          const high = members[j] ?? 0;
          const pair = low * bodies.length + high;
          if (seen.has(pair)) continue;
          seen.add(pair);
          const a = bodies[low];
          const b = bodies[high];
          if (a === undefined || b === undefined) continue;
          const reach = a.reach + b.reach;
          if ((a.x - b.x) ** 2 + (a.y - b.y) ** 2 >= reach * reach) continue;
          const key = `${a.id}|${b.id}`;
          if (a.asleep && b.asleep) {
            if (touching.has(key)) resting.add(key);
            continue;
          }
          const touch = between(a, b);
          if (touch !== undefined) found.push({ key, a, b, ...touch });
        }
    for (const body of bodies)
      for (const wall of fixed) {
        const touch = against(body, wall.collider);
        if (touch !== undefined)
          found.push({ key: `${body.id}|${wall.id}`, a: body, b: wall, ...touch });
      }
    return found;
  };

  const velocityAt = (body: Body | undefined, r: Vec): Vec =>
    body === undefined || body.asleep
      ? { x: 0, y: 0 }
      : { x: body.vx - body.spin * r.y, y: body.vy + body.spin * r.x };

  const push = (body: Body | undefined, r: Vec, impulse: Vec, sign: number): void => {
    if (body === undefined || body.asleep) return;
    body.vx += sign * impulse.x * body.inverseMass;
    body.vy += sign * impulse.y * body.inverseMass;
    body.spin += sign * cross(r, impulse) * body.inverseInertia;
  };

  const prepare = (manifold: Manifold, seconds: number): Point[] => {
    const a = manifold.a;
    const b = isBody(manifold.b) ? manifold.b : undefined;
    const restitution = (a.restitution + manifold.b.restitution) / 2;
    const friction = (a.friction + manifold.b.friction) / 2;
    const resting = Math.hypot(gx, gy) * seconds * 4 + 30;
    const n = manifold.n;
    const t = { x: -n.y, y: n.x };
    return manifold.points.map(({ p, depth }) => {
      const ra = sub(p, a);
      const rb = b === undefined ? { x: 0, y: 0 } : sub(p, b);
      const mass = (axis: Vec) => {
        const ia = a.asleep ? 0 : a.inverseMass + a.inverseInertia * cross(ra, axis) ** 2;
        const ib =
          b === undefined || b.asleep ? 0 : b.inverseMass + b.inverseInertia * cross(rb, axis) ** 2;
        return ia + ib === 0 ? 0 : 1 / (ia + ib);
      };
      const va = velocityAt(a, ra);
      const vb = velocityAt(b, rb);
      const closing = dot(sub(vb, va), n);
      const bounce = -closing > resting ? -restitution * closing : 0;
      const correct = (BIAS / seconds) * Math.max(0, depth - SLOP);
      return {
        a,
        b,
        n,
        ra,
        rb,
        normalMass: mass(n),
        tangentMass: mass(t),
        target: Math.max(bounce, correct),
        friction,
        pushed: 0,
        rubbed: 0,
      };
    });
  };

  const solve = (point: Point): void => {
    const { a, b, n, ra, rb } = point;
    const t = { x: -n.y, y: n.x };
    const relative = () => sub(velocityAt(b, rb), velocityAt(a, ra));
    const normal = point.normalMass * (point.target - dot(relative(), n));
    const pushed = Math.max(0, point.pushed + normal);
    const dn = pushed - point.pushed;
    point.pushed = pushed;
    push(a, ra, { x: n.x * dn, y: n.y * dn }, -1);
    push(b, rb, { x: n.x * dn, y: n.y * dn }, 1);
    const limit = point.friction * point.pushed;
    const tangent = point.tangentMass * -dot(relative(), t);
    const rubbed = Math.max(-limit, Math.min(limit, point.rubbed + tangent));
    const dt = rubbed - point.rubbed;
    point.rubbed = rubbed;
    push(a, ra, { x: t.x * dt, y: t.y * dt }, -1);
    push(b, rb, { x: t.x * dt, y: t.y * dt }, 1);
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
      const inertia =
        spec.shape.kind === "circle"
          ? (mass * spec.shape.radius ** 2) / 2
          : (mass * (spec.shape.width ** 2 + spec.shape.height ** 2)) / 12;
      const reach =
        spec.shape.kind === "circle"
          ? spec.shape.radius
          : Math.hypot(spec.shape.width, spec.shape.height) / 2;
      const existing = byId.get(spec.id);
      if (existing !== undefined && bodies.includes(existing))
        throw new RangeError(`builtinWorld: body "${spec.id}" is added twice.`);
      const body: Body = {
        id: spec.id,
        shape: spec.shape,
        inverseMass: 1 / mass,
        inverseInertia: spec.fixedRotation === true ? 0 : 1 / inertia,
        restitution: spec.restitution ?? 0,
        friction: spec.friction ?? 0.5,
        drag: spec.drag ?? 0,
        reach,
        x: spec.x,
        y: spec.y,
        angle: ((spec.angle ?? 0) * Math.PI) / 180,
        vx: spec.vx ?? 0,
        vy: spec.vy ?? 0,
        spin: ((spec.spin ?? 0) * Math.PI) / 180,
        asleep: false,
        still: 0,
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
        if (body.asleep) continue;
        const keep = Math.max(0, 1 - body.drag * seconds);
        body.vx = (body.vx + gx * seconds) * keep;
        body.vy = (body.vy + gy * seconds) * keep;
        body.spin *= keep;
      }
      const resting = new Set<string>();
      const found = manifolds(resting);
      for (const { a, b } of found) {
        if (!isBody(b) || a.asleep === b.asleep) continue;
        const awake = a.asleep ? b : a;
        const sleeper = a.asleep ? a : b;
        if (Math.hypot(awake.vx, awake.vy) > WAKE_SPEED) {
          sleeper.asleep = false;
          sleeper.still = 0;
        }
      }
      const points = found.flatMap((manifold) => prepare(manifold, seconds));
      for (let i = 0; i < ITERATIONS; i += 1) for (const point of points) solve(point);
      for (const body of bodies) {
        if (body.asleep) continue;
        body.x += body.vx * seconds;
        body.y += body.vy * seconds;
        body.angle += body.spin * seconds;
        const calm =
          Math.hypot(body.vx, body.vy) < SLEEP_SPEED &&
          Math.abs(body.spin) * body.reach < SLEEP_SPEED;
        body.still = calm ? body.still + seconds : 0;
        if (body.still >= SLEEP_AFTER) {
          body.asleep = true;
          body.vx = 0;
          body.vy = 0;
          body.spin = 0;
        }
      }
      const now = new Set([...resting, ...found.map(({ key }) => key)]);
      for (const { key, a, b } of found) if (!touching.has(key)) started.push({ a: a.id, b: b.id });
      touching = now;
    },
    body(id): BodyState {
      const body = byId.get(id);
      if (body === undefined) throw new RangeError(`builtinWorld: no body "${id}".`);
      const degrees = 180 / Math.PI;
      return {
        x: body.x,
        y: body.y,
        rotation: body.angle * degrees,
        vx: body.vx,
        vy: body.vy,
        spin: body.spin * degrees,
      };
    },
    drainContacts() {
      const drained = started;
      started = [];
      return drained;
    },
    snapshot() {
      const state = {
        gravity: [gx, gy],
        bodies: bodies.map((b) => [
          b.id,
          b.x,
          b.y,
          b.angle,
          b.vx,
          b.vy,
          b.spin,
          b.asleep ? 1 : 0,
          b.still,
        ]),
        touching: [...touching],
      };
      return new TextEncoder().encode(JSON.stringify(state));
    },
    restore(snapshot) {
      const state: unknown = JSON.parse(new TextDecoder().decode(snapshot));
      const gravity: unknown = Reflect.get(Object(state), "gravity");
      const rows: unknown = Reflect.get(Object(state), "bodies");
      const keys: unknown = Reflect.get(Object(state), "touching");
      if (!Array.isArray(gravity) || !Array.isArray(rows) || !Array.isArray(keys))
        throw new TypeError("builtinWorld: the snapshot is not from this world.");
      gx = Number(gravity[0]);
      gy = Number(gravity[1]);
      bodies.length = 0;
      for (const row of rows) {
        const body = Array.isArray(row) ? byId.get(String(row[0])) : undefined;
        if (body === undefined || !Array.isArray(row))
          throw new TypeError("builtinWorld: the snapshot names a body this world never had.");
        body.x = Number(row[1]);
        body.y = Number(row[2]);
        body.angle = Number(row[3]);
        body.vx = Number(row[4]);
        body.vy = Number(row[5]);
        body.spin = Number(row[6]);
        body.asleep = Number(row[7]) === 1;
        body.still = Number(row[8]);
        bodies.push(body);
      }
      touching = new Set(keys.map(String));
      started = [];
    },
  };
}
