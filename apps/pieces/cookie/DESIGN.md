---
name: Warm Batch
colors:
  primary: "#3D2216"
  secondary: "#5C3A2B"
  accent: "#C86D3B"
  neutral: "#F7F0E6"
  blush: "#F7D7E0"
  surface: "#EFE7DB"
  flavors:
    brown-butter: "#F4E6D4"
    matcha: "#E6ECE1"
    double-dark: "#E5D7CE"
    pecan-oat: "#F2D9C2"
typography:
  display-hero:
    fontFamily: Fraunces
    fontSize: clamp(2.75rem, 5.4vw, 4.75rem)
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: -0.03em
  display-flavor:
    fontFamily: Fraunces
    fontSize: clamp(2.5rem, 5vw, 4.25rem)
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: -0.03em
  display-counter:
    fontFamily: Fraunces
    fontSize: clamp(2.25rem, 4.2vw, 3.5rem)
    fontWeight: 600
    fontVariantNumeric: tabular-nums
  heading-banner:
    fontFamily: Fraunces
    fontSize: clamp(1.4rem, 2.5vw, 2.25rem)
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: clamp(1.05rem, 1.35vw, 1.2rem)
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.95rem
    fontWeight: 400
    lineHeight: 1.55
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.8rem
    fontWeight: 600
    letterSpacing: 0.08em
  ui-pill:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.92rem
    fontWeight: 600
rounded:
  card: 24px
  banner: 32px
  pill: 999px
  circle: 50%
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  section: 84px
---

## Overview

**Sunlit Kinfolk Bakery meets Tactile 3D.** Warm Batch is an editorial, homely, ultra-clean 3D cookie store landing page (`apps/pieces/cookie/`) built around a continuous **Jar-to-Roll-to-Jar** visual narrative (**Order A**):

1. **Hero Jar (`Phase 0` / `Section 1`):** Sunlit glass apothecary jar filled with stacked cookies rests beside serif display type above a curved linen tabletop horizon; scrolling lifts the oak lid and launches a hero cookie into the page.
2. **Rolling Flavour Spotlight (`Section 2`):** Sticky full-viewport editorial stage inspired by `crumbandough.com.au` in `references/reel-inspo.mp4`, upgraded to face-on **3D rolling `.glb` cookies** that roll right-to-left with true wheel rotation, velocity banking, pointer tilt, and per-flavor ambient surface tints.
3. **Sticky Craft Strip (`Section 3`):** Tall scroll-pinned horizontal card strip walking through ingredients and bake ritual on Chromium's compositor timeline.
4. **Six-Cookie Jar Builder (`Section 4`):** Sticky desktop right-sidebar / mobile bottom-bar builder where shoppers add/remove cookies into the returning glass jar with a `@gerak/rapier` 3D crumb burst on seal.
5. **Closing & Wordmark (`Section 5`):** Playful *"Hungry yet?"* finale, sealed jar at full rest, and oversized cropped **WARM BATCH** bottom wordmark.

## Colors

Warm Batch pairs roasted espresso-cocoa ink against sunlit oat-cream and pastel frosting tints—never dark-mode neon WebGL.

| Token | Value | Role |
| --- | --- | --- |
| `--ink-cocoa` (`primary`) | `#3D2216` | Primary display ink, body headings, pill CTA & offer banner background |
| `--ink-cocoa-soft` (`secondary`) | `#5C3A2B` | Secondary editorial copy, eyebrows, muted counters |
| `--accent-caramel` (`accent`) | `#C86D3B` | Hover accent, active seal ring highlight, active flavor state |
| `--bg-cream` (`neutral`) | `#F7F0E6` | Default warm oat-cream page canvas |
| `--bg-blush` (`blush`) | `#F7D7E0` | Soft frosting blush banner kicker & highlight tint |
| `--surface-linen` (`surface`) | `#EFE7DB` | Curved sunlit tabletop horizon & card base |

**Per-Flavor Ambient Surface Tints (`Section 2`):**

| Counter | Flavor | Ambient Surface Tint | Dough Color | Chunk / Mix-In Color |
| --- | --- | --- | --- | --- |
| `01 / 04` | **Brown Butter Choc Chip** | `#F4E6D4` | `#C58D56` | `#3A2014` |
| `02 / 04` | **Matcha White Choc** | `#E6ECE1` | `#7F9965` | `#F4EAD5` |
| `03 / 04` | **Double Dark Sea Salt** | `#E5D7CE` | `#4E2E20` | `#26140D` |
| `04 / 04` | **Toasted Pecan Oat** | `#F2D9C2` | `#B77C49` | `#633821` |

Contrast standard: body copy maintains WCAG AA `>= 4.5:1` (`#3D2216` on `#F7F0E6` is ~12.4:1; `#F7F0E6` on `#3D2216` is ~12.4:1) and large display headings maintain `>= 3:1`.

## Typography

