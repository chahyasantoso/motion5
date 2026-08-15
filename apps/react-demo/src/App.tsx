import React, { useEffect, useMemo, useRef, useState } from "react";
import { Engine, PluginRegistry, type ProjectHandle, type PluginDefinition } from "@motion5/core";
import { createBrowserClock } from "@motion5/core/adapters/browser-clock";
import { createScrollTriggerPort } from "@motion5/core/adapters/scroll-trigger";
import { fkPlugin } from "@motion5/core/plugins/fk";
import { transformPlugin } from "@motion5/core/plugins/transform";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/ports/fakes";
import { initialWalkerProject, armTracks } from "./full-body-project";
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

const ARM_NODES = ["walk/armL_upper", "walk/armL_lower", "walk/armR_upper", "walk/armR_lower"];

export const App: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [armsAdopted, setArmsAdopted] = useState(false);
  const ownerRef = useRef({});
  const armsAdoptedRef = useRef(false);

  const { handle, clock, scheduler } = useMemo(() => {
    const plugins = new PluginRegistry();
    plugins.register(transformPlugin);
    plugins.register(fkPlugin);

    const clock = createBrowserClock({
      requestFrame: (cb: FrameRequestCallback) => requestAnimationFrame(cb),
      cancelFrame: (h: number) => cancelAnimationFrame(h),
    });

    const scheduler = createFakeScheduler();

    const engine = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
      plugins,
    });

    // Start with 9-node core skeleton (no arms)
    const handle = engine.load(initialWalkerProject);

    for (const nodeId of CORE_NODES) {
      handle.mount(nodeId);
    }

    return { handle, clock, scheduler };
  }, []);

  useEffect(() => {
    const scrollSource = createGsapScrollSource({
      trigger: "#scroll-scene",
      start: "top top",
      end: "+=2500",
      pin: true,
    });

    const port = createScrollTriggerPort(scrollSource);

    const unsubscribe = port.subscribe((p: number) => {
      setProgress(p);

      // Dynamic Graph Adoption: Adopt arm tracks when scrolling past 50%
      if (p >= 0.5 && !armsAdoptedRef.current) {
        for (const track of armTracks) {
          handle.adopt(track, ownerRef.current, { motionId: "walk" });
        }
        armsAdoptedRef.current = true;
        setArmsAdopted(true);
      } else if (p < 0.45 && armsAdoptedRef.current) {
        // Destroy adopted tracks when scrolling back up
        // MUST destroy in reverse topological order (children before parents)
        // to prevent graph validation errors in intermediate states.
        for (const nodeId of [...ARM_NODES].reverse()) {
          handle.destroyAdopted(nodeId, ownerRef.current);
        }
        armsAdoptedRef.current = false;
        setArmsAdopted(false);
      }

      handle.signal("walk", { type: "scroll", progress: p });
      scheduler.flush();
    });

    handle.signal("walk", { type: "scroll", progress: 0 });
    scheduler.flush();

    return () => {
      unsubscribe();
      port.dispose();
    };
  }, [handle, scheduler]);

  useEffect(() => {
    return () => {
      handle.dispose();
      clock.dispose();
    };
  }, [handle, clock]);

  return (
    <div id="scroll-scene">
      <div className="stage-wrap">
        <header className="demo-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1>motion5 — Dynamic Graph Rig Demo</h1>
              <p>
                Authored Schema v5 · Dynamic Motion Track Adoption · React 19 <code>usePatch</code>{" "}
                · GSAP ScrollTrigger
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
                ? "✨ ARMS ADOPTED INTO MOTION (13 NODES)"
                : "⏳ CORE RIG ONLY (9 NODES)"}
            </div>
          </div>
        </header>
        <SkeletonRig handle={handle} />
      </div>

      <aside className="sidebar">
        <div className="sidebar-top">
          <div>
            <h2>Scroll Progress &amp; Graph Lifecycle</h2>
            <div className="progress-track" style={{ position: "relative" }}>
              <div className="progress-fill" style={{ width: `${(progress * 100).toFixed(2)}%` }} />
              {/* Adoption Threshold Indicator at 50% */}
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
                title="Dynamic Adoption Point (50%)"
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
                ? "▶ [0.50+] Arm tracks adopted & snapped to motion"
                : "▷ [0.00-0.49] Scroll past 50% to adopt arms"}
            </div>
          </div>
          <InspectorPanel handle={handle} />
        </div>

        <footer className="sidebar-footer">
          <strong>Architecture: Dynamic Graph</strong>
          <br />
          Start: 9 Nodes (Core) → <code>handle.adopt(..., &apos;walk&apos;)</code>
          <br />
          Scroll &ge; 50% → 13 Nodes (Arms Snapped &amp; FK Computed)
          <br />
          Scroll &lt; 45% → <code>handle.destroyAdopted()</code> (Pruned)
        </footer>
      </aside>
    </div>
  );
};
