import { describe, expect, it } from "vitest";
import type { Scene, PerspectiveCamera } from "three";
import { mountAvatarViewport, type AvatarRenderer } from "../src/view/avatar-viewport";
import { createGapPipeline } from "../src/filler/pipeline";
import { createWorldRigSolver } from "../src/rig/solver";
import { createLiveRig } from "../src/live/live-rig";
import { WORLD_SPACE } from "../src/filler/space";
import { jointRecord } from "../src/filler/landmarks";
import { scale } from "../src/filler/vec";
import { syntheticWorldPose } from "../src/replay/synthetic";
import { fakePorts } from "./engine";
import { frameOf } from "./frames";
import { publishFrame } from "../src/live/publish-frame";
import { createSourceSession } from "../src/live/session";
import { SOURCE_SPECS } from "../src/live/sources";
import type { SourceSample } from "../src/live/source";

const pose = () =>
  jointRecord((joint) => scale(syntheticWorldPose({ kind: "exercise" }, 400)[joint], 1000));
const ports = () => {
  const canvas = Object.assign(new EventTarget(), {
    clientWidth: 640,
    clientHeight: 480,
  }) as unknown as HTMLCanvasElement;
  const yaw = Object.assign(new EventTarget(), { value: "0" }) as unknown as HTMLInputElement;
  const pitch = Object.assign(new EventTarget(), { value: "0" }) as unknown as HTMLInputElement;
  const info = { textContent: "" } as HTMLElement;
  return { canvas, yaw, pitch, info };
};
const rendererProbe = () => {
  let scene: Scene | undefined, camera: PerspectiveCamera | undefined;
  let draws = 0,
    disposed = 0;
  const renderer: AvatarRenderer = {
    setPixelRatio() {},
    shadowMap: { enabled: true },
    setSize() {},
    render(nextScene, nextCamera) {
      scene = nextScene;
      camera = nextCamera;
      draws += 1;
    },
    dispose() {
      disposed += 1;
    },
  };
  return {
    renderer,
    get scene() {
      return scene;
    },
    get camera() {
      return camera;
    },
    get draws() {
      return draws;
    },
    get disposed() {
      return disposed;
    },
    visible: () => scene?.children[0]?.children.filter((object) => object.visible).length ?? 0,
  };
};

