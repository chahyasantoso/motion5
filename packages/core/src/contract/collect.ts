/** The single published output carrying collect records. */
export const COLLECT_OUTPUT = "collect";

/** One collect record. Core stamps `id = entryId`; a producer must not supply `id`. */
export type CollectRecord = Readonly<Record<string, unknown>> & { readonly id?: never };
