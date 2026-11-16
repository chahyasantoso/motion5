import { valueField } from "@gerak/core";
import {
  isLively,
  outsideRanges,
  type DescriptorRanges,
  type Descriptors,
  type StyleCard,
} from "@gerak/moves";
import {
  measureSamples,
  type Beat,
  type ReviewFinder,
  type ReviewPreparation,
  type Samples,
  type SceneModule,
} from "@gerak/tools/scene";
import { qualityNames, rangesOf, styleCards } from "./cards";
import { intentsOf, readDesign, type Design, type Intent } from "./design";
import { describeOffsets } from "./moves";

/** The number a target's value holds at a dotted field path, or none. */
function numberAt(value: unknown, field: string): number | undefined {
  let here = value;
  for (const key of field.split(".")) {
    if (typeof here !== "object" || here === null || Array.isArray(here)) return undefined;
    here = Reflect.get(here, key);
  }
  return typeof here === "number" && Number.isFinite(here) ? here : undefined;
}

/** The amount a field rests at: its table row's, or 0 for a `custom` number and an unknown field. */
function restOfField(field: string): number {
  if (field.startsWith("custom.")) return 0;
  return valueField(field.slice(field.lastIndexOf(".") + 1))?.rest ?? 0;
}

const SHAPE_POINTS = 62;
const MOVED = 1e-4;

