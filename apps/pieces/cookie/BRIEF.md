# Warm Batch — 3D Cookie Site Brief

Cookie shoppers browse Warm Batch's four small-batch flavors, inspect each warm baked cookie in 3D, and build a custom six-cookie glass jar; Gerak maintainers use the piece to stress-test multi-section 3D + DOM choreography, scroll-linked transitions, and physics-assisted jar assembly under responsive layouts.

## Creative Direction (Re-interpreting `references/reel-inspo.mp4`)

Adapted from the editorial warmth and kinetic pacing of [reel-inspo.mp4](file:///C:/Data/dev/motion5/motion5/apps/pieces/cookie/references/reel-inspo.mp4) (*"Crumb and Dough"*) — and documented under the `google-labs-code/design.md` structure in [DESIGN.md](file:///C:/Data/dev/motion5/motion5/apps/pieces/cookie/DESIGN.md) — **Warm Batch** blends bakery tactility with clean editorial restraint across a five-section **Jar-to-Roll-to-Jar** 3D landing page (**Order A**):

- **Palette & surfaces:** Deep baked cocoa ink (`#3D2216`) over warm oat-cream (`#F7F0E6`), blush frosting (`#F7D7E0`), and linen (`#EFE7DB`), shifting across per-flavor ambient surface tints during the rolling spotlight.
- **Typography & numerals:** High-contrast serif display (`Fraunces`), geometric UI sans (`Plus Jakarta Sans`), and oversized tabular counters (`01 / 04`).
- **Signature motion & framing:** Curved sunlit hero tabletop horizon, rounded cocoa offer banner with rotating circular seal badge, **right-to-left rolling 3D cookie spotlight** (top `FLAVOURS` kicker, 2-line left title, bottom-left `01 / 04` counter, center-right face-on rolling cookie with soft shadow, right-edge clickable 4-dot rail, bottom-right tasting note + `Add to jar` pill), sticky horizontal craft strip, sticky six-cookie jar builder (right sidebar on desktop, bottom bar on mobile), and playful *"Hungry yet?"* closing paired with an oversized cropped bottom wordmark.

## Signature Flavors

| # | Flavor | Tagline | Price | Ambient Tint |
| --- | --- | --- | --- | --- |
| `01` | **Brown Butter Choc Chip** | Toasted milk solids, puddles of 62% dark chocolate, flaky Maldon salt. | `$5.00` | `#F4E6D4` |
| `02` | **Matcha White Choc** | Stone-milled Uji matcha dough folded with caramelized white chocolate chunks. | `$5.50` | `#E6ECE1` |
| `03` | **Double Dark Sea Salt** | Dutch-process Valrhona cocoa dough, bittersweet chunks, crisp sea salt finish. | `$5.25` | `#E5D7CE` |
| `04` | **Toasted Pecan Oat** | Brown-sugar rolled oats, roasted buttered pecans, warm cinnamon crumb. | `$5.00` | `#F2D9C2` |

## GLB & Authored-Cast Status

On `main`, earlier 3D pieces (`avatar-3d`, `dragon-intro`) loaded `dragonling.glb` through `GLTFLoader`. On `feat/authored-cast`, those legacy pieces were pruned during authored-cast cleanup while keeping `dragonling.glb` and the `GLTFLoader` / `@gerak/three` infrastructure intact. **Warm Batch (`apps/pieces/cookie/`) is the first authored-cast `.glb` piece**, exercising `mount` + `threeBinder` + `object(..., { view })` + `travel({ to: slot })` with custom bakery assets (`references/warm-batch-jar.glb` and `references/warm-batch-cookie.glb`).

## Worker Split

- **Asset Worker (`argon/medium`):** Authors and validates `references/warm-batch-jar.glb` and `references/warm-batch-cookie.glb` against the shared coordinate and node-name contract.
- **UI & Studio Worker (`argon/medium`):** Owns `BRIEF.md`, `DESIGN.md`, `GAPS.md`, `cookie.html`, `cookie.css`, `src/contract.ts`, `src/world-studio.ts`, and `src/world-models.ts`.
- **Motion & Coding Worker (`neon/medium`):** Owns Section 1–5 choreography, scroll-linked jar-to-roll-to-jar motion, right-to-left flavor spotlight, Rapier/jar-fill builder integration, and `gerak measure` / `gerak review` / Chromium verification.

## Flat `src/` Module Map (SOLID)

`scripts/repo-map.mjs` permits only `apps/pieces/*/src` (and `src/moves`). Every TypeScript module lives directly in `apps/pieces/cookie/src/`:

| File | Single Responsibility |
| --- | --- |
| `src/contract.ts` | Pure data & types: `CastName`, `DomCast`, and `ObjectCast` (re-exported from `../cookie.cast.ts`), `FLAVORS`, `STAGE_SIZE`, `LENS`, `JAR_METRICS`. No DOM or Three.js. |
| `src/world-studio.ts` | Three.js `Scene`, `PerspectiveCamera` from `LENS`, `WebGLRenderer`, 3-point sunlit studio lights, resize/draw/dispose. |
| `src/world-models.ts` | `GLTFLoader` loading for jar & cookie `.glb`s, sunlit `JarGlass` `MeshPhysicalMaterial`, jar-attached `ShadowMaterial` disc, `jarRoot` / `jarLid` / `cookieHero` assembly (producer of 3D `objects`, independent of cast files). |
| `src/scene-hero.ts` | Pure `sceneBuilder()` fragment for the hero entrance and jar settle (no `length` or `cues`). |
| `src/cookie.ts` | Root piece entry exporting `size`, `lens`, and `default` `sceneBuilder` combining section scenes via `.include()`. |
| `src/cookie-main.ts` | Page bootstrap: `window.__motionReady`, studio + model load, `mount` + `threeBinder`, resize observer, initial draw. |

## Roadmap (Order A: Hero Jar → Rolling Flavour Spotlight → Craft → Builder → Closing)

1. **Phase 0 — Foundation & Hero Jar *(Complete)*:** Docs, `google-labs-code/design.md` spec, procedural `.glb` jar + stacked preview cookies, sunlit studio, responsive hero + cocoa offer banner, calm entrance settle, green `gerak measure` / `gerak review` / desktop & mobile frames.
2. **Section 1 — Hero Jar Unseal & Cookie Lift-Out:** Scroll-driven lid lift (`jarLid`), hero cookie (`cookieHero`) rising out of the jar mouth, and pointer parallax on the resting jar.
3. **Section 2 — Right-to-Left Rolling 3D Flavour Spotlight:** Sticky `100vh` stage with top `FLAVOURS` kicker, 2-line left title, bottom-left `01 / 04` counter, center-right face-on 3D cookies rolling right-to-left with no-slip spin + `trailTurn` velocity banking + soft shadow + pointer tilt, clickable 4-dot rail, per-flavor ambient tints, and mobile stacked layout.
4. **Section 3 — Sticky Horizontal Craft Strip:** Tall scroll wrapper with `position: sticky` inner horizontal card track moving on Chromium's `ScrollTimeline` compositor.
5. **Section 4 — Six-Cookie Jar Builder:** Sticky desktop right sidebar / mobile bottom bar, `+1 / -1` flavor pills, ballistic cookie arcs into the returning glass jar, live `Your Jar (N)` tally, and `@gerak/rapier` 3D `{ spawn }` crumb burst when sealed at `6 / 6`.
6. **Section 5 — Closing & Wordmark:** *"Hungry yet?"* finale, sealed jar at clean zero-CPU rest, oversized cropped **WARM BATCH** bottom wordmark, and full-page `gerak check` + `GAPS.md` audit.
