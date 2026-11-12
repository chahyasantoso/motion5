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

| Question | Owner | Today | Gap |
| --- | --- | --- | --- |
| A value at a time, from time and events | the scene, `moves` | have | none |
| The vocabulary of moves | `moves` | five declared moves | a library by role, and modifiers that wrap any move |
| Where an authored move lives and how it is found | `moves`, `tools` | `defineMove`, no home | a moves folder, a catalog command, a gate for a new move |
| How an agent is told to work | the guides, the scaffold | told to copy the nearest example | start from the brief and the catalog; an empty scaffold |
| What is on the stage | a new `stage` package | hand-written component and CSS | object makers, a generic stage that applies each value by its maker |
| The frame and the camera | `stage` | none | fixed formats, pan and zoom |
| Text in parts | `stage` | by hand, per letter | lines, words and letters from one maker |
| Several shots in one piece | `moves` | one beat per scene | a scene nested on a span, and a sequence of shots |
| Getting from one shot, page or state to the next | `moves` | one `wipe` | transitions: a move over two scenes, with cut, dissolve, wipe, slide and push to start |
| An element between two layouts | `dom` measures, `moves` plays | `centreIn` for one point | measure the old box and the new, play from the offset to rest; the same move carries a shared element across a transition |
| Values past a pose | `moves`, each renderer | position, turn, scale, opacity, a circular reveal, a drawn stroke | colour, blur, shadow, a mask of any shape |
| Where time comes from | drivers in `dom` | clock, scroll, events, manual | a beat driver; time from a sound file |
| A new scene at the same time | `player`, `react` | `replace`, a host-owned driver | none |
| Source text into a running scene | the live kit | Vite, in a clone | evaluation in the page, moves in scope |
| A file of the motion | `tools` | MP4 and GIF, frame-exact | sound in the file |
| Bones | `rig` | 2D chains, 3D solvers | typed 3D chains, a skinned mesh's bones |
| Bodies | `physics`, `rapier` | 2D, seekable | 3D |
| Bindings | `dom`, `react`, `three` | plain DOM, React, Three.js | a React Three Fiber scaffold |
| Getting it | every package | private, `0.0.0` | published |

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
- **Video:** the instrument's stage on a longer timeline, with shots, sound and export.

## 5. Order

1. **Authoring.** The move library and modifiers, the moves folder, catalog and gate, the guide and skill rewritten
   around the brief, the empty scaffold. Proof: one brief run cold three times gives three different pieces, and
   three briefs do not share a move set.
   The proof did not pass (`plan/authoring-plan.md`, "Proof and interviews"), so this stage stays open with these
   items: `span` takes the scene's length once, not at every call; `motion:review` prints findings and the sheet by
   default and the per-channel eases on request; the "Cannot fast-forward to the past" error on a first run is
   reproduced and fixed; and the guide's idea step asks what the piece does that the obvious answer does not, and
   asks for a move written where the catalog's nearest answer would make a piece like the last one. A second proof
   runs after them.
2. **Composition.** Shots in a sequence, transitions between two scenes, an element moved between two layouts and
   carried across a transition, and values past a pose. It comes before publishing because it shapes the public
   surface, and it serves a site (a route change, a list reordering, a card opening) as much as a video.
3. **Publish.** A first `0.x` release, a release command, and the app boundary in the scan. `1.0` waits until the
   `stage` package and one app have held the surface still.
4. **The live kit and the web overlay.** The panel, timeline and guard become a package; the overlay attaches to any
   page, picks elements and loops a trigger. Hover knobs and review marks on the timeline land here.
5. **Objects.** The `stage` package: makers, the generic stage, frame formats, text in parts. A piece becomes one
   file.
6. **The instrument.** Evaluation in the page, the code over the stage, the status line, the caret and playhead
   links, a static site.
7. **Video.** The camera, the beat driver, sound in the rendered file, a clip of footage as an object.

**3D runs beside this, any time after stage 1:** typed 3D chains, a skinned mesh's bones, 3D physics on Rapier, and
a React Three Fiber scaffold and worked example.

**Artwork from a reference runs after stage 5:** an agent looks at an image and rebuilds it as SVG or as a Three.js
scene, in named parts with anchors so each part can take a move or a bone. The base gains a command that renders the
rebuild beside the reference and reports where they differ; the looking and drawing are the agent's.

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

- **The scene has no cast.** Objects and text are made by hand in a component. The `stage` package (stage 5) is
  that layer, and it comes before the instrument and video.
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
