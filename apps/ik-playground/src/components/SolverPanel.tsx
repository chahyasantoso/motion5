import React from "react";
import type { ProjectHandle } from "@motion5/core";
import { selectRecord, selectRow } from "@motion5/core/plugin-api";
import { patchRender, usePatch } from "@motion5/react";
import { TENTACLE, nodeId } from "../ik-playground-project";
import { IK3D, IK3D_GOAL_BOUNDS, IK3D_NODE_ID } from "../ik3d-playground-project";
import type { GoalControl } from "../goal-control";

type Values = Readonly<Record<string, number | string | boolean>>;

function numberValue(values: Values, key: string): number {
  return Number(values[key] ?? 0);
}

function inspectionLine(values: Values | undefined): string {
  if (values === undefined) return "no inspection published";
  const kind = values.kind;
  const residual = values.residual;
  if (typeof kind !== "string" || typeof residual !== "number") return "malformed inspection";
  return `${kind} · residual ${residual.toFixed(3)}`;
}

function booleanValue(values: Values, key: string): boolean {
  return values[key] === true;
}

const PlanarCard: React.FC<{ readonly handle: ProjectHandle; readonly goals: GoalControl }> = ({
  handle,
  goals,
}) => {
  const rootPatch = usePatch(handle, nodeId(TENTACLE.rootTrack));
  const goalPatch = usePatch(handle, nodeId(TENTACLE.goalsTrack));
  const solverPatch = usePatch(handle, nodeId(TENTACLE.solverTrack));
  const posePatch = usePatch(handle, nodeId(TENTACLE.poseTrack));
  const rootDecision = patchRender(rootPatch);
  const goalDecision = patchRender(goalPatch);
  const solverDecision = patchRender(solverPatch);
  const poseDecision = patchRender(posePatch);
  const reach = TENTACLE.lengths.reduce((sum, length) => sum + length, 0);

  if (
    rootDecision.kind !== "render" ||
    goalDecision.kind !== "render" ||
    solverDecision.kind !== "render" ||
    poseDecision.kind !== "render"
  )
    return <div className="solver-card">Waiting for the 2D FABRIK solve…</div>;

  const rootPicked = selectRecord(rootDecision.patch.outputs.values);
  const goalPicked = selectRow(goalDecision.patch.outputs.values, TENTACLE.goalRowId);
  const solverPicked = selectRow(solverDecision.patch.outputs.values, TENTACLE.tipTrack);
  const tipPicked = selectRow(poseDecision.patch.outputs.values, TENTACLE.tipTrack);
  const inspectPicked = selectRecord(solverDecision.patch.outputs.inspect);
  if (
    rootPicked.kind !== "record" ||
    goalPicked.kind !== "row" ||
    solverPicked.kind !== "row" ||
    tipPicked.kind !== "row"
  )
    return <div className="solver-card">Waiting for the 2D FABRIK solve…</div>;

  const root = rootPicked.values;
  const goal = goalPicked.cells;
  const solved = solverPicked.cells;
  const tip = tipPicked.cells;
  const distance = Math.hypot(
    numberValue(goal, "x") - numberValue(root, "x"),
    numberValue(goal, "y") - numberValue(root, "y"),
  );
  const gap = Math.hypot(
    numberValue(goal, "x") - numberValue(tip, "x"),
    numberValue(goal, "y") - numberValue(tip, "y"),
  );
  const authored = handle.track(nodeId(TENTACLE.solverTrack)).definition.input?.values;
  const authoredPicked = selectRecord(authored);
  const flip = authoredPicked.kind === "record" && authoredPicked.values.flip === true;

  return (
    <div className="solver-card" data-rig={TENTACLE.solverTrack}>
      <div className="card-title" style={{ color: "#34d399" }}>
        FABRIK 2D
      </div>
      <div className="mono-line">distance to goal: {distance.toFixed(1)} px</div>
      <div className="mono-line dim">reach: {reach} px</div>
      <div className={gap < 1 ? "chip ok" : "chip warn"}>blended tip gap: {gap.toFixed(1)} px</div>
      <div className="rot-block">
        <div className="mono-line dim">tip member · solved row</div>
        <div className="rot-row">
          <span>{TENTACLE.tipTrack}</span>
          <span>{numberValue(solved, "rotation").toFixed(1)}°</span>
        </div>
        <div className="mono-line dim">
          residual {numberValue(solved, "residual").toFixed(3)} · atBound{" "}
          {booleanValue(solved, "atBound") ? "true" : "false"}
        </div>
      </div>
      <div className="mono-line dim">
        inspect:{" "}
        {inspectionLine(inspectPicked.kind === "record" ? inspectPicked.values : undefined)}
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
  const goalPatch = usePatch(handle, IK3D_NODE_ID(IK3D.goalsTrack));
  const solvePatch = usePatch(handle, IK3D_NODE_ID(IK3D.solverTrack));
  const goalDecision = patchRender(goalPatch);
  const solveDecision = patchRender(solvePatch);
  if (goalDecision.kind !== "render" || solveDecision.kind !== "render")
    return <div className="solver-card">Waiting for the 3D FABRIK solve…</div>;

  const goalPicked = selectRow(goalDecision.patch.outputs.values, IK3D.goalRowId);
  const solvedPicked = selectRow(solveDecision.patch.outputs.values, IK3D.tipTrack);
  const inspectPicked = selectRecord(solveDecision.patch.outputs.inspect);
  if (goalPicked.kind !== "row" || solvedPicked.kind !== "row")
    return <div className="solver-card">Waiting for the 3D FABRIK solve…</div>;
  const goal = goalPicked.cells;
  const solved = solvedPicked.cells;
  const x = numberValue(goal, "x");
  const y = numberValue(goal, "y");
  const z = numberValue(goal, "z");

  return (
    <div className="solver-card" data-rig={IK3D.solverTrack}>
      <div className="card-title" style={{ color: "#818cf8" }}>
        FABRIK 3D
      </div>
      <div className="mono-line dim">
        inspect:{" "}
        {inspectionLine(inspectPicked.kind === "record" ? inspectPicked.values : undefined)}
      </div>
      <div className="mono-line">
        goal: x {x.toFixed(0)} · y {y.toFixed(0)} · z {z.toFixed(0)}
      </div>
      <div className="mono-line dim">
        tip residual {numberValue(solved, "residual").toFixed(3)} · atBound{" "}
        {booleanValue(solved, "atBound") ? "true" : "false"}
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
