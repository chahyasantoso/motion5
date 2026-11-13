# Roadmap

**Status:** Accepted by the owner, 2026-11-10. It is the one statement of where the repository is going. Each stage in
section 5 gets its own plan before any code, and what has landed is stated only in `docs/SESSION-STATUS.md`.

## 1. Objective

**gerak is a standard vocabulary of motion that an agent or a person authors as reusable code, and that plays
anywhere: on a web page, on a live stage, in a video.**

Three things follow from it:

- **Authored, not copied.** A piece is built from named moves with declared options. A move the brief lacks is
  defined, checked and kept, so the next piece can use it. Throwaway animation code and copies of the examples both
  miss the objective.
- **One base, many apps.** The base answers every question about motion once. An app is a way of working with it and
  adds no second answer.
- **An agent and a person share one format.** A scene file an agent wrote opens in every app, and a piece made in an
  app is a scene file an agent can edit.

## 2. Shape

```text
 apps      web overlay            instrument              video
           (tune a real site)     (live-coded stage)      (shots, sound, export)
               \                       |                      /
 kit            +------- live kit: editor panel, timeline, swap, guard -------+
                                       |
 base      tools     dom   react   three   stage (objects)
                \      \     |      /       /
                 +------+----+-----+-------+
                             |
                          player
                             |
              moves  <--  rig        physics  <--  rapier
```

- **The base is the packages.** They are published, and a site installs them with no clone.
- **An app imports only a package's declared exports.** A package never imports an app, and an app never imports
  another app. The boundary scan enforces it.
- **What two apps need moves down.** The live page's panel, timeline and guard sit in `apps/react-demo/src/live`
  today; they become the live kit when the second app needs them.
- **One repository** until the packages are published. An app then moves out by changing its dependencies only.

## 3. What the base must answer

| Question | Owner |
| --- | --- |
| A value at a time, from time and events | the scene, `moves` |
| The vocabulary of moves | `moves` |
| Where an authored move lives and how it is found | `moves`, `tools` |
| How an agent is told to work | the guides, the scaffold |
| What is on the stage | `stage` |
| The frame and the camera | `stage` |
| Text in parts | `stage` |
| Several shots in one piece | `moves` |
| Getting from one shot, page or state to the next | `moves` |
| An element between two layouts | `dom` measures, `stage` carries |
| Values past a pose | `moves`, each renderer |
| Where time comes from | drivers in `dom` |
| A new scene at the same time | `player`, `react` |
| Source text into a running scene | the live kit |
| A file of the motion | `tools` |
| Bones | `rig` |
| Bodies | `physics`, `rapier` |
| Bindings | `dom`, `react`, `three` |
| How a rigged piece differs from its SVG | `tools` |
| Getting it | every package |

## 4. The apps

| App | For | Objects come from | The source is |
| --- | --- | --- | --- |
| **Web overlay** | planning and tuning motion on a real site: enter, hover, press, scroll | the site's own elements, picked on the page | a scene file in the site's project |
| **Instrument** | live coding in a browser: the loop never stops, the code sits over the stage | object makers in the code | the text in the page, shared as a link, exported as a scene file |
| **Video** | short pieces: social, explainer, commercial | object makers and assets | a scene file of shots, rendered to a file |

- **Web overlay:** a dev-only panel on a running site. Pick an element, see its moves per trigger, loop the
  interaction, type or drag, and each change is written to the file.
- **Instrument:** `Ctrl+Enter` swaps the scene at the same moment of the loop; a broken edit changes nothing and
  shows in a status line; the caret's line lights its object; the move playing now glows in the code; a commented
  line rests its object.
- **Video:** the stage on a longer timeline, with shots, sound and export.

## 5. Order

1. **Authoring.** Done (`plan/authoring-plan.md`): roles on moves, the gate, modifiers, the library, the catalog,
   the guide rewritten round the brief, and two proofs. Agents no longer copy the examples.
2. **Values and sequence.** Done (`plan/values-plan.md`): one table of a value's fields with colour, blur, strokes
   and clips; modifiers over any value; `sequence`; a span placed by the clock; the catalog's parts; a review that
   picks its frames. The showreel rebuilt on it is the standing measure.
3. **Objects and story.** Done (`plan/stage-plan.md`): the `stage` package, layer 3 of `docs/ARCHITECTURE.md`. A cast
   described in code (shapes, text, letters and words, images, paths, groups), a frame format, beats as named spans,
   and presence (when each member is on stage), played by one stage with no component, and read by the tools. A
   piece becomes one file.
4. **Composition, the rest.** Done (`plan/composition-four-plan.md`): named layouts the stage measures, and a member
   carried between boxes, for a route change, a list reordering and a card opening. Joining two stage modules with a
   cut or a dissolve waits for stage 10.
5. **Ready to publish.** Done (`plan/publish-plan.md`): the runtime packages build and install outside the repository,
   and the app boundary is in the check. Nothing is on npm; publishing waits for a project that needs it, and `1.0`
   until the `stage` package and one app have held the surface still.
6. **Rigging vector artwork.** Next (`plan/artwork-plan.md`). An SVG drawn by someone else is imported as a stage
   module, and the agent rigs it: parts named by what moves, grouped by what carries what, a pivot at each joint, so
   each part can take a move or a bone. A command compares the rigged piece with the SVG. Rebuilding from a raster
   picture is out; a Three.js model belongs with stage 8.
7. **Driving a rig from live inputs.** A small plan after stage 6, no plan yet. Tracking stays outside; the base takes
   its numbers: each sample a named value in the event log, such as `mouthOpen` 0.6 at 1234 ms, read smoothed by a
   helper, so a scene stays pure and a recorded session replays, scrubs and renders. Proof: the rigged penguin blinks
   and talks from a recorded input file. Mouth shapes that switch or morph between outlines, the blend shapes of
   section 6, wait for their own plan.
