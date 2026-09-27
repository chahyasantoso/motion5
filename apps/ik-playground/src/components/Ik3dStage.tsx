import React from "react";
import type { ProjectHandle } from "@motion5/core";
import { patchRender, useDomPatch, usePatch } from "@motion5/react";
import { IK3D, IK3D_NODE_ID, IK3D_PERSPECTIVE, IK3D_WORLD } from "../ik3d-playground-project";

/** One colour per frame kind; a `Record` over the closed union, so a new kind cannot go unpainted. */
type FrameKind = "goal" | "pole" | "root";
const FRAME_COLOR: Readonly<Record<FrameKind, string>> = {
  goal: "#fbbf24",
  pole: "#34d399",
  root: "#c084fc",
};
/** One colour per member, keyed by the authored member ids so none can go unpainted. */
const BONE_COLOR: Readonly<Record<(typeof IK3D.memberTracks)[number], string>> = {
  upper: "#c084fc",
  fore: "#818cf8",
  hand: "#38bdf8",
};

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
  readonly kind: FrameKind;
}> = ({ handle, id, kind }) => {
  const bind = useDomPatch<HTMLDivElement>(handle, IK3D_NODE_ID(id));
  return (
    <div
      ref={bind}
      className={`ik3d-marker ik3d-${kind}`}
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
        color: FRAME_COLOR[kind],
      }}
    />
  );
};

/**
 * The solver's published `inspection`, the consumer of the rig's authored `inspect: true`.
 *
 * Read as untyped plugin output, which is what the public surface promises a consumer: the record's
 * shape is documented in the 3D guide rather than exported as a type.
 */
function inspectionLine(values: Readonly<Record<string, unknown>>): string {
  const inspection = values.inspection;
  if (typeof inspection !== "object" || inspection === null) return "no inspection published";
  const { kind, residual, iterations } = inspection as Readonly<Record<string, unknown>>;
  if (typeof kind !== "string" || typeof residual !== "number") return "malformed inspection";
  const passes = typeof iterations === "number" && iterations > 0 ? ` · ${iterations} passes` : "";
  return `${kind} · residual ${residual.toFixed(3)}${passes}`;
}

const SolveReadout: React.FC<{ readonly handle: ProjectHandle }> = ({ handle }) => {
  const decision = patchRender(usePatch(handle, IK3D_NODE_ID(IK3D.solverTrack)));
  let line: string;
  switch (decision.kind) {
    case "render":
      line = inspectionLine(decision.patch.values);
      break;
    case "retain":
      line = "holding the last pose";
      break;
    case "gone":
      line = "solver removed";
      break;
    default: {
      // A consumer has no `unreachable`; the `never` binding is the same compile-time exhaustiveness.
      const unhandled: never = decision;
      throw new Error(`Unhandled render decision: ${JSON.stringify(unhandled)}`);
    }
  }
  return (
    <output className="mono-line dim" aria-label="3D solve inspection" data-testid="ik3d-quality">
      {line}
    </output>
  );
};

export const Ik3dStage: React.FC<{ readonly handle: ProjectHandle }> = ({ handle }) => (
  <section className="solver-card ik3d-stage" aria-label="3D inverse kinematics playground">
    <div className="card-title" style={{ color: FRAME_COLOR.root }}>
      {IK3D.label}
    </div>
    <div className="mono-line dim">transform3d · fk3d · ik3d via public subpaths</div>
    <SolveReadout handle={handle} />
    <div
      className="ik3d-world"
      style={{
        position: "relative",
        height: IK3D_WORLD.height,
        marginTop: "0.5rem",
        perspective: `${IK3D_PERSPECTIVE}px`,
        transformStyle: "preserve-3d",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <FrameMarker handle={handle} id={IK3D.goalTrack} kind="goal" />
      <FrameMarker handle={handle} id={IK3D.poleTrack} kind="pole" />
      {IK3D.memberTracks.map((id, index) => (
        <Bone
          key={id}
          handle={handle}
          id={id}
          length={IK3D.lengths[index]!}
          color={BONE_COLOR[id]}
        />
      ))}
      <FrameMarker handle={handle} id={IK3D.rootTrack} kind="root" />
    </div>
  </section>
);
