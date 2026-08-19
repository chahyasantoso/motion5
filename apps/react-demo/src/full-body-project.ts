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
 */
export const armTracks: readonly TrackDefinition[] = [
  // 10. Left Arm Upper (Foreground - Observes Chest which is -90deg UP, so 180deg hangs DOWN)
  {
    id: "armL_upper",
    keyframes: {
      fk: {
        length: {
          stops: [
            { p: 0, v: 62 },
            { p: 1, v: 62 },
          ],
        },
        rotation: {
          stops: [
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
      },
    },
    observes: [
      {
        source: "walk/chest",
        role: "input",
        projection: {
          map: {
            x: "parentX",
            y: "parentY",
            rotation: "parentRotation",
          },
        },
      },
    ],
  },

  // 11. Left Arm Lower
  {
    id: "armL_lower",
    keyframes: {
      fk: {
        length: {
          stops: [
            { p: 0, v: 58 },
            { p: 1, v: 58 },
          ],
        },
        rotation: {
          stops: [
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
      },
    },
    observes: [
      {
        source: "walk/armL_upper",
        role: "input",
        projection: {
          map: {
            x: "parentX",
            y: "parentY",
            rotation: "parentRotation",
          },
        },
      },
    ],
  },

  // 12. Right Arm Upper (Background - In phase with Left Leg)
  {
    id: "armR_upper",
    keyframes: {
      fk: {
        length: {
          stops: [
            { p: 0, v: 62 },
            { p: 1, v: 62 },
          ],
        },
        rotation: {
          stops: [
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
      },
    },
    observes: [
      {
        source: "walk/chest",
        role: "input",
        projection: {
          map: {
            x: "parentX",
            y: "parentY",
            rotation: "parentRotation",
          },
        },
      },
    ],
  },

  // 13. Right Arm Lower
  {
    id: "armR_lower",
    keyframes: {
      fk: {
        length: {
          stops: [
            { p: 0, v: 58 },
            { p: 1, v: 58 },
          ],
        },
        rotation: {
          stops: [
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
      },
    },
    observes: [
      {
        source: "walk/armR_upper",
        role: "input",
        projection: {
          map: {
            x: "parentX",
            y: "parentY",
            rotation: "parentRotation",
          },
        },
      },
    ],
  },
];

export const coreWalkerTracks: readonly TrackDefinition[] = [
  // 1. Pelvis (Root)
  {
    id: "pelvis",
    keyframes: {
      transform: {
        x: {
          stops: [
            { p: 0, v: 120 },
            { p: 0.5, v: 550 },
            { p: 1, v: 980 },
          ],
        },
        y: {
          stops: [
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
        },
        rotation: {
          stops: [
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
        length: {
          stops: [
            { p: 0, v: 80 },
            { p: 1, v: 80 },
          ],
        },
        rotation: {
          stops: [
            { p: 0, v: -87 },
            { p: 0.25, v: -93 },
            { p: 0.5, v: -87 },
            { p: 0.75, v: -93 },
            { p: 1, v: -87 },
          ],
        },
      },
    },
    observes: [
      {
        source: "walk/pelvis",
        role: "input",
        projection: {
          map: {
            x: "parentX",
            y: "parentY",
            rotation: "parentRotation",
          },
        },
      },
    ],
  },

  // 3. Head (Continues UP 0deg from Chest)
  {
    id: "head",
    keyframes: {
      fk: {
        length: {
          stops: [
            { p: 0, v: 45 },
            { p: 1, v: 45 },
          ],
        },
        rotation: {
          stops: [
            { p: 0, v: -3 },
            { p: 0.25, v: 3 },
            { p: 0.5, v: -3 },
            { p: 0.75, v: 3 },
            { p: 1, v: -3 },
          ],
        },
      },
    },
    observes: [
      {
        source: "walk/chest",
        role: "input",
        projection: {
          map: {
            x: "parentX",
            y: "parentY",
            rotation: "parentRotation",
          },
        },
      },
    ],
  },

  // 4. Left Leg Thigh (Foreground - Points DOWN ~90deg from Pelvis)
  {
    id: "legL_thigh",
    keyframes: {
      fk: {
        length: {
          stops: [
            { p: 0, v: 85 },
            { p: 1, v: 85 },
          ],
        },
        rotation: {
          stops: [
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
      },
    },
    observes: [
      {
        source: "walk/pelvis",
        role: "input",
        projection: {
          map: {
            x: "parentX",
            y: "parentY",
            rotation: "parentRotation",
          },
        },
      },
    ],
  },

  // 5. Left Leg Shin (Extends from Thigh)
  {
    id: "legL_shin",
    keyframes: {
      fk: {
        length: {
          stops: [
            { p: 0, v: 80 },
            { p: 1, v: 80 },
          ],
        },
        rotation: {
          stops: [
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
      },
    },
    observes: [
      {
        source: "walk/legL_thigh",
        role: "input",
        projection: {
          map: {
            x: "parentX",
            y: "parentY",
            rotation: "parentRotation",
          },
        },
      },
    ],
  },

  // 6. Left Leg Foot (Points FORWARD +X ~-90deg from Shin)
  {
    id: "legL_foot",
    keyframes: {
      fk: {
        length: {
          stops: [
            { p: 0, v: 38 },
            { p: 1, v: 38 },
          ],
        },
        rotation: {
          stops: [
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
      },
    },
    observes: [
      {
        source: "walk/legL_shin",
        role: "input",
        projection: {
          map: {
            x: "parentX",
            y: "parentY",
            rotation: "parentRotation",
          },
        },
      },
    ],
  },

  // 7. Right Leg Thigh (Background - 180deg / 0.5 phase offset)
  {
    id: "legR_thigh",
    keyframes: {
      fk: {
        length: {
          stops: [
            { p: 0, v: 85 },
            { p: 1, v: 85 },
          ],
        },
        rotation: {
          stops: [
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
      },
    },
    observes: [
      {
        source: "walk/pelvis",
        role: "input",
        projection: {
          map: {
            x: "parentX",
            y: "parentY",
            rotation: "parentRotation",
          },
        },
      },
    ],
  },

  // 8. Right Leg Shin
  {
    id: "legR_shin",
    keyframes: {
      fk: {
        length: {
          stops: [
            { p: 0, v: 80 },
            { p: 1, v: 80 },
          ],
        },
        rotation: {
          stops: [
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
      },
    },
    observes: [
      {
        source: "walk/legR_thigh",
        role: "input",
        projection: {
          map: {
            x: "parentX",
            y: "parentY",
            rotation: "parentRotation",
          },
        },
      },
    ],
  },

  // 9. Right Leg Foot
  {
    id: "legR_foot",
    keyframes: {
      fk: {
        length: {
          stops: [
            { p: 0, v: 38 },
            { p: 1, v: 38 },
          ],
        },
        rotation: {
          stops: [
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
      },
    },
    observes: [
      {
        source: "walk/legR_shin",
        role: "input",
        projection: {
          map: {
            x: "parentX",
            y: "parentY",
            rotation: "parentRotation",
          },
        },
      },
    ],
  },
];

export const initialWalkerProject: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "full-body-walker-v5",
  motions: [
    {
      id: "walk",
      trigger: { type: "scroll", source: WALK_SCROLL_SOURCE }, // can this source be something
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
