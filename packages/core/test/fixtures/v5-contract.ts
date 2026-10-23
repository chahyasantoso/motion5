export const minimalV5Project = {
  schemaVersion: 5,
  motions: [],
  freeTracks: [],
} as const;

export const freeTrackProject = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [{ id: "pointer" }],
    },
  ],
  freeTracks: [{ id: "cursor" }],
} as const;
