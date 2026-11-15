# Style plan: a brief's style, carried to a new piece

**Status:** Approved, 2026-11-15. S0 and S1 built.
**Base:** `main` at `02389bb1`.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ADR-187-styles-on-briefs.md`,
`.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**A person copies a brief folder into their project, writes a new brief, and an agent makes a new piece in the copied
brief's style; the review checks the piece against that brief's style card.** The agent reads the card and the brief's
moves, parts and tokens, never its pieces, so the style carries over and the content does not.

- **A brief folder is the portable unit.** Its moves and parts import only `@gerak/moves` and its own `src/parts/`;
  zipped and unzipped into another app's pieces folder, the catalog finds its moves and the gate its parts.
- **A style card** is an optional `style.ts` in a brief: its own qualities as descriptor ranges, the quality each
  field should have by default, skin tokens, and habits in words (unchecked guidance).
- **A card is measured first, then narrowed:** `motion:style -- measure <brief>` measures the brief's pieces and
  writes the card; a person narrows its ranges and writes its habits.

Not planned here: publishing to npm; a shared registry; colour in 3D; a card that carries beats, layout or story.

## 2. Architecture

| Thing | What it is | Lives in | Owner |
| --- | --- | --- | --- |
| Shape and quality | a moved field's measured shape; a named range of shapes | `packages/moves/src/style/qualities.ts` (built, S0) | the table |
| Style card | a brief's qualities, field defaults, tokens, habits | `<brief>/style.ts`, made by `defineStyle` (`packages/moves/src/style/card.ts`) | the brief |
| Custom part | a part a brief declares | `<brief>/src/parts/<kind>/`, declared with `definePart` (built, S1) | its brief |
| A piece's style | which brief's card a piece is made in | the stage module's `export const style = "<brief>"` | the piece |

```text
apps/pieces/<brief>/
  style.ts          export const card = defineStyle({ ... })
  src/moves/        the brief's moves
  src/parts/<kind>/ the brief's parts
  src/<piece>.ts    the brief's pieces; an agent working in another brief never opens them
```

## 3. Decisions (ADR-187)

- **`defineStyle(card)`** returns a frozen `StyleCard` or throws naming the first problem:
  - `name`: equal to its brief folder; `description`: one sentence;
  - `qualities: Readonly<Record<string, DescriptorRanges>>`: used as `<brief>/<name>` everywhere;
  - `defaults: Readonly<Partial<Record<keyof typeof VALUE_FIELDS, string>>>`: a quality name (library or
    `<brief>/<name>`) per field; `custom.*` numbers have none;
  - `tokens: Readonly<Record<string, string>>`: CSS custom properties, each name starting `--`;
  - `habits: readonly string[]`.
- **Cards are found** by `styleCards(root)` in `packages/tools/src/scene/cards.ts`: every brief's `style.ts`,
  imported, its `card` export checked.
- **A piece in a style** exports `style = "<brief>"`; `readStageModule` carries it as `StageModule.style?: string`;
  `readSceneModule` refuses a name no card holds, naming the cards. Then:
  - the design may name `<brief>/` qualities;
  - `--anatomy --style <brief>` prints the card first (qualities, defaults, tokens, habits, the brief's moves and
    parts), then the library;
  - `--design` sorts by `fieldFit`, then the style brief's moves before other sources, then `usesFit`, then id.
- **Which quality a field must have:** a design naming the field (for any beat) decides it; otherwise the card's
  default; otherwise none. The review checks the default per member and per list item (`word.3`), in each beat in
  which that field changes; a field the piece never moves, and a default for a field no member carries, give no
  finding. A miss names the card: "`card.y` (enter): peak 0.30, showreel/arrive wants 0.60 to 1 (style default)".
- **Tokens.** `cssVariables(tokens)` in `@gerak/stage` answers `:host { --ink: #222; ... }`; a piece prepends it to
  its skin.
- **Measured cards.** `motion:style -- measure <brief>` reads each piece of the brief (every `src/*.ts` that
  `readSceneModule` accepts), samples it every `STEP_MS`, measures each field of each member and list item in each
  beat it changes in, and writes `style.ts` with one quality per field that moved, named by the field in kebab-case (`<brief>/scale-y`): per descriptor,
  the measured minimum to maximum, widened by 0.05 each side for shares (held to 0..1) and by 1 for `rings` (held at 0
  or more), that quality the field's default, tokens and habits empty, description "Measured from <brief>.". It
  refuses a brief that has a `style.ts`. `motion:style -- check <brief>` runs `defineStyle`, the move and part gates on
  the brief, the portability rule, and the review of the brief's pieces and of every piece naming the style.

