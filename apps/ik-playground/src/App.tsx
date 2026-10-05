import React, { useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createMicrotaskScheduler, type ProjectHandle } from "@motion5/core";
import { createBrowserClock } from "@motion5/core/adapters/browser-clock";
import { createGsapInterpolator, createGsapScrollSource } from "@motion5/core/adapters";
import { Ik3dStage } from "./components/Ik3dStage";
import { IkStage } from "./components/IkStage";
import { SolverPanel } from "./components/SolverPanel";
import { StageBoundary } from "./components/StageBoundary";
import { ThreeStage } from "./components/ThreeStage";
import { TENTACLE, nodeId } from "./ik-playground-project";
import { loadPlayground, type PlaygroundRuntime } from "./playground-runtime";

type PlaygroundTab = "dom" | "three";
const TAB_LABEL: Readonly<Record<PlaygroundTab, string>> = {
  dom: "DOM",
  three: "three.js",
};

function tabPanel(
  tab: PlaygroundTab,
  handle: ProjectHandle,
  goals: PlaygroundRuntime["goals"],
): React.ReactNode {
  switch (tab) {
    case "dom":
      return (
        <div className="dom-stages">
          <IkStage handle={handle} goals={goals} />
          <Ik3dStage handle={handle} goals={goals} />
        </div>
      );
    case "three":
      return (
        <div className="three-stage-wrap">
          <ThreeStage handle={handle} goals={goals} />
        </div>
      );
    default: {
      const unhandled: never = tab;
      throw new Error(`Unhandled playground tab: ${String(unhandled)}`);
    }
  }
}

export const App: React.FC = () => {
  const [handle, setHandle] = useState<ProjectHandle>();
  const [goals, setGoals] = useState<PlaygroundRuntime["goals"]>();
  const [tab, setTab] = useState<PlaygroundTab>("dom");
  const [weight, setWeight] = useState(0);
  const [setupError, setSetupError] = useState<{ readonly error: unknown }>();

  useLayoutEffect(() => {
    const clock = createBrowserClock({
      requestFrame: (callback: FrameRequestCallback) => requestAnimationFrame(callback),
      cancelFrame: (id: number) => cancelAnimationFrame(id),
    });
    let cancelled = false;
    let released = false;
    let owned: PlaygroundRuntime | undefined;
    let unsubscribeWeight = () => {};
    const release = () => {
      if (released) return;
      released = true;
      const failures: unknown[] = [];
      for (const dispose of [
        () => unsubscribeWeight(),
        () => owned?.project.dispose(),
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
    const reportFailure = (error: unknown) => {
      try {
        release();
      } catch (cleanupError) {
        error = new AggregateError([error, cleanupError], "IK setup and cleanup failed.");
      }
      // Promise callbacks cannot reach a React error boundary by throwing. Store even undefined
      // as a tagged failure and throw during render instead.
      setSetupError({ error });
    };

    try {
      gsap.registerPlugin(ScrollTrigger);
      void loadPlayground({
        clock,
        interpolator: createGsapInterpolator(gsap),
        scheduler: createMicrotaskScheduler(),
        scroll: createGsapScrollSource(ScrollTrigger, {
          trigger: "#scroll-demo",
          start: "top top",
          end: "bottom bottom",
        }),
      })
        .then(
          (runtime) => {
            if (cancelled) {
              runtime.project.dispose();
              return;
            }
            owned = runtime;
            setHandle(runtime.project);
            setGoals(runtime.goals);
            setWeight(0);
            unsubscribeWeight = runtime.project.subscribeNode(
              nodeId(TENTACLE.memberTracks[0]!),
              (patch) => {
                if (patch.status === "ready") setWeight(patch.sourceProgress);
              },
            );
          },
          (error: unknown) => {
            if (!cancelled) reportFailure(error);
          },
        )
        .catch((error: unknown) => {
          if (!cancelled) reportFailure(error);
          else console.error("IK cleanup after cancellation failed.", error);
        });
    } catch (error) {
      try {
        release();
      } catch (cleanupError) {
        throw new AggregateError([error, cleanupError], "IK setup and cleanup failed.");
      }
      throw error;
    }

    return () => {
      cancelled = true;
      setHandle(undefined);
      setGoals(undefined);
      release();
    };
  }, []);

  if (setupError !== undefined) throw setupError.error;

  return (
    <main id="scroll-demo">
      <div id="playground">
        <section className="playground-main">
          <header className="demo-header">
            <h1>motion5: IK Playground</h1>
            <p>
              Scroll blends rest → solved. Dragging moves the chain immediately at the current
              blend.
            </p>
            <p className="weight-readout">
              <output aria-label="IK blend weight" data-testid="ik-weight">
                {Math.round(weight * 100)}%
              </output>
              <span>rest → solved</span>
              <progress aria-label="Rest to solved blend" max={1} value={weight} />
            </p>
          </header>
          <nav className="tabs" role="tablist" aria-label="IK renderer">
            {(Object.keys(TAB_LABEL) as PlaygroundTab[]).map((key) => (
              <button
                key={key}
                id={`tab-${key}`}
                role="tab"
                type="button"
                aria-selected={tab === key}
                aria-controls={`panel-${key}`}
                onClick={() => setTab(key)}
              >
                {TAB_LABEL[key]}
              </button>
            ))}
          </nav>
          <div
            id={`panel-${tab}`}
            className="tab-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
          >
            {handle && goals ? (
              <StageBoundary key={tab}>{tabPanel(tab, handle, goals)}</StageBoundary>
            ) : (
              <p>Loading rig…</p>
            )}
          </div>
        </section>
        <aside className="sidebar">
          {handle && goals ? <SolverPanel handle={handle} goals={goals} /> : null}
        </aside>
      </div>
    </main>
  );
};
