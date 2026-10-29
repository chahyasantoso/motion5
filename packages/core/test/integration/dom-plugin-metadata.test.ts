import { describe, expect, it } from "vitest";
import { createDomPatchAdapter } from "../../src/adapters/dom";

/**
 * What belongs to this adapter is serializing a host-declared output before writing it.
 *
 * The metadata channel is the host's now, not a resolved plugin chain's: a caller that knows an
 * output needs a serializer hands one to the adapter. Intentional hiding of internal keys is not
 * this adapter's either; the identified publisher only publishes declared outputs.
 */
describe("DOM plugin metadata (X-2)", () => {
  it("serializes plugin-owned outputs before writing to the DOM", () => {
    const writes: Record<string, unknown>[] = [];
    const stage = { style: {} as Record<string, unknown> };
    const adapter = createDomPatchAdapter(
      stage,
      undefined,
      () => stage,
      (_target, values) => writes.push({ ...values }),
      { outputSerializers: { transform: (value) => `translate(${String(value)}px)` } },
    );
    adapter.apply({
      nodeId: "hero/path",
      revision: 1,
      outputs: { values: { transform: 10 } },
      sourceProgress: 0,
      sourceRevisions: {},
      status: "ready",
      diagnostics: [],
    });
    expect(writes).toEqual([{ transform: "translate(10px)" }]);
  });
});
