import React from "react";
import type { ProjectHandle } from "@motion5/core";
import { patchRender, usePatch } from "@motion5/react";
import { IK3D, IK3D_GOAL_BOUNDS, IK3D_NODE_ID } from "../ik3d-playground-project";
import { TENTACLE, nodeId } from "../ik-playground-project";
import type { GoalControl } from "../goal-control";

function numberValue(values: Readonly<Record<string, unknown>>, key: string): number {
  return Number(values[key] ?? 0);
}

function inspectionLine(values: Readonly<Record<string, unknown>>): string {
  const inspection = values.inspection;
  if (typeof inspection !== "object" || inspection === null) return "no inspection published";
  const record = inspection as Readonly<Record<string, unknown>>;
  if (typeof record.kind !== "string" || typeof record.residual !== "number")
    return "malformed inspection";
  return `${record.kind} · residual ${record.residual.toFixed(3)}`;
}

const PlanarCard: React.FC<{ readonly handle: ProjectHandle; readonly goals: GoalControl }> = ({
  handle,
  goals,
}) => {
  const rootPatch = usePatch(handle, nodeId(TENTACLE.rootTrack));
  const goalPatch = usePatch(handle, nodeId(TENTACLE.goalTrack));
  const solverPatch = usePatch(handle, nodeId(TENTACLE.solverTrack));
  const tipPatch = usePatch(handle, nodeId(TENTACLE.tipTrack));
  const rootDecision = patchRender(rootPatch);
  const goalDecision = patchRender(goalPatch);
  const solverDecision = patchRender(solverPatch);
  const tipDecision = patchRender(tipPatch);
  const reach = TENTACLE.lengths.reduce((sum, length) => sum + length, 0);

  if (
    rootDecision.kind !== "render" ||
    goalDecision.kind !== "render" ||
    solverDecision.kind !== "render" ||
    tipDecision.kind !== "render"
  )
    return <div className="solver-card">Waiting for the 2D FABRIK solve…</div>;

  const root = rootDecision.patch.values;
  const goal = goalDecision.patch.values;
  const tip = tipDecision.patch.values;
  const solver = solverDecision.patch.values;
  const distance = Math.hypot(
    numberValue(goal, "x") - numberValue(root, "x"),
    numberValue(goal, "y") - numberValue(root, "y"),
  );
  const gap = Math.hypot(
    numberValue(goal, "x") - numberValue(tip, "x"),
    numberValue(goal, "y") - numberValue(tip, "y"),
  );
  const rotations = solver.rotations;
  const flip = solver.flip === true;

  return (
    <div className="solver-card" data-rig={TENTACLE.solverTrack}>
      <div className="card-title" style={{ color: "#34d399" }}>
        FABRIK 2D
      </div>
      <div className="mono-line">distance to goal: {distance.toFixed(1)} px</div>
      <div className="mono-line dim">reach: {reach} px</div>
      <div className={gap < 1 ? "chip ok" : "chip warn"}>blended tip gap: {gap.toFixed(1)} px</div>
      <div className="rot-block">
        <div className="mono-line dim">solved local rotations</div>
        {typeof rotations === "object" && rotations !== null
          ? Object.entries(rotations as Readonly<Record<string, unknown>>).map(([id, value]) => (
              <div className="rot-row" key={id}>
                <span>{id.replace(/^rig\//, "")}</span>
                <span>{Number(value).toFixed(1)}°</span>
              </div>
            ))
          : null}
      </div>
      <label className="flip-toggle">
        <input
          type="checkbox"
          checked={flip}
          onChange={(event) => goals.flip(event.target.checked)}
        />
        <span className="mono-line">flip: {flip ? "true" : "false"}</span>
        <span className="note">writes immediately</span>
      </label>
    </div>
  );
};

const SpatialCard: React.FC<{ readonly handle: ProjectHandle; readonly goals: GoalControl }> = ({
  handle,
  goals,
}) => {
  const goalPatch = usePatch(handle, IK3D_NODE_ID(IK3D.goalTrack));
  const solvePatch = usePatch(handle, IK3D_NODE_ID(IK3D.solverTrack));
  const goalDecision = patchRender(goalPatch);
  const solveDecision = patchRender(solvePatch);
  if (goalDecision.kind !== "render" || solveDecision.kind !== "render")
    return <div className="solver-card">Waiting for the 3D FABRIK solve…</div>;

  const goal = goalDecision.patch.values;
  const solve = solveDecision.patch.values;
  const x = numberValue(goal, "x");
  const y = numberValue(goal, "y");
  const z = numberValue(goal, "z");

  return (
    <div className="solver-card" data-rig={IK3D.solverTrack}>
      <div className="card-title" style={{ color: "#818cf8" }}>
        FABRIK 3D
      </div>
      <div className="mono-line dim">inspection: {inspectionLine(solve)}</div>
      <div className="mono-line">
        goal: x {x.toFixed(0)} · y {y.toFixed(0)} · z {z.toFixed(0)}
      </div>
      <label className="depth-control">
        <span className="mono-line dim">depth z</span>
        <input
          type="range"
          min={IK3D_GOAL_BOUNDS.min.z}
          max={IK3D_GOAL_BOUNDS.max.z}
          step={1}
          value={z}
          aria-label="3D goal depth"
          onChange={(event) => goals.move({ rig: "spatial", x, y, z: Number(event.target.value) })}
        />
      </label>
    </div>
  );
};

export const SolverPanel: React.FC<{
  readonly handle: ProjectHandle;
  readonly goals: GoalControl;
}> = ({ handle, goals }) => (
  <>
    <div>
      <h2>Solver panel</h2>
      <PlanarCard handle={handle} goals={goals} />
      <SpatialCard handle={handle} goals={goals} />
    </div>
    <div className="panel-footer">
      <strong>How this page moves</strong>
      <br />
      Scroll = weight only; drags and flip = immediate value writes.
      <br />
      FK and fk3d own the rest-to-solved blend.
    </div>
  </>
);
