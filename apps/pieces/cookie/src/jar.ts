import { seeded } from "@gerak/core";
import {
  BUILDER_CAPACITY,
  BUILDER_MIN_SEAL,
  JAR_ADD_EVENT,
  JAR_MIX_EVENT,
  JAR_REMOVE_EVENT,
  JAR_RESET_EVENT,
  JAR_SEALED_VALUE,
  SPOTLIGHT_ZONES,
  jarSlotName,
  type JarSlotName,
  type SpotlightZone,
} from "./contract.ts";

export interface JarState {
  readonly slots: readonly SpotlightZone[];
  readonly mixes: number;
  readonly sealed: boolean;
  readonly sealId: number;
}

export type EventSend =
  | {
      readonly kind: "value";
      readonly name: JarSlotName | typeof JAR_SEALED_VALUE;
      readonly value: number;
    }
  | {
      readonly kind: "trigger";
      readonly name:
        | typeof JAR_ADD_EVENT
        | typeof JAR_REMOVE_EVENT
        | typeof JAR_MIX_EVENT
        | typeof JAR_RESET_EVENT;
      readonly value: number;
    };

export interface JarUpdate {
  readonly jar: JarState;
  readonly sends: readonly EventSend[];
}

export const INITIAL_JAR: JarState = {
  slots: [],
  mixes: 0,
  sealed: false,
  sealId: 0,
};

/** A shuffled mix of `count` flavors from `seed`, never matching a full `previous` of that count. */
export function smartMix(
  count: number,
  seed: number,
  previous: readonly SpotlightZone[],
): SpotlightZone[] {
  const rand = seeded(seed);
  const pool: SpotlightZone[] = [...SPOTLIGHT_ZONES];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const a = pool[i];
    const b = pool[j];
    if (a !== undefined && b !== undefined) {
      pool[i] = b;
      pool[j] = a;
    }
  }
  const next: SpotlightZone[] = [];
  for (let i = 0; i < count; i += 1) next.push(pool[i % pool.length] ?? 0);
  const unchanged =
    previous.length === count && count > 0 && next.every((zone, i) => zone === previous[i]);
  if (unchanged) next[0] = SPOTLIGHT_ZONES[((next[0] ?? 0) + 1) % SPOTLIGHT_ZONES.length] ?? 0;
  return next;
}

export function addCookie(jar: JarState, flavor: SpotlightZone): JarUpdate {
  if (jar.sealed || jar.slots.length >= BUILDER_CAPACITY) {
    return { jar, sends: [] };
  }
  const slotIndex = jar.slots.length;
  return {
    jar: { ...jar, slots: [...jar.slots, flavor] },
    sends: [
      { kind: "value", name: jarSlotName(slotIndex), value: flavor + 1 },
      { kind: "trigger", name: JAR_ADD_EVENT, value: slotIndex },
    ],
  };
}

export function removeFlavor(jar: JarState, flavor: SpotlightZone): JarUpdate {
  if (jar.sealed) return { jar, sends: [] };
  const removeIdx = jar.slots.lastIndexOf(flavor);
  if (removeIdx === -1) return { jar, sends: [] };
  const nextSlots = jar.slots.filter((_, i) => i !== removeIdx);
  const sends: EventSend[] = [{ kind: "trigger", name: JAR_REMOVE_EVENT, value: removeIdx }];
  for (let i = removeIdx; i < jar.slots.length; i += 1) {
    const prevVal = (jar.slots[i] ?? 0) + 1;
    const nextSlot = nextSlots[i];
    const nextVal = nextSlot === undefined ? 0 : nextSlot + 1;
    if (nextVal !== prevVal) {
      sends.push({ kind: "value", name: jarSlotName(i), value: nextVal });
    }
  }
  return { jar: { ...jar, slots: nextSlots }, sends };
}

export function mixJar(jar: JarState): JarUpdate {
  if (jar.sealed) return { jar, sends: [] };
  const count = jar.slots.length === 0 ? BUILDER_CAPACITY : jar.slots.length;
  const mixes = jar.mixes + 1;
  const flavors = smartMix(count, mixes * 97, jar.slots);
  const sends: EventSend[] = [{ kind: "trigger", name: JAR_MIX_EVENT, value: count }];
  for (let i = 0; i < count; i += 1) {
    const prevSlot = jar.slots[i];
    const prevVal = prevSlot === undefined ? 0 : prevSlot + 1;
    const nextVal = (flavors[i] ?? 0) + 1;
    if (nextVal !== prevVal) {
      sends.push({ kind: "value", name: jarSlotName(i), value: nextVal });
    }
  }
  return { jar: { ...jar, slots: flavors, mixes }, sends };
}

export function toggleSeal(jar: JarState): JarUpdate {
  if (jar.sealed) {
    return {
      jar: { ...jar, sealed: false },
      sends: [{ kind: "value", name: JAR_SEALED_VALUE, value: 0 }],
    };
  }
  if (jar.slots.length < BUILDER_MIN_SEAL) return { jar, sends: [] };
  const sealId = jar.sealId + 1;
  return {
    jar: { ...jar, sealed: true, sealId },
    sends: [{ kind: "value", name: JAR_SEALED_VALUE, value: sealId }],
  };
}

export function resetJar(jar: JarState): JarUpdate {
  if (jar.sealed || jar.slots.length === 0) return { jar, sends: [] };
  const sends: EventSend[] = [{ kind: "trigger", name: JAR_RESET_EVENT, value: 0 }];
  for (let i = 0; i < jar.slots.length; i += 1) {
    sends.push({ kind: "value", name: jarSlotName(i), value: 0 });
  }
  return { jar: { ...jar, slots: [], sealed: false }, sends };
}
