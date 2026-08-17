import React, { useEffect, useRef, useState } from "react";
import {
  Engine,
  PluginRegistry,
  createTriggerFactory,
  type ProjectHandle,
  type TrackHandle,
} from "@motion5/core";
import { createBrowserClock } from "@motion5/core/adapters/browser-clock";
import { fkPlugin } from "@motion5/core/plugins/fk";
import { transformPlugin } from "@motion5/core/plugins/transform";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/ports/fakes";
import { armTracks, initialWalkerProject, WALK_SCROLL_SOURCE } from "./full-body-project";
import { createGsapScrollSource } from "./scroll-source-gsap";
import { SkeletonRig } from "./components/SkeletonRig";
import { InspectorPanel } from "./components/InspectorPanel";

const CORE_NODES = [
  "walk/pelvis",
  "walk/chest",
  "walk/head",
  "walk/legL_thigh",
  "walk/legL_shin",
  "walk/legL_foot",
  "walk/legR_thigh",
  "walk/legR_shin",
  "walk/legR_foot",
];

export const App: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [armsAdopted, setArmsAdopted] = useState(false);
  const [handle, setHandle] = useState<ProjectHandle | undefined>(undefined);
  const armHandlesRef = useRef<TrackHandle[]>([]);

  useEffect(() => {
    // engine.load() runs here, not in a render-phase useMemo, because this app owns the scroll
    // source and GSAP needs #scroll-scene committed to the DOM before ScrollTrigger.create().
    const plugins = new PluginRegistry();
    plugins.register(transformPlugin);
    plugins.register(fkPlugin);

    const clock = createBrowserClock({
      requestFrame: (cb: FrameRequestCallback) => requestAnimationFrame(cb),
      cancelFrame: (h: number) => cancelAnimationFrame(h),
    });
    const scheduler = createFakeScheduler();
    const scrollSource = createGsapScrollSource({
      trigger: "#scroll-scene",
      start: "top top",
      end: "+=2500",
      pin: true,
    });

    // Core never sees the element, the selector, or GSAP. It receives a normalized progress
    // source resolved from the serializable authored key, and nothing else.
    const project = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
      plugins,
      triggerFactory: createTriggerFactory({
        scroll: ({ trigger }) => (trigger.source === WALK_SCROLL_SOURCE ? scrollSource : undefined),
      }),
    }).load(initialWalkerProject);

    for (const nodeId of CORE_NODES) project.mount(nodeId);

    // The app owns the source, so tapping it for UI and threshold logic keeps core clean. There is
    // deliberately no handle.signal() call here: the injected driver is the only thing that moves
    // this Motion, and signalling it would now throw.
    const unsubscribe = scrollSource.subscribe((p: number) => {
      setProgress(p);

      // Add arm tracks when scrolling past 50%.
      if (p >= 0.5 && armHandlesRef.current.length === 0) {
        armHandlesRef.current = armTracks.map((track) =>
          project.addTrack(track, { motionId: "walk" }),
        );
        setArmsAdopted(true);
      } else if (p < 0.45 && armHandlesRef.current.length > 0) {
        // Remove children before parents so every intermediate graph stays valid.
        for (const trackHandle of [...armHandlesRef.current].reverse()) {
          trackHandle.remove();
        }
        armHandlesRef.current = [];
        setArmsAdopted(false);
      }

      scheduler.flush();
    });

    setHandle(project);

    return () => {
      unsubscribe();
      for (const trackHandle of [...armHandlesRef.current].reverse()) {
        trackHandle.remove();
      }
      armHandlesRef.current = [];
      setHandle(undefined);
      project.dispose();
      clock.dispose();
    };
  }, []);

  return (
    <div id="scroll-scene">
      <div className="stage-wrap">
        <header className="demo-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1>motion5 — Dynamic Graph Rig Demo</h1>
              <p>
                Authored Schema v5 · Runtime Track Handles · React 19 <code>usePatch</code> · GSAP
                ScrollTrigger
              </p>
            </div>
            <div
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: "700",
                fontFamily: "monospace",
                background: armsAdopted ? "rgba(56, 189, 248, 0.2)" : "rgba(100, 116, 139, 0.2)",
                border: `1px solid ${armsAdopted ? "#38bdf8" : "#475569"}`,
                color: armsAdopted ? "#38bdf8" : "#94a3b8",
                transition: "all 0.3s ease",
              }}
            >
              {armsAdopted ? "✨ ARM TRACKS ACTIVE (13 NODES)" : "⏳ CORE RIG ONLY (9 NODES)"}
            </div>
          </div>
        </header>
        {handle ? <SkeletonRig handle={handle} /> : null}
      </div>

      <aside className="sidebar">
        <div className="sidebar-top">
          <div>
            <h2>Scroll Progress &amp; Graph Lifecycle</h2>
            <div className="progress-track" style={{ position: "relative" }}>
              <div className="progress-fill" style={{ width: `${(progress * 100).toFixed(2)}%` }} />
              {/* Arm insertion threshold at 50% */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "-2px",
                  bottom: "-2px",
                  width: "2px",
                  background: "#f43f5e",
                  zIndex: 2,
                }}
                title="Dynamic Track Insertion Point (50%)"
              />
            </div>
            <div className="progress-label">
              <span>PROGRESS</span>
              <span>{progress.toFixed(3)}</span>
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: progress >= 0.5 ? "#38bdf8" : "#64748b",
                marginTop: "0.25rem",
                fontFamily: "monospace",
              }}
            >
              {progress >= 0.5
                ? "▶ [0.50+] Arm tracks active"
                : "▷ [0.00-0.49] Scroll past 50% to add arms"}
            </div>
          </div>
          {handle ? <InspectorPanel handle={handle} /> : null}
        </div>

        <footer className="sidebar-footer">
          <strong>Architecture: Unified Track Store</strong>
          <br />
          Start: 9 Nodes (Core)
          <br />
          Scroll &ge; 50% → 13 Nodes (Arm TrackHandles added)
          <br />
          Scroll &lt; 45% → Arm handles removed
        </footer>
      </aside>
    </div>
  );
};