- **Display Serif:** `"Fraunces", Georgia, "Times New Roman", serif` (Google Fonts `opsz,wght@9..144,400..700`, `display=swap`). Used for headlines, offer banner copy, flavor spotlight titles, and tabular counters.
- **UI & Body Sans:** `"Plus Jakarta Sans", system-ui, -apple-system, sans-serif` (Google Fonts `wght@400;500;600;700`, `display=swap`). Used for navigation, tasting descriptions, price tags, micro-kickers, and pill buttons.
- **Numerals:** All step counters (`01 / 04`, `06`, `Your Jar (0)`) strictly enable `font-variant-numeric: tabular-nums` so rolling/counting transitions never jitter horizontally.

## Layout

### Responsive Breakpoints

| Viewport | Layout Rules |
| --- | --- |
| `1440px` (Desktop) | Two-column hero (`1.05fr / 0.95fr`), `slotHeroJar` `min-height: 440px` over curved tabletop horizon; right sticky jar builder in Section 4. |
| `1024px` (Compact Desktop) | Reduced outer gutters (`24px`), `slotHeroJar` `min-height: 400px`, full 3-link primary nav visible. |
| `768px` (Tablet) | Single-column stacked hero: copy + CTA on top, `slotHeroJar` (`min-height: 340px`) cleanly below with zero overlap. |
| `390px` (Mobile) | Compact header (`Warm Batch` wordmark left + `Your Jar (0)` pill right), stacked hero (`slotHeroJar` `min-height: 300px`), stacked offer banner/seal, mobile bottom-bar builder in Section 4. |

### Section 2 Spatial Contract — Right-to-Left Rolling Flavour Spotlight

Adapted directly from the `crumbandough.com.au` spotlight layout in `references/reel-inspo.mp4`:

- **Scroll Track & Pinning:** Tall outer scroll wrapper (`~360vh`) enclosing a `position: sticky; top: 0; height: 100vh;` showcase stage with smooth ambient surface tint crossfades across all 4 flavors.
- **Desktop (`1440px` / `1024px`) Frame Zones:**
  - **Top Center:** Centered uppercase micro-kicker `FLAVOURS` (`label-caps`, wide tracking).
  - **Mid-Left:** Oversized two-line `Fraunces` flavor title (`display-flavor`, e.g. *Brown Butter / Choc Chip*, *Matcha / White Choc*) clipped inside a vertical overflow reveal mask.
  - **Bottom-Left:** Oversized tabular flavor index (`01 / 04` in `display-counter` paired with muted `/ 04`).
  - **Center-Right Showcase Slot:** Transparent measured `slotFlavorCookie` (~48% viewport height) hosting the **3D `.glb` cookie face-on** (`rotationX: 90°`) with a **soft elliptical contact shadow** anchored directly below it.
  - **Bottom-Right:** Concise tasting subtitle, 2-line ingredient note (`body-md`), and solid cocoa pill button (`Add to jar`).
  - **Right Edge:** Vertical **4-dot pagination rail** aligned right-center (active flavor dot scaled/filled `--ink-cocoa`, clickable to jump smoothly to any flavor).
- **Mobile (`390px` / `768px`) Adaptation:** Top micro-kicker + tabular index (`01 / 04`) + two-line flavor title on top, rolling 3D cookie + elliptical shadow centered across the middle band, and tasting note + `Add to jar` pill pinned cleanly near the bottom without overlapping the cookie silhouette.

## Elevation & Depth

- **Canvas Z-Stacking:**
  - `z-index: 0`: Curved tabletop horizon (`.hero-horizon`) and ambient section surface fills behind the canvas.
  - `z-index: 1`: Fixed full-viewport transparent `<canvas data-cast="stageCanvas">` (`pointer-events: none`).
  - `z-index: 2`: Site header, editorial copy, interactive pills, dot rail, and builder controls.
- **Sunlit 3D Lighting & Glass Depth:**
  - `MeshPhysicalMaterial` on `JarGlass` (`color: 0xf7efe4`, `transparent: true`, `opacity: 0.34`, `roughness: 0.08`, `metalness: 0.02`, `clearcoat: 1.0`, `clearcoatRoughness: 0.06`, `ior: 1.48`, `depthWrite: false`, `renderOrder: 2`).
  - Three-point warm kitchen daylight (`2048x2048` soft directional key light `#fff6e8`, warm cream hemisphere `#fffaf2`/`#e8d5c0`, soft fill `#fce8d8`) rendered with `ACESFilmicToneMapping` (`1.05` exposure) and `SRGBColorSpace`.
  - Contact shadows travel with their subject (`ShadowMaterial` disc attached inside `jarModel` at `y = 0.002`, `opacity: 0.14`, `renderOrder: 0`; soft elliptical shadow beneath the rolling Section 2 cookies) so shadows never slice through models at responsive breakpoints.

## Shapes

