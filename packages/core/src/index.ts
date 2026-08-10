/**
 * `@motion5/core` public entrypoint.
 *
 * Phase 0 placeholder. This module exists so the toolchain is exercised by
 * something real instead of being configured against an empty tree. The
 * contract layer replaces it in P0-03.
 *
 * The export map is an allow list. Runtime internals such as the graph binding,
 * publisher, patch registry, and project runtime are never exported from here.
 * See docs/ARCHITECTURE.md section 13.
 */

/** Version of this package. Independent of the authored schema version. */
export const CORE_VERSION = "0.0.0";

/** Authored input contract version. Stable across runtime rewrites. ADR-002. */
export const AUTHORED_SCHEMA_VERSION = 4;
