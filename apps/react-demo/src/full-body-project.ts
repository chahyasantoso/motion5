import type { ProjectDefinition, TrackDefinition } from "@motion5/core";

/**
 * Serializable scroll source key. Core never resolves it; the host maps it to a real ScrollSource
 * at the composition root. See ADR-030.
 */
export const WALK_SCROLL_SOURCE = "walk";

export const coreWalkerTracks: readonly TrackDefinition[] = [
  // 1. Pelvis (Root record track)
  {
    id: "pelvis",
    input: {
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

  // 2. Body Aggregate Table (Chest, Head, Legs)
  {
    id: "body",
    input: {
      values: [
        {
          id: "chest",
          cells: {
            length: 80,
            rotation: [
              { p: 0, v: -87 },
              { p: 0.25, v: -93 },
              { p: 0.5, v: -87 },
              { p: 0.75, v: -93 },
              { p: 1, v: -87 },
            ],
          },
        },
        {
          id: "head",
          cells: {
            parentId: "chest",
            length: 45,
            rotation: [
              { p: 0, v: -3 },
              { p: 0.25, v: 3 },
              { p: 0.5, v: -3 },
              { p: 0.75, v: 3 },
              { p: 1, v: -3 },
            ],
          },
        },
        {
          id: "legL_thigh",
          cells: {
            length: 85,
            rotation: [
              { p: 0, v: 65 },
              { p: 0.125, v: 85 },
              { p: 0.25, v: 115 },
              { p: 0.375, v: 95 },
              { p: 0.5, v: 65 },
              { p: 0.625, v: 85 },
              { p: 0.75, v: 115 },
              { p: 0.875, v: 95 },
              { p: 1, v: 65 },
            ],
          },
        },
        {
          id: "legL_shin",
          cells: {
            parentId: "legL_thigh",
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
        },
        {
          id: "legL_foot",
          cells: {
            parentId: "legL_shin",
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
        },
        {
          id: "legR_thigh",
          cells: {
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
        },
        {
          id: "legR_shin",
          cells: {
            parentId: "legR_thigh",
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
        },
        {
          id: "legR_foot",
          cells: {
            parentId: "legR_shin",
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
        },
      ],
    },
  },

  // 3. Solved Table
  {
    id: "solved",
    input: {
      values: [
        "chest",
        "head",
        "legL_thigh",
        "legL_shin",
        "legL_foot",
        "legR_thigh",
        "legR_shin",
        "legR_foot",
      ].map((id) => ({ id, cells: { rotation: 0 } })),
    },
  },

  // 4. Pose Track (fk plugin)
  {
    id: "pose",
    plugin: "fk",
    input: {
      values: {},
      requires: {
        chain: "walk/body",
        solved: "walk/solved",
        base: "walk/pelvis",
      },
    },
  },
];

export const armTracks: readonly TrackDefinition[] = [
  // 1. Arms Body Table
  {
    id: "arms-body",
    input: {
      values: [
        {
          id: "chest",
          cells: {
            length: 80,
            rotation: [
              { p: 0, v: -87 },
              { p: 0.25, v: -93 },
              { p: 0.5, v: -87 },
              { p: 0.75, v: -93 },
              { p: 1, v: -87 },
            ],
          },
        },
        {
          id: "armL_upper",
          cells: {
            parentId: "chest",
            length: 62,
            rotation: [
              { p: 0, v: 210 },
              { p: 0.125, v: 190 },
              { p: 0.25, v: 150 },
              { p: 0.375, v: 170 },
              { p: 0.5, v: 210 },
              { p: 0.625, v: 190 },
              { p: 0.75, v: 150 },
              { p: 0.875, v: 170 },
              { p: 1, v: 210 },
            ],
          },
        },
        {
          id: "armL_lower",
          cells: {
            parentId: "armL_upper",
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
        },
        {
          id: "armR_upper",
          cells: {
            parentId: "chest",
            length: 62,
            rotation: [
              { p: 0, v: 150 },
              { p: 0.125, v: 170 },
              { p: 0.25, v: 210 },
              { p: 0.375, v: 190 },
              { p: 0.5, v: 150 },
              { p: 0.625, v: 170 },
              { p: 0.75, v: 210 },
              { p: 0.875, v: 190 },
              { p: 1, v: 150 },
            ],
          },
        },
        {
          id: "armR_lower",
          cells: {
            parentId: "armR_upper",
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
        },
      ],
    },
  },

  // 2. Arms Solved Table
  {
    id: "arms-solved",
    input: {
      values: ["chest", "armL_upper", "armL_lower", "armR_upper", "armR_lower"].map((id) => ({
        id,
        cells: { rotation: 0 },
      })),
    },
  },

  // 3. Arms Pose Track (fk plugin)
  {
    id: "arms-pose",
    plugin: "fk",
    input: {
      values: {},
      requires: {
        chain: "walk/arms-body",
        solved: "walk/arms-solved",
        base: "walk/pelvis",
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
