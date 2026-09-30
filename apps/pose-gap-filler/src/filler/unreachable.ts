/**
 * The `never` default of every exhaustive `switch` over a closed union. The parameter type is the
 * compile-time check (a new variant stops the build at every switch that misses it); the throw is
 * the runtime refusal of a value that arrived untyped.
 */
export function unreachable(value: never, what: string): never {
  throw new Error(`Unhandled ${what}: ${JSON.stringify(value)}`);
}