## 4. Slices

### S0. Decision and the quality table (planner) — built

### S1. Custom parts (executor) — built

`localParts`, `checkLocalParts` (the duplicate rule), `portabilityFindings`, `--anatomy` listing parts by brief.

### S2. Style cards and the review's default check (executor)

- **Invariant:** `defineStyle`, `StyleCard`, `styleCards`, `StageModule.style`, the refusal of an unknown style,
  `--anatomy --style`, the `--design` order, `cssVariables`, the review's default check. **Owner:**
  `packages/moves/src/style/card.ts`, `packages/stage/src/module.ts`, `packages/stage/src/` (`cssVariables`),
  `packages/tools/src/scene/{cards,catalog,scene,review}.ts`.
- **Test:** a card with an unknown field, unknown quality or a token not starting `--` is refused naming it;
  `--anatomy --style` prints the card first; of two moves with equal `fieldFit` the style brief's comes first; a
  scratch piece in a scratch style gets no finding when its undesigned fields meet the defaults, one naming the card
  when one field moves with the wrong shape, none for a field its design names, and none for a default on a field it
  never moves; a piece naming an unknown style is refused.

### S3. `motion:style` (executor, after S2)

- **Invariant:** `measure` and `check` as decided. **Owner:** `packages/tools/src/scene/style.ts`,
  `packages/tools/bin/motion-style.mjs`, the root `package.json` script, `docs/guide/agent-reference.md`'s entry.
- **Test:** `measure` on a scratch brief writes a card that `check` passes and under which the brief's pieces review
  clean; the measured card refuses a different shape (a linear `x` where the brief's `x` overshoots); `measure` refuses
  a brief with a `style.ts`; `check` refuses a brief move importing outside its folder.

### S4. The showreel style and the guide (planner)

- `npm run motion:style -- measure showreel`. The lead narrows the card until it is a style, not a spread: the
  `motion:style -- check showreel` passes (it counts only the card's findings; the pieces already hold others), and the library's `fade`, `slide` and `rise` fail the defaults on every field
  they share with the card (recorded as a test). The lead writes the habits from the brief's moves, never its stories.
- `docs/guide/agent-style.md`: working in a style in the loop's order (read `--anatomy --style`, design with its
  qualities, ask `--design`, prefer its moves, prepend `cssVariables(tokens)`, never open the style brief's pieces);
  `agent-motion.md`'s table routes to it; the reference regenerated.

### S5. Proof

- **Measure:** a fresh Sonnet worker at medium effort, from the guide alone, makes `launch-day` (a product launch
  countdown: a date card, three feature badges, a "Live" stamp) in the `showreel` style. It passes when its review is
  clean, the defaults included; it imports at least two moves from `showreel/src/moves/` or names at least two
  `showreel/` qualities in its design; and it opened no piece file of `apps/pieces/showreel/src/` (its report lists
  every file it read). Whether its story is its own is the lead's reading, stated as such.
- **Cold review:** a fresh executor-model agent reviews the diff and runs what it claims.

## 5. Team and order

| Wave | Who | Slices | Needs |
| --- | --- | --- | --- |
| 1 | Planner | S0 | built |
| 2 | Executor | S1 | built |
| 3 | Executor | S2 | S1 |
| 4 | Executor | S3 | S2 |
| 5 | Planner | S4 | S3 |
| 6 | Executor model, fresh | S5, then the cold review | S4 |

One pull request, after wave 6.

## 6. Risks

- **A measured card can be too loose.** The S4 test (the library's soft moves fail the defaults) makes it visible.
- **Beats mix motions.** Defaults are checked per beat a field changes in; a design per beat overrides the default.
- **A field that leaves rest and returns inside one beat** has almost no travel, so its `overshoot` and `windup`
  shares explode (the `delivered` parcel's `scaleX` reads 1652 in `fall`); a measured card holds them to 1 and the
  lead narrows them in S4.
- **Content leaks when an agent opens the style brief's pieces.** Only the guide forbids it; the measure checks it.

## 7. Done when

The measure passes, `npm run check` is green, and `docs/SESSION-STATUS.md` says so.
