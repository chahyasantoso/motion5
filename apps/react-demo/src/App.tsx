import React, { useEffect, useMemo, useState } from "react";
import { Engine, PluginRegistry, type ProjectHandle, type PluginDefinition } from "@motion5/core";
import { createBrowserClock } from "@motion5/core/adapters/browser-clock";
import { createScrollTriggerPort } from "@motion5/core/adapters/scroll-trigger";
import { fkPlugin } from "@motion5/core/plugins/fk";
import { transformPlugin } from "@motion5/core/plugins/transform";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/ports/fakes";
import { fullBodyWalkerProject } from "./full-body-project";
import { createGsapScrollSource } from "./scroll-source-gsap";
import { SkeletonRig } from "./components/SkeletonRig";
import { InspectorPanel } from "./components/InspectorPanel";

const ALL_NODES = [
  "walk/pelvis",
  "walk/chest",
  "walk/head",
  "walk/armL_upper",
  "walk/armL_lower",
  "walk/armR_upper",
  "walk/armR_lower",
  "walk/legL_thigh",
  "walk/legL_shin",
  "walk/legL_foot",
  "walk/legR_thigh",
  "walk/legR_shin",
  "walk/legR_foot",
];

export const App: React.FC = () => {
  const [progress, setProgress] = useState(0);

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

    // Runs validateV5 against authored fullBodyWalkerProject schema
    const handle = engine.load(fullBodyWalkerProject);

    for (const nodeId of ALL_NODES) {
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
          <h1>motion5 — React 12-Node Full-Body Skeleton Demo</h1>
          <p>
            Authored Schema v5 · 12-Node FK Hierarchy · React 19 <code>usePatch</code> · GSAP
            ScrollTrigger
          </p>
        </header>
        <SkeletonRig handle={handle} />
      </div>

      <aside className="sidebar">
        <div className="sidebar-top">
          <div>
            <h2>Scroll Progress</h2>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${(progress * 100).toFixed(2)}%` }} />
            </div>
            <div className="progress-label">
              <span>PROGRESS</span>
              <span>{progress.toFixed(3)}</span>
            </div>
          </div>
          <InspectorPanel handle={handle} />
        </div>

        <footer className="sidebar-footer">
          <strong>Architecture</strong>
          <br />
          Authored Schema v5 → <code>Engine.load()</code>
          <br />
          GSAP Scroll → <code>ScrollSource</code>
          <br />→ <code>createScrollTriggerPort()</code>
          <br />→ <code>handle.signal("walk")</code>
          <br />→ <code>@motion5/react usePatch()</code>
        </footer>
      </aside>
    </div>
  );
};
