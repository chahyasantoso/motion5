# Style-kit plan: a style installed, a new piece made in it

**Status:** Proposed, 2026-11-15, revised after one round of critique.
**Base:** `feat/anatomy` at `8b514ba5` (pull request 596, open); rebase on `main` once it merges.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ARCHITECTURE.md`, `docs/ADR-185-*.md`,
`docs/ADR-186-*.md`, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**A person installs a style kit into a project, writes a new brief with new references, and an agent makes a new
piece in that style; the review checks the piece against the kit's style card.** The agent reads the card and the
kit's moves, parts and skin tokens, never the kit's demo piece or the brief the kit came from, so the style carries
over and the content does not.

- **A kit** holds a style's moves, its own parts, its skin tokens and a style card: its own qualities as descriptor
  ranges, the quality each field should have by default, and habits in words (unchecked guidance).
- **A kit is measured first, then adjusted:** `motion:kit -- new <kit> --from <brief>` moves a brief's moves and parts
  into a kit, measures the brief's pieces, and writes a card; a person narrows its ranges and writes its habits.
- **Custom parts** come with it: a brief or a kit may declare its own parts, held to their kind like the library's.

Not planned here: publishing a kit to npm; a shared registry; a sameness score across agents; colour in 3D; a kit
that carries beats, layout or story (a kit carries motion and look only).

## 2. Architecture

| Thing | What it is | Lives in | Owner |
| --- | --- | --- | --- |
| Shape and quality | a moved field's measured shape; a named range of shapes | `packages/moves/src/style/qualities.ts`: `Descriptors`, `DESCRIPTOR_KEYS`, `DescriptorRanges`, `QUALITIES`, `qualityOf`, `outsideRanges` (moved from `@gerak/tools`) | the table |
| Kit card | a style: its qualities, field defaults, habits | `<kit>/kit.ts`, made by `defineKit` (`packages/moves/src/style/kit.ts`) | the kit |
| Kit | a card with its moves, parts and skin tokens | `apps/pieces/kits/<kit>/` here; an installed package elsewhere | its folder |
| Custom part | a part a brief or kit declares | `<brief or kit>/src/parts/<kind>/`, declared with `definePart` from `@gerak/moves` | its folder |
| A piece's kit | which card a piece is made in | the stage module's `export const kit = "<name>"` | the piece |

- **`style/`** is a layer folder of `@gerak/moves` at the height of `fields/`: it imports `fields/` and nothing above
  it, which the layer test holds. Sampling (`describeOffsets`, `offsetsOf`) stays in `@gerak/tools`.
- **A portable unit is a folder.** A move or part in a brief or kit imports `@gerak/moves` and its own folder's
  `src/parts/` by relative path, nothing else; the brief or kit folder travels whole. This supersedes ADR-185's clause
  that a move outside `@gerak/moves` imports only `@gerak/moves`.

```text
apps/pieces/kits/<kit>/
  kit.ts            export const card = defineKit({ ... })
  src/moves/        the kit's moves
  src/parts/<kind>/ the kit's parts
  skin.ts           export const tokens = { "--kit-ink": "#222", ... }
  demo/             a piece a person may look at; agents never read it
