# @gerak/stage reference

Generated from doc comments by `npm run reference -- --write`; one page per source folder.

- [runtime](./runtime.md), 6 exports: Authoring entry point (`defineStage`), frame evaluation (`evaluateFrame`), and scene shape validation.
- [beats](./beats.md), 8 exports: Compiled timeline spans (`compileBeats`) and stretch visibility (`presentAt`).
- [cast](./cast.md), 37 exports: Cast builders (`m.box`, `m.text`, `m.readout`, `m.stroke`, `m.morph`, `m.many`, `m.letters`, `m.words`, `m.group`), outline morphing, and dependency-ordered stroke resolution.
- [layout](./layout.md), 17 exports: Stage frame defaults, measured `RestReader` lookup, multi-layout specs, and cross-layout `carry` transitions.
- [skins](./skins.md), 6 exports: DOM stylesheet/defs skin compilation (`inline` strings or `url` assets) and typed renderer skin extension.
- [review](./review.md), 5 exports: Author-declared review expectations (`settle`, `ambient`, `static`) and per-target step limits compiled onto `CompiledStage.review`.
- [compile](./compile.md), 15 exports: Stage compilation (`compileStage`), flattened typed scene target inference, and closed `StageError` formatting.
- [dom](./dom.md), 2 exports: Browser CSS custom property helpers exported from `@gerak/stage/dom` (`cssVariables`, `isTokenName`).
