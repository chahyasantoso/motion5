# Stage plan: the cast and the story

**Status:** Approved by the owner, 2026-11-12.
**Base:** `main` at `924c6451`.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ARCHITECTURE.md` (section 2a, the five layers),
`plan/roadmap.md` stage 3, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**A piece is one file: who is on stage, when each beat happens, how each thing moves, and how it looks on each
renderer, played by one stage that needs no component and no page of its own.**

This is layer 3 of `docs/ARCHITECTURE.md`. Today a piece is three files: a scene, a component and a page. The
component is the cast, hand-written JSX with one `useTarget` per element (17 in the second showreel); the page holds
the look. The scene names targets but cannot say what they are, and its beats are raw numbers: 71 `span(...)` calls
in the second showreel. No tool can tell whether a thing shows before its beat, whether every cast member is used, or
what the beats are called; the rebuild worker hid exits by hand with 16 ms fades.

## 2. The shape

```ts
export const beats = story(15000, { origin: [0, 1250], anticipate: [1000, 3550], weight: [3460, 6260] });

export const cast = {
  camera: group({
    dot: actor(),
    word: letters("ANTICIPATE", { enters: "anticipate", leaves: "weight" }),
    dust: many(6),
  }),
  card: actor({ watch: true }),
};

export const skins = {
  dom: {
    css: `[data-cast="dot"] { width: 36px; height: 36px; border-radius: 50%; background: #ff5533 }`,
  },
};

