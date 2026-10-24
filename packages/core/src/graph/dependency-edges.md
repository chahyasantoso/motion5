# packages/core/src/graph/dependency-edges.ts

The slot-and-binding half of graph construction: qualifying an authored source and turning one `input.requires` binding into one input edge, or into a refusal that names the authored path. Extracted from `ir.ts` by Phase 4 to keep that file under the 45,000-byte threshold the phase set; behaviour is unchanged.

`collectDependencyEdges` adds the edges one identified-table plugin track authors under `input.requires`. The parser has already proved the binding shape when this runs from `validateV5`; the guards stay because graph construction is callable directly and a malformed binding must be refused rather than silently producing no dependency. A no-plugin track contributes no demand and therefore no edges here.

`qualifySource` is the one spelling of local, free and cross-motion source qualification. `ir.ts` still calls it for solver goals, so the function lives here beside the binding walk that also needs it, and the module imports only types from `ir.ts`.