- **Pills (`999px`):** All primary action buttons (`Fill your jar →`, `Add to jar`, `Your Jar (0)`).
- **Editorial Containers (`32px` / `24px`):** Rounded deep-cocoa morning offer banner (`32px`), sticky horizontal craft cards and jar builder drawer (`24px`).
- **Circular Seals & Rails (`50%`):** `112px` circular `WARM BATCH / 06 / FRESH DAILY` stamp (`92px` on mobile) and right-edge spotlight rail dots.
- **Curved Horizon (`50% 50% 0 0 / 100% 100% 0 0`):** Subtle sunlit tabletop ellipse grounding the hero jar.

## Components

- **Site Header:** 3-column grid (`Flavours`, `Craft`, `Fill a Jar` left, centered `Fraunces` **Warm Batch** wordmark, right `Your Jar (N)` pill); collapses left links cleanly under `480px`.
- **Cocoa Offer Banner + Rotating Seal:** High-contrast `#3D2216` rounded banner (`#F7F0E6` text, `#F7D7E0` kicker) with circular bordered seal (`offerSeal`).
- **Right-to-Left Rolling Cookie Spotlight:** 4-flavor interactive showcase pairing sticky DOM layout zones, vertical dot rail, and 4 face-on 3D rolling cookie instances.
- **Sticky Craft Strip:** 4 step cards (*01 Build your jar*, *02 Baked that morning*, *03 Sealed warm in glass*, *04 Picked up or dropped off*) gliding horizontally across sticky scroll.
- **Six-Cookie Jar Builder:** Desktop right sticky sidebar / mobile fixed bottom drawer with `+1 / -1` flavor controls, 6-slot visual counter, and seal trigger.

## Do's and Don'ts

- **Do** keep `transform` unset in CSS on every `[data-cast]` element so `@gerak/dom` owns transforms exclusively.
- **Do** keep hero wrappers and `slot*` containers transparent so the `z-index: 1` WebGL canvas shines unobstructed behind/between DOM layers.
- **Do** keep DOM scroll/trigger beats un-smoothed (`x`, `y`, `rotation`, `scale`, `opacity`) for Chromium `ScrollTimeline` compositor offload while damping 3D objects cleanly.
- **Do** compute responsive 3D scale from `LENS.fov` and `context.rest` (`responsiveJarScale` / `responsiveCookieScale`) because 3D `travel({ to: slot })` does not scale to fit slots automatically (`G-02`).
- **Don't** place a static world-space shadow plane at fixed `y = 0` when 3D objects travel vertically across viewports; attach contact shadows to the subject assembly.
- **Don't** use dark backgrounds, neon glow, `any`, unchecked `as`/`!` casts, or `Math.random()`.

## 3D Studio & Motion Architecture

### Lens, Stage & `.glb` Contract

- **`STAGE_SIZE`:** `{ width: 1440, height: 900 }`.
- **`LENS: Lens3d`:** `{ x: 0, y: 0.9, z: 5.2, rotation: 0, rotationX: -6, rotationY: 0, fov: 36 }`, applied via `applyPose3d(camera, LENS)`.
- **`references/warm-batch-jar.glb`:** Bottom at `y = 0`, radius `0.60`, height `1.36`, nodes `JarGlass`, `JarGasket`, `JarLid` (`JarLid` translation `[0, 1.32, 0]` for clean `+Y` lid lift). Mounted inside `jarRoot` with `jarModel` offset by `-height * 0.57` (`-0.7752`) so `travel({ to: slotHeroJar })` centers the full jar-plus-lid silhouette.
- **`references/warm-batch-cookie.glb`:** Centered at `(0, 0, 0)`, flat on XZ plane, crown pointing `+Y`, radius `0.42`, thickness `0.16`, nodes `CookieDough`, `ChocChunks`, `SaltFlakes`.

### Section 2 — Right-to-Left Rolling Kinematics (`G-02` / `G-03` Aware)

- **Face-on showcase orientation:** Each flavor cookie in Section 2 rests tilted upright face-on toward the camera (`rotationX: 90°`) inside `slotFlavorCookie`.
- **No-slip wheel roll:** When transitioning from flavor `i` to `i + 1`, the outgoing cookie rolls left (`x: 0 → -exitX`) and the incoming cookie rolls in from right (`x: +enterX → 0`) with Z-axis spin strictly coupled to travel distance: `angleDeg = -(dx / R) * (180 / Math.PI)` (`R = JAR_METRICS.cookieRadius * scale`).
- **3D velocity banking & hover inspection:** During roll transit, `trailTurn` / `velocity3d` banks the cookie slightly along `rotationY` proportional to roll speed so the 3D thickness, chocolate chunks, and salt flakes catch sunlit highlights before settling flat face-on. At rest on desktop, pointer proximity (`pointer.x` / `pointer.y`) tilts the cookie gently (`±10°`).
- **Modular scene boundaries (`G-01`):** Section-local DOM casts live in modular `sceneBuilder()` files merged with `.include()`, while persistent multi-section 3D elements (`jarRoot`, `jarLid`, `cookieHero`) remain single-owned in the coordinating chain.
