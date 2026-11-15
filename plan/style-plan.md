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
- **A style card** is an optional `style.ts` in a brief: per field, the share of its motions that must be lively
  (overshooting, ringing or winding up); its own qualities for designs; skin tokens; habits in words (unchecked).
  A brief mixes springy and plain motion, so a style is how much of it is lively, not one shape per field: every
  showreel piece is at least 44% lively on each field it moves, and a piece of `fade`, `slide` and `rise` is at 0%.
- **A card is measured first, then narrowed:** `motion:style -- measure <brief>` measures the brief's pieces and
  writes the card; a person narrows its ranges and writes its habits.

Not planned here: publishing to npm; a shared registry; colour in 3D; a card that carries beats, layout or story.

## 2. Architecture

| Thing | What it is | Lives in | Owner |
| --- | --- | --- | --- |
| Shape and quality | a moved field's measured shape; a named range of shapes | `packages/moves/src/style/qualities.ts` (built, S0) | the table |
| Style card | a brief's lively shares, qualities, tokens, habits | `<brief>/style.ts`, made by `defineStyle` (`packages/moves/src/style/card.ts`) | the brief |
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
  - `lively: Readonly<Partial<Record<keyof typeof VALUE_FIELDS, readonly [number, number]>>>`: per field, the range
    of the share of its motions that are lively (`isLively`: overshoot or windup over 0.02, or a ring);
  - `tokens: Readonly<Record<string, string>>`: CSS custom properties, each name starting `--`;
  - `habits: readonly string[]`.
- **Cards are found** by `styleCards(root)` in `packages/tools/src/scene/cards.ts`: every brief's `style.ts`,
  imported, its `card` export checked.
- **A piece in a style** exports `style = "<brief>"`; `readStageModule` carries it as `StageModule.style?: string`;
  `readSceneModule` refuses a name no card holds, naming the cards. Then:
  - the design may name `<brief>/` qualities;
  - `--anatomy --style <brief>` prints the card first (lively shares, qualities, tokens, habits, the brief's moves and
    parts), then the library;
  - `--design` sorts by `fieldFit`, then the style brief's moves before other sources, then `usesFit`, then id.
- **The style check.** A field's motions in a piece are its shapes per member and list item, per beat it moves in,
  leaving out targets the piece's design names for that field. With 3 or more, a lively share outside the card's range
  gives one finding: "`y: 1 of 8 motions lively (13%); showreel wants 50% to 100% (style)`".
- **Tokens.** `cssVariables(tokens)` in `@gerak/stage` answers `:host { --ink: #222; ... }`; a piece prepends it to
  its skin.
- **Measured cards.** `motion:style -- measure <brief>` takes each piece of the brief with 3 or more motions of a
  field, its lively share, and writes the lowest to highest share widened by 0.1, in steps of 0.05; a field whose range
  comes out 0 to 1 refuses nothing and is left out. It refuses a brief that has a `style.ts`. `motion:style -- check
  <brief>` runs `defineStyle`, the move and part gates on the brief, the portability rule, and the style findings of
  the brief's pieces and of every piece naming the style (a piece's other findings are its own).

## 4. Slices

### S0. Decision and the quality table (planner) — built

### S1. Custom parts (executor) — built

`localParts`, `checkLocalParts` (the duplicate rule), `portabilityFindings`, `--anatomy` listing parts by brief.

### S2. Style cards (executor) — built

`defineStyle`, `styleCards`, `StageModule.style`, the refusal of an unknown style, `--anatomy --style`, the `--design`
order, `cssVariables`.

### S3. `motion:style` (executor) — built

`measure` and `check`, one shared walk (`measureShapes`) for the review and the measure.

### S3b. The lively share (executor)

- **Invariant:** `isLively`, `StyleCard.lively` in place of per-field defaults, the style check, `measure` writing
  shares. **Owner:** `packages/moves/src/style/{qualities,card}.ts`, `packages/tools/src/scene/{review,style}.ts`.
- **Test:** three bouncy motions pass a `[0.5, 1]` card and three linear ones fail it with one finding; a design
  naming the field, or fewer than 3 motions, gives none; a calm `[0, 0.1]` card fails three bouncy ones; `measure`
  writes the widened range and leaves out a field whose range comes out 0 to 1.

### S4. The showreel style and the guide (planner)

- `npm run motion:style -- measure showreel`. The lead narrows the card until it is a style, not a spread: the
  `motion:style -- check showreel` passes (it counts only the card's findings; the pieces already hold others), and a piece of the library's `fade`, `slide` and `rise` fails the card on every field
  they share with the card (recorded as a test). The lead writes the habits from the brief's moves, never its stories.
- `docs/guide/agent-style.md`: working in a style in the loop's order (read `--anatomy --style`, design with its
  qualities, ask `--design`, prefer its moves, prepend `cssVariables(tokens)`, never open the style brief's pieces);
  `agent-motion.md`'s table routes to it; the reference regenerated.

### S5. Proof

- **Measure:** a fresh Sonnet worker at medium effort, from the guide alone, makes `launch-day` (a product launch
  countdown: a date card, three feature badges, a "Live" stamp) in the `showreel` style. It passes when its review is
  clean, the style check included; it imports at least two moves from `showreel/src/moves/` or names at least two
  `showreel/` qualities in its design; and it opened no piece file of `apps/pieces/showreel/src/` (its report lists
  every file it read). Whether its story is its own is the lead's reading, stated as such.
- **Cold review:** a fresh executor-model agent reviews the diff and runs what it claims.

## 5. Team and order

| Wave | Who | Slices | Needs |
| --- | --- | --- | --- |
| 1 | Planner | S0 | built |
| 2 | Executor | S1 | built |
| 3 | Executor | S2 | built |
| 4 | Executor | S3, then S3b | built; S3b building |
| 5 | Planner | S4 | S3 |
| 6 | Executor model, fresh | S5, then the cold review | S4 |

One pull request, after wave 6.

## 6. Risks

- **A measured card can be too loose.** The S4 test (a piece of the library's soft moves fails) makes it visible.
- **The lively line is one threshold** (0.02); a style whose character is in timing alone (peak, settle) is not
  checked by the share; its designs and qualities carry that.
- **A field that leaves rest and returns inside one beat** has almost no travel, so its `overshoot` and `windup`
  shares explode (the `delivered` parcel's `scaleX` reads 1652 in `fall`); a measured card holds them to 1 and the
  lead narrows them in S4.
- **Content leaks when an agent opens the style brief's pieces.** Only the guide forbids it; the measure checks it.

## 7. Done when

The measure passes, `npm run check` is green, and `docs/SESSION-STATUS.md` says so.
