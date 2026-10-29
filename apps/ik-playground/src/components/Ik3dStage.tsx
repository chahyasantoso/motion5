import React from "react";
import type { ProjectHandle } from "@motion5/core";
import { useDomPatch } from "@motion5/react";
import { IK3D, IK3D_NODE_ID } from "../ik3d-playground-project";
import type { GoalControl } from "../goal-control";
import { spatialRowSource, type RigSource } from "../rig-sources";
import { GoalHandle, Ik3dFrame, Ik3dWorld } from "./Ik3dFrame";
import { BONE_COLOR, FRAME_COLOR, type FrameKind } from "./ik3d-palette";

const Bone: React.FC<{
  readonly source: RigSource;
  readonly id: (typeof IK3D.memberTracks)[number];
  readonly length: number;
}> = ({ source, id, length }) => {
  // A member's published frame is its tip with its world orientation, which is exactly the pose
  // `useDomPatch` composes, so the bar extends back along local -x from there.
  const bind = useDomPatch<HTMLDivElement>(source, IK3D_NODE_ID(id));
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
  readonly source: RigSource;
  readonly id: string;
  readonly kind: Exclude<FrameKind, "goal">;
}> = ({ source, id, kind }) => {
  const bind = useDomPatch<HTMLDivElement>(source, IK3D_NODE_ID(id));
  return (
    <div
      ref={bind}
      className={`ik3d-marker ik3d-${kind}`}
      style={{ borderColor: FRAME_COLOR[kind] }}
    />
  );
};

export const Ik3dStage: React.FC<{
  readonly handle: ProjectHandle;
  readonly goals: GoalControl;
}> = ({ handle, goals }) => {
  const source = React.useMemo(() => spatialRowSource(handle), [handle]);
  return (
    <section className="stage-card ik3d-stage" aria-label="3D FABRIK inverse kinematics playground">
      <div className="stage-card-heading">
        <strong>{IK3D.label}</strong>
        <span>four members · one goal · pole · CSS 3D</span>
      </div>
      <Ik3dFrame className="ik3d-css">
        {(scale, toBox) => (
          <Ik3dWorld scale={scale}>
            <FrameMarker source={source} id={IK3D.poleTrack} kind="pole" />
            {IK3D.memberTracks.map((id, index) => (
              <Bone key={id} source={source} id={id} length={IK3D.lengths[index]!} />
            ))}
            <FrameMarker source={source} id={IK3D.rootTrack} kind="root" />
            <GoalHandle source={source} goals={goals} scale={scale} toBox={toBox} />
          </Ik3dWorld>
        )}
      </Ik3dFrame>
    </section>
  );
};
