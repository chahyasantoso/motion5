/** The sink of an exhaustive switch: a value TypeScript proves cannot arrive. */
export function unreachable(value: never): never {
  throw new TypeError(`Unreachable value: ${JSON.stringify(value)}`);
}
