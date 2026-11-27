import { describe, expect, it } from "vitest";
import { createStore, storeCell, withProbeStore, withStore } from "../src/index";

interface BoxCell {
  version: number;
  items: number[];
}

describe("storeCell own", () => {
  it("reuses in the same epoch, copies on write in a probe store, and gives a fresh cell on reset", () => {
    const slot = storeCell<BoxCell>();
    const parent = createStore();
    let shouldReset = false;

    const read = (): BoxCell =>
      slot.own(
        () => shouldReset,
        (prev) => ({ version: (prev?.version ?? 0) + 1, items: [] }),
        (cur) => ({ version: cur.version, items: cur.items.slice() }),
      );

    withStore(parent, () => {
      const c1 = read();
      c1.items.push(1);
      const c2 = read();
      expect(c2).toBe(c1);
      c2.items.push(2);

      const probeResult = withProbeStore(() => {
        const probed = read();
        expect(probed).not.toBe(c1);
        probed.items.push(99);
        expect(read()).toBe(probed);
        return probed.items.slice();
      });
      expect(probeResult).toEqual([1, 2, 99]);
      expect(c1.items).toEqual([1, 2]);

      shouldReset = true;
      const fresh = read();
      expect(fresh).not.toBe(c1);
      expect(fresh).toEqual({ version: 2, items: [] });
      expect(c1.items).toEqual([1, 2]);
    });
  });
});
