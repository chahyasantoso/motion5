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
