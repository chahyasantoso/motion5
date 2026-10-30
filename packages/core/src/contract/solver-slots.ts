/**
 * Carries a solver's goal dict: member id -> node, one goal per chain leaf. Named ids can be
 * checked; a positional pairing cannot. */

/** The `requires` slot whose authored value is a solver's goal dict rather than a source id. */
export const PLUGIN_GOALS_SLOT = "targets";
