import React from "react";
import type { ProjectHandle } from "@motion5/core";
import {
  patchRender,
  useDerivedDomPatch,
  type PatchDerivation,
  type PatchValues,
} from "@motion5/react";
import { STAGE_2D, TENTACLE, nodeId } from "../ik-playground-project";
import type { GoalControl } from "../goal-control";
import { goalNudge, useGoalDrag } from "./goal-drag";

function point(values: PatchValues): { readonly x: number; readonly y: number } {
  return { x: Number(values.x ?? 0), y: Number(values.y ?? 0) };
}

const endpoints: PatchDerivation = ([parent = {}, child = {}]) => {
  const from = point(parent);
  const to = point(child);
  return { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
};

const position: PatchDerivation = ([values = {}]) => point(values);

/** One line between two published frames; each line owns its binding, so an absent one costs nothing. */
const BoneLine: React.FC<{
  readonly handle: ProjectHandle;
  readonly parentId: string;
  readonly childId: string;
  readonly stroke: string;
  readonly width: number;
  readonly opacity?: number;
}> = ({ handle, parentId, childId, stroke, width, opacity }) => {
  const bind = useDerivedDomPatch<SVGLineElement>(handle, [parentId, childId], endpoints);
  return (
    <line ref={bind} stroke={stroke} strokeWidth={width} strokeLinecap="round" opacity={opacity} />
  );
};

const Bone: React.FC<{
  readonly handle: ProjectHandle;
  readonly parentId: string;
  readonly childId: string;
  readonly width: number;
  readonly color: string;
  readonly innerColor?: string;
}> = ({ handle, parentId, childId, width, color, innerColor }) => (
  <g>
    <BoneLine handle={handle} parentId={parentId} childId={childId} stroke={color} width={width} />
    {innerColor ? (
      <BoneLine
        handle={handle}
        parentId={parentId}
        childId={childId}
        stroke={innerColor}
        width={Math.max(1, width - 3)}
        opacity={0.6}
      />
    ) : null}
  </g>
);

const Joint: React.FC<{
  readonly handle: ProjectHandle;
  readonly id: string;
  readonly color: string;
  readonly radius: number;
  readonly label?: string;
}> = ({ handle, id, color, radius, label }) => {
  const bind = useDerivedDomPatch<SVGGElement>(handle, [id], position);
  return (
    <g ref={bind} pointerEvents="none">
      <circle r={radius} fill={color} stroke="#07111f" strokeWidth={1.5} />
      {label ? (
        <text x={radius + 6} y={4} fill={color} fontSize="9" fontFamily="monospace">
          {label}
        </text>
      ) : null}
    </g>
  );
};

const RootPin: React.FC<{ readonly handle: ProjectHandle; readonly id: string }> = ({
  handle,
  id,
}) => {
  const bind = useDerivedDomPatch<SVGGElement>(handle, [id], position);
  return (
    <g ref={bind} pointerEvents="none">
      <circle r={16} fill="#c084fc" opacity={0.18} />
      <rect x={-6} y={-6} width={12} height={12} fill="#c084fc" transform="rotate(45)" />
      <text x={20} y={4} fill="#c084fc" fontSize="10" fontWeight="700" fontFamily="monospace">
        ROOT
      </text>
    </g>
  );
};

const GoalHandle: React.FC<{
  readonly handle: ProjectHandle;
  readonly goals: GoalControl;
  readonly svgRef: React.RefObject<SVGSVGElement | null>;
}> = ({ handle, goals, svgRef }) => {
  const id = nodeId(TENTACLE.goalTrack);
  const bind = useDerivedDomPatch<SVGGElement>(handle, [id], position);

  const toStagePoint = (clientX: number, clientY: number) => {
    const ctm = svgRef.current?.getScreenCTM();
    if (!ctm) return undefined;
    const local = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return {
      x: Math.min(STAGE_2D.width - STAGE_2D.margin, Math.max(STAGE_2D.margin, local.x)),
      y: Math.min(STAGE_2D.height - STAGE_2D.margin, Math.max(STAGE_2D.margin, local.y)),
    };
  };
  const move = (x: number, y: number) => goals.move({ rig: "planar", x, y });
  const drag = useGoalDrag<true>({
    begin: () => true,
    move: (_session, event) => {
      const local = toStagePoint(event.clientX, event.clientY);
      if (local) move(local.x, local.y);
    },
  });

  const nudge = (event: React.KeyboardEvent<SVGCircleElement>) => {
    const amount = goalNudge(event);
    if (amount === undefined || amount.dz !== 0) return;
    const decision = patchRender(handle.get(id));
    if (decision.kind !== "render") return;
    const current = point(decision.patch.values);
    event.preventDefault();
    move(current.x + amount.dx, current.y + amount.dy);
  };

  return (
    <g ref={bind} data-testid="ik-goal-handle" pointerEvents="none">
      <circle
        r={7}
        fill="none"
        stroke="#fbbf24"
        strokeWidth={2}
        opacity={0.55}
        pointerEvents="none"
      />
      <circle
        r={26}
        role="button"
        tabIndex={0}
        aria-label="Move FABRIK 2D goal"
        fill="transparent"
        pointerEvents="auto"
        style={{ touchAction: "none", cursor: "grab" }}
        onKeyDown={nudge}
        {...drag}
      />
      <circle r={12} fill="none" stroke="#fbbf24" strokeWidth={2} pointerEvents="none" />
      <circle r={4} fill="#fbbf24" pointerEvents="none" />
      <text x={18} y={-14} fill="#fbbf24" fontSize="10" fontWeight="700" fontFamily="monospace">
        GOAL · drag
      </text>
    </g>
  );
};

export const IkStage: React.FC<{
  readonly handle: ProjectHandle;
  readonly goals: GoalControl;
}> = ({ handle, goals }) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const reach = TENTACLE.lengths.reduce((sum, length) => sum + length, 0);
  const rootId = nodeId(TENTACLE.rootTrack);

  return (
    <section className="stage-card ik-stage" aria-label="2D FABRIK inverse kinematics playground">
      <div className="stage-card-heading">
        <strong>FABRIK 2D</strong>
        <span>six members · one goal</span>
      </div>
      <div className="stage-container">
        <svg
          ref={svgRef}
          className="ik-svg"
          viewBox={`0 0 ${STAGE_2D.width} ${STAGE_2D.height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ touchAction: "pan-y" }}
        >
          <defs>
            <radialGradient id="ik-reach" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle
            ref={useDerivedDomPatch<SVGCircleElement>(handle, [rootId], position)}
            r={reach}
            fill="url(#ik-reach)"
            stroke="#34d399"
            strokeWidth={1}
            strokeDasharray="5 7"
            opacity={0.5}
            pointerEvents="none"
          />
          {TENTACLE.memberTracks.map((member, index) => {
            const parent = index === 0 ? TENTACLE.rootTrack : TENTACLE.memberTracks[index - 1]!;
            return (
              <Bone
                key={member}
                handle={handle}
                parentId={nodeId(parent)}
                childId={nodeId(member)}
                width={Math.max(3.5, 9 - index)}
                color="#34d399"
                innerColor="#a7f3d0"
              />
            );
          })}
          <Bone
            handle={handle}
            parentId={nodeId(TENTACLE.tipTrack)}
            childId={nodeId(TENTACLE.fkTailTrack)}
            width={3}
            color="#475569"
          />
          {TENTACLE.memberTracks.map((member, index) => (
            <Joint
              key={member}
              handle={handle}
              id={nodeId(member)}
              color="#34d399"
              radius={Math.max(2.5, 5.5 - index * 0.45)}
            />
          ))}
          <RootPin handle={handle} id={rootId} />
          <GoalHandle handle={handle} goals={goals} svgRef={svgRef} />
        </svg>
      </div>
    </section>
  );
};
