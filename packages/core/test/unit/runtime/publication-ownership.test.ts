import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { code, member } from "../../helpers/source-region";

/**
 * The mechanical publication-ownership scan over `runtime/project-runtime.ts`.
 *
 * This is a scan, and the file is named after what it scans on purpose. It reads source text and
 * counts spellings, so it fails for legal changes as well as for the illegal one it is about, and
 * issue #379 is that it used to live inside `LV-5`, a case named after live values. Two things
 * followed from that. A future member that legitimately reaches the graph through a flush broke a
 * count about ownership, and the failure read as a count problem rather than as an ownership one.
 * And the literal it counts stopped being rare: it was `this.#graph.invalidate(`, a member one
 * caller in `src` ever named, and #375 made it `this.#graph.flush(`, the graph tier's ordinary verb.
 *
 * It also cannot see the thing it guards against. A second owner reaching the same member through a
 * local alias, a bound function, a differently formatted call or a wrapper leaves the count where it
 * was. So it fails for legal changes and passes for the illegal one it was written to catch, and
 * that is the whole of #379.
 *
 * Its scope is therefore stated here rather than assumed. The behavioural half of the claim, that
 * one live write produces exactly one publication for the node it named and that a publication's
 * diagnostics are recorded exactly once, is asserted in `live-value-updates.test.ts` by a spy and a
 * diagnostics snapshot, and that is the evidence the claim actually rests on. This is the cheap
 * mechanical backstop beside it, and a legitimate new call site is expected to move the number
 * below in the same change that adds the site. See ADR-087.
 */

const RUNTIME_SOURCE = fileURLToPath(
  new URL("../../../src/runtime/project-runtime.ts", import.meta.url),
);

/**
 * How many members may spell `this.#graph.flush(`, and `#invalidateSeeds` is the one.
 *
 * A named number rather than a literal in an assertion, so a slice that legitimately adds a call
 * site changes one line that says what it means. Three members carried this pair as three copies
 * before ADR-078 and issue #369.
 */
const PUBLICATION_SPELLINGS = 1;

describe("the mechanical publication-ownership scan over project-runtime.ts", () => {
  it("finds the publish-and-record pair in exactly one member, and counts it once in the file", () => {
    const source = code(RUNTIME_SOURCE);
    const owner = member(source, "#invalidateSeeds(");

    expect(owner).toContain("this.#graph.flush(nodeIds)");
    expect(owner).toContain("this.#diagnostics.recordAll(batch.diagnostics)");
    // A count over the whole file rather than a presence inside one member, which is what caught the
    // third copy issue #369 found. `split` answers one more part than there are occurrences.
    expect(source.split("this.#graph.flush(")).toHaveLength(PUBLICATION_SPELLINGS + 1);
  });

  it("keeps the direct write path out of the publication owner's job", () => {
    const source = code(RUNTIME_SOURCE);
    const write = member(source, "#writeValues(");
    const single = member(source, "#invalidateOne(");

    expect(write).not.toContain("this.#graph.flush(");
    expect(write).not.toContain("this.#diagnostics.recordAll(");
    // The report still lives with the publication that reports it, which keeps skipping and
    // reporting one decision rather than two that could disagree: this member asserts liveness
    // itself and then ends at the one owner above.
    expect(single).toContain("this.#assertLive()");
    expect(single).toContain("this.#invalidateSeeds([nodeId])");
  });
});