/** A number to 2 places, a whole one plain. */
function shown(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

/** The indexes of the first and last step at which `values` changes, or none when it never does. */
function changeSpan(values: readonly number[]): readonly [number, number] | undefined {
  const steps = values.flatMap((value, index) =>
    index > 0 && Math.abs(value - (values[index - 1] ?? value)) > MOVED ? [index] : [],
  );
  const first = steps[0];
  const last = steps.at(-1);
  return first === undefined || last === undefined ? undefined : [first, last];
}

/** `values` at `at` ms, from its first change to its last, as offsets from `rest` at evenly spaced points;
 * none when it never changes. */
function offsetsOf(
  at: readonly number[],
  values: readonly number[],
  rest: number,
): readonly number[] | undefined {
  const span = changeSpan(values);
  if (span === undefined) return undefined;
  const [first, last] = span;
  const from = at[first - 1] ?? 0;
  const to = at[last] ?? from;
  return Array.from({ length: SHAPE_POINTS }, (_, point) => {
    const when = from + ((to - from) * point) / (SHAPE_POINTS - 1);
    const after = Math.min(
      last,
      Math.max(
        first,
        at.findIndex((time) => time >= when),
      ),
    );
    const t0 = at[after - 1] ?? from;
    const t1 = at[after] ?? to;
    const v0 = values[after - 1] ?? 0;
    const v1 = values[after] ?? v0;
    const share = t1 === t0 ? 1 : Math.min(1, Math.max(0, (when - t0) / (t1 - t0)));
    return v0 + (v1 - v0) * share - rest;
  });
}

/** A target's value in one sample: a member by name, or one item of a list member as `<name>.<index>`. */
function targetValue(found: Readonly<Record<string, unknown>>, target: string): unknown {
  if (Object.hasOwn(found, target)) return found[target];
  const dot = target.lastIndexOf(".");
  const list = dot < 0 ? undefined : found[target.slice(0, dot)];
  const index = Number(target.slice(dot + 1));
  return Array.isArray(list) && Number.isInteger(index) && index >= 0 ? list[index] : undefined;
}

/** The targets one intent's target stands for: itself, or every item of a list member as `<name>.<index>`. */
function unitsOf(samples: Samples, target: string): readonly string[] {
  const count = Math.max(
    0,
    ...samples.map(({ targets: found }) => {
      const value = Object.hasOwn(found, target) ? found[target] : undefined;
      return Array.isArray(value) ? value.length : 0;
    }),
  );
  return count === 0 ? [target] : Array.from({ length: count }, (_, index) => `${target}.${index}`);
}

/** A target's field as offsets from rest over the samples inside `span` (all when none), or none when
 * it never moves there. */
function fieldOffsets(
  samples: Samples,
  target: string,
  field: string,
  span: Beat | undefined,
): readonly number[] | undefined {
  const inside = samples.filter(
    ({ at }) => span === undefined || (at >= span.from && at <= span.to),
  );
  return offsetsOf(
    inside.map(({ at }) => at),
    inside.map(({ targets: found }) => numberAt(targetValue(found, target), field) ?? 0),
    restOfField(field),
  );
}

/** The descriptors that lie outside `ranges`, worded for `quality`; none when it fits. */
function missesOf(
  descriptors: Descriptors,
  quality: string,
  ranges: DescriptorRanges,
): readonly string[] {
  return outsideRanges(descriptors, ranges).map(
    ({ key, value, range }) =>
      `${key} ${value.toFixed(2)}, ${quality} wants ${shown(range[0])} to ${shown(range[1])}`,
  );
}

/** One finding for each intent of the module's `design` that names what does not exist or whose field moves
 * outside its quality's ranges; a list member's intent holds for each of its items. */
function designFindings(
  module: SceneModule,
  design: Design,
  samples: Samples,
  cards: readonly StyleCard[],
): readonly string[] {
  const beats = module.beats ?? [];
  const exists = (target: string): boolean =>
    samples.some(({ targets: found }) => targetValue(found, target) !== undefined);
  const check = ({ field, beat, quality }: Intent, target: string): string | undefined => {
    const name = beat === undefined ? `${target}.${field}` : `${target}.${field} (${beat})`;
    const carried = samples.some(
      ({ targets: found }) => numberAt(targetValue(found, target), field) !== undefined,
    );
    if (!carried)
      return `design names the field "${field}" of "${target}", which its value never carries.`;
    const span = beat === undefined ? undefined : beats.find((each) => each.name === beat);
    if (beat !== undefined && span === undefined)
      return `design names the beat "${beat}" for ${target}.${field}, which the module does not have.`;
    const ranges = rangesOf(quality, cards);
    if (ranges === undefined)
      return `design names the quality "${quality}" for ${name}; the qualities are ${qualityNames(cards).join(", ")}.`;
    const offsets = fieldOffsets(samples, target, field, span);
    if (offsets === undefined) return `${name} never moves; ${quality} wants motion`;
    const wants = missesOf(describeOffsets(offsets), quality, ranges);
    return wants.length === 0 ? undefined : `${name}: ${wants.join("; ")}`;
  };
  return intentsOf(design).flatMap((intent) => {
    if (!exists(intent.target))
      return [`design names the target "${intent.target}", which the scene never returns.`];
    return unitsOf(samples, intent.target).flatMap((target) => check(intent, target) ?? []);
  });
}

/** The motions of `field` in the module, leaving out the targets (and, when the design names a beat, only
 * that beat) that the design names for that field. */
export function styleMotions(
  module: SceneModule,
  samples: Samples,
  field: string,
): readonly Shape[] {
  const read = module.design === undefined ? undefined : readDesign(module.design);
  const named = read?.kind === "design" ? intentsOf(read.design) : [];
  return shapesOf(module, samples, [field]).filter(
    (shape) =>
      !named.some(
        (intent) =>
          intent.field === field &&
          (shape.target === intent.target || shape.target.startsWith(`${intent.target}.`)) &&
          (intent.beat === undefined || shape.beat === intent.beat),
      ),
  );
}

/** For a styled module, one finding for each field of its card whose share of lively motions (three or
 * more, leaving out targets the design names for that field) lies outside the card's range. */
function styleFindings(
  module: SceneModule,
  samples: Samples,
  cards: readonly StyleCard[],
): readonly string[] {
  const card = cards.find((each) => each.name === module.style);
  if (card === undefined) return [];
  const percent = (share: number): number => Math.round(share * 100);
  return Object.entries(card.lively).flatMap(([field, range]) => {
    const motions = styleMotions(module, samples, field);
    if (motions.length < 3) return [];
    const lively = motions.filter((shape) => isLively(shape.descriptors)).length;
    const share = lively / motions.length;
    if (share >= range[0] && share <= range[1]) return [];
    return [
      `${field}: ${lively} of ${motions.length} motions lively (${percent(share)}%); ${card.name} wants ${percent(range[0])}% to ${percent(range[1])}% (style)`,
    ];
  });
}

/** One field of one target (an item of a list member as `word.3`) moving in one beat, and how. */
export interface Shape {
  readonly target: string;
  readonly field: string;
  readonly beat?: string;
  readonly descriptors: Descriptors;
}

/** The dotted paths of the numbers a target's value carries in any sample. */
function numberFields(samples: Samples, target: string): readonly string[] {
  const paths = new Set<string>();
  const walk = (value: unknown, prefix: string): void => {
    if (typeof value === "number") {
      if (prefix !== "" && Number.isFinite(value)) paths.add(prefix);
      return;
    }
    if (typeof value !== "object" || value === null || Array.isArray(value)) return;
    for (const [key, inner] of Object.entries(value))
      walk(inner, prefix === "" ? key : `${prefix}.${key}`);
  };
  for (const { targets: found } of samples) walk(targetValue(found, target), "");
  return [...paths];
}

/** The shape of every unit, field (the given ones, else every number it carries) and beat in which the
 * field moves, over samples of the module. */
function shapesOf(
  module: SceneModule,
  samples: Samples,
  only?: readonly string[],
): readonly Shape[] {
  const spans: readonly (Beat | undefined)[] =
    module.beats === undefined || module.beats.length === 0 ? [undefined] : module.beats;
  const targets = [...new Set(samples.flatMap(({ targets: found }) => Object.keys(found)))].flatMap(
    (target) => unitsOf(samples, target),
  );
  return targets.flatMap((target) =>
    (only ?? numberFields(samples, target)).flatMap((field) => {
      const carried = samples.some(
        ({ targets: found }) => numberAt(targetValue(found, target), field) !== undefined,
      );
      if (!carried) return [];
      return spans.flatMap((span) => {
        const offsets = fieldOffsets(samples, target, field, span);
        if (offsets === undefined) return [];
        const descriptors = describeOffsets(offsets);
        return [
          span === undefined
            ? { target, field, descriptors }
            : { target, field, beat: span.name, descriptors },
        ];
      });
    }),
  );
}

/** The shape of each field each target of the module moves, in each beat (the whole run when it has
 * none), sampled every step over its run. */
export function measureShapes(module: SceneModule): readonly Shape[] {
  return shapesOf(module, measureSamples(module));
}

/** The review finder for a pieces root's style cards: the findings of a module's `design` and of its `style`. */
export function libraryFinder(cards: readonly StyleCard[]): ReviewFinder {
  return ({ module, samples }) => {
    const read = module.design === undefined ? undefined : readDesign(module.design);
    if (read?.kind === "refused") return [`The module's ${read.reason}`];
    const design = read?.design;
    return [
      ...(design === undefined ? [] : designFindings(module, design, samples, cards)),
      ...styleFindings(module, samples, cards),
    ];
  };
}

/** The finder for the scene under `root`, or why the review cannot go on: a `style` that names no card. */
export async function prepare(root: string, module: SceneModule): Promise<ReviewPreparation> {
  if (module.style === undefined && module.design === undefined)
    return { kind: "ready", find: () => [] };
  const { cards, problems } = await styleCards(root);
  if (module.style !== undefined && !cards.some((card) => card.name === module.style)) {
    const names = cards.map((card) => card.name).join(", ");
    return {
      kind: "refused",
      message: [
        `style "${module.style}" names no card; ${names === "" ? "there are none" : `the cards are ${names}`}`,
        ...problems,
      ].join("\n"),
    };
  }
  return { kind: "ready", find: libraryFinder(cards) };
}
