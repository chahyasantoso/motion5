import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Source guards, for the same reason C-3 in motion-track-resolution.test.ts is one. Both entry
// construction paths already behave identically, so the shape difference between them is invisible
// to behavioral tests right up until some consumer counts keys. Section 3.2 of the plan sanctions
// the conditional-spread idiom; these assertions are what keep it applied everywhere.
const ENGINE_SOURCE = readFileSync(
  fileURLToPath(new URL("../../../src/engine.ts", import.meta.url)),
  "utf8",
);
const MOTION_TEST_SOURCE = readFileSync(
  fileURLToPath(new URL("../domain/motion.test.ts", import.meta.url)),
  "utf8",
);
const CONDITIONAL_DURATION = /\.\.\.\(duration === undefined \? \{\} : \{ duration \}\)/g;

describe("Motion track entry shape", () => {
  it("never builds an entry with an explicitly undefined duration", () => {
    // `{ id, duration: nodes.get(id)?.duration }` makes `"duration" in entry` true-with-undefined
    // on the load path while the hook-built entries omit the key, for entries that are otherwise
    // the same. C-2 asserts the key set, but only on a directly constructed Motion.
    expect(ENGINE_SOURCE).not.toMatch(/duration: nodes\.get\(/);
  });

  it("uses the conditional-spread idiom at every entry construction site", () => {
    // Three sites: the load-time loop, addMotionTrack, and replaceMotionTrack.
    expect(ENGINE_SOURCE.match(CONDITIONAL_DURATION) ?? []).toHaveLength(3);
  });

  it("keeps compiled Track instances out of entry-shaped fixtures", () => {
    // Grep gate 6.3 bans `track:` inside a MotionTrackEntry literal. These fixtures are no longer
    // typed as entries, so typecheck is happy, but they still read as one and the next person to
    // run that grep stops here for nothing.
    expect(MOTION_TEST_SOURCE).not.toMatch(/^\s+track: registry\.register\(/m);
  });
});
