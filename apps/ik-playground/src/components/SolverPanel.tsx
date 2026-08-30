import React from "react";
import type { ProjectHandle } from "@motion5/core";
import { usePatch } from "@motion5/react";
import { ARM, TENTACLE, nodeId, type RigGeometry } from "../ik-playground-project";

interface DispatchCardProps {
  readonly handle: ProjectHandle;
  readonly rig: RigGeometry;
  readonly solverLine: string;
  readonly goalLine: string;
  readonly methodLine: string;
  readonly accent: string;
  readonly flip: boolean;
  readonly onFlip: (flip: boolean) => void;
  readonly flipNote: string;
}

const DispatchCard: React.FC<DispatchCardProps> = ({
  handle,
  rig,
  solverLine,
  goalLine,
  methodLine,
  accent,
  flip,
  onFlip,
  flipNote,
}) => {
  const rootPatch = usePatch(handle, nodeId(rig.rootTrack));
  const goalPatch = usePatch(handle, nodeId(rig.goalTrack));
  const solverPatch = usePatch(handle, nodeId(rig.solverTrack));
  const tipPatch = usePatch(handle, nodeId(rig.tipTrack));

  if (!rootPatch || !goalPatch || !solverPatch || !tipPatch) return null;

  const rootX = Number(rootPatch.values.x ?? 0);
  const rootY = Number(rootPatch.values.y ?? 0);
  const goalX = Number(goalPatch.values.x ?? 0);
  const goalY = Number(goalPatch.values.y ?? 0);
  const tipX = Number(tipPatch.values.x ?? 0);
  const tipY = Number(tipPatch.values.y ?? 0);

  const reach = rig.lengths.reduce((sum, length) => sum + length, 0);
  const distance = Math.hypot(goalX - rootX, goalY - rootY);
  const reachable = distance <= reach + 0.5;
  const tipError = Math.hypot(goalX - tipX, goalY - tipY);
  const rotations = solverPatch.values.rotations as Readonly<Record<string, number>> | undefined;

  return (
    <div className="solver-card">
      <div className="card-title" style={{ color: accent }}>
        {rig.label}
      </div>
      <div className="mono-line">{solverLine}</div>
      <div className="mono-line dim">{goalLine}</div>
      <div className="mono-line dim">{methodLine}</div>

      <div className="reach-block">
        <div className="reach-track">
          <div
            className="reach-fill"
            style={{
              width: `${Math.min(100, (distance / reach) * 100).toFixed(1)}%`,
              background: reachable ? accent : "#fbbf24",
            }}
          />
        </div>
        <div className="reach-labels">
          <span>{distance.toFixed(0)} px to goal</span>
          <span>{reach} px reach</span>
        </div>
        <div className={reachable ? "chip ok" : "chip warn"}>
          {reachable
            ? `reachable · tip error ${tipError.toFixed(1)} px`
            : `beyond reach · extends toward goal (${tipError.toFixed(0)} px short)`}
        </div>
      </div>

      <div className="rot-block">
        <div className="mono-line dim">solved local rotations</div>
        {rotations
          ? Object.entries(rotations).map(([memberId, degrees]) => (
              <div className="rot-row" key={memberId}>
                <span>{memberId.replace(/^rig\//, "")}</span>
                <span>{degrees.toFixed(1)}°</span>
              </div>
            ))
          : null}
      </div>

      <label className="flip-toggle">
        <input type="checkbox" checked={flip} onChange={(e) => onFlip(e.target.checked)} />
        <span className="mono-line">flip: {flip ? "true" : "false"}</span>
        <span className="note">{flipNote}</span>
      </label>
    </div>
  );
};

interface SolverPanelProps {
  readonly handle: ProjectHandle;
  readonly armFlip: boolean;
  readonly tentacleFlip: boolean;
  readonly onArmFlip: (flip: boolean) => void;
  readonly onTentacleFlip: (flip: boolean) => void;
}

export const SolverPanel: React.FC<SolverPanelProps> = ({
  handle,
  armFlip,
  tentacleFlip,
  onArmFlip,
  onTentacleFlip,
}) => (
  <>
    <div>
      <h2>Solver dispatch</h2>
      <DispatchCard
        handle={handle}
        rig={ARM}
        solverLine={`${ARM.solverTrack} · ${ARM.memberTracks.length} members · 1 goal → solveTwoBone`}
        goalLine="goal: ik.requires.target (bare slot)"
        methodLine="law of cosines · exact · unreachable clamps"
        accent="#38bdf8"
        flip={armFlip}
        onFlip={onArmFlip}
        flipNote="mirror the elbow branch"
      />
      <DispatchCard
        handle={handle}
        rig={TENTACLE}
        solverLine={`${TENTACLE.solverTrack} · ${TENTACLE.memberTracks.length} members · 1 goal → solveFabrik`}
        goalLine="goal: ik.requires.targets.seg-6 (member-id dict)"
        methodLine="iterative · length-preserving · arc seed"
        accent="#34d399"
        flip={tentacleFlip}
        onFlip={onTentacleFlip}
        flipNote="mirror the seed arc"
      />
    </div>

    <div className="panel-footer">
      <strong>How this page moves</strong>
      <br />
      Drag either goal on the stage, or toggle a flip. Each gesture is a{" "}
      <code>TrackHandle.replace()</code> of one track plus a single <code>seek</code> that flushes
      the solver and every bone below it. Nothing animates on a timeline here: every authored leaf
      is static, so the interpolator compiles zero tweens and the whole rig is driven by
      transactional graph replacement.
    </div>
  </>
);
