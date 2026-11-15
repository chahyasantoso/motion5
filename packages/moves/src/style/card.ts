import { VALUE_FIELDS } from "../fields/pose";
import { DESCRIPTOR_KEYS, type DescriptorRanges } from "./qualities";

/** A brief's style: the qualities it names, the share of lively motion each field holds, and its tokens and habits. */
export interface StyleCard {
  readonly name: string;
  readonly description: string;
  readonly qualities: Readonly<Record<string, DescriptorRanges>>;
  /** Per field, the share of that field's motions in a piece that must be lively, as [low, high]. */
  readonly lively: Readonly<Partial<Record<keyof typeof VALUE_FIELDS, readonly [number, number]>>>;
  readonly tokens: Readonly<Record<string, string>>;
  readonly habits: readonly string[];
}

const KEBAB = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const made = new WeakSet<object>();

/** Whether `value` is a card `defineStyle` returned itself. */
export function isStyleCard(value: unknown): value is StyleCard {
  return typeof value === "object" && value !== null && made.has(value);
}

function problemWith(card: StyleCard): string | undefined {
  if (!KEBAB.test(card.name)) return `style name "${card.name}" is not lower kebab-case`;
  if (card.description.trim() === "") return `style "${card.name}" has an empty description`;
  for (const [quality, ranges] of Object.entries(card.qualities)) {
    if (!KEBAB.test(quality)) return `quality "${quality}" is not lower kebab-case`;
    for (const [key, range] of Object.entries(ranges)) {
      if (!DESCRIPTOR_KEYS.some((known) => known === key))
        return `quality "${quality}" ranges over "${key}", which is not a descriptor`;
      if (!Array.isArray(range) || range.length !== 2 || range[0] > range[1])
        return `quality "${quality}" has a reversed or malformed range for "${key}"`;
    }
  }
  for (const [field, range] of Object.entries(card.lively)) {
    if (!Object.hasOwn(VALUE_FIELDS, field))
      return `lively range for "${field}", which is not a value field`;
    const ok =
      Array.isArray(range) &&
      range.length === 2 &&
      range.every((end) => typeof end === "number") &&
      range[0] >= 0 &&
      range[0] <= range[1] &&
      range[1] <= 1;
    if (!ok) return `lively range for "${field}" is not two numbers with 0 <= low <= high <= 1`;
  }
  for (const token of Object.keys(card.tokens))
    if (!token.startsWith("--")) return `token "${token}" does not start with "--"`;
  return undefined;
}

function freezeDeep<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const inner of Object.values(value)) freezeDeep(inner);
  }
  return value;
}

/** A frozen copy of the card, or an error naming its first problem. */
export function defineStyle(card: StyleCard): StyleCard {
  const copy: StyleCard = structuredClone(card);
  const problem = problemWith(copy);
  if (problem !== undefined) throw new Error(problem);
  freezeDeep(copy);
  made.add(copy);
  return copy;
}
