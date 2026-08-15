# Walker Demo on motion5 — Implementation Plan

**Goal:** Build a React "FK walk cycle" demo (the one in the motionpath oracle) as a real consumer of `@motion5/core` + `@motion5/react`, off base branch `phase5/membership-base`. The demo is a proving ground: if a real app can author a project, wire the runtime, and render published patches end to end, the value pipeline is actually done.

## Why this demo is the right test

The motionpath walker is deliberately unforgiving. One `pelvis` track authors position (`x`, `y`, `rotation`). Every one of the other 13 bones authors **only** a bone length and a local joint angle, then observes its parent. A forward-kinematics plugin folds parent-world + local bone into a flat `{ x, y, rotation }` world transform. If any of these are broken, the skeleton visibly falls apart:

- authored keyframe compilation (per-property stops → interpolated proxy state)
- plugin resolution + compose ordering
- observation edges feeding one node's output into another's input
- Track state surviving many flushes
- one clock owner, progress invalidation, deterministic topo order
- DOM patch application

That's exactly the Phase 0R/1R value pipeline the audit says is not yet shipped. A green walker = the pipeline works against a real graph.

## What already exists in motion5

| Piece                           | Location                             | Status for the demo                                                   |
| ------------------------------- | ------------------------------------ | --------------------------------------------------------------------- |
| Authored schema v5 + validation | `contract/v5.ts`, `validate-v5.ts`   | ✅ Usable — walker authored in v5                                     |
| Engine.load → ProjectHandle     | `engine.ts`                          | ✅ Usable — mount/seek/signal/subscribe/dispose                       |
| Plugin registry + resolution    | `domain/plugins.ts`                  | ✅ Usable — register the FK + transform plugins                       |
| Track compose                   | `domain/track.ts`                    | ✅ Usable                                                             |
| Observation graph               | `runtime/graph-publisher.ts`         | ✅ Usable                                                             |
| Motion + clock subscription     | `domain/motion.ts`, `ports/clock.ts` | ✅ Usable — auto-advance on clock deltas                              |
| GSAP interpolator adapter       | `adapters/interpolator/gsap.ts`      | ⚠️ Not exported                                                       |
| DOM patch adapter               | `adapters/dom.ts`                    | ⚠️ Not exported                                                       |
| Browser RAF clock               | `adapters/browser-clock.ts`          | ⚠️ Not exported                                                       |
| React binding                   | `packages/react`                     | ⚠️ Only `usePatch`                                                    |
| Triggers                        | `domain/triggers.ts`                 | ❌ Vestigial — use Clock polymorphism instead (see feasibility study) |

## The five core gaps (this demo forces us to close them)

### 1. Adapters aren't public

`@motion5/core` only exports `.` and `./internal`. `createGsapInterpolator`, `createDomPatchAdapter`, and `createBrowserClock` are unreachable from a real consumer.

**Fix:** Add a public `./adapters` entrypoint exporting clock, interpolator, and DOM adapter factories. Low risk, one entry per package.json exports map.

### 2. No `PatchSource` off the handle

`usePatch(source, nodeId)` needs `{ get, subscribeNode }`. `ProjectHandle` exposes `subscribe` but not `get`.

**Fix:** Add `handle.get(nodeId): Patch | undefined` or expose a `handle.source: PatchSource` property. One-line change.

### 3. Observation is flat-keyed, not nested

Motionpath fed the parent as one `parentWorld` object. Motion5's publisher merges the parent's published values as **flat input keys** (optionally renamed via `projection.map`).

**Fix:** The FK plugin must be redesigned to read `parentX/parentY/parentRotation`, not `parentWorld`. Behavioral change, but justified (see design notes below).

### 4. No polished React hooks above `usePatch`

Motionpath had `useMotionProject`, `useMotionSubscriber`, `useScrollMotion`. Motion5 has only `usePatch`. The walker needs ways to:

- Load a project and get a `ProjectHandle`
- Subscribe a DOM element to a node's patches
- Wire a scroll clock and drive motion through scroll

**Fix:** Build app-level hooks first; promote to `@motion5/react` later if proven. No core change needed.

### 5. Clock polymorphism instead of triggers

Instead of three identical `TriggerDelegate` classes, use different Clock implementations. A `BrowserClock` emits RAF; a `ScrollClock` emits scroll deltas. Same Motion, different clock backend.

