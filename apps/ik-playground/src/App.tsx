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
import { LOADING_VIEW, startPlaygroundSession, type PlaygroundView } from "./playground-session";
import { unreachable } from "./unreachable";

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
    default:
      return unreachable(tab, "playground tab");
  }
}

/** What one view shows. A failure is thrown during render, where an error boundary can catch it. */
function presentation(view: PlaygroundView): {
  readonly runtime: PlaygroundRuntime | undefined;
  readonly weight: number;
} {
  switch (view.kind) {
    case "loading":
      return { runtime: undefined, weight: 0 };
    case "ready":
      return { runtime: view.runtime, weight: view.weight };
    case "failed":
      throw view.error;
    default:
      return unreachable(view, "playground view");
  }
}

export const App: React.FC = () => {
  const [view, setView] = useState<PlaygroundView>(LOADING_VIEW);
  const [tab, setTab] = useState<PlaygroundTab>("dom");

  useLayoutEffect(() => {
    const clock = createBrowserClock({
      requestFrame: (callback: FrameRequestCallback) => requestAnimationFrame(callback),
      cancelFrame: (id: number) => cancelAnimationFrame(id),
    });
    const stop = startPlaygroundSession({
      load: () => {
        gsap.registerPlugin(ScrollTrigger);
        return loadPlayground({
          clock,
          interpolator: createGsapInterpolator(gsap),
          scheduler: createMicrotaskScheduler(),
          scroll: createGsapScrollSource(ScrollTrigger, {
            trigger: "#scroll-demo",
            start: "top top",
            end: "bottom bottom",
          }),
        });
      },
      releaseHost: () => clock.dispose(),
      weightNode: nodeId(TENTACLE.memberTracks[0]!),
      onView: setView,
      onOrphanFailure: (error) => console.error("IK cleanup after cancellation failed.", error),
    });
    return () => {
      setView(LOADING_VIEW);
      stop();
    };
  }, []);

  const { runtime, weight } = presentation(view);

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
            {runtime ? (
              <StageBoundary key={tab}>
                {tabPanel(tab, runtime.project, runtime.goals)}
              </StageBoundary>
            ) : (
              <p>Loading rig…</p>
            )}
          </div>
        </section>
        <aside className="sidebar">
          {runtime ? <SolverPanel handle={runtime.project} goals={runtime.goals} /> : null}
        </aside>
      </div>
    </main>
  );
};
