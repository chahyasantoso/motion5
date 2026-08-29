import React, { useRef } from "react";
import type { ProjectHandle } from "@motion5/core";
import { usePatch, type Patch } from "@motion5/react";
import { ARM, TENTACLE, nodeId, type RigGeometry } from "../ik-playground-project";

/**
 * Presence is not liveness. A patch that is blocked, errored, or terminal still carries the last
 * values the node published, so gating a bone on `usePatch(...) !== undefined` happily draws a node
 * the graph has already destroyed. Only `"ready"` means "this pose is current".
 */
function useLivePatch(handle: ProjectHandle, id: string): Patch | undefined {
  const patch = usePatch(handle, id);
  return patch?.status === "ready" ? patch : undefined;
}

interface BoneProps {
  readonly handle: ProjectHandle;
  readonly parentId: string;
  readonly childId: string;
  readonly color: string;
  readonly width: number;
  readonly innerColor?: string;
}

const Bone: React.FC<BoneProps> = ({ handle, parentId, childId, color, width, innerColor }) => {
  const parentPatch = useLivePatch(handle, parentId);
  const childPatch = useLivePatch(handle, childId);
  if (!parentPatch || !childPatch) return null;

  return (
    <g>
      <line
        x1={Number(parentPatch.values.x ?? 0)}
        y1={Number(parentPatch.values.y ?? 0)}
        x2={Number(childPatch.values.x ?? 0)}
        y2={Number(childPatch.values.y ?? 0)}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
      {innerColor && (
        <line
          x1={Number(parentPatch.values.x ?? 0)}
          y1={Number(parentPatch.values.y ?? 0)}
          x2={Number(childPatch.values.x ?? 0)}
          y2={Number(childPatch.values.y ?? 0)}
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
  const patch = useLivePatch(handle, id);
  if (!patch) return null;

  return (
    <g transform={`translate(${Number(patch.values.x ?? 0)}, ${Number(patch.values.y ?? 0)})`}>
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
  const patch = useLivePatch(handle, id);
  if (!patch) return null;

  return (
    <g transform={`translate(${Number(patch.values.x ?? 0)}, ${Number(patch.values.y ?? 0)})`}>
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
  const patch = useLivePatch(handle, rootId);
  if (!patch) return null;

  return (
    <circle
      cx={Number(patch.values.x ?? 0)}
      cy={Number(patch.values.y ?? 0)}
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
 * The draggable goal. Pointer capture keeps the drag alive outside the marker, and the position
 * renders from the goal node's own patch, so the marker and the solver read one source of truth:
 * the track the drag just replaced.
 */
const GoalHandle: React.FC<{
  readonly handle: ProjectHandle;
  readonly id: string;
  readonly color: string;
  readonly svgRef: React.RefObject<SVGSVGElement | null>;
  readonly onDrag: (x: number, y: number) => void;
}> = ({ handle, id, color, svgRef, onDrag }) => {
  const patch = useLivePatch(handle, id);
  const dragging = useRef(false);
  if (!patch) return null;

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
    <g
      transform={`translate(${Number(patch.values.x ?? 0)}, ${Number(patch.values.y ?? 0)})`}
      style={{ cursor: dragging.current ? "grabbing" : "grab" }}
    >
      <circle
        r={18}
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
      />
      <circle r={12} fill="none" stroke={color} strokeWidth={2} opacity={0.9} />
      <circle r={4.5} fill={color} />
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
        goal · drag
      </text>
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
        color={goalColor}
        svgRef={svgRef}
        onDrag={(x, y) => onGoalMove(rig.goalTrack, x, y)}
      />
    </g>
  );
};

interface IkStageProps {
  readonly handle: ProjectHandle;
  readonly onGoalMove: (goalTrack: string, x: number, y: number) => void;
}

export const IkStage: React.FC<IkStageProps> = ({ handle, onGoalMove }) => {
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
