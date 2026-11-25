# Studio

`@gerak/studio` reads a piece without changing it. The scene file stays the source of motion and the page the source
of the look and the cast; the Studio draws them as one graph of cards and wires.

## The graph

`graphOf(piece, sources)` builds the one `StudioGraph` the canvas, the CLI and tests read. It takes:

- the compiled stage and `provenanceOf(scene)` from `@gerak/stage/provenance`: which shot or named scene binds each
  member, its binding calls in order, and where each beat comes from;
- `readSources(sceneFile)`: what the files say, read with the TypeScript compiler and an HTML scan, never run. It finds
  the cue JSON the scene imports and the `cues` option or shot `until` each feeds, the audio or captions file under
  `audio/` of the same name, `<video>` and `<audio>` sources of cast elements, loose files under `audio/` and `media/`,
  and each `.moves(...)` argument of a statically named element.

A card's id comes from code identity, so it survives edits: `scene:<name>`, `shot:<name>`, `beat:<name>`,
`member:<name>`, `move:<member>.<step>`, `job:<cue file>`, `source:<path>`, `output:<kind>`.

- A move is a `motion` card when it calls a package function such as `rise` or `travel`, and a `code` card at its file
  and line when it is hand-written: a local or relative function, `motion(...)`, `bind`, `bindEach` or an inline
  function. `stagger` takes the kind of what it staggers.
- A cue file becomes a `beats` job when an audio file made it and a `cues` job when captions did.
- Beats that scroll or a trigger drive get an `input` source.
- A dynamic import or a spread of moves cannot be placed: it becomes a card marked "set in code", with no wires.
- A page `data-cast` element with no member is an "unused cast".

Wires carry `time` (beat or shot into a move), `events` (cues or input into a scene, a cue file into a shot's
`until`), `pose` (a move into its cast, a travel target or `stayWith` read into a move), `media` (a file into a job, a
clip into its media box) and `stage` (the scene into preview, check and render).

## `gerak studio`

The tools package's `gerak` binary forwards `gerak studio` to this package when it is installed.

```sh
npx gerak studio graph reel          # the graph as an outline
npx gerak studio graph reel --json   # the graph as JSON
```