**Fix:** See [TRIGGER-REFACTORING-FEASIBILITY.md](TRIGGER-REFACTORING-FEASIBILITY.md). Remove triggers from core, let the app choose the clock. This is the insight from designing the walker.

## The FK plugin, adapted to motion5

Port `composeWorld` verbatim (it's the behavioral oracle), but feed it flat inputs.

```ts
// fkMath.ts — ported from oracle, unchanged behavior
export function composeWorld(
  parent: { x: number; y: number; rotation: number },
  local: { x: number; y: number; rotation: number },
) {
  const rad = (parent.rotation * Math.PI) / 180;
  const cos = Math.cos(rad),
    sin = Math.sin(rad);
  return {
    x: parent.x + (local.x * cos - local.y * sin),
    y: parent.y + (local.x * sin + local.y * cos),
    rotation: parent.rotation + local.rotation,
  };
}
```

```ts
// fkPlugin.ts — claims the authored keys, composes a flat world transform
import type { PluginDefinition } from "@motion5/core";
import { composeWorld } from "./fkMath";

export const fkPlugin: PluginDefinition = {
  name: "fk",
  keys: ["boneLength", "boneRotation"],
  inputs: ["parentX", "parentY", "parentRotation"],
  stage: "compose",
  outputs: ["x", "y", "rotation"],
  compose: (values) => {
    const parent = {
      x: Number(values.parentX ?? 0),
      y: Number(values.parentY ?? 0),
      rotation: Number(values.parentRotation ?? 0),
    };
    return composeWorld(parent, {
      x: Number(values.boneLength ?? 0),
      y: 0,
      rotation: Number(values.boneRotation ?? 0),
    });
  },
};
```

Observation wiring in the authored project:

```ts
observes: [
  {
    source: parentId,
    role: "input",
    projection: { map: { x: "parentX", y: "parentY", rotation: "parentRotation" } },
  },
];
```

The publisher's `projectValues` supports `map`, and the flat keys are merged into the child's inputs before compose. This replaces motionpath's nested `parentWorld` object cleanly.

### Why flat keys, not nested objects?

Three reasons:

1. **Plugins stay topology-agnostic.** `simpleProperty` reads `values[key]`, FK reads `values.parentX`. Same flat lookup whether it's local state or observed. Plugins never unwrap a nested source object.
2. **The graph owns shape, not the plugin.** Renaming lives on the _edge_ via `projection.map`, not in compose code. The publisher does the projection; plugins stay dumb.
3. **Collisions are validated, not hidden.** Two edges contributing the same key throws `observation-input-collision` at flush time. Nesting would auto-namespace that away, which sounds nice until you _want_ two upstreams to feed one value space and can't tell them apart. Motion5 pushes that ambiguity to authoring time where it's explicit and checkable.

## Target project structure

Add an `apps/*` workspace to the monorepo (root `package.json` currently globs `packages/*` only — extend `workspaces` to include `apps/*`).

```
apps/walker-demo/
  package.json
  vite.config.ts
  index.html
  src/
    main.tsx
    App.tsx
    engine/
      createWalkerEngine.ts      # wires clock + gsap + scheduler + plugins
      createScrollClock.ts        # scroll reader → Clock
      createGsapScrollClock.ts    # GSAP ScrollTrigger → Clock
    plugins/
      fkMath.ts
      fkPlugin.ts
      transformPlugins.ts         # simple x/y/rotation pass-through
    walker/
      walkerProject.ts            # schema-v5 authored project
      rig.ts                      # RIG/WALK/BONES/JOINTS tables
      WalkerPage.tsx
      WalkerPage.css
      useWalkerEngine.ts          # engine.load lifecycle
      useNodeTransform.ts         # subscribe + transform + DOM
    __tests__/
      fkMath.test.ts
      walkerProject.contract.test.ts
      fkPlugin.compose.test.ts
      walkerGraph.integration.test.ts
```

## Clock implementations (the key insight)

Instead of a scroll "trigger," build a scroll "clock."

### createScrollClock (hand-rolled)

```ts
export function createScrollClock(
  triggerEl: HTMLElement,
  pinEl: HTMLElement,
  { scrub = 0, start = "top top", end = "bottom bottom" } = {},
): Clock {
  const listeners = new Set<(event: ClockTick) => void>();
  let tick = 0;
  let lastTime = performance.now();
  let lastProgress = 0;

  function onScroll() {
    const triggerRect = triggerEl.getBoundingClientRect();
    const pinRect = pinEl.getBoundingClientRect();
    const startPos = parseStart(start, triggerRect, window.innerHeight);
    const endPos = parseEnd(end, triggerRect, window.innerHeight);
    const rawProgress = clamp((startPos - window.scrollY) / (endPos - startPos), 0, 1);
    const smoothedProgress = lerp(lastProgress, rawProgress, 1 - scrub);
    const delta = smoothedProgress - lastProgress;
    lastProgress = smoothedProgress;

    const now = performance.now();
    const event = Object.freeze({ tick: tick++, time: now, delta });
    for (const listener of [...listeners]) listener(event);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  return {
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispose: () => {
      listeners.clear();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    },
  };
}
```

### createGsapScrollClock (recommended for the demo)

```ts
export function createGsapScrollClock(
  gsap: GsapLike,
  triggerEl: HTMLElement,
  pinEl: HTMLElement,
  { scrub = 0, start = "top top", end = "bottom bottom" } = {},
): Clock {
  const listeners = new Set<(event: ClockTick) => void>();
  let tick = 0;
  let lastTime = performance.now();

  gsap.timeline({
    scrollTrigger: {
      trigger: triggerEl,
      pin: pinEl,
      scrub,
      start,
      end,
      onUpdate: (self) => {
        const now = performance.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;
        const event = Object.freeze({ tick: tick++, time: now, delta });
        for (const listener of [...listeners]) listener(event);
      },
    },
  });

  return {
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
```

Then wire it into the engine:

```ts
const walkerMotion = walkerProject.motions[0];
const { type: triggerType, scrub, pin, start, end } = walkerMotion.trigger;

let clock: Clock;
if (triggerType === "scroll") {
  const triggerRef = document.querySelector("[data-scroll-trigger]");
  const pinRef = document.querySelector("[data-scroll-pin]");
  clock = createGsapScrollClock(gsap, triggerRef, pinRef, { scrub, start, end });
} else if (triggerType === "time") {
  clock = createBrowserClock({
    requestFrame: requestAnimationFrame,
    cancelFrame: cancelAnimationFrame,
  });
} else {
  clock = createManualClock(); // test/headless
}

const motion = new Motion({ clock, scheduler, tracks, invalidate });
if (triggerType === "time") motion.play();
```

## Core changes required (small)

### C1 — Public adapters entrypoint

Add `packages/core/src/adapters/index.ts` re-exporting `createGsapInterpolator`, `createDomPatchAdapter`, `createBrowserClock` (+ their types). Add `"./adapters"` to the exports map in `packages/core/package.json`.

**Failing-first test:** import and instantiate each. Fails today (no entrypoint).

### C2 — `PatchSource` from the handle

`ProjectHandle` gains a `get(nodeId): Patch | undefined` method (delegates to `runtime.graph.registry.get`), or expose a `source: PatchSource` getter.

**Failing-first test:** load a trivial project, seek, assert `handle.get(nodeId)` returns the last patch. Fails today (no `get`).

### C3 (Recommended, see feasibility study) — Trigger refactoring

Remove `TriggerDelegate` from core. Motion constructor drops the `trigger` parameter. Engine checks `definition.trigger.type` to decide whether to `motion.play()` upfront.

**Failing-first test:** load a time-motion, assert it advances automatically; load a scroll-motion, assert it stays paused. Fails without the refactoring.

## Authored walker project (schema v5)

Re-author `walkerMotions.js` as `walkerProject.ts`. Keep the gait math and RIG/WALK/BONES tables (safe to reuse). Changes vs the oracle:

- `schemaVersion: 4` → `5`.
- Each bone's `observes` uses `projection.map` instead of `target: "parentWorld"`.
- Stops stay `{ p, v, ease }` — matches v5 `AuthoredStop`.
- Keep `trigger: { type: "scroll", scrub, pin, start, end }` on the motion. The app driver reads this.
- Author `p:0` and `p:1` on every property to avoid warnings.

## React binding (app-local, then promote)

### useWalkerEngine

```ts
export function useWalkerEngine() {
  const [state, setState] = useState<{ handle?: ProjectHandle; source?: PatchSource }>({
    handle: undefined,
    source: undefined,
  });

  useEffect(() => {
    const engine = createWalkerEngine();
    const handle = engine.load(walkerProject);
    const source = { get: handle.get, subscribeNode: handle.subscribe } as PatchSource;
    for (const node of allNodeIds) handle.mount(node);
    setState({ handle, source });
    return () => {
      handle.dispose();
    };
  }, []);

  return state;
}
```

### useNodeTransform

Subscribe a node's patch, run a per-part transform callback, write to DOM:

```ts
export function useNodeTransform(
  source: PatchSource | undefined,
  nodeId: string,
  ref: React.RefObject<HTMLElement>,
  transform: (raw: Patch["values"], compose: (input: any) => any) => Record<string, any>,
) {
  useEffect(() => {
    if (!source || !ref.current) return;
    return source.subscribeNode(nodeId, (patch) => {
      if (patch.status !== "ready") return;
      const transformed = transform(patch.values, (input) => input);
      Object.entries(transformed).forEach(([key, value]) => {
        if (key === "transformOrigin") {
          ref.current!.style.transformOrigin = String(value);
        } else if (key in ref.current!.style) {
          (ref.current!.style as any)[key] = value;
        }
      });
    });
  }, [source, nodeId, ref, transform]);
}
```

### WalkerPage

Wire it all together:

```tsx
export default function WalkerPage() {
  const { handle, source } = useWalkerEngine();
  const walkerMotion = walkerProject.motions[0];
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!handle || !triggerRef.current || !pinRef.current) return;
    const clock = createGsapScrollClock(
      gsap,
      triggerRef.current,
      pinRef.current,
      walkerMotion.trigger,
    );
    const motion = new Motion({ clock, scheduler, tracks, invalidate });
    motion.play();
  }, [handle]);

  return (
    <div className="app">
      <section ref={triggerRef} className="walk-scene">
        <div ref={pinRef} className="walk-stage">
          {/* render bones, joints, shadow, etc using useNodeTransform */}
        </div>
      </section>
    </div>
  );
}
```

## Phased plan

| Phase                 | Deliverable                                                    | Exit evidence                                                                               |
| --------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| P0 — Core enablers    | C1 adapters entrypoint, C2 PatchSource, C3 trigger refactoring | New import/`get` tests fail on base, pass after; `npm run check` green                      |
| P1 — Plugins          | fkMath, fkPlugin, transform plugins                            | Unit tests for `composeWorld`; fkPlugin compose test (flat inputs → world)                  |
| P2 — Authored project | walkerProject.ts in schema v5                                  | `validateV5(walkerProject).valid === true`; contract test                                   |
| P3 — Clock + Motion   | BrowserClock, ScrollClock, create engine                       | Load + seek headless, assert patches; each bone's x/y/rotation matches `composeWorld` chain |
| P4 — React app        | Vite app, hooks, WalkerPage, GSAP scroll clock                 | App builds; scrubbing walks the rig; RTL smoke test                                         |
| P5 — Polish           | CSS, shadow/rail/head details, reverse-on-scroll-up            | Visual pass; boundary scan green; no leakage                                                |

## Acceptance criteria

- [ ] `apps/walker-demo` builds and runs on Node 24 via Vite.
- [ ] Scrolling the pinned section scrubs 4 gait cycles; scrolling up runs the gait in reverse.
- [ ] Only the pelvis authors position; all 13 bones derive world transforms via observation + FK.
- [ ] Every published bone patch equals the `composeWorld` chain for the same progress (integration test).
- [ ] One clock owner; Motion listens to a Clock port; no second RAF/ticker.
- [ ] New behavior tests fail on the base commit and pass after (failing-first evidence).
- [ ] `npm run check` green; boundary scan passes.
- [ ] No motionpath files copied; core graph internals stay private.

## Decisions confirmed

1. **Trigger refactoring is go.** Remove `TriggerDelegate` from core; use Clock polymorphism instead (see feasibility study).
2. **React hooks are app-local first.** Build them in the walker demo, promote to `@motion5/react` in a follow-up after proving them.
3. **GSAP ScrollClock is the demo's scroll driver.** Hand-rolled `createScrollClock` is provided as a reference; the walker uses GSAP for battle-tested scrub/pin/scrub.
4. **Direct DOM writes via `useNodeTransform`.** Cheaper and clearer than a centralized DOM adapter for this use case.

---

**Bottom line:** Motion5's runtime, plugin system, observation graph, and adapters are all present. The walker is buildable today after two-to-three core edits (public adapters, PatchSource, trigger refactoring), an FK plugin adapted to flat inputs, the schema-v5 project, and Clock implementations that marry the DOM to the runtime cleanly.
