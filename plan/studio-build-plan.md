# Studio build: a piece as cards you edit, add, remove and wire

## Goal

A person or an agent opens `saved` in the Studio and makes motion on the canvas: they edit a card's code, add a card, remove a card, and add or remove a wire between cards, and each action writes the code an agent would write in `saved.ts`, which the preview plays at once. The code adds one owner that turns a small set of JSON edit operations into minimal code changes, a reader that gives back exactly the cards and wires those changes made, a command for agents, and canvas controls for each operation. It works for `saved` first; other pieces may not, and are left for later.

Status: draft 2026-11-26, for review. It replaces the order of `plan/studio-canvas-plan.md` from its PR 3 on, which is paused; the work already built on `feat/studio-canvas-3` is kept, unmerged.

Read `AGENTS.md` first. Every rule there applies.

## Where things stand

- `gerak studio open saved` shows saved as cards: the scene, its four beats, its three casts, eight move cards and the preview, with wires read from code. Nothing on the canvas writes code yet.
- The graph is built from a static read of the scene file and the page (`readSources`) and the compiled stage's provenance (`graphOf`). On `main` a move card knows its call and its file and line, but not the text range of its code; `backwards(...)` moves read as `code` cards. The paused branch `feat/studio-canvas-3` reads them as `slide` and `fade` tagged `backwards`, with knobs and doc comments, and adds floating wires, scene rows and several previews.
- The page is drawn only in the preview; the casts it tags (`data-cast`) appear as cast cards, and its CSS appears nowhere.

## Decisions

### 1. A card is code

- Every card stands for one piece of code with a known text range, and its body is that code, edited as text. There is no palette and no form: adding a card means writing its code.
- The cards of a piece and the code each one is:

  | Card | Code it is |
  | --- | --- |
  | page | `<name>.html` with its `<style>` and linked CSS; it lists the casts its `data-cast` elements tag |
  | element | `const mark = box("mark")` (also `text`, `shape`, `object`) |
  | beat | `const markIn = beat("markIn", 260, { at: 0 })` |
  | move | one call in an element's `.moves(...)`, such as `pop({ overshoot: 0.15 })`, or a named `const` holding a move |
  | helper | a local `const` or `function` that moves call, such as `backwards` |
  | scene | the `scene(...)` the file exports |
  | preview | the page played on the canvas; it is not code |

- Card ids stay code identity (`member:mark`, `beat:markIn`, `move:mark.0`, `helper:backwards`, `page:saved`).

### 2. A wire is a reference in code

- Each wire is one reference, and adding or removing it edits that reference:

  | Wire | Code it is |
  | --- | --- |
  | beat → move | the move's `.in(markIn)` |
  | move → element | the call sits in that element's `.moves(...)` |
  | helper → move | the move calls the helper, as `backwards(...)` does |
  | element → scene | the element is listed in `scene(...)`, bare or with its `.moves(...)` |
  | page cast → element | the `data-cast` name equals the element's name |
  | scene → preview | the canvas's own wire, kept in the sidecar, not code |

- A wire the reader cannot place is not drawn, and the card says "set in code".

### 3. Edits are JSON operations with one owner

- A closed union of operations, read with an exhaustive `switch` in one owner, `packages/studio/src/edit.ts`:
  - `edit-card`: replace a card's code text;
  - `add-card`: add an element, beat, move or helper from given code text;
  - `remove-card`: remove a card's code;
  - `add-wire` and `remove-wire`: add or remove one reference from Decision 2's table.
- An operation changes only the text it names; every other byte of the file stays. Its output is formatted with the repository's Prettier settings.
- Round trip: for each operation, applying it and reading the file back gives the graph before, changed exactly as the operation says. A test per operation proves it on a copy of saved.
- A refused operation writes nothing and says why:
  - removing a card still referenced: a beat a move still uses, an element a scene still lists, a helper a move still calls; remove the wires first;
  - code that does not parse, or a file changed since the graph was read;
  - a page cast wire, since the page owns its `data-cast` names: renaming in the page or the element changes it.
- A move taken out of its element (`remove-wire` move → element) is kept as a named `const` in the scene file, so the card stays; wiring it into an element puts it back in that element's `.moves(...)`.

### 4. The agent and the canvas use the same operations

- `gerak studio apply '<operation json>'` (or `--file ops.json` for a list, applied in order, all or none) runs the owner against the piece and prints the new graph or the refusal. An agent may also edit the file by hand; the canvas redraws either way.
- The canvas sends the same operations through the dev server, `POST /__gerak/edit?piece=`.

### 5. The canvas controls

- A card's body is its code in a small editor; saving sends `edit-card`. A compile error keeps the last good frame under the banner, and the card shows the error.
- "Add card" asks for the kind and the code, and places the new card where it was asked for.
- Remove: selecting a card or a wire and pressing Delete sends `remove-card` or `remove-wire`; a refusal shows why, and nothing is removed. The preview and the scene → preview wire cannot be removed.
- Connect: dragging from a card's port to another card's port sends `add-wire` when the pair is in Decision 2's table; any other pair is refused at the drop.

### 6. The page card

- One page card per piece reads `<name>.html` and its CSS: its body lists the casts (`data-cast` names) as rows, each with a port that wires to the element of that name, and the page's file and line.
- Editing the page's HTML or CSS from the card is not in this plan; the page card is read and wired only.

## Slices

One pull request at the end, built in order.

| Slice | Decisions | Done when |
| --- | --- | --- |
| 1: Cards and wires as code | 1, 2, 6 | `gerak studio graph saved --json` lists the page card with its three cast rows, three element cards, four beats, eight moves, `helper:backwards` and the scene, each with its text range, and the wires of Decision 2's table |
| 2: The edit owner | 3 | each operation applies to a copy of saved and reads back as the graph changed exactly as it says; each refusal writes nothing |
| 3: The command | 4 | `gerak studio apply` adds a `rise()` move to `word` in a new beat, rewires it and removes it again, leaving `saved.ts` byte-identical to the start |
| 4: The canvas | 5 | on the canvas, without opening a file, a person edits `pop`'s overshoot in its code, adds a move and a beat and wires them, removes a wire and a card, and the preview plays each change; a refused removal says why |

## Tests first, per slice

- 1: the graph of saved has exactly the cards and wires above; each card's text range slices out its code.
- 2: per operation, apply then read gives the expected graph; the file outside the change is byte-identical; each refusal case writes nothing.
- 3: a list of operations applied with `--file` is all or none; a stale file is refused.
- 4: a browser test on saved runs each canvas control and checks the file and the preview.

## Not in this plan

- Other pieces than `saved`; they keep working as far as they do today.
- A palette of moves, forms or knobs for card code.
- Editing the page's HTML or CSS from the page card.
- The rest of `plan/studio-canvas-plan.md`: take cards, inputs and state, the code panel, sources and jobs, render settings, the look card's custom properties.
