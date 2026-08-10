export const minimalV5Project = {
  schemaVersion: 5,
  motions: [],
  freeTracks: [],
} as const;

export const perspectiveWarningProject = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [{ id: "tilt", keyframes: { rotationY: {} } }],
    },
  ],
} as const;

export const freeTrackProject = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [
        {
          id: "pointer",
          observes: [{ source: "~/cursor", role: "input", target: "position" }],
        },
      ],
    },
  ],
  freeTracks: [{ id: "cursor" }],
} as const;

export const cyclicProject = {
  schemaVersion: 5,
  motions: [
    {
      id: "rig",
      trigger: { type: "manual" },
      tracks: [
        { id: "a", observes: [{ source: "b" }] },
        { id: "b", observes: [{ source: "a" }] },
      ],
    },
  ],
} as const;
