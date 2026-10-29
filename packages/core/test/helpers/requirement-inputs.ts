/** One plugin's scoped slots in a publisher composition, as the grouped input channel delivers them. */
export type ScopedInputs = Readonly<Record<string, Readonly<Record<string, unknown>>>>;
type ScalarRecord = Readonly<Record<string, number | string | boolean>>;

/** The values one plugin's slot received, or an empty scope when the slot did not arrive. */
export function slotOf(inputs: ScopedInputs, plugin: string, slot: string): ScalarRecord {
  return (inputs[plugin]?.[slot] ?? {}) as ScalarRecord;
}
