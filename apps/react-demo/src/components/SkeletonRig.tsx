import React from "react";
import type { ProjectHandle } from "@motion5/core";
import {
  useDerivedDomPatch,
  useDomPatch,
  type PatchDerivation,
  type PatchValues,
} from "@motion5/react";

/**
 * Nothing in this rig re-renders on a tick.
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
  // One derivation, two elements: the inner highlight is the same line at a smaller width, so it
  // takes its own binding rather than a second derivation.
  const bindBone = useDerivedDomPatch<SVGLineElement>(handle, [parentId, childId], boneEndpoints);
  const bindInner = useDerivedDomPatch<SVGLineElement>(handle, [parentId, childId], boneEndpoints);

  return (
    <g>
      <line ref={bindBone} stroke={color} strokeWidth={width} strokeLinecap="round" />
      {innerColor && width > 3 && (
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
  const bind = useDomPatch<SVGGElement>(handle, nodeId);

  return (
    <g ref={bind}>
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

// Ankle -> Heel vector (-12px back, +5px down)
const wedgePoints: PatchDerivation = ([shin = {}, foot = {}]) => {
  const ankle = point(shin);
  const toe = point(foot);
  const heel = { x: ankle.x - 12, y: ankle.y + 5 };
  return {
    points: `${heel.x},${heel.y} ${ankle.x},${ankle.y} ${toe.x},${toe.y} ${toe.x},${toe.y + 5}`,
  };
};

const FootWedge: React.FC<FootWedgeProps> = ({ handle, shinId, footId, color }) => {
  const bind = useDerivedDomPatch<SVGPolygonElement>(handle, [shinId, footId], wedgePoints);

  return (
    <polygon
      ref={bind}
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

// Skull center is slightly above the neck: the node is the top of the head.
function skullCenter(head: PatchValues): { x: number; y: number } {
  const top = point(head);
  return { x: top.x, y: top.y + 8 };
}

const skullPose: PatchDerivation = ([head = {}]) => skullCenter(head);

const visorPose: PatchDerivation = ([head = {}]) => ({
  ...skullCenter(head),
  rotation: Number(head.rotation ?? 0) + 90,
});

const HeadSkull: React.FC<HeadSkullProps> = ({ handle, chestId, headId }) => {
  const bindNeck = useDerivedDomPatch<SVGLineElement>(handle, [chestId, headId], boneEndpoints);
  const bindSkull = useDerivedDomPatch<SVGCircleElement>(handle, [headId], skullPose);
  const bindVisor = useDerivedDomPatch<SVGGElement>(handle, [headId], visorPose);

  return (
    <g>
      {/* Neck Bone */}
      <line ref={bindNeck} stroke="#e2e8f0" strokeWidth={5} strokeLinecap="round" />
      {/* Skull Outline, posed rather than positioned: the composed transform pivots at the element's
          own origin, which is what the visor group below rotates around. */}
      <circle ref={bindSkull} r={18} fill="#0f172a" stroke="#cbd5e1" strokeWidth={3} />
      {/* Eye/Visor Line */}
      <g ref={bindVisor}>
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

function spanX(values: PatchValues, half: number): Record<string, number> {
  const centre = point(values);
  return { x1: centre.x - half, y1: centre.y, x2: centre.x + half, y2: centre.y };
}

const pelvisBar: PatchDerivation = ([pelvis = {}]) => spanX(pelvis, 14);
const shoulderBar: PatchDerivation = ([chest = {}]) => spanX(chest, 20);

const ribcagePose: PatchDerivation = ([pelvis = {}, chest = {}]) => {
  const hips = point(pelvis);
  const shoulders = point(chest);
  return { x: (hips.x + shoulders.x) / 2, y: (hips.y + shoulders.y) / 2 - 6 };
};

const TorsoContour: React.FC<TorsoContourProps> = ({ handle, pelvisId, chestId }) => {
  const bindPelvis = useDerivedDomPatch<SVGLineElement>(handle, [pelvisId], pelvisBar);
  const bindShoulder = useDerivedDomPatch<SVGLineElement>(handle, [chestId], shoulderBar);
  const bindRibcage = useDerivedDomPatch<SVGEllipseElement>(
    handle,
    [pelvisId, chestId],
    ribcagePose,
  );

  return (
    <g>
      {/* Pelvis Transverse Bar */}
      <line ref={bindPelvis} stroke="#64748b" strokeWidth={5} strokeLinecap="round" />
      {/* Shoulder Transverse Bar */}
      <line ref={bindShoulder} stroke="#cbd5e1" strokeWidth={6} strokeLinecap="round" />
      {/* Ribcage Outline */}
      <ellipse
        ref={bindRibcage}
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

const shadowPose: PatchDerivation = ([pelvis = {}]) => ({ x: point(pelvis).x, y: 398 });

export const SkeletonRig: React.FC<SkeletonRigProps> = ({ handle }) => {
  const bindShadow = useDerivedDomPatch<SVGEllipseElement>(handle, ["walk/pelvis"], shadowPose);

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

        {/* Ground Dynamic Shadow: absent while the pelvis is not live, rather than parked at a
            default, which is what a derivation with nothing to draw means. */}
        <ellipse ref={bindShadow} rx={60} ry={8} fill="url(#groundShadow)" />

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
