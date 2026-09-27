import React, { useLayoutEffect, useRef, useState } from "react";
import type { ProjectHandle } from "@motion5/core";
import { patchRender, useDomPatch } from "@motion5/react";
import { IK3D, IK3D_NODE_ID, IK3D_VIEW } from "../ik3d-playground-project";
import type { GoalControl } from "../goal-control";
import { unprojectPoint, type Point3 } from "../projection";
import { goalNudge, useGoalDrag } from "./goal-drag";
import { BONE_COLOR, FRAME_COLOR, type FrameKind } from "./ik3d-palette";

/** The goal the runtime last published, which is where a drag or a nudge starts from. */
function publishedGoal(handle: ProjectHandle): Point3 | undefined {
  const decision = patchRender(handle.get(IK3D_NODE_ID(IK3D.goalTrack)));
  if (decision.kind !== "render") return undefined;
  const { x, y, z } = decision.patch.values;
  return { x: Number(x ?? 0), y: Number(y ?? 0), z: Number(z ?? 0) };
}

const Bone: React.FC<{
  readonly handle: ProjectHandle;
  readonly id: (typeof IK3D.memberTracks)[number];
  readonly length: number;
}> = ({ handle, id, length }) => {
  // A member's published frame is its tip with its world orientation, which is exactly the pose
  // `useDomPatch` composes, so the bar extends back along local -x from there.
  const bind = useDomPatch<HTMLDivElement>(handle, IK3D_NODE_ID(id));
  const color = BONE_COLOR[id];
  return (
    <div ref={bind} className="ik3d-member">
      <div
        className="ik3d-bone"
        style={{ width: length, background: color, boxShadow: `0 0 12px ${color}` }}
      />
      <div className="ik3d-joint" style={{ background: color }} />
    </div>
  );
};

/** A root or pole frame: posed by the runtime, never grabbed. */
const FrameMarker: React.FC<{
  readonly handle: ProjectHandle;
  readonly id: string;
  readonly kind: Exclude<FrameKind, "goal">;
}> = ({ handle, id, kind }) => {
  const bind = useDomPatch<HTMLDivElement>(handle, IK3D_NODE_ID(id));
  return (
    <div
      ref={bind}
      className={`ik3d-marker ik3d-${kind}`}
      style={{ borderColor: FRAME_COLOR[kind] }}
    />
  );
};

/**
 * The goal, posed by the runtime and dragged by the pointer.
 *
 * A drag keeps the depth the goal was grabbed at and moves it in the screen plane through the shared
 * projection, so the goal stays under the pointer whatever its depth; Shift turns vertical movement
 * into depth. Every write goes through `GoalControl`, and the marker follows because the runtime
 * publishes the new goal, not because this component holds a copy of it.
 */
const GoalHandle: React.FC<{
  readonly handle: ProjectHandle;
  readonly goals: GoalControl;
  readonly worldRef: React.RefObject<HTMLDivElement | null>;
  readonly scale: number;
}> = ({ handle, goals, worldRef, scale }) => {
  const bind = useDomPatch<HTMLDivElement>(handle, IK3D_NODE_ID(IK3D.goalTrack));
  const drag = useGoalDrag<{ readonly z: number; readonly clientY: number }>({
    begin(event) {
      const goal = publishedGoal(handle);
      return goal === undefined ? undefined : { z: goal.z, clientY: event.clientY };
    },
    move(session, event) {
      const rect = worldRef.current?.getBoundingClientRect();
      if (rect === undefined) return;
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
      const local = {
        x: (event.clientX - rect.left) / scale,
        y: (event.clientY - rect.top) / scale,
      };
      const point = unprojectPoint(IK3D_VIEW, local, session.z);
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

export const Ik3dStage: React.FC<{
  readonly handle: ProjectHandle;
  readonly goals: GoalControl;
}> = ({ handle, goals }) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  // The world is authored at `IK3D_VIEW` pixels and scaled to its column, so a phone draws the same
  // rig smaller rather than clipping it, and a drag divides the pointer by the same factor.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (viewport === null) return undefined;
    const update = () => {
      const { width, height } = viewport.getBoundingClientRect();
      const fit = Math.min(width / IK3D_VIEW.width, height / IK3D_VIEW.height);
      if (fit > 0) setScale(fit);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stage-card ik3d-stage" aria-label="3D FABRIK inverse kinematics playground">
      <div className="stage-card-heading">
        <strong>{IK3D.label}</strong>
        <span>four members · one goal · pole · CSS 3D</span>
      </div>
      <div ref={viewportRef} className="ik3d-viewport">
        <div
          ref={worldRef}
          className="ik3d-world"
          style={{
            width: IK3D_VIEW.width,
            height: IK3D_VIEW.height,
            perspective: `${IK3D_VIEW.perspective}px`,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          <FrameMarker handle={handle} id={IK3D.poleTrack} kind="pole" />
          {IK3D.memberTracks.map((id, index) => (
            <Bone key={id} handle={handle} id={id} length={IK3D.lengths[index]!} />
          ))}
          <FrameMarker handle={handle} id={IK3D.rootTrack} kind="root" />
          <GoalHandle handle={handle} goals={goals} worldRef={worldRef} scale={scale} />
        </div>
      </div>
    </section>
  );
};
