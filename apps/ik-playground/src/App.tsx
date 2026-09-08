import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Engine,
  PluginRegistry,
  createMicrotaskScheduler,
  type ProjectHandle,
} from "@motion5/core";
import { createBrowserClock } from "@motion5/core/adapters/browser-clock";
import {
  createGsapInterpolator,
  createGsapScrollSource,
  createTriggerFactory,
} from "@motion5/core/adapters";
import { fkPlugin } from "@motion5/core/plugins/fk";
import { ikPlugin } from "@motion5/core/plugins/ik";
import { transformPlugin } from "@motion5/core/plugins/transform";
import { IkStage } from "./components/IkStage";
import { SolverPanel } from "./components/SolverPanel";
import {
  ALL_NODE_IDS,
  ARM,
  TENTACLE,
  SCROLL_SOURCE,
  ikPlaygroundProject,
  nodeId,
} from "./ik-playground-project";
import { bindScrollReach, createScrollReach, initialGoals } from "./scroll-reach";

export const App: React.FC = () => {
  const [handle, setHandle] = useState<ProjectHandle | undefined>(undefined);
  const [armFlip, setArmFlip] = useState(false);
  const [tentacleFlip, setTentacleFlip] = useState(false);
  const controllerRef = useRef<ReturnType<typeof createScrollReach> | undefined>(undefined);
  const [pendingGoals, setPendingGoals] = useState(initialGoals);
  const [weight, setWeight] = useState(0);

  useLayoutEffect(() => {
    const plugins = new PluginRegistry();
    plugins.register(transformPlugin);
    plugins.register(fkPlugin);
    plugins.register(ikPlugin);

    const clock = createBrowserClock({
      requestFrame: (cb: FrameRequestCallback) => requestAnimationFrame(cb),
      cancelFrame: (h: number) => cancelAnimationFrame(h),
    });

    let ownedProject: ProjectHandle | undefined;
    let unsubscribeWeight = () => {};
    const release = () => {
      const failures: unknown[] = [];
      for (const dispose of [
        () => unsubscribeWeight(),
        () => ownedProject?.dispose(),
        () => clock.dispose(),
      ]) {
        try {
          dispose();
        } catch (error) {
          failures.push(error);
        }
      }
      if (failures.length === 1) throw failures[0];
      if (failures.length > 1) throw new AggregateError(failures, "IK resource cleanup failed.");
    };
    try {
      gsap.registerPlugin(ScrollTrigger);
      const scroll = createGsapScrollSource(ScrollTrigger, {
        trigger: "#scroll-demo",
        start: "top top",
        end: "bottom bottom",
      });
      // The adapter defers initial delivery until load, mount and this wiring have completed.
      let controller: ReturnType<typeof createScrollReach>;
      const project = new Engine({
        clock,
        interpolator: createGsapInterpolator(gsap),
        scheduler: createMicrotaskScheduler(),
        plugins,
        triggerFactory: createTriggerFactory({
          scroll: ({ trigger }) =>
            trigger.source === SCROLL_SOURCE
              ? bindScrollReach(scroll, () => controller.commit())
              : undefined,
        }),
      }).load(ikPlaygroundProject);
      ownedProject = project;
      controller = createScrollReach(project);
      for (const id of ALL_NODE_IDS) project.mount(id);
      controllerRef.current = controller;
      setPendingGoals(controller.goals);
      setArmFlip(false);
      setTentacleFlip(false);
      setHandle(project);
      setWeight(0);
      unsubscribeWeight = project.subscribe(nodeId(ARM.memberTracks[0]!), (patch) => {
        if (patch.status === "ready") setWeight(patch.sourceProgress);
      });
    } catch (error) {
      controllerRef.current = undefined;
      try {
        release();
      } catch (cleanupError) {
        throw new AggregateError([error, cleanupError], "IK setup and cleanup failed.");
      }
      throw error;
    }

    return () => {
      controllerRef.current = undefined;
      setHandle(undefined);
      // Project disposal owns the driver subscription and therefore the GSAP instance.
      release();
    };
  }, []);

  // Gestures stage intent even at weight 1. Only qualifying source events commit it;
  // movement outside the clipped trigger range need not produce an event.
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
              flips stay pending until ScrollTrigger emits a qualifying progress change. Movement
              beyond a clamped endpoint does not apply them.
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
