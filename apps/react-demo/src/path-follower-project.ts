import type { ProjectDefinition } from "@motion5/core";

/** An authored outline becomes a cubic path, and a card follows that path by arc length. */
export const pathFollowerProject: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "follow",
      trigger: { type: "manual" },
      tracks: [
        {
          id: "outline",
          output: { model: "Anchors2d" },
          input: {
            values: [
              { id: "a", cells: { x: 0, y: 0, outX: 10 } },
              { id: "b", cells: { x: 100, y: 0, inX: -10 } },
            ],
          },
        },
        {
          id: "path",
          output: { plugin: "anchorsToCubic" },
          input: { requires: { anchors: "outline" } },
        },
        {
          id: "card",
          output: { plugin: "bezier" },
          input: { requires: { path: "path" } },
        },
      ],
    },
  ],
};