```

`kits` joins `RESERVED_FOLDERS`, so no tool takes it for a brief; `kitFolders(root)` in `briefs.ts` finds kits.

## 3. Decisions to record (ADR-187)

- **The quality table moves to `@gerak/moves`** (the names in §2), exported from the entry; `@gerak/tools` imports
  them. A kit's card must not depend on the tools.
- **`defineKit(card)`** returns a frozen `KitCard` or throws naming the first problem:
  - `name`: a folder-safe word equal to its folder; `description`: one sentence;
  - `qualities: Readonly<Record<string, DescriptorRanges>>`: used as `<kit>/<name>` everywhere;
  - `defaults: Readonly<Partial<Record<keyof typeof VALUE_FIELDS, string>>>`: a quality name (library or
    `<kit>/<name>`) per field; `custom.*` numbers have none;
  - `habits: readonly string[]`, unchecked words for the agent.
- **Custom parts.** `localParts(root)` in `packages/tools/src/scene/parts.ts` imports every `.ts` under each brief's
  and kit's `src/parts/<kind>/` and lists each exported function with a contract (read with `partContract`, the one
  registry in `@gerak/moves`), its group the kind folder and its source the brief or kit. `--anatomy` lists them under
  their source; the part gate checks them as library parts. **A duplicate** is a new part whose first sample's values
  at 101 even progress steps match, within 1e-6, any sample of an existing part of its kind; the finding names that
  part and sample. Parts are promoted by two briefs, as moves are.
- **Kits as sources.** `gerak.kits` in an app's `package.json` (folders or packages; default `["./kits/*"]`); each
  kit's moves join the catalog as source `<kit>` and its parts as local parts.
- **A piece in a kit** exports `kit = "<name>"`; `readStageModule` carries it as `StageModule.kit?: string`;
  `readSceneModule` refuses a name no kit holds, naming the kits. Then:
  - the design may name `<kit>/` qualities;
  - `--anatomy --kit <name>` prints the card first (qualities, defaults, habits, tokens, its moves and parts), then the
    library;
  - `--design` sorts by `fieldFit`, then the piece's kit before other sources, then `usesFit`, then id.
- **Which quality a field must have:** a design naming the field (for any beat) decides it; otherwise the kit's
  default; otherwise none. The review checks the default per member and per list item (`word.3`), in each beat of the
  story in which that field changes, as design intents are measured; a field the piece never moves, and a default for a
  field no member carries, give no finding. A miss names the kit: "`card.y` (enter): peak 0.30, cartoon/arrive wants
  0.60 to 1 (kit default)".
- **Skin tokens.** `cssVariables(tokens)` in `@gerak/stage` answers `:host { --kit-ink: #222; ... }`; a piece imports
  its kit's `tokens` and prepends that to its skin.
- **Measured kits.** `motion:kit -- new <kit> --from <brief>`:
  1. moves the brief's `src/moves/` and `src/parts/` into `kits/<kit>/src/` with `git mv`, rewrites the brief's imports
     to the kit, and adds `export const kit = "<kit>"` to each of the brief's pieces;
  2. reads each piece of the brief (every `src/*.ts` that `readSceneModule` accepts), samples it every `STEP_MS` over
     its run, and measures each field of each member and list item in each beat it changes in;
  3. writes `kit.ts` with one quality `<kit>/<field>` per field that moved: per descriptor, the measured minimum to
     maximum, widened by 0.05 each side for shares (`peak`, `overshoot`, `windup`, `settle`, held to 0..1) and by 1
     each side for `rings` (held at 0 or more); that quality is the field's default; `habits` empty; description
     "Measured from <brief>.";
  4. refuses a kit that exists. `motion:kit -- check <kit>` runs the move gate, the part gate, `defineKit`, the
     portability rule, and the review of every piece that names the kit.

## 4. Slices

### S0. Decision and the quality table (planner)

- ADR-187 and its index line, ADR-185 marked superseded in part; the §2 shape-and-quality names moved to
  `packages/moves/src/style/qualities.ts` with bodies unchanged and the tools' importers repointed (`catalog.ts`,
  `review.ts`, `moves.ts`); `style` at height 1 in the layer test with a stub test that it may not import a part;
  `kits` in `RESERVED_FOLDERS`; samples and the reference unchanged.

### S1. Custom parts and kit discovery (executor)

- **Invariant:** `localParts`, the duplicate rule, `kitFolders`, the folder portability rule. **Owner:**
  `packages/tools/src/scene/{parts,briefs}.ts`, `test/repo/brief-moves.test.ts`.
- **Test:** a scratch brief's envelope part is listed by `--anatomy` under the brief and passes the gate; one dipping
  below 0 is refused; one sampling as `taper(p, 2)` is refused naming `taper`; a brief move importing its own part
  passes the import rule and one importing another brief's part fails; `kitFolders` finds `kits/<kit>` and
  `briefFolders` does not.

### S2. Kit cards, sources and the card check (executor, after S1)

