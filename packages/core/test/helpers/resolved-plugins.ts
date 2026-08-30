import type { PluginComposer, PluginDefinition, ResolvedPlugins } from "../../src/domain/plugins";

/** A compose-stage plugin that claims no key, which is all `Track` needs to run a chain. */
export function createPlugin(name: string, compose: PluginComposer): PluginDefinition {
  return { name, compose };
}

/**
 * The resolver's output for a fixed plugin chain, with every other member empty.
 *
 * One owner, because `Track` reads seven members of `ResolvedPlugins` and a per-file copy of this
 * builder lets two suites disagree about what an unresolved member looks like. Same reason
 * `slotOf` in this directory exists.
 */
export function resolvePlugins(...plugins: readonly PluginDefinition[]): ResolvedPlugins {
  return {
    plugins: Object.freeze(plugins),
    diagnostics: Object.freeze([]),
    authoredKeyframes: Object.freeze({}),
    // Required rather than optional on `ResolvedPlugins`: a resolver that computed bindings and
    // then forgot to report them should not typecheck. See ADR-044.
    requirements: Object.freeze([]),
    internalKeys: Object.freeze([]),
    outputSerializers: Object.freeze({}),
    preparation: Object.freeze({ keyframes: Object.freeze({}), tweenVars: Object.freeze({}) }),
  };
}

/**
 * The same output, plus the flattened authored record the resolver resolved.
 *
 * `authoredKeyframes` is the seam a live value is validated against, so a suite about masking one
 * has to say what was authored in the first place. Wrapped around the builder above rather than
 * declared beside it, so there is still one answer for what an unresolved member looks like.
 */
export function resolveAuthored(
  authoredKeyframes: Readonly<Record<string, unknown>>,
  ...plugins: readonly PluginDefinition[]
): ResolvedPlugins {
  return {
    ...resolvePlugins(...plugins),
    authoredKeyframes: Object.freeze({ ...authoredKeyframes }),
  };
}
