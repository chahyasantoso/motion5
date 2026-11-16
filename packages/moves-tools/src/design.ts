/** A field's intended quality: one name for the whole run, or a name per beat. */
export type FieldIntent = string | Readonly<Record<string, string>>;

/** A piece's `design`: target name to field name to the quality its motion should have. */
export type Design = Readonly<Record<string, Readonly<Record<string, FieldIntent>>>>;

/** One intended quality, flattened: a target's field, the beat it is measured in, and the quality's name. */
export interface Intent {
  readonly target: string;
  readonly field: string;
  readonly beat: string | undefined;
  readonly quality: string;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** A `design` export read, or why it is not one; names are checked by the tools that use them. */
export type DesignRead =
  | { readonly kind: "design"; readonly design: Design }
  | { readonly kind: "refused"; readonly reason: string };

/** A `design` export read as a `Design`, or why it is not one; names are checked by the tools that use them. */
export function readDesign(value: unknown): DesignRead {
  const shape =
    "`design` maps target names to fields, each field to a quality name or to a record of beat name to quality name.";
  if (!isRecord(value)) return { kind: "refused", reason: shape };
  const design: Record<string, Record<string, FieldIntent>> = {};
  for (const [target, fields] of Object.entries(value)) {
    if (!isRecord(fields))
      return { kind: "refused", reason: `${shape} "${target}" is not a record of fields.` };
    const read: Record<string, FieldIntent> = {};
    for (const [field, intent] of Object.entries(fields)) {
      if (typeof intent === "string") read[field] = intent;
      else if (
        isRecord(intent) &&
        Object.values(intent).every((name) => typeof name === "string")
      ) {
        const beats: Record<string, string> = {};
        for (const [beat, name] of Object.entries(intent))
          if (typeof name === "string") beats[beat] = name;
        read[field] = beats;
      } else return { kind: "refused", reason: `${shape} "${target}.${field}" is neither.` };
    }
    design[target] = read;
  }
  return { kind: "design", design };
}

/** Every intended quality of a design, one per target, field and beat, in the design's order. */
export function intentsOf(design: Design): readonly Intent[] {
  return Object.entries(design).flatMap(([target, fields]) =>
    Object.entries(fields).flatMap(([field, intent]): readonly Intent[] =>
      typeof intent === "string"
        ? [{ target, field, beat: undefined, quality: intent }]
        : Object.entries(intent).map(([beat, quality]) => ({ target, field, beat, quality })),
    ),
  );
}
