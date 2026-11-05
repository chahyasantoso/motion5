import type { Structure } from "../contract/v5";

/** One resolved binding: source id, output set, and the source's structure when parsed. */
export interface BoundSlot {
  readonly sourceId: string;
  readonly values: unknown;
  readonly structure?: Structure<unknown>;
}

export interface BoundSingle {
  readonly kind: "single";
  readonly bound: BoundSlot;
}

export interface BoundMap {
  readonly kind: "map";
  readonly members: Readonly<Record<string, BoundSlot>>;
}

export type BoundSlotEntry = BoundSingle | BoundMap;
export type BoundSlots = Readonly<Record<string, BoundSlotEntry>>;