8. **3D.** Typed 3D chains, a skinned mesh's bones, 3D physics on Rapier, and a React Three Fiber scaffold and worked
   example.
9. **Motion atlas, a brainstorm.** Whether a library-agnostic map of motion, with gerak as one port, serves the
   objective; `plan/motion-atlas-plan.md` is its starting notes. It ends in a decision, not code.
10. **The live kit, the web overlay and video.** The panel, timeline and guard become a package; the overlay attaches
   to any page, picks elements and loops a trigger, with hover knobs and review marks on the timeline. Video then adds
   the camera, the beat driver, sound in the rendered file and a clip of footage as an object.

**Deferred: the instrument.** Evaluation in the page, the code over the stage, the status line, the caret and playhead
links, a static site. It waits until the live kit exists and a person asks to live-code; `da-lang` waits with it.

### Done and not done

Stage by stage; `docs/SESSION-STATUS.md` holds the detail of what has landed.

| Area | Done | Not done |
| --- | --- | --- |
| Moves | a library by role with modifiers, a gate, a catalog, local moves and promotion by brief | particles from a seed |
| Values | position, turn, scale, opacity, blur, strokes, circle and box clips, a piece's own numbers as CSS variables | colour and shadow as fields of their own, a mask of any shape |
| Stage | cast, story, presence, skins, measured rest, layouts and `carried`, scripted cues | a camera, joining two stage modules |
| Bones | 2D chains, 3D FK and IK solvers with constraints | typed 3D chains, a skinned mesh's bones, retargeting |
| Bodies | 2D physics, built in or on Rapier, seekable | 3D physics |
| Bindings | DOM, React, Three.js poses | a React Three Fiber scaffold, Vue, Svelte |
| Artwork | | importing an SVG as a stage module, pivots at joints, the command that compares the rig with its SVG |
| Tools | the `motion:*` commands, the live page, frames and their comparison | the live kit as a package |
| Getting it | installable outside the repository, checked by installing | on npm |
| Apps | the live page in `apps/pieces` | the web overlay, video, the instrument (deferred) |

### What a real piece asked for

A 15 second hand-made showreel was rebuilt with gerak (`plan/authoring-plan.md`, "A hand-made piece, rebuilt"). Its
gaps reorder stage 2, Composition, by what limited it most:

1. **A pose carries more than a transform:** colour, blur and any numeric field a renderer can apply, so they
   compose, ease and pass the gate like position does. Thirty of seventy elements needed this.
2. **A target with several phases:** a sequence on one target, so a move's pose does not have to be chosen by
   elapsed time in the scene. This is the shot sequence of stage 2 at the scale of one element.
3. **A stroke with a head and a tail,** and `trace` by time as well as by length.
4. **Modifiers over any value,** a reveal and a stroke included.
5. **Something that hangs from a thing that moves:** a follow driven by its parent's motion.
6. Smaller: a pose that leaves opacity out resets it; the gate's jump rule allows a declared tremble; the review
   reads a parent's clip.

### After the values plan

Two improvements the owner asked to keep, each its own small plan:

- **One app holds too much.** `apps/react-demo` carries the worked examples that tests read, the proof pieces, the
  showreel and the live page, and an agent making a piece works beside all of them. Split it in three: examples for
  the tests, pieces for what agents make, and the live page by itself. It touches every page path, the scaffold's
  target and the tools' default root, so it is one mechanical move by script, before the web overlay is built.
- **The reference is written by hand.** `docs/guide/agent-reference.md` restates each function and move in over
  five hundred lines beside the code's own comments, and a worker opened package source four times where it had
  gaps. Generate it from the declarations and the doc comments, keep the hand-written part to the few lines that
  explain how the pieces fit, and let the test that holds it complete compare the two.

### Layers 3 and 4

`docs/ARCHITECTURE.md` names five layers. Two show gaps:

- **The scene has no cast.** Objects and text are made by hand in a component. The `stage` package (stage 3,
  `plan/stage-plan.md`) is that layer, together with the story: beats and presence a tool can check.
- **Logic has no plan.** A game, a quiz or an interactive explainer needs rules over the event log: state as a fold
  over events, collisions from the seekable physics world, and a fixed step so a replay gives the same answer. It is
  written when a brief needs it, not before.

## 6. Waiting for a brief that needs them

- Live extras: reroll a seed and pick from variations, an edit history to scrub, onion skin on the stage, an agent
  pane, editing the event log from the timeline, a recorded session.
- A chain API (`word("CATCH").drop(700).stagger(0.25)`) and a chain builder for rigs: sugar over the same scene and
  the same `buildChain`.
- Particles from a seed, as a move over a list of targets.
- Vue and Svelte bindings.
- Retargeting, blend shapes, and matching a reference site's motion.

## 7. Out

- A second way to make motion.
- A house look. Makers carry no style of their own.
- Feedback effects that cannot be sought.
- Drawing a character frame by frame. A character moves here through bones on its artwork.
- Working inside footage: keying, tracking a graphic to something filmed, grading. A clip is an object that plays.
- Simulated effects: fluids, smoke, light. Colour, blur, shadow and masks are values, and in.

## 8. The names

- **`gerak`** is the base: the packages publish as `@gerak/*`. The GitHub repository keeps the address
  `chahyasantoso/motion5` until its owner renames it.
- **`da-lang`** is held for the short notation a person types in the instrument, and for the instrument itself. It is
  written in TypeScript and builds the same scene function, so it is a way of writing a `gerak` scene and never a
  second way to make motion. Its shape is decided in the instrument's plan.