- **Invariant:** `defineKit`, `KitCard`, `gerak.kits`, kit moves as sources, `StageModule.kit`, the refusal of an
  unknown kit, `--anatomy --kit`, the `--design` order, `cssVariables`, and the review's default check.
  **Owner:** `packages/moves/src/style/kit.ts`, `packages/stage/src/module.ts`, `packages/stage/src/` (`cssVariables`),
  `packages/tools/src/scene/{catalog,scene,review}.ts`.
- **Test:** a card with an unknown field or quality is refused naming it; a scratch kit's moves are found tagged with
  the kit; `--anatomy --kit` prints the card first; of two moves with equal `fieldFit` the kit's comes first; a scratch
  piece in a scratch kit gets no finding when its undesigned fields meet the defaults, one naming the kit when one
  field moves with the wrong shape, none for a field its design names, and none for a default on a field it never
  moves; a piece naming an unknown kit is refused.

### S3. `motion:kit` (executor, after S2)

- **Invariant:** `new` and `check` as decided. **Owner:** `packages/tools/src/scene/kit.ts`,
  `packages/tools/bin/motion-kit.mjs`, the root `package.json` script, `docs/guide/agent-reference.md`'s command entry.
- **Test:** `new` on a scratch brief moves its moves into the kit, repoints the brief's imports, and writes a card that
  `check` passes and under which the brief's pieces review clean; the measured card refuses a deliberately different
  shape (a linear `x` where the brief's `x` overshoots); `new` refuses an existing kit; `check` refuses a kit move
  importing outside the kit.

### S4. The showreel kit and the guide (planner)

- `npm run motion:kit -- new showreel --from showreel`. The lead reads the measured card and narrows it until it is a
  style, not a spread: the showreel's pieces still review clean, and the library's `fade`, `slide` and `rise` fail the
  defaults on every field they share with the card (recorded as a test). The lead writes the habits from the kit's
  moves, never from the pieces' stories, and adds a demo.
- `docs/guide/agent-style.md`: working in a kit in the loop's order (read `--anatomy --kit`, design with its
  qualities, ask `--design`, prefer kit moves, prepend `cssVariables(tokens)`, never open `demo/` or the brief the kit
  came from); `agent-motion.md`'s table routes to it; a test refuses a guide page, the skill or the reference that
  names a kit's `demo/` files; the reference regenerated.

### S5. Proof

- **Measure:** a fresh Sonnet worker at medium effort, from the guide alone, makes `launch-day` (a product launch
  countdown: a date card, three feature badges, a "Live" stamp) in the `showreel` kit. It passes when its review is
  clean, the kit's defaults included; its piece imports at least two moves from `kits/showreel/` or names at least two
  `showreel/` qualities in its design (read from its source); and it opened no file under `apps/pieces/showreel/` or
  `kits/showreel/demo/` (its report lists every file it read, and the lead checks the list). Whether its story is its
  own is the lead's reading, stated as such.
- **Cold review:** a fresh executor-model agent reviews the diff and runs what it claims.

## 5. Team and order

| Wave | Who | Slices | Needs |
| --- | --- | --- | --- |
| 1 | Planner | S0 | nothing |
| 2 | Executor | S1 | S0 |
| 3 | Executor | S2 | S1 |
| 4 | Executor | S3 | S2 |
| 5 | Planner | S4 | S3 |
| 6 | Executor model, fresh | S5, then the cold review | S4 |

The slices are sequential: each needs the last one's sources or checks. One pull request, after wave 6.

## 6. Risks

- **A measured card can be too loose.** The S4 test (the library's soft moves fail the defaults) makes "too loose"
  visible; the lead narrows by that test, not by eye.
- **Beats mix motions.** Defaults are checked per beat a field changes in, so an enter and a leave are measured
  apart; a beat holding two motions of one field can still mix them, and a design per beat overrides the default.
- **Moving the brief's moves into the kit** changes the brief's imports; S3's test reviews the brief before and after.
- **Moving the quality table** touches the tools' importers; S0 does it alone, checked by unchanged samples and the
  reference.

## 7. Done when

The measure passes, `npm run check` is green, and `docs/SESSION-STATUS.md` says so.
