import { pageInputs, type Contract, type InputSpec, type TargetOf } from "../events/contract";
import type { EventPoint, Input, InputEntry } from "../events/event-list";
import { generationOf, inputSerialsOf, sourceStreamOf, upperBoundAt } from "../events/event-log";
import type { Signal } from "../time/shapes";
import { elapsedOf } from "../time/time";
import { unreachable } from "../utility/unreachable";
import { notifyInputUse, rawTime, type InputChannel } from "./clock-watch";
import { INPUT_EVENTS } from "./inputs";
import { buildState, type State } from "./state";
import { storeCell } from "./store";

/** A retained trigger entry in arrival order, with its insertion `serial`. */
export interface Trigger {
  readonly at: number;
  readonly value: number;
  readonly target?: string;
  readonly serial: number;
  readonly other?: string;
  readonly point?: EventPoint;
}

const NO_TRIGGERS: readonly Trigger[] = Object.freeze([]);

interface TriggersCell {
  list: Trigger[];
  snapshot: readonly Trigger[];
  cursor: number;
  latest: number;
  maxSerial: number;
  seen: Input | undefined;
  seenStream: object | undefined;
  seenGeneration: number;
}

function channelOfValue(contract: unknown, name: string): InputChannel {
  if (contract !== pageInputs) return "events";
  if (name === INPUT_EVENTS.scroll) return "scroll";
  if (name === INPUT_EVENTS.pointerX || name === INPUT_EVENTS.pointerY) return "pointer";
  return "events";
}

function serialAt(serials: readonly number[] | undefined, index: number): number {
  return serials !== undefined ? (serials[index] ?? index + 1) : index + 1;
}

function toTrigger(entry: InputEntry, serial: number): Trigger {
  return {
    at: entry.at,
    value: entry.value,
    serial,
    ...(entry.target === undefined ? {} : { target: entry.target }),
    ...(entry.other === undefined ? {} : { other: entry.other }),
    ...(entry.point === undefined ? {} : { point: entry.point }),
  };
}

/** A `State<number>` reading `"value"` entries of `name` (and `target` when given), starting at 0. */
export function value<
  V extends Record<string, InputSpec>,
  T extends Record<string, InputSpec>,
  K extends keyof V & string,
>(contract: Contract<V, T>, name: K, target?: TargetOf<V[K]> | undefined): State<number> {
  return buildState(
    0,
    (current, entry) => {
      switch (entry.kind) {
        case "value":
          return entry.name === name ? entry.value : current;
        case "trigger":
          return current;
        default:
          return unreachable(entry.kind);
      }
    },
    target === undefined ? {} : { target },
    channelOfValue(contract, name),
  );
}

/** The number held by `name` (and `target` when given) when `trigger` arrived, by arrival order; 0 before any set. */
export function valueAt<
  V extends Record<string, InputSpec>,
  T extends Record<string, InputSpec>,
  K extends keyof V & string,
>(
  _contract: Contract<V, T>,
  name: K,
  trigger: Trigger,
  target?: TargetOf<V[K]> | undefined,
): Signal<number> {
  return (watched, input) => {
    notifyInputUse("events");
    const now = elapsedOf(rawTime(watched).clock);
    const limitAt = now === undefined ? trigger.at : Math.min(now, trigger.at);
    const serials = inputSerialsOf(input);
    const upper = upperBoundAt(input, limitAt);
    for (let index = upper - 1; index >= 0; index -= 1) {
      const entry = input[index];
      if (entry === undefined) continue;
      switch (entry.kind) {
        case "value": {
          if (entry.name !== name) break;
          if (target !== undefined && entry.target !== target) break;
          const entrySerial = serialAt(serials, index);
          if (entry.at === trigger.at && entrySerial >= trigger.serial) break;
          return entry.value;
        }
        case "trigger":
          break;
        default:
          return unreachable(entry.kind);
      }
    }
    return 0;
  };
}

/** Every retained trigger of `name` (and `target` when given) with `at <= now`, in arrival order. */
export function triggers<
  V extends Record<string, InputSpec>,
  T extends Record<string, InputSpec>,
  K extends keyof T & string,
>(
  _contract: Contract<V, T>,
  name: K,
  target?: TargetOf<T[K]> | undefined,
): Signal<readonly Trigger[]> {
  const cellSlot = storeCell<TriggersCell>();

  return (watched, input) => {
    notifyInputUse("events");
    const now = elapsedOf(rawTime(watched).clock);
    const generation = generationOf(input);
    const stream = sourceStreamOf(input);
    const serials = inputSerialsOf(input);

    const sameStream = (cell: TriggersCell): boolean =>
      input === cell.seen || (stream !== undefined && stream === cell.seenStream);

    const canResume = (cell: TriggersCell): boolean => {
      if (now !== undefined && cell.latest > now) return false;
      return sameStream(cell) && generation === cell.seenGeneration;
    };

    const work = cellSlot.own(
      (existing) => !canResume(existing),
      () => ({
        list: [],
        snapshot: NO_TRIGGERS,
        cursor: 0,
        latest: -Infinity,
        maxSerial: -Infinity,
        seen: input,
        seenStream: stream,
        seenGeneration: generation,
      }),
      (existing) => ({
        ...existing,
        list: existing.list.slice(),
      }),
    );

    work.seen = input;
    work.seenStream = stream;
    work.seenGeneration = generation;

    let appended = false;
    let needsSort = false;
    for (let offset = work.cursor; offset < input.length; offset += 1) {
      const entry = input[offset];
      if (entry === undefined) break;
      if (now !== undefined && entry.at > now) break;
      work.cursor = offset + 1;
      work.latest = Math.max(work.latest, entry.at);
      switch (entry.kind) {
        case "value":
          break;
        case "trigger": {
          if (entry.name !== name) break;
          if (target !== undefined && entry.target !== target) break;
          const serial = serialAt(serials, offset);
          if (serial < work.maxSerial) needsSort = true;
          else work.maxSerial = serial;
          work.list.push(toTrigger(entry, serial));
          appended = true;
          break;
        }
        default:
          return unreachable(entry.kind);
      }
    }

    if (needsSort) {
      work.list.sort((a, b) => a.serial - b.serial);
      work.maxSerial = work.list[work.list.length - 1]?.serial ?? -Infinity;
    }
    if (appended) {
      work.snapshot = Object.freeze(work.list.slice());
    }
    return work.snapshot;
  };
}
