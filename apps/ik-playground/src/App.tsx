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
  armSolverTrack,
  frameTrack,
  ikPlaygroundProject,
  nodeId,
  tentacleSolverTrack,
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
      // No leaf in this project animates, so the interpolator compiles zero tweens; it is still a
      // required port at the Engine seam. Every rig movement below is a track replacement.
      interpolator: createGsapInterpolator(gsap),
      scheduler: createMicrotaskScheduler(),
      plugins,
    }).load(ikPlaygroundProject);

    for (const id of ALL_NODE_IDS) project.mount(id);

    // A manual trigger emits nothing on its own, so the first pose comes from explicit seeks.
    // Each seek flushes its seed and every dependant, and the four source nodes cover both rigs.
    for (const id of [
      nodeId(ARM.rootTrack),
      nodeId(ARM.goalTrack),
      nodeId(TENTACLE.rootTrack),
      nodeId(TENTACLE.goalTrack),
    ]) {
      project.seek(id, 0);
    }

    handleRef.current = project;
    setHandle(project);

    return () => {
      handleRef.current = undefined;
      setHandle(undefined);
      project.dispose();
      clock.dispose();
    };
  }, []);

  // Every pointer move is a transactional track replacement followed by one seek: the replacement
  // rebuilds the graph but does not flush, and the seek seeds the goal so the solver and every bone
  // below it re-compose in the same synchronous flush.
  const moveGoal = (goalTrack: string, x: number, y: number) => {
    const project = handleRef.current;
    if (!project) return;
    project.track(nodeId(goalTrack)).replace(frameTrack(goalTrack, x, y));
    project.seek(nodeId(goalTrack), 0);
  };

  const flipArm = (flip: boolean) => {
    setArmFlip(flip);
    const project = handleRef.current;
    if (!project) return;
    project.track(nodeId(ARM.solverTrack)).replace(armSolverTrack(flip));
    project.seek(nodeId(ARM.solverTrack), 0);
  };

  const flipTentacle = (flip: boolean) => {
    setTentacleFlip(flip);
    const project = handleRef.current;
    if (!project) return;
    project.track(nodeId(TENTACLE.solverTrack)).replace(tentacleSolverTrack(flip));
    project.seek(nodeId(TENTACLE.solverTrack), 0);
  };

  return (
    <div id="playground">
      <div className="stage-wrap">
        <header className="demo-header">
          <h1>motion5 — IK Playground</h1>
          <p>
            Authored Schema v5 · ik plugin · analytic + FABRIK dispatch · runtime track replacement
            · React 19 <code>usePatch</code>
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
