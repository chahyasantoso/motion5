import React from "react";
import type { ProjectHandle } from "@motion5/core";
import { useDomPatch } from "@motion5/react";
import { IK3D, IK3D_NODE_ID } from "../ik3d-playground-project";

interface BoneProps {
  readonly handle: ProjectHandle;
  readonly id: string;
  readonly length: number;
  readonly color: string;
}

const Bone: React.FC<BoneProps> = ({ handle, id, length, color }) => {
  const bind = useDomPatch<HTMLDivElement>(handle, IK3D_NODE_ID(id));
  return (
    <div
      ref={bind}
      className="ik3d-member"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        zIndex: id === IK3D.tipTrack ? 3 : 2,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="ik3d-bone"
        style={{
          position: "absolute",
          top: -4,
          left: 0,
          height: 8,
          borderRadius: 999,
          background: color,
          boxShadow: `0 0 12px ${color}`,
          width: `${length}px`,
          transform: "translateX(-100%)",
        }}
      />
      <div
        className="ik3d-joint"
        style={{
          position: "absolute",
          left: -6,
          top: -6,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: color,
          border: "2px solid #080c14",
        }}
      />
    </div>
  );
};

const FrameMarker: React.FC<{
  readonly handle: ProjectHandle;
  readonly id: string;
  readonly className: string;
}> = ({ handle, id, className }) => {
  const bind = useDomPatch<HTMLDivElement>(handle, IK3D_NODE_ID(id));
  return (
    <div
      ref={bind}
      className={`ik3d-marker ${className}`}
      style={{
        position: "absolute",
        left: -9,
        top: -9,
        width: 18,
        height: 18,
        borderRadius: "50%",
        border: "2px solid currentColor",
        background: "rgba(8, 12, 20, 0.7)",
        transformStyle: "preserve-3d",
        color:
          className === "ik3d-goal" ? "#fbbf24" : className === "ik3d-pole" ? "#34d399" : "#c084fc",
      }}
    />
  );
};

export const Ik3dStage: React.FC<{ readonly handle: ProjectHandle }> = ({ handle }) => (
  <section
    className="ik3d-stage"
    aria-label="3D inverse kinematics playground"
    style={{
      position: "absolute",
      right: 18,
      bottom: 18,
      width: 360,
      height: 300,
      padding: 14,
      border: "1px solid #1e2d45",
      borderRadius: 10,
      background: "rgba(8, 12, 20, 0.72)",
      color: "#f1f5f9",
      pointerEvents: "none",
      zIndex: 4,
    }}
  >
    <div
      className="ik3d-stage-label"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 10,
        fontFamily: "ui-monospace, monospace",
        fontSize: 11,
      }}
    >
      <strong style={{ color: "#c084fc" }}>{IK3D.label}</strong>
      <span style={{ color: "#64748b", fontSize: 9 }}>orbiting goal · pole-guided FABRIK</span>
    </div>
    <div
      className="ik3d-world"
      style={{
        position: "absolute",
        left: 0,
        top: 38,
        right: 0,
        bottom: 0,
        perspective: "720px",
        transformStyle: "preserve-3d",
        overflow: "hidden",
      }}
    >
      <FrameMarker handle={handle} id={IK3D.goalTrack} className="ik3d-goal" />
      <FrameMarker handle={handle} id={IK3D.poleTrack} className="ik3d-pole" />
      {IK3D.memberTracks.map((id, index) => (
        <Bone
          key={id}
          handle={handle}
          id={id}
          length={IK3D.lengths[index]!}
          color={["#c084fc", "#818cf8", "#38bdf8"][index]!}
        />
      ))}
      <FrameMarker handle={handle} id={IK3D.rootTrack} className="ik3d-root" />
    </div>
  </section>
);
