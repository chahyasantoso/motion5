import { stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));

/** Pages an agent reads whole before writing a piece, and the most bytes each may hold. A ceiling may only go down. */
const CEILINGS: readonly (readonly [string, number])[] = [
  ["packages/core/docs/core.md", 9_000],
  ["packages/stage/docs/stage.md", 10_500],
];

describe("pages read whole stay under their ceiling", () => {
  for (const [path, ceiling] of CEILINGS) {
    it(`${path} is at most ${ceiling} bytes`, async () => {
      const { size } = await stat(join(ROOT, path));
      expect(
        size,
        `${path} holds ${size} bytes; move what one kind of piece needs to a page read on demand`,
      ).toBeLessThanOrEqual(ceiling);
    });
  }
});
