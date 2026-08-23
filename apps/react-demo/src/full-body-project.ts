import type { ProjectDefinition, TrackDefinition } from "@motion5/core";

/**
 * Serializable scroll source key. Core never resolves it; the host maps it to a real ScrollSource
 * at the composition root. See ADR-030.
 */
export const WALK_SCROLL_SOURCE = "walk";

/*
 * This app registers `transformPlugin` and `fkPlugin`, and both claim `rotation`, so every track
 * names the plugin that owns its keys: a bone is authored under `fk` and the pelvis under
 * `transform`. The flat spelling of a key with two claimants is `plugin-ambiguous-key` at load.
 * See ADR-043 and the keyframes section of docs/AUTHORED-SCHEMA.md.
 *
 * A group has exactly two members. Its animated properties live under `values` and the graph
 * bindings the named plugin owns live under `requires`, beside that section rather than around it.
 * Both names are reserved, so a group is recognised by the sections it names rather than by the
 * shape of its leaves. See ADR-049.
 *
 * A leaf is the stops themselves, or a static value. Every bone's `length` is static here, because
 * a bone does not change length: it is authored as `length: 62` rather than as two identical stops,
 * and it never enters the interpolator, so it costs no percent-map entry and no tween. Only
 * `rotation` is animated. See ADR-050.
 *
 * Each bone names its parent once, as `fk.requires.base`, beside the values that parent frame
 * composes against. That replaced a five-line `observes` block per bone whose projection map
 * restated the fk plugin's own input contract as `parentX`, `parentY`, and `parentRotation`. The
 * graph derives the same input edge from the binding, and the parent's values arrive scoped to the
 * `base` slot under their own names. See ADR-044.
 */
export const armTracks: readonly TrackDefinition[] = [
  // 10. Left Arm Upper (Foreground - Observes Chest which is -90deg UP, so 180deg hangs DOWN)
  {
    id: "armL_upper",
    keyframes: {
      fk: {
        values: {
          length: 62,
          rotation: [
            { p: 0, v: 210 }, // Back swing
            { p: 0.125, v: 190 },
            { p: 0.25, v: 150 }, // Forward swing
            { p: 0.375, v: 170 },
            { p: 0.5, v: 210 },
            { p: 0.625, v: 190 },
            { p: 0.75, v: 150 },
            { p: 0.875, v: 170 },
            { p: 1, v: 210 },
          ],
        },
        requires: { base: "walk/chest" },
      },
    },
  },

  // 11. Left Arm Lower
  {
    id: "armL_lower",
    keyframes: {
      fk: {
        values: {
          length: 58,
          rotation: [
            { p: 0, v: 20 },
            { p: 0.125, v: 35 },
            { p: 0.25, v: 45 },
            { p: 0.375, v: 25 },
            { p: 0.5, v: 20 },
            { p: 0.625, v: 35 },
            { p: 0.75, v: 45 },
            { p: 0.875, v: 25 },
            { p: 1, v: 20 },
          ],
        },
        requires: { base: "walk/armL_upper" },
      },
    },
  },

  // 12. Right Arm Upper (Background - In phase with Left Leg)
  {
    id: "armR_upper",
    keyframes: {
      fk: {
        values: {
          length: 62,
          rotation: [
            { p: 0, v: 150 }, // Forward swing
            { p: 0.125, v: 170 },
            { p: 0.25, v: 210 }, // Back swing
            { p: 0.375, v: 190 },
            { p: 0.5, v: 150 },
            { p: 0.625, v: 170 },
            { p: 0.75, v: 210 },
            { p: 0.875, v: 190 },
            { p: 1, v: 150 },
          ],
        },
        requires: { base: "walk/chest" },
      },
    },
  },

  // 13. Right Arm Lower
  {
    id: "armR_lower",
    keyframes: {
      fk: {
        values: {
          length: 58,
          rotation: [
            { p: 0, v: 45 },
            { p: 0.125, v: 25 },
            { p: 0.25, v: 20 },
            { p: 0.375, v: 35 },
            { p: 0.5, v: 45 },
            { p: 0.625, v: 25 },
            { p: 0.75, v: 20 },
            { p: 0.875, v: 35 },
            { p: 1, v: 45 },
          ],
        },
        requires: { base: "walk/armR_upper" },
      },
    },
  },
];

