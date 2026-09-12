import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Engine,
  PluginRegistry,
  createMicrotaskScheduler,
  createTriggerFactory,
  type ProjectHandle,
  type TrackHandle,
} from "@motion5/core";
import { createBrowserClock } from "@motion5/core/adapters/browser-clock";
import { createGsapInterpolator } from "@motion5/core/adapters";
import { fkPlugin } from "@motion5/core/plugins/fk";
import { transformPlugin } from "@motion5/core/plugins/transform";
import { armTracks, initialWalkerProject, WALK_SCROLL_SOURCE } from "./full-body-project";
import { createWalkScrollSource } from "./scroll-source-gsap";
import { SkeletonRig } from "./components/SkeletonRig";
import { InspectorPanel } from "./components/InspectorPanel";

export const App: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [armsAdopted, setArmsAdopted] = useState(false);
  const [handle, setHandle] = useState<ProjectHandle | undefined>(undefined);
  const armHandlesRef = useRef<TrackHandle[]>([]);

  useLayoutEffect(() => {
    // GSAP measures committed DOM in the layout phase, not during render or after paint.
    // Together with the initial root commit, its pin spacer exists before native scroll
    // restoration. The source still defers its snapshot; core load/mount do not publish.
    const plugins = new PluginRegistry();
    plugins.register(transformPlugin);
    plugins.register(fkPlugin);

    const clock = createBrowserClock({
      requestFrame: (cb: FrameRequestCallback) => requestAnimationFrame(cb),
      cancelFrame: (h: number) => cancelAnimationFrame(h),
    });
    let ownedProject: ProjectHandle | undefined;
    let unsubscribe = () => {};
    const release = () => {
      const failures: unknown[] = [];
      for (const dispose of [
        () => unsubscribe(),
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
      if (failures.length > 1)
        throw new AggregateError(failures, "Walking resource cleanup failed.");
    };
    try {
      const scrollSource = createWalkScrollSource();

      // Core never sees the element, the selector, or GSAP. It receives a normalized progress
      // source resolved from the serializable authored key, and nothing else.
      const project = new Engine({
        clock,
        interpolator: createGsapInterpolator(gsap),
        // The shipped scheduler drains on a microtask, so this app no longer flushes the queue by
        // hand from inside the scroll subscriber below. Issue #155.
        scheduler: createMicrotaskScheduler(),
        plugins,
        triggerFactory: createTriggerFactory({
          scroll: ({ trigger }) =>
            trigger.source === WALK_SCROLL_SOURCE ? scrollSource : undefined,
        }),
      }).load(initialWalkerProject);
      ownedProject = project;

      // Mounted from the runtime's own answer rather than from a second copy of the document's
      // ids. This is every node any project can hold rather than the shape this one happens to
      // have, and a track added later is mounted by the commit that added it.
      for (const motionId of project.motionIds())
        for (const trackNode of project.motion(motionId).trackIds) project.mount(trackNode);
      for (const freeNode of project.freeTrackIds()) project.mount(freeNode);

      // The app owns the source, so tapping it for UI and threshold logic keeps core clean. There is
      // deliberately no handle.signal() call here: the injected driver is the only thing that moves
      // this Motion, and signalling it would now throw.
      unsubscribe = scrollSource.subscribe((p: number) => {
        setProgress(p);

        // One structural transaction adds and mounts all four arms at the live Motion's progress.
        // Retain the new handles only after the recipe commits successfully.
        if (p >= 0.5 && armHandlesRef.current.length === 0) {
          armHandlesRef.current = project.edit((tx) => {
            const walk = tx.motion("walk");
            return armTracks.map((track) => walk.addTrack(track));
          });
          setArmsAdopted(true);
        } else if (p < 0.45 && armHandlesRef.current.length > 0) {
          // Remove the whole branch in one commit, with no partially removed graph published.
          project.edit(() => {
            for (const trackHandle of [...armHandlesRef.current].reverse()) {
              trackHandle.remove();
            }
          });
          armHandlesRef.current = [];
          setArmsAdopted(false);
        }
      });

      setHandle(project);
    } catch (error) {
      try {
        release();
      } catch (cleanupError) {
        throw new AggregateError([error, cleanupError], "Walking setup and cleanup failed.");
      }
      throw error;
    }

    return () => {
      // Project disposal owns all remaining tracks; do not rebuild a graph being torn down.
      armHandlesRef.current = [];
      setArmsAdopted(false);
      setHandle(undefined);
      release();
    };
  }, []);

  // The badge counts what is actually mounted rather than restating 9 and 13 as literals: the
  // recipe that adds the arms mounts them too, and the state flip above is what re-renders this.
  const mountedNodes = handle?.mountedNodeIds().length ?? 0;

  return (
    <div id="scroll-scene">
      <div className="stage-wrap">
        <header className="demo-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1>motion5: Dynamic Graph Rig Demo</h1>
              <p>
                Authored Schema v5 · Runtime Schema Transactions · React 19 <code>usePatch</code> ·
                GSAP ScrollTrigger
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
              {armsAdopted
                ? `✨ ARM TRACKS ACTIVE (${mountedNodes} NODES)`
                : `⏳ CORE RIG ONLY (${mountedNodes} NODES)`}
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
          <strong>Architecture: Runtime Schema Transactions</strong>
          <br />
          Start: 9 Nodes (Core)
          <br />
          Scroll &ge; 50% → 13 Nodes (one edit transaction)
          <br />
          Scroll &lt; 45% → Arm handles removed together
        </footer>
      </aside>
    </div>
  );
};
