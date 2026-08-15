import React from "react";
import type { ProjectHandle } from "@motion5/core";
import { usePatch } from "@motion5/react";

interface SkeletonRigProps {
  readonly handle: ProjectHandle;
}

interface BoneSegmentProps {
  readonly handle: ProjectHandle;
  readonly parentId: string;
  readonly childId: string;
  readonly color: string;
  readonly width: number;
  readonly innerColor?: string;
}

const BoneSegment: React.FC<BoneSegmentProps> = ({
  handle,
  parentId,
  childId,
  color,
  width,
  innerColor,
}) => {
  const parentPatch = usePatch(handle, parentId);
  const childPatch = usePatch(handle, childId);

  if (!parentPatch || !childPatch) return null;

  const px = Number(parentPatch.values.x ?? 0);
  const py = Number(parentPatch.values.y ?? 0);
  const cx = Number(childPatch.values.x ?? 0);
  const cy = Number(childPatch.values.y ?? 0);

  return (
    <g>
      <line
        x1={px}
        y1={py}
        x2={cx}
        y2={cy}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
      {innerColor && width > 3 && (
        <line
          x1={px}
          y1={py}
          x2={cx}
          y2={cy}
          stroke={innerColor}
          strokeWidth={Math.max(1, width - 3)}
          strokeLinecap="round"
          opacity={0.6}
        />
      )}
    </g>
  );
};

interface JointMarkerProps {
  readonly handle: ProjectHandle;
  readonly nodeId: string;
  readonly color: string;
  readonly radius: number;
  readonly label?: string;
  readonly glow?: boolean;
}

const JointMarker: React.FC<JointMarkerProps> = ({
  handle,
  nodeId,
  color,
  radius,
  label,
  glow = false,
}) => {
  const patch = usePatch(handle, nodeId);
  if (!patch) return null;

  const x = Number(patch.values.x ?? 0);
  const y = Number(patch.values.y ?? 0);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {glow && <circle cx={0} cy={0} r={radius * 1.8} fill={color} opacity={0.25} />}
      <circle cx={0} cy={0} r={radius} fill={color} stroke="#0f172a" strokeWidth={1.5} />
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

interface FootWedgeProps {
  readonly handle: ProjectHandle;
  readonly shinId: string;
  readonly footId: string;
  readonly color: string;
}

const FootWedge: React.FC<FootWedgeProps> = ({ handle, shinId, footId, color }) => {
  const shinPatch = usePatch(handle, shinId);
  const footPatch = usePatch(handle, footId);

  if (!shinPatch || !footPatch) return null;

  const ax = Number(shinPatch.values.x ?? 0);
  const ay = Number(shinPatch.values.y ?? 0);
  const tx = Number(footPatch.values.x ?? 0);
  const ty = Number(footPatch.values.y ?? 0);

  // Ankle -> Heel vector (-12px back, +6px down)
  const hx = ax - 12;
  const hy = ay + 5;

  return (
    <polygon
      points={`${hx},${hy} ${ax},${ay} ${tx},${ty} ${tx},${ty + 5}`}
      fill={color}
      stroke={color}
      strokeWidth={1}
      strokeLinejoin="round"
      opacity={0.85}
    />
  );
};

interface HeadSkullProps {
  readonly handle: ProjectHandle;
  readonly chestId: string;
  readonly headId: string;
}

const HeadSkull: React.FC<HeadSkullProps> = ({ handle, chestId, headId }) => {
  const chestPatch = usePatch(handle, chestId);
  const headPatch = usePatch(handle, headId);

  if (!chestPatch || !headPatch) return null;

  const cx = Number(chestPatch.values.x ?? 0);
  const cy = Number(chestPatch.values.y ?? 0);
  const hx = Number(headPatch.values.x ?? 0);
  const hy = Number(headPatch.values.y ?? 0);
  const hrot = Number(headPatch.values.rotation ?? 0);

  // Skull center is slightly above neck (hx, hy is top of head)
  const skullX = hx;
  const skullY = hy + 8;

  return (
    <g>
      {/* Neck Bone */}
      <line
        x1={cx}
        y1={cy}
        x2={hx}
        y2={hy}
        stroke="#e2e8f0"
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* Skull Outline */}
      <circle cx={skullX} cy={skullY} r={18} fill="#0f172a" stroke="#cbd5e1" strokeWidth={3} />
      {/* Eye/Visor Line */}
      <g transform={`translate(${skullX}, ${skullY}) rotate(${hrot + 90})`}>
        <rect x={2} y={-3} width={14} height={6} rx={2} fill="#38bdf8" />
        <circle cx={-3} cy={7} r={2} fill="#94a3b8" />
      </g>
    </g>
  );
};

interface TorsoContourProps {
  readonly handle: ProjectHandle;
  readonly pelvisId: string;
  readonly chestId: string;
}

const TorsoContour: React.FC<TorsoContourProps> = ({ handle, pelvisId, chestId }) => {
  const pelvisPatch = usePatch(handle, pelvisId);
  const chestPatch = usePatch(handle, chestId);

  if (!pelvisPatch || !chestPatch) return null;

  const px = Number(pelvisPatch.values.x ?? 0);
  const py = Number(pelvisPatch.values.y ?? 0);
  const cx = Number(chestPatch.values.x ?? 0);
  const cy = Number(chestPatch.values.y ?? 0);

  const midX = (px + cx) / 2;
  const midY = (py + cy) / 2;

  return (
    <g>
      {/* Pelvis Transverse Bar */}
      <line
        x1={px - 14}
        y1={py}
        x2={px + 14}
        y2={py}
        stroke="#64748b"
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* Shoulder Transverse Bar */}
      <line
        x1={cx - 20}
        y1={cy}
        x2={cx + 20}
        y2={cy}
        stroke="#cbd5e1"
        strokeWidth={6}
        strokeLinecap="round"
      />
      {/* Ribcage Outline */}
      <ellipse
        cx={midX}
        cy={midY - 6}
        rx={18}
        ry={26}
        fill="none"
        stroke="#334155"
        strokeWidth={2}
        strokeDasharray="4 3"
      />
    </g>
  );
};

