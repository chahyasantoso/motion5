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
import { ALL_NODE_IDS, ARM, TENTACLE, ikPlaygroundProject, nodeId } from "./ik-playground-project";
import { bindScrollReach, createScrollReach, initialGoals } from "./scroll-reach";

export const App: React.FC = () => {
  const [handle, setHandle] = useState<ProjectHandle | undefined>(undefined);
  const [armFlip, setArmFlip] = useState(false);
  const [tentacleFlip, setTentacleFlip] = useState(false);
  const controllerRef = useRef<ReturnType<typeof createScrollReach> | undefined>(undefined);
  const [pendingGoals, setPendingGoals] = useState(initialGoals);
  const [weight, setWeight] = useState(0);

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

    const controller = createScrollReach(project);
    controllerRef.current = controller;
    setPendingGoals(controller.goals);
    setArmFlip(false);
    setTentacleFlip(false);
    setHandle(project);
    const unbindScroll = bindScrollReach(
      window,
      () => document.documentElement.scrollHeight - window.innerHeight,
      (progress) => setWeight(controller.commit(progress)),
    );

    return () => {
      unbindScroll();
      controllerRef.current = undefined;
      setHandle(undefined);
      project.dispose();
      clock.dispose();
    };
  }, []);

  // Pointer and checkbox gestures stage intent, including at weight 1. Only scroll commits it.
  const moveGoal = (goalTrack: string, x: number, y: number) => {
    const controller = controllerRef.current;
    if (controller) setPendingGoals(controller.moveGoal(goalTrack, x, y));
  };

  const flipArm = (flip: boolean) => {
    controllerRef.current?.flip(ARM.solverTrack, flip);
    setArmFlip(flip);
  };

  const flipTentacle = (flip: boolean) => {
    controllerRef.current?.flip(TENTACLE.solverTrack, flip);
    setTentacleFlip(flip);
  };

  return (
    <main id="scroll-demo">
      <div id="playground">
        <div className="stage-wrap">
          <header className="demo-header">
            <h1>motion5: IK Playground</h1>
            <p>
              Drag a target, then scroll to reach. Scroll back to the top for rest. Targets and
              flips stay pending until the page moves.
            </p>
            <p className="weight-readout">
              <output aria-label="IK blend weight" data-testid="ik-weight">
                {Math.round(weight * 100)}%
              </output>{" "}
              IK weight
              <progress aria-label="Rest to IK reach" max={1} value={weight} />
              <span>0% rest · 100% solved</span>
            </p>
          </header>
          {handle ? (
            <IkStage handle={handle} pendingGoals={pendingGoals} onGoalMove={moveGoal} />
          ) : (
            <p>Loading rig...</p>
          )}
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
    </main>
  );
};