describe("avatar presentation lifecycle", () => {
  it("keeps a source alive on publication failure, displays stale geometry and recovers current output", () => {
    const p = ports(),
      probe = rendererProbe();
    const view = mountAvatarViewport(p.canvas, p.info, p.yaw, p.pitch, () => probe.renderer);
    const real = createWorldRigSolver(fakePorts(), { diagnostics: true });
    const run = createGapPipeline({ filler: { kind: "raw" } });
    let emit: ((sample: SourceSample) => void) | undefined;
    let calls = 0,
      endings = 0;
    const outputs: number[] = [];
    const solver = {
      ...real,
      solve: (...args: Parameters<typeof real.solve>) => {
        if (++calls === 2) throw new Error("publication failed");
        return real.solve(...args);
      },
    };
    const session = createSourceSession({
      create: () => ({
        start(callback) {
          emit = callback;
          return new Promise<void>(() => {});
        },
        stop() {},
      }),
      begin() {},
      sample(sample) {
        const step = run.step(frameOf(pose(), sample.tMs, WORLD_SPACE));
        const publication = publishFrame(solver, step, run.lengths);
        // This is the exact current-only map the live overlay consumes, never cached geometry.
        outputs.push(publication.solved.size);
        view.update(step, publication.solved, run.lengths, solver, undefined, 0.5);
      },
      end() {
        endings++;
      },
    });
    const spec = SOURCE_SPECS.find((item) => item.kind === "synthetic")!;
    try {
      session.start(spec);
      emit!({ result: null, tMs: 0, detectMs: 0 });
      expect(probe.visible()).toBe(17);
      emit!({ result: null, tMs: 33, detectMs: 0 });
      expect(session.running).toBe(spec);
      expect(endings).toBe(0);
      expect(probe.visible()).toBe(17);
      expect(p.info.textContent).toContain("stale");
      expect(p.info.textContent).not.toContain("unresolved");
      emit!({ result: null, tMs: 66, detectMs: 0 });
      expect(outputs).toEqual([4, 0, 4]);
      expect(p.info.textContent).not.toContain("last valid");
      expect(session.running).toBe(spec);
    } finally {
      session.stop();
      view.dispose();
      real.dispose();
    }
  });

  it("GF-144 drops stale geometry on context loss and restores empty until a new pose", () => {
    const p = ports(),
      probe = rendererProbe();
    const view = mountAvatarViewport(p.canvas, p.info, p.yaw, p.pitch, () => probe.renderer);
    const solver = createWorldRigSolver(fakePorts()),
      pipeline = createGapPipeline({ filler: { kind: "raw" } });
    const update = (time: number) => {
      const step = pipeline.step(frameOf(pose(), time, WORLD_SPACE));
      view.update(
        step,
        solver.solve(step, pipeline.lengths),
        pipeline.lengths,
        solver,
        undefined,
        0.5,
      );
    };
    try {
      update(0);
      expect(probe.visible()).toBeGreaterThan(0);
      const loss = new Event("webglcontextlost", { cancelable: true });
      p.canvas.dispatchEvent(loss);
      expect(loss.defaultPrevented).toBe(true);
      expect(probe.visible()).toBe(0);
      const previousDraws = probe.draws;
      update(100);
      expect(probe.draws).toBe(previousDraws);
      p.canvas.dispatchEvent(new Event("webglcontextrestored"));
      expect(probe.visible()).toBe(0);
      expect(p.info.textContent).toContain("waiting");
      update(200);
      expect(probe.visible()).toBeGreaterThan(0);
    } finally {
      view.dispose();
      solver.dispose();
    }
  });

  it("GF-145 makes every live-rig restart clear presentation synchronously", () => {
    const p = ports(),
      probe = rendererProbe();
    const view = mountAvatarViewport(p.canvas, p.info, p.yaw, p.pitch, () => probe.renderer);
    const pipeline = createGapPipeline({ filler: { kind: "raw" } });
    const rig = createLiveRig(
      () => createWorldRigSolver(fakePorts()),
      () => createGapPipeline({ filler: { kind: "raw" } }),
      view.clear,
    );
    try {
      const step = pipeline.step(frameOf(pose(), 0, WORLD_SPACE));
      view.update(
        step,
        rig.solver.solve(step, pipeline.lengths),
        pipeline.lengths,
        rig.solver,
        undefined,
        0.5,
      );
      expect(probe.visible()).toBeGreaterThan(0);
      rig.restart();
      expect(probe.visible()).toBe(0);
      expect(p.info.textContent).toContain("No current");
    } finally {
      rig.dispose();
      view.dispose();
    }
  });

  it("GF-146 handles renderer initialization failure without requiring a detector or camera", () => {
    const p = ports();
    const view = mountAvatarViewport(p.canvas, p.info, p.yaw, p.pitch, () => {
      throw new Error("no GPU");
    });
    try {
      expect(p.info.textContent).toContain("overlay/sources still work");
      p.yaw.dispatchEvent(new Event("input"));
      view.clear();
      expect(p.info.textContent).toContain("no GPU");
    } finally {
      view.dispose();
    }
  });

  it("GF-147 orbit changes camera presentation only and disposal removes input/resource ownership", () => {
    const p = ports(),
      probe = rendererProbe();
    const view = mountAvatarViewport(p.canvas, p.info, p.yaw, p.pitch, () => probe.renderer);
    try {
      view.clear();
      const initial = probe.camera!.position.clone();
      p.yaw.value = "45";
      p.yaw.dispatchEvent(new Event("input"));
      expect(probe.camera!.position.distanceTo(initial)).toBeGreaterThan(0.5);
      const children = probe.scene!.children[0]!.children.length;
      expect(children).toBe(17);
      view.dispose();
      view.dispose();
      const draws = probe.draws;
      p.yaw.dispatchEvent(new Event("input"));
      p.canvas.dispatchEvent(new Event("webglcontextrestored"));
      expect(probe.draws).toBe(draws);
      expect(probe.disposed).toBe(1);
    } finally {
      view.dispose();
    }
  });

  it("GF-155 isolates runtime renderer failure from accepted pose/source processing", () => {
    const p = ports(),
      probe = rendererProbe();
    probe.renderer.render = () => {
      throw new Error("GPU runtime failure");
    };
    const view = mountAvatarViewport(p.canvas, p.info, p.yaw, p.pitch, () => probe.renderer);
    try {
      view.clear();
      expect(p.info.textContent).toContain("overlay/sources still work");
      expect(p.info.textContent).toContain("GPU runtime failure");
      p.yaw.dispatchEvent(new Event("input"));
      expect(p.info.textContent).toContain("GPU runtime failure");
    } finally {
      view.dispose();
    }
  });

  it("GF-158 clears on failed restart, releases a failed replacement and isolates resize failures", () => {
    let clears = 0,
      created = 0,
      released = 0,
      failImage = false;
    const rig = createLiveRig(
      () => {
        created += 1;
        return {
          solve: () => new Map(),
          dispose: () => {
            released += 1;
          },
        };
      },
      () => {
        if (failImage) throw new Error("image factory failed");
        return createGapPipeline({ filler: { kind: "raw" } });
      },
      () => {
        clears += 1;
      },
    );
    try {
      const original = rig.solver;
      failImage = true;
      expect(() => rig.restart()).toThrow(/image factory/);
      expect(clears).toBe(1);
      expect(created).toBe(2);
      expect(released).toBe(1);
      expect(rig.solver).toBe(original);
    } finally {
      rig.dispose();
    }
    const p = ports(),
      probe = rendererProbe();
    probe.renderer.setSize = () => {
      throw new Error("resize GPU failure");
    };
    const view = mountAvatarViewport(p.canvas, p.info, p.yaw, p.pitch, () => probe.renderer);
    try {
      view.clear();
      expect(p.info.textContent).toContain("resize GPU failure");
      expect(p.info.textContent).toContain("overlay/sources still work");
    } finally {
      view.dispose();
    }
  });
});