export const SkeletonRig: React.FC<SkeletonRigProps> = ({ handle }) => {
  const pelvisPatch = usePatch(handle, "walk/pelvis");
  const pelvisX = Number(pelvisPatch?.values.x ?? 150);

  return (
    <div className="stage-container">
      <svg id="stage" viewBox="0 0 1100 500" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Grid & Ground */}
        <line x1="0" y1="400" x2="1100" y2="400" stroke="#1e293b" strokeWidth="2" />
        <line
          x1="0"
          y1="400"
          x2="1100"
          y2="400"
          stroke="#38bdf8"
          strokeWidth="1"
          strokeDasharray="8 8"
          opacity={0.3}
        />

        {/* Ground Dynamic Shadow */}
        <ellipse cx={pelvisX} cy={398} rx={60} ry={8} fill="url(#groundShadow)" />

        {/* 1. BACKGROUND LIMBS (Right Arm & Right Leg - Dimmed) */}
        <g opacity={0.65}>
          {/* Right Arm */}
          <BoneSegment
            handle={handle}
            parentId="walk/chest"
            childId="walk/armR_upper"
            color="#475569"
            width={6}
          />
          <BoneSegment
            handle={handle}
            parentId="walk/armR_upper"
            childId="walk/armR_lower"
            color="#334155"
            width={5}
          />
          <JointMarker handle={handle} nodeId="walk/armR_lower" color="#475569" radius={3.5} />

          {/* Right Leg */}
          <BoneSegment
            handle={handle}
            parentId="walk/pelvis"
            childId="walk/legR_thigh"
            color="#475569"
            width={8}
          />
          <BoneSegment
            handle={handle}
            parentId="walk/legR_thigh"
            childId="walk/legR_shin"
            color="#334155"
            width={7}
          />
          <FootWedge
            handle={handle}
            shinId="walk/legR_shin"
            footId="walk/legR_foot"
            color="#334155"
          />
          <JointMarker handle={handle} nodeId="walk/legR_thigh" color="#475569" radius={5} />
          <JointMarker handle={handle} nodeId="walk/legR_shin" color="#475569" radius={4} />
        </g>

        {/* 2. CORE TORSO & HEAD */}
        <TorsoContour handle={handle} pelvisId="walk/pelvis" chestId="walk/chest" />
        <BoneSegment
          handle={handle}
          parentId="walk/pelvis"
          childId="walk/chest"
          color="#f8fafc"
          width={8}
          innerColor="#38bdf8"
        />
        <HeadSkull handle={handle} chestId="walk/chest" headId="walk/head" />

        {/* 3. FOREGROUND LIMBS (Left Arm & Left Leg - Vibrant Neon) */}
        {/* Left Leg */}
        <BoneSegment
          handle={handle}
          parentId="walk/pelvis"
          childId="walk/legL_thigh"
          color="#38bdf8"
          width={9}
          innerColor="#bae6fd"
        />
        <BoneSegment
          handle={handle}
          parentId="walk/legL_thigh"
          childId="walk/legL_shin"
          color="#818cf8"
          width={7}
          innerColor="#c7d2fe"
        />
        <FootWedge
          handle={handle}
          shinId="walk/legL_shin"
          footId="walk/legL_foot"
          color="#a7f3d0"
        />

        {/* Left Arm */}
        <BoneSegment
          handle={handle}
          parentId="walk/chest"
          childId="walk/armL_upper"
          color="#38bdf8"
          width={7}
          innerColor="#bae6fd"
        />
        <BoneSegment
          handle={handle}
          parentId="walk/armL_upper"
          childId="walk/armL_lower"
          color="#818cf8"
          width={5}
          innerColor="#c7d2fe"
        />

        {/* 4. FOREGROUND JOINTS & GLOW MARKERS */}
        <JointMarker
          handle={handle}
          nodeId="walk/pelvis"
          color="#f43f5e"
          radius={9}
          label="Pelvis"
          glow
        />
        <JointMarker handle={handle} nodeId="walk/chest" color="#f8fafc" radius={7} />
        <JointMarker
          handle={handle}
          nodeId="walk/head"
          color="#38bdf8"
          radius={6}
          label="Head"
          glow
        />

        <JointMarker
          handle={handle}
          nodeId="walk/legL_thigh"
          color="#38bdf8"
          radius={6}
          label="Knee L"
          glow
        />
        <JointMarker
          handle={handle}
          nodeId="walk/legL_shin"
          color="#818cf8"
          radius={5}
          label="Ankle L"
        />
        <JointMarker handle={handle} nodeId="walk/legL_foot" color="#a7f3d0" radius={3} />

        <JointMarker
          handle={handle}
          nodeId="walk/armL_upper"
          color="#38bdf8"
          radius={5}
          label="Elbow L"
        />
        <JointMarker handle={handle} nodeId="walk/armL_lower" color="#818cf8" radius={4} />
      </svg>
    </div>
  );
};
