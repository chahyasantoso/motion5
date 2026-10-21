/** The one test for a definition on the retired compose channel. F2 deletes it with that channel. */
export interface ComposeDeclaration {
  readonly compose?: unknown;
}

/** F2 deletes this predicate with the legacy compose channel. */
export function isLegacyComposeDefinition<T extends ComposeDeclaration>(
  definition: T,
): definition is T & Required<Pick<T, "compose">> {
  return typeof definition.compose === "function";
}
