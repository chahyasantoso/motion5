# Studio build: a piece as cards you edit, add, remove and wire

## Goal

A person or an agent opens `saved` in the Studio and makes its motion on the canvas: they add, edit and remove beats and moves, and wire moves to beats and to the page's casts, and each action writes the code an agent would write in `saved.ts`, which the preview plays at once. The code adds one owner that turns a small set of JSON edit operations into minimal code changes, a reader that gives back exactly the cards and wires those changes made, a command for agents, and canvas controls for each operation. It works for `saved` first; other pieces may show less or break on the canvas, and are left for later.

Status: next, 2026-11-26, built as a rapid prototype first. `plan/studio-canvas-plan.md` is paused inside its PR 3, and its finished part has landed.

Read `AGENTS.md` first. Every rule there applies.

## Where things stand

- `gerak studio open saved` shows saved as cards read from code: a scene, four beats, three casts, eight moves and the preview. Nothing on the canvas writes code yet.
- The graph is built from a static read of the scene file and the page (`readSources`) and the compiled stage's provenance (`graphOf`). A move card knows its call and its file and line, but not the text range of its code.
- The page appears only in the preview; its CSS appears nowhere.

## Decisions

### 1. Four cards

- The canvas has four kinds of card, and only two of them are code you edit:

  | Card | What it is | Its body |
  | --- | --- | --- |
  | page | `<name>.html` and its CSS | the casts its `data-cast` elements tag, one row each, with the kind the scene gives it (`box`, `text`, `shape`, `object`) |
  | beat | one `beat(...)` in the scene file | its code, such as `beat("markIn", 260, { at: 0 })` |
  | move | one call in a cast's `.moves(...)` | its code, such as `pop({ overshoot: 0.15 })` or `backwards(slide({ distance: 8, from: "top" }))` |
  | preview | the page played on the canvas | the player |

- A cast is one name on both sides: the `data-cast` element in the page and the scene's member of that name. It is a row of the page card, not a card of its own. The scene-side code for it (`const mark = box("mark")`, its place in `scene(...)`) is written and kept by the Studio, never shown as a card.
- A move is code. Its card's body is the whole call, edited as text, and there is no palette: adding a move means writing its call. A function the file defines and moves call, such as `backwards`, stays plain code in the file; a move card shows the call to it, and its definition is edited in the file. A new motion of the piece's own is written inline in a move card (`motion((time) => ...)`) or in the file.
- The scene is the piece itself, not a card: saved has one scene, and the preview plays it.

### 2. Two wires write code

- Only two wires stand for code, and adding or removing one edits that code:

  | Wire | Code it is |
  | --- | --- |
  | beat → move | the move's `.in(markIn)` |
  | move → cast | the call sits in that cast's `.moves(...)` |

- A move always sits on exactly one cast, as the code needs. Its cast wire can be moved to another cast, which moves the call, but not removed; removing the move card removes the call.
- A move with no beat wire runs over the whole scene, as `.moves(fade())` does in code.
- The page → preview wire is the canvas's own and is not code.

### 3. Edits are JSON operations with one owner

- A closed union of operations, read with an exhaustive `switch` in one owner, `packages/studio/src/edit.ts`:
  - `add-beat` and `add-move` (on a cast, from given code text);
  - `edit-beat` and `edit-move` (replace the card's code text);
  - `remove-beat` and `remove-move`;
  - `wire-beat` and `unwire-beat` (a move's `.in(...)`);
  - `move-to-cast` (a move's call moves to another cast's `.moves(...)`).
- An operation changes only the text it names, and every other byte of the file stays. The Studio writes the scene-side code for a cast on its first move (`const word = text("word")` and `word.moves(...)` in `scene(...)`, with `box` unless the scene already gives a kind), and leaves it in place when its last move is removed.
- Round trip: for each operation, applying it and reading the file back gives the graph before, changed exactly as the operation says. A test per operation proves it on a copy of saved.
- A refused operation writes nothing and says why:
  - `remove-beat` while a move is still wired to it;
  - `edit-beat` that changes the beat's name;
  - code that does not parse, or that is not a beat or a move call;
  - a file changed since the graph was read.

### 4. The agent and the canvas use the same operations

- `gerak studio apply '<operation json>'`, or `--file ops.json` for a list applied in order, all or none, runs the owner on the piece and prints the new graph or the refusal. An agent may also edit the file by hand; the canvas redraws either way.
- The canvas sends the same operations through the dev server, `POST /__gerak/edit?piece=`.

### 5. The canvas controls

- A beat or move card's body is its code in a small editor; saving sends `edit-beat` or `edit-move`. A compile error keeps the last good frame under the banner, and the card shows the error.
- "Add beat" asks for its code. "Add move" on a cast row asks for its code and wires it to that cast.
- Selecting a beat or move card, or a beat wire, and pressing Delete sends its remove operation; a refusal shows why and removes nothing. The page card, its cast rows, the preview and the move → cast wires are not removed this way.
- Dragging from a beat to a move sends `wire-beat`, replacing the move's beat; dragging a move's cast wire onto another cast row sends `move-to-cast`. Any other drop is refused.

## Slices

One pull request at the end, built in order.

| Slice | Decisions | Done when |
| --- | --- | --- |
| 1: The four cards | 1, 2 | `gerak studio graph saved --json` gives the page card with rows `pill`, `mark`, `word`, four beats, eight moves and the preview; each beat and move carries the text range of its code; the wires are the eight move → cast and eight beat → move references |
| 2: The edit owner | 3 | each operation applies to a copy of saved and reads back as the graph changed exactly as it says; each refusal writes nothing |
| 3: The command | 4 | `gerak studio apply` adds a beat and a `rise()` move on `word` in it, rewires it, moves it to `mark` and removes both again, leaving `saved.ts` byte-identical to the start |
| 4: The canvas | 5 | on the canvas, without opening a file, a person edits `pop`'s overshoot in its code, adds a beat and a move and wires them, rewires a move to another beat and another cast, removes a move and a beat, and the preview plays each change; removing a beat still in use says why |

## Tests first, per slice

- 1: the graph of saved has exactly the cards and wires above, and each card's text range slices out its code.
- 2: per operation, apply then read gives the expected graph; the file outside the change is byte-identical; each refusal case writes nothing.
- 3: a list of operations applied with `--file` is all or none; a stale file is refused.
- 4: a browser test on saved runs each canvas control and checks the file and the preview.

## Not in this plan

- Pieces other than `saved`.
- Adding or removing casts, and editing the page's HTML or CSS from the page card.
- Sub-scenes and shots on the canvas, and choosing what a preview plays.
- Renaming a beat, reordering a cast's moves, and editing a function the file defines.
- A palette of moves, forms or knobs for card code.
- The rest of `plan/studio-canvas-plan.md`: take cards, inputs and state, the code panel, sources and jobs, render settings, the look card's custom properties.
