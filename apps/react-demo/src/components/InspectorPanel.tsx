import React from "react";
import type { ProjectHandle } from "@motion5/core";
import { patchRender, usePatch } from "@motion5/react";

interface InspectorPanelProps {
  readonly handle: ProjectHandle;
}

const NodeCard: React.FC<{ handle: ProjectHandle; nodeId: string; title: string }> = ({
  handle,
  nodeId,
  title,
}) => {
  const patch = usePatch(handle, nodeId);
  // A pose belongs to the render decision's `render` answer rather than to patch existence,
  // and the decision is core-owned because the DOM adapter and the React bindings read one
  // four-status wire.
  //
  // This card renders nothing while the node is blocked, where it used to render the pose the
  // carry-forward republished onto the blocked patch. That pose is `PatchRegistry.lastReady`'s
  // now, and no consumer surface forwards it yet, so rendering nothing is the honest answer until
  // one does.
  const decision = patchRender(patch);
  if (decision.kind !== "render") return null;
  const ready = decision.patch;

  const x = Number(ready.values.x ?? 0);
  const y = Number(ready.values.y ?? 0);
  const rot = ready.values.rotation !== undefined ? Number(ready.values.rotation) : undefined;

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
