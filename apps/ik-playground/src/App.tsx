import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Engine,
  PluginRegistry,
  createMicrotaskScheduler,
  type ProjectHandle,
} from "@motion5/core";
import { createBrowserClock } from "@motion5/core/adapters/browser-clock";
import { createGsapInterpolator } from "@motion5/core/adapters";
import { fkPlugin } from "@motion5/core/plugins/fk";
import { ikPlugin } from "@motion5/core/plugins/ik";
import { transformPlugin } from "@motion5/core/plugins/transform";
import { IkStage } from "./components/IkStage";
import { SolverPanel } from "./components/SolverPanel";
import {
  ALL_NODE_IDS,
  ARM,
  TENTACLE,
  ikPlaygroundProject,
  nodeId,
} from "./ik-playground-project";

export const App: React.FC = () => {
  const [handle, setHandle] = useState<ProjectHandle | undefined>(undefined);
  const [armFlip, setArmFlip] = useState(false);
  const [tentacleFlip, setTentacleFlip] = useState(false);
  const handleRef = useRef<ProjectHandle | undefined>(undefined);

  useEffect(() => {
    const plugins = new PluginRegistry();
    plugins.register(transformPlugin);
    plugins.register(fkPlugin);
    plugins.register(ikPlugin);

    const clock = createBrowserClock({
      requestFrame: (cb: FrameRequestCallback) => requestAnimationFrame(cb),
      cancelFrame: (h: number) => cancelAnimationFrame(h),
    });

    const project = new Engine({
      clock,
      // Static leaves compile zero tweens. Gestures below use value-tier writes, not graph edits.
      interpolator: createGsapInterpolator(gsap),
      scheduler: createMicrotaskScheduler(),
      plugins,
    }).load(ikPlaygroundProject);

    for (const id of ALL_NODE_IDS) project.mount(id);

    // Load and mount do not publish. Seed the initial pose once; later value edits flush themselves.
    for (const id of [
      nodeId(ARM.rootTrack),
      nodeId(ARM.goalTrack),
      nodeId(TENTACLE.rootTrack),
      nodeId(TENTACLE.goalTrack),
    ]) {
      project.seek(id, 0);
    }

    handleRef.current = project;
    setArmFlip(false);
    setTentacleFlip(false);
    setHandle(project);

    return () => {
      handleRef.current = undefined;
      setHandle(undefined);
      project.dispose();
      clock.dispose();
    };
  }, []);

  // Both coordinates move in one value write and one flush, preserving rotation and bindings.
  const moveGoal = (goalTrack: string, x: number, y: number) => {
    const project = handleRef.current;
    if (!project) return;
    project.track(nodeId(goalTrack)).setValues({ x, y });
  };

  const flipArm = (flip: boolean) => {
    const project = handleRef.current;
    if (!project) return;
    project.track(nodeId(ARM.solverTrack)).setKeyframe("ik", "flip", flip);
    setArmFlip(flip);
  };

  const flipTentacle = (flip: boolean) => {
    const project = handleRef.current;
    if (!project) return;
    project.track(nodeId(TENTACLE.solverTrack)).setKeyframe("ik", "flip", flip);
    setTentacleFlip(flip);
  };

  return (
    <div id="playground">
      <div className="stage-wrap">
        <header className="demo-header">
          <h1>motion5: IK Playground</h1>
          <p>
            Authored Schema v5 · ik plugin · analytic + FABRIK dispatch · runtime value authoring ·
            React 19 <code>usePatch</code>
          </p>
        </header>
        {handle ? <IkStage handle={handle} onGoalMove={moveGoal} /> : null}
      </div>
      <aside className="sidebar">
        {handle ? (
          <SolverPanel
            handle={handle}
            armFlip={armFlip}
            tentacleFlip={tentacleFlip}
            onArmFlip={flipArm}
            onTentacleFlip={flipTentacle}
          />
        ) : null}
      </aside>
    </div>
  );
};
