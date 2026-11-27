/** Input slot specification: `targets` restricts allowed target names; empty allows any target or none. */
export interface InputSpec {
  readonly targets?: readonly string[];
}

/** Declared contract of named value and trigger inputs. */
export interface Contract<
  V extends Record<string, InputSpec>,
  T extends Record<string, InputSpec>,
> {
  readonly values: V;
  readonly triggers: T;
}

/** Allowed target string type for an `InputSpec`: the declared union when `targets` is listed, else `string`. */
export type TargetOf<S> = S extends { targets: readonly (infer U extends string)[] } ? U : string;

/** Builds a typed input `Contract` declaring `values` and `triggers`. */
export function inputs<const V extends Record<string, InputSpec>>(spec: {
  readonly values: V;
}): Contract<V, {}>;
export function inputs<const T extends Record<string, InputSpec>>(spec: {
  readonly triggers: T;
}): Contract<{}, T>;
export function inputs<
  const V extends Record<string, InputSpec>,
  const T extends Record<string, InputSpec>,
>(spec: { readonly values: V; readonly triggers: T }): Contract<V, T>;
export function inputs(spec: {
  readonly values?: undefined;
  readonly triggers?: undefined;
}): Contract<{}, {}>;
export function inputs<
  const V extends Record<string, InputSpec> = {},
  const T extends Record<string, InputSpec> = {},
>(spec: { readonly values?: V; readonly triggers?: T }): Contract<V | {}, T | {}> {
  return {
    values: spec.values ?? {},
    triggers: spec.triggers ?? {},
  };
}

/** Built-in contract for page-level scroll, pointer and interaction values (`scroll`, `pointer-x`, `pointer-y`, `hovered`, `pressed`, `focused`). */
export const pageInputs: Contract<
  {
    scroll: {};
    "pointer-x": {};
    "pointer-y": {};
    hovered: {};
    pressed: {};
    focused: {};
  },
  {}
> = inputs({
  values: {
    scroll: {},
    "pointer-x": {},
    "pointer-y": {},
    hovered: {},
    pressed: {},
    focused: {},
  },
});
