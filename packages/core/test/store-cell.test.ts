import { describe, expect, it } from "vitest";
import {
  createStore,
  ownCell,
  restore,
  snapshot,
  storeCell,
  withProbeStore,
  withStore,
} from "../src/index";

interface BoxCell {
  version: number;
  items: number[];
}

describe("ownCell", () => {
  it("reuses in the same epoch, copies on write in a probe store, and gives a fresh cell on reset", () => {
    const slot = storeCell<BoxCell>();
    const parent = createStore();
    let shouldReset = false;

    const read = (): BoxCell =>
      ownCell(
        slot,
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

  it("copies on write after snapshot and restore without mutating the captured snapshot", () => {
    const slot = storeCell<BoxCell>();
    const store = createStore();

    const read = (): BoxCell =>
      ownCell(
        slot,
        () => false,
        () => ({ version: 1, items: [] }),
        (cur) => ({ version: cur.version, items: cur.items.slice() }),
      );

    withStore(store, () => {
      const initial = read();
      initial.items.push(10);
      const snap = snapshot(store);

      const afterSnap = read();
      expect(afterSnap).not.toBe(initial);
      afterSnap.items.push(20);
      expect(initial.items).toEqual([10]);

      restore(store, snap);
      const afterRestore = read();
      expect(afterRestore).not.toBe(initial);
      expect(afterRestore.items).toEqual([10]);
      afterRestore.items.push(30);

      restore(store, snap);
      expect(read().items).toEqual([10]);
    });
  });
});