export const coreWalkerTracks: readonly TrackDefinition[] = [
  // 1. Pelvis (Root)
  {
    id: "pelvis",
    keyframes: {
      transform: {
        values: {
          x: [
            { p: 0, v: 120 },
            { p: 0.5, v: 550 },
            { p: 1, v: 980 },
          ],
          y: [
            { p: 0, v: 230 },
            { p: 0.125, v: 220 },
            { p: 0.25, v: 230 },
            { p: 0.375, v: 220 },
            { p: 0.5, v: 230 },
            { p: 0.625, v: 220 },
            { p: 0.75, v: 230 },
            { p: 0.875, v: 220 },
            { p: 1, v: 230 },
          ],
          rotation: [
            { p: 0, v: -3 },
            { p: 0.25, v: 3 },
            { p: 0.5, v: -3 },
            { p: 0.75, v: 3 },
            { p: 1, v: -3 },
          ],
        },
      },
    },
  },

  // 2. Chest (Spine - Points UP -90deg from Pelvis)
  {
    id: "chest",
    keyframes: {
      fk: {
        values: {
          length: 80,
          rotation: [
            { p: 0, v: -87 },
            { p: 0.25, v: -93 },
            { p: 0.5, v: -87 },
            { p: 0.75, v: -93 },
            { p: 1, v: -87 },
          ],
        },
        requires: { base: "walk/pelvis" },
      },
    },
  },

  // 3. Head (Continues UP 0deg from Chest)
  {
    id: "head",
    keyframes: {
      fk: {
        values: {
          length: 45,
          rotation: [
            { p: 0, v: -3 },
            { p: 0.25, v: 3 },
            { p: 0.5, v: -3 },
            { p: 0.75, v: 3 },
            { p: 1, v: -3 },
          ],
        },
        requires: { base: "walk/chest" },
      },
    },
  },

  // 4. Left Leg Thigh (Foreground - Points DOWN ~90deg from Pelvis)
  {
    id: "legL_thigh",
    keyframes: {
      fk: {
        values: {
          length: 85,
          rotation: [
            { p: 0, v: 65 }, // Forward contact
            { p: 0.125, v: 85 }, // Mid-stance
            { p: 0.25, v: 115 }, // Push-off back
            { p: 0.375, v: 95 }, // Swing forward
            { p: 0.5, v: 65 },
            { p: 0.625, v: 85 },
            { p: 0.75, v: 115 },
            { p: 0.875, v: 95 },
            { p: 1, v: 65 },
          ],
        },
        requires: { base: "walk/pelvis" },
      },
    },
  },

  // 5. Left Leg Shin (Extends from Thigh)
  {
    id: "legL_shin",
    keyframes: {
      fk: {
        values: {
          length: 80,
          rotation: [
            { p: 0, v: 5 },
            { p: 0.125, v: 8 },
            { p: 0.25, v: 25 },
            { p: 0.375, v: 45 },
            { p: 0.5, v: 5 },
            { p: 0.625, v: 8 },
            { p: 0.75, v: 25 },
            { p: 0.875, v: 45 },
            { p: 1, v: 5 },
          ],
        },
        requires: { base: "walk/legL_thigh" },
      },
    },
  },

  // 6. Left Leg Foot (Points FORWARD +X ~-90deg from Shin)
  {
    id: "legL_foot",
    keyframes: {
      fk: {
        values: {
          length: 38,
          rotation: [
            { p: 0, v: -75 },
            { p: 0.125, v: -90 },
            { p: 0.25, v: -105 },
            { p: 0.375, v: -70 },
            { p: 0.5, v: -75 },
            { p: 0.625, v: -90 },
            { p: 0.75, v: -105 },
            { p: 0.875, v: -70 },
            { p: 1, v: -75 },
          ],
        },
        requires: { base: "walk/legL_shin" },
      },
    },
  },

  // 7. Right Leg Thigh (Background - 180deg / 0.5 phase offset)
  {
    id: "legR_thigh",
    keyframes: {
      fk: {
        values: {
          length: 85,
          rotation: [
            { p: 0, v: 115 },
            { p: 0.125, v: 95 },
            { p: 0.25, v: 65 },
            { p: 0.375, v: 85 },
            { p: 0.5, v: 115 },
            { p: 0.625, v: 95 },
            { p: 0.75, v: 65 },
            { p: 0.875, v: 85 },
            { p: 1, v: 115 },
          ],
        },
        requires: { base: "walk/pelvis" },
      },
    },
  },

  // 8. Right Leg Shin
  {
    id: "legR_shin",
    keyframes: {
      fk: {
        values: {
          length: 80,
          rotation: [
            { p: 0, v: 25 },
            { p: 0.125, v: 45 },
            { p: 0.25, v: 5 },
            { p: 0.375, v: 8 },
            { p: 0.5, v: 25 },
            { p: 0.625, v: 45 },
            { p: 0.75, v: 5 },
            { p: 0.875, v: 8 },
            { p: 1, v: 25 },
          ],
        },
        requires: { base: "walk/legR_thigh" },
      },
    },
  },

  // 9. Right Leg Foot
  {
    id: "legR_foot",
    keyframes: {
      fk: {
        values: {
          length: 38,
          rotation: [
            { p: 0, v: -105 },
            { p: 0.125, v: -70 },
            { p: 0.25, v: -75 },
            { p: 0.375, v: -90 },
            { p: 0.5, v: -105 },
            { p: 0.625, v: -70 },
            { p: 0.75, v: -75 },
            { p: 0.875, v: -90 },
            { p: 1, v: -105 },
          ],
        },
        requires: { base: "walk/legR_shin" },
      },
    },
  },
];

export const initialWalkerProject: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "full-body-walker-v5",
  motions: [
    {
      id: "walk",
      trigger: { type: "scroll", source: WALK_SCROLL_SOURCE },
      tracks: coreWalkerTracks,
    },
  ],
};

export const fullBodyWalkerProject: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "full-body-walker-v5",
  motions: [
    {
      id: "walk",
      trigger: { type: "scroll", source: WALK_SCROLL_SOURCE },
      tracks: [...coreWalkerTracks, ...armTracks],
    },
  ],
};