export const scene = (time: Time, events: Events, rest: Rest) => ({
  camera: bump({ dy: 40 }, beats.weight.of(time)),
  dot: sequence(time, [[beats.origin, (t) => launch({}, t)]]),
  word: [...],                       // one value per letter
  dust: [...],                       // one value per item
  card: lift(events, "card"),
});
```

## 3. Decisions to record (P0, ADR-174)

- **A cast member is a proxy.** Core says only what the scene's motion depends on: the member's name, how many parts
  it has, the text it says, and its behaviour (`enters`, `leaves`, `watch`, `still`). What it looks like, its shape,
  size and layout, belongs to the renderer's skin.
- **Three kinds.**

  | Kind | The scene answers | A renderer makes |
  | --- | --- | --- |
  | `actor({ text? })` | one value | one thing, showing its text if it has one |
  | `many(n)` or `many(list, make)` | a list of values, one per item | one thing per item |
  | `group({ ...members })` | one value for the group, and each member's | a parent holding its members |

  `letters(text)` and `words(text)` are helpers in `@gerak/stage` that make `many` of text actors. No renderer
  knows them.
- **A group's value applies to its members.** A member's value is relative to its group, as an element's transform
  is relative to its parent's; a 3D renderer nests in the same way.
- **Names are paths.** A member is named by its key, inside a group by its key alone (keys are unique across the
  cast), and an item of `many` by its key and index, `dust.3`. Events from a `watch` member carry that name.
- **Presence is inherited.** A member without `enters` or `leaves` takes its group's; the stage hides a member
  outside its presence.
- **Skins are per renderer and live in the module.** `skins.dom` holds `css`, scoped to the stage, that styles each
  member by `[data-cast="<name>"]`. A member the skin does not style is drawn by the default skin: a grey box with its
  name, or its text. `skins.three` is a later slice; nothing in core changes for it.
- **The renderer hands back where things rest.** After layout the stage measures each member's rest box and passes a
  `Rest` record to the scene as its third argument, the boxes keyed by name. Tools with no renderer pass a fallback:
  the boxes the module exports as `rest`, or an empty record. A scene reads a box through `restOf(rest, name)`, which
  answers a zero box when there is none, so a tool never throws on a piece that measures.
- **The story owns the duration.** `story(durationMs, { name: [from, to] })` answers one `span` per beat and the
  length; beats may overlap. The module's `durationMs` is `beats.durationMs`.
- **The module's names are one contract.** `readSceneModule` in `@gerak/tools/scene` is the one owner of what a
  stage module exports: `beats`, `cast`, `skins`, `scene`, and optionally `frame` (default 1280 by 720) and `rest`.
- **Pieces use the stage; sites use the hooks.** A piece is a stage module. `usePlayer` and `useTarget` stay for
  binding a real site's own elements, which is what the web overlay needs. The worked examples keep their components.
- **Replay is the `R` key and a click on the frame's background**, never a click on a `watch` member.

## 4. Slices

### P1. The records

- **Invariant:** `actor`, `many`, `group`, `letters`, `words`, `story` and `frame` answer frozen records; `story`
  refuses a beat that is not finite, runs backwards or passes the duration; `castNames(cast)` answers every name the
  cast makes, refuses a key used twice, and resolves presence through groups; `restOf` answers a zero box for a name
  it lacks.
- **Owner:** `packages/stage/src/`.
- **Test:** each maker's record holds only what it was given; `letters("ABC")` has three text actors; nested names,
  `many` names and inherited presence come out as above; a duplicate key and a bad beat are refused.

### P2a. The renderer

- **Invariant:** `mountStage(element, module)` in `@gerak/dom` builds the cast as nested elements tagged
  `data-cast`, injects `skins.dom.css` scoped to the stage, draws unstyled members with the default skin, measures
  each member's rest box after layout and before the first value, plays the scene with those boxes, binds each value
  with `applyValue`, hides a member outside its presence, wires `watch` members to an event driver, fits the frame to
  its container, and replays on `R` or a click on the background.
- **Owner:** `packages/dom/src/stage.ts`.
- **Test:** a module with every kind renders the right nesting and tags; a group's value moves its members; a member
  outside its presence has `visibility: hidden`; a hover on a `watch` member reaches the scene as an event with its
  name; the scene receives measured boxes.

### P2b. The page and the live page

- **Invariant:** `<Stage module />` in `@gerak/react` wraps `mountStage`; `apps/pieces/stage.html?piece=<name>` shows
  any stage module; the live page plays a stage module and swaps it in place on a save.
- **Owner:** `packages/react/src/stage.tsx`, `apps/pieces`.
- **Test:** the shared page shows a fixture module; the live browser test swaps a stage module's scene in place.

### P3. Tools read the story

- **Invariant:** `readSceneModule` reads a stage module; the live timeline marks beats by name; `motion:review`
  labels picked frames with their beat; a scene-file review reports a member the scene never moves and is not
  `still`, a target the scene moves that is not cast, and a member whose value changes outside its presence.
- **Owner:** `packages/tools/src/scene/`, `packages/tools/src/page/`, `apps/pieces/src/live/timeline.tsx`.
- **Test:** one finding of each kind on a fixture; a clean fixture has none; `motion:sample` runs a module whose
  scene reads `rest`.

### P4. Scaffold, guide and two pieces

- **Invariant:** `motion:new <name>` writes one stage module with a story of one beat, one actor at rest and an empty
  `skins.dom.css`. The guide's loop names the cast, the story and the skin; the reference covers `@gerak/stage`
  through the generator. `saved` and `tempo` are rewritten as stage modules by hand and sample the same.
- **Owner:** `packages/tools/src/scene/new.ts` and templates, `docs/guide/agent-motion.md`, the skill, the two pieces.
- **Test:** the scaffold mounts and samples to rest; the two pieces' samples and frames match before and after.

### P5. Proof

- **Measure, alone in its worker:** the hand-made showreel rebuilt a third time as one stage module. New columns:
  files per piece and lines of component code (the second rebuild: 4 files, a 250-line component). Passes when it is
  one file with no component, no `fade` hides a member outside its presence, and its frames match the second's.
- **Cold run and review, one agent:** a Sonnet agent at medium effort makes a piece from a new brief with the guide
  alone, then reviews the plan's diff with that experience, and answers the interview's questions on the cast, the
  story and the skin.

## 5. Team and order

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Conductor | P0, P1 | the records' shapes decide the rest |
| 2 | Opus, medium | P2a | the renderer: nesting, measuring, presence, events |
| 2 | Sonnet, medium | P3 | tools only, against P1's records |
| 3 | Sonnet, medium | P2b, P4 | the page, the live page, the scaffold, the guide and two pieces, after the renderer |
| 4 | Opus, medium, alone | P5 measure | the measure runs alone, so its tokens are its own |
| 4 | Sonnet, medium | P5 cold run and review | one start for both |

One pull request, after wave 4.

## 6. Risks

- **A default skin can become a house look.** It draws grey boxes and plain text only, meant to be replaced.
- **CSS in a string has no checking.** The review's sheet is the check, as for CSS in a page today.
- **Measuring before the first value** holds the first frame until layout lands.
- **A third scene argument** changes `Scene`'s shape for stage modules only; a scene that ignores it is unchanged.

## 7. Done when

A new piece is one file, the third rebuild is one file with no component, the tools read beat names, `npm run check`
is green, and `docs/SESSION-STATUS.md` says so.
