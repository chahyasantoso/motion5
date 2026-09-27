import React, { useLayoutEffect, useRef, useState } from "react";
import type { ProjectHandle } from "@motion5/core";
import { patchRender, useDomPatch } from "@motion5/react";
import { IK3D, IK3D_FRAME, IK3D_NODE_ID, IK3D_VIEW } from "../ik3d-playground-project";
import type { GoalControl } from "../goal-control";
import { unprojectPoint, type Point2, type Point3 } from "../projection";
import { goalNudge, useGoalDrag } from "./goal-drag";
import { FRAME_COLOR } from "./ik3d-palette";

/** The goal the runtime last published, which is where a drag or a nudge starts from. */
function publishedGoal(handle: ProjectHandle): Point3 | undefined {
  const decision = patchRender(handle.get(IK3D_NODE_ID(IK3D.goalTrack)));
  if (decision.kind !== "render") return undefined;
  const { x, y, z } = decision.patch.values;
  return { x: Number(x ?? 0), y: Number(y ?? 0), z: Number(z ?? 0) };
}

/** Maps a pointer to the box's own unscaled pixels, the space `unprojectPoint` reads. */
type ToBox = (clientX: number, clientY: number) => Point2 | undefined;

/**
 * `IK3D_FRAME`, fitted into its viewport at one uniform scale and centred.
 *
 * Every 3D stage draws inside this box: the CSS world, the three.js canvas and the goal handle
 * layered over it. They all read the same scale and the same frame, so a phone draws the rig
 * smaller rather than clipping it, and a pointer maps to the same box pixel in every tab.
 */
export const Ik3dFrame: React.FC<{
  readonly className: string;
  readonly children: (scale: number, toBox: ToBox) => React.ReactNode;
}> = ({ className, children }) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (viewport === null) return undefined;
    const update = () => {
      const { width, height } = viewport.getBoundingClientRect();
      const fit = Math.min(width / IK3D_FRAME.width, height / IK3D_FRAME.height);
      if (fit > 0) setScale(fit);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const toBox: ToBox = (clientX, clientY) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (rect === undefined || scale <= 0) return undefined;
    return {
      x: IK3D_FRAME.x + (clientX - rect.left) / scale,
      y: IK3D_FRAME.y + (clientY - rect.top) / scale,
    };
  };

  return (
    <div ref={viewportRef} className={`ik3d-viewport ${className}`}>
      <div
        ref={frameRef}
        className="ik3d-frame"
        style={{ width: IK3D_FRAME.width * scale, height: IK3D_FRAME.height * scale }}
      >
        {scale > 0 ? children(scale, toBox) : null}
      </div>
    </div>
  );
};

/**
 * The authored box as a CSS 3D world, placed in its frame: `IK3D_VIEW` pixels with the one
 * perspective, scaled from the frame's corner. Children are posed in world pixels by the runtime.
 */
export const Ik3dWorld: React.FC<{
  readonly scale: number;
  readonly children: React.ReactNode;
}> = ({ scale, children }) => (
  <div
    className="ik3d-world"
    style={{
      width: IK3D_VIEW.width,
      height: IK3D_VIEW.height,
      perspective: `${IK3D_VIEW.perspective}px`,
      transform: `scale(${scale}) translate(${-IK3D_FRAME.x}px, ${-IK3D_FRAME.y}px)`,
    }}
  >
    {children}
  </div>
);

/**
 * The goal, posed by the runtime and dragged by the pointer; the same control in every 3D tab.
 *
 * A drag keeps the depth the goal was grabbed at and moves it in the screen plane through the shared
 * projection, so the goal stays under the pointer whatever its depth; Shift turns vertical movement
 * into depth. Every write goes through `GoalControl`, and the marker follows because the runtime
 * publishes the new goal, not because this component holds a copy of it. It lives in a CSS 3D world
 * even over the three.js canvas, which projects identically (`threeCamera`), so touch, focus and
 * keyboard behave the same in both tabs.
 */
export const GoalHandle: React.FC<{
  readonly handle: ProjectHandle;
  readonly goals: GoalControl;
  readonly scale: number;
  readonly toBox: ToBox;
}> = ({ handle, goals, scale, toBox }) => {
  const bind = useDomPatch<HTMLDivElement>(handle, IK3D_NODE_ID(IK3D.goalTrack));
  const drag = useGoalDrag<{ readonly z: number; readonly clientY: number }>({
    begin(event) {
      const goal = publishedGoal(handle);
      return goal === undefined ? undefined : { z: goal.z, clientY: event.clientY };
    },
    move(session, event) {
      if (event.shiftKey) {
        const goal = publishedGoal(handle);
        if (goal === undefined) return;
        goals.move({
          rig: "spatial",
          ...goal,
          z: session.z + (session.clientY - event.clientY) / scale,
        });
        return;
      }
      const local = toBox(event.clientX, event.clientY);
      const point = local === undefined ? undefined : unprojectPoint(IK3D_VIEW, local, session.z);
      if (point !== undefined) goals.move({ rig: "spatial", ...point });
    },
  });
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const nudge = goalNudge(event);
    const goal = publishedGoal(handle);
    if (nudge === undefined || goal === undefined) return;
    event.preventDefault();
    goals.move({
      rig: "spatial",
      x: goal.x + nudge.dx,
      y: goal.y + nudge.dy,
      z: goal.z + nudge.dz,
    });
  };
  return (
    <div
      ref={bind}
      className="ik3d-marker ik3d-goal"
      data-testid="ik3d-goal-handle"
      role="button"
      tabIndex={0}
      aria-label="Move the FABRIK 3D goal: drag, Shift+drag for depth, arrows and PageUp/PageDown"
      style={{ borderColor: FRAME_COLOR.goal }}
      onKeyDown={onKeyDown}
      {...drag}
    >
      <span className="ik3d-goal-dot" aria-hidden="true" />
    </div>
  );
};
