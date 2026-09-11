import React, { useRef } from "react";
import type { ProjectHandle } from "@motion5/core";
import {
  useDerivedDomPatch,
  useDomPatch,
  type PatchDerivation,
  type PatchValues,
} from "@motion5/react";
import { ARM, TENTACLE, nodeId, type RigGeometry } from "../ik-playground-project";
import type { GoalPoint, PendingGoals } from "../scroll-reach";

/**
 * Nothing in this stage re-renders on a tick.
 *
 * A one-node pose is `useDomPatch`. Everything else is a derivation: geometry this file computes
 * from the values of one or more nodes, written to one element by `useDerivedDomPatch` through the
 * same DOM adapter. Presence is still not liveness, and that rule has one owner now instead of one
 * per component: a derivation runs only while every node it names is ready, and its target is hidden
 * rather than unmounted while one is not. See ADR-073 and ADR-075.
 */
function point(values: PatchValues): { x: number; y: number } {
  return { x: Number(values.x ?? 0), y: Number(values.y ?? 0) };
}

const boneEndpoints: PatchDerivation = ([parent = {}, child = {}]) => {
  const from = point(parent);
  const to = point(child);
  return { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
};

const nodePose: PatchDerivation = ([values = {}]) => point(values);

interface BoneProps {
  readonly handle: ProjectHandle;
  readonly parentId: string;
  readonly childId: string;
  readonly color: string;
  readonly width: number;
  readonly innerColor?: string;
}

const Bone: React.FC<BoneProps> = ({ handle, parentId, childId, color, width, innerColor }) => {
  // One derivation, two elements: the inner highlight is the same line at a smaller width, so it
  // takes its own binding rather than a second derivation.
  const bindBone = useDerivedDomPatch<SVGLineElement>(handle, [parentId, childId], boneEndpoints);
  const bindInner = useDerivedDomPatch<SVGLineElement>(handle, [parentId, childId], boneEndpoints);

  return (
    <g>
      <line ref={bindBone} stroke={color} strokeWidth={width} strokeLinecap="round" />
      {innerColor && (
        <line
          ref={bindInner}
          stroke={innerColor}
          strokeWidth={Math.max(1, width - 3)}
          strokeLinecap="round"
          opacity={0.6}
        />
      )}
    </g>
  );
};

const Joint: React.FC<{
  readonly handle: ProjectHandle;
  readonly id: string;
  readonly color: string;
  readonly radius: number;
  readonly label?: string;
}> = ({ handle, id, color, radius, label }) => {
  const bind = useDomPatch<SVGGElement>(handle, id);

  return (
    <g ref={bind}>
      <circle r={radius} fill={color} stroke="#0f172a" strokeWidth={1.5} />
      {label && (
        <text
          x={radius + 6}
          y={4}
          fill={color}
          fontSize="9"
          fontWeight="600"
          fontFamily="monospace"
        >
          {label}
        </text>
      )}
    </g>
  );
};

const RootPin: React.FC<{
  readonly handle: ProjectHandle;
  readonly id: string;
  readonly color: string;
  readonly label: string;
}> = ({ handle, id, color, label }) => {
  const bind = useDomPatch<SVGGElement>(handle, id);

  return (
    <g ref={bind}>
      <circle r={16} fill={color} opacity={0.18} />
      <rect x={-6} y={-6} width={12} height={12} fill={color} transform="rotate(45)" />
      <text x={20} y={4} fill={color} fontSize="10" fontWeight="700" fontFamily="monospace">
        {label}
      </text>
    </g>
  );
};

const ReachCircle: React.FC<{
  readonly handle: ProjectHandle;
  readonly rootId: string;
  readonly radius: number;
  readonly color: string;
}> = ({ handle, rootId, radius, color }) => {
  // A projection onto the element's own geometry, posed rather than positioned: `cx` and `cy` are
  // CSS properties as well as SVG attributes, so a derived position is `x`/`y` and the adapter
  // composes it into a transform that pivots at this element's origin.
  const bind = useDerivedDomPatch<SVGCircleElement>(handle, [rootId], nodePose);

  return (
    <circle
      ref={bind}
      r={radius}
      fill="none"
      stroke={color}
      strokeWidth={1}
      strokeDasharray="5 7"
      opacity={0.22}
    />
  );
};

/**
 * The solid marker renders pending intent. The small hollow marker shows the applied target
 * from the runtime. Pointer capture keeps the drag alive without moving the solved rig.
 */
const GoalHandle: React.FC<{
  readonly handle: ProjectHandle;
  readonly id: string;
  readonly color: string;
  readonly svgRef: React.RefObject<SVGSVGElement | null>;
  readonly pending: GoalPoint;
  readonly onDrag: (x: number, y: number) => void;
}> = ({ handle, id, color, svgRef, pending, onDrag }) => {
  // The applied marker is the runtime's answer, so it binds to it. The pending marker is client
  // state, so it stays mounted and draggable while the node is blocked, errored or destroyed, where
  // gating the whole handle on one patch used to take the drag target with it. See ADR-075.
  const bindApplied = useDerivedDomPatch<SVGCircleElement>(handle, [id], nodePose);
  const dragging = useRef(false);

  const toStagePoint = (clientX: number, clientY: number) => {
    const ctm = svgRef.current?.getScreenCTM();
    if (!ctm) return undefined;
    const point = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return {
      x: Math.min(1080, Math.max(20, point.x)),
      y: Math.min(540, Math.max(20, point.y)),
    };
  };

  return (
    <g>
      <circle
        ref={bindApplied}
        data-applied-goal={id}
        r={7}
        fill="none"
        stroke={color}
        opacity={0.45}
        pointerEvents="none"
      />
      <g
        data-pending-goal={id}
        transform={`translate(${pending.x}, ${pending.y})`}
        style={{ cursor: dragging.current ? "grabbing" : "grab" }}
      >
        <circle
          r={22}
          role="button"
          tabIndex={0}
          aria-label={`Move ${id} pending target with arrow keys`}
          style={{ touchAction: "none" }}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 20 : 5;
            const dx = e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0;
            const dy = e.key === "ArrowDown" ? step : e.key === "ArrowUp" ? -step : 0;
            if (!dx && !dy) return;
            e.preventDefault();
            onDrag(
              Math.min(1080, Math.max(20, pending.x + dx)),
              Math.min(540, Math.max(20, pending.y + dy)),
            );
          }}
          fill="transparent"
          onPointerDown={(e) => {
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            dragging.current = true;
          }}
          onPointerMove={(e) => {
            if (!dragging.current) return;
            const point = toStagePoint(e.clientX, e.clientY);
            if (point) onDrag(point.x, point.y);
          }}
          onPointerUp={(e) => {
            dragging.current = false;
            if (e.currentTarget.hasPointerCapture(e.pointerId))
              e.currentTarget.releasePointerCapture(e.pointerId);
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
          onLostPointerCapture={() => {
            dragging.current = false;
          }}
        />
        <circle
          r={12}
          fill="none"
          stroke={color}
          strokeWidth={2}
          opacity={0.9}
          pointerEvents="none"
        />
        <circle r={4.5} fill={color} pointerEvents="none" />
        <g opacity={0.8} pointerEvents="none">
          <line x1={-20} y1={0} x2={-14} y2={0} stroke={color} strokeWidth={2} />
          <line x1={14} y1={0} x2={20} y2={0} stroke={color} strokeWidth={2} />
          <line x1={0} y1={-20} x2={0} y2={-14} stroke={color} strokeWidth={2} />
          <line x1={0} y1={14} x2={0} y2={20} stroke={color} strokeWidth={2} />
        </g>
        <text
          x={22}
          y={-14}
          fill={color}
          fontSize="10"
          fontWeight="700"
          fontFamily="monospace"
          pointerEvents="none"
        >
          pending · drag
        </text>
      </g>
    </g>
  );
};

interface RigViewProps {
  readonly handle: ProjectHandle;
  readonly rig: RigGeometry;
  readonly labelX: number;
  readonly labelY: number;
  readonly accent: string;
  readonly innerColor: string;
  readonly goalColor: string;
  readonly dispatchNote: string;
  readonly pending: GoalPoint;
  readonly svgRef: React.RefObject<SVGSVGElement | null>;
  readonly onGoalMove: (goalTrack: string, x: number, y: number) => void;
}

const RigView: React.FC<RigViewProps> = ({
  handle,
  rig,
  labelX,
  labelY,
  accent,
  innerColor,
  goalColor,
  dispatchNote,
  pending,
  svgRef,
  onGoalMove,
}) => {
  const reach = rig.lengths.reduce((sum, length) => sum + length, 0);

  return (
    <g>
      <text
        x={labelX}
        y={labelY}
        fill={accent}
        fontSize="15"
        fontWeight="800"
        fontFamily="monospace"
      >
        {rig.label}
      </text>
      <text x={labelX} y={labelY + 18} fill="#64748b" fontSize="11" fontFamily="monospace">
        {dispatchNote}
      </text>

      <ReachCircle handle={handle} rootId={nodeId(rig.rootTrack)} radius={reach} color={accent} />

      {rig.memberTracks.map((member, index) => {
        const parent = index === 0 ? rig.rootTrack : rig.memberTracks[index - 1]!;
        const width = rig.memberTracks.length === 2 ? [9, 7][index]! : Math.max(3.5, 8.5 - index);
        return (
          <Bone
            key={member}
            handle={handle}
            parentId={nodeId(parent)}
            childId={nodeId(member)}
            color={accent}
            width={width}
            innerColor={innerColor}
          />
        );
      })}

      {/* Ordinary FK below the chain, at its own authored length, unaware of the solve. */}
      <Bone
        handle={handle}
        parentId={nodeId(rig.memberTracks[rig.memberTracks.length - 1]!)}
        childId={nodeId(rig.fkTailTrack)}
        color="#475569"
        width={3.5}
      />

      {rig.memberTracks.map((member, index) => (
        <Joint
          key={member}
          handle={handle}
          id={nodeId(member)}
          color={accent}
          radius={Math.max(2.2, 5.5 - index * 0.5)}
        />
      ))}

      <RootPin handle={handle} id={nodeId(rig.rootTrack)} color={goalColor} label={rig.rootTrack} />

      <GoalHandle
        handle={handle}
        id={nodeId(rig.goalTrack)}
        pending={pending}
        color={goalColor}
        svgRef={svgRef}
        onDrag={(x, y) => onGoalMove(rig.goalTrack, x, y)}
      />
    </g>
  );
};

interface IkStageProps {
  readonly handle: ProjectHandle;
  readonly pendingGoals: PendingGoals;
  readonly onGoalMove: (goalTrack: string, x: number, y: number) => void;
}

export const IkStage: React.FC<IkStageProps> = ({ handle, pendingGoals, onGoalMove }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  return (
    <div className="stage-container">
      <svg id="stage" ref={svgRef} viewBox="0 0 1100 560" preserveAspectRatio="xMidYMid meet">
        <line
          x1={550}
          y1={0}
          x2={550}
          y2={560}
          stroke="#1e2d45"
          strokeWidth={1}
          strokeDasharray="6 8"
        />
        <RigView
          handle={handle}
          rig={ARM}
          pending={pendingGoals[ARM.goalTrack]!}
          labelX={28}
          labelY={44}
          accent="#38bdf8"
          innerColor="#bae6fd"
          goalColor="#f43f5e"
          dispatchNote="2 members · 1 goal → analytic (closed form)"
          svgRef={svgRef}
          onGoalMove={onGoalMove}
        />
        <RigView
          handle={handle}
          rig={TENTACLE}
          pending={pendingGoals[TENTACLE.goalTrack]!}
          labelX={578}
          labelY={44}
          accent="#34d399"
          innerColor="#a7f3d0"
          goalColor="#fbbf24"
          dispatchNote="6 members · 1 goal → FABRIK (iterative)"
          svgRef={svgRef}
          onGoalMove={onGoalMove}
        />
      </svg>
    </div>
  );
};
