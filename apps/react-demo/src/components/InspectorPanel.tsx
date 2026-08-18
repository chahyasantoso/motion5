import React from "react";
import type { ProjectHandle } from "@motion5/core";
import { usePatch } from "@motion5/react";

interface InspectorPanelProps {
  readonly handle: ProjectHandle;
}

const NodeCard: React.FC<{ handle: ProjectHandle; nodeId: string; title: string }> = ({
  handle,
  nodeId,
  title,
}) => {
  const patch = usePatch(handle, nodeId);
  if (!patch) return null;

  const x = Number(patch.values.x ?? 0);
  const y = Number(patch.values.y ?? 0);
  const rot = patch.values.rotation !== undefined ? Number(patch.values.rotation) : undefined;

  return (
    <div className="node-card">
      <div className="title">{title}</div>
      <div className="val-row">
        <span>World X:</span> <span>{x.toFixed(1)}</span>
      </div>
      <div className="val-row">
        <span>World Y:</span> <span>{y.toFixed(1)}</span>
      </div>
      {rot !== undefined && (
        <div className="val-row">
          <span>Rot:</span> <span>{rot.toFixed(1)}&deg;</span>
        </div>
      )}
    </div>
  );
};

export const InspectorPanel: React.FC<InspectorPanelProps> = ({ handle }) => {
  return (
    <div>
      <h2>Kinematic Telemetry (13 Nodes)</h2>
      <div className="inspector-list">
        <NodeCard handle={handle} nodeId="walk/pelvis" title="walk/pelvis (Root)" />
        <NodeCard handle={handle} nodeId="walk/chest" title="walk/chest (Spine)" />
        <NodeCard handle={handle} nodeId="walk/head" title="walk/head" />
        <NodeCard handle={handle} nodeId="walk/legL_thigh" title="walk/legL_thigh" />
        <NodeCard handle={handle} nodeId="walk/legL_shin" title="walk/legL_shin" />
        <NodeCard handle={handle} nodeId="walk/legL_foot" title="walk/legL_foot" />
        <NodeCard handle={handle} nodeId="walk/legR_thigh" title="walk/legR_thigh" />
        <NodeCard handle={handle} nodeId="walk/legR_shin" title="walk/legR_shin" />
        <NodeCard handle={handle} nodeId="walk/legR_foot" title="walk/legR_foot" />
        <NodeCard handle={handle} nodeId="walk/armL_upper" title="walk/armL_upper" />
        <NodeCard handle={handle} nodeId="walk/armL_lower" title="walk/armL_lower" />
        <NodeCard handle={handle} nodeId="walk/armR_upper" title="walk/armR_upper" />
        <NodeCard handle={handle} nodeId="walk/armR_lower" title="walk/armR_lower" />
      </div>
    </div>
  );
};
