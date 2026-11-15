# Motion atlas plan: standalone library-agnostic motion geometry with a `gerak` port

**Status:** Deferred, 2026-11-14: not built until a sameness score shows agents still converge; its measured, zero-ML part is `plan/anatomy-plan.md`. Brainstorm / exploratory proposal (2026-11-13). Not scheduled; records the target direction from researching Epicure ([arXiv:2605.22391](https://arxiv.org/abs/2605.22391)) and separating universal motion knowledge (`motion-atlas`) from execution runtimes (`gerak` and other ports).

## 1. Intent

Build **`motion-atlas`** as a standalone, library-agnostic Epicure map of motion design—capturing full **Anatomy × Physics** (`Motion-Chem`) and real-world choreography (`Motion-Cooc`)—and connect it to `motion5` through a thin **`port-gerak`** adapter inside `@gerak/tools`.

Separating universal motion knowledge from execution runtimes preserves `gerak`'s invariants while removing the adoption barrier:

- **Pure scene functions:** `@gerak/moves`, `@gerak/stage`, and `@gerak/player` run zero ML and stay pure `(time, events) => targets`.
- **Authored, not copied:** agents navigate abstract geometry and compositional grammar rather than reading or copying example scenes.
- **Standalone atlas, pluggable ports:** `motion-atlas` owns crawling, normalization, ML compilation, and universal queries (CLI / TS SDK / MCP); `motion5` owns the lossless `port-gerak` adapter, while sibling ports (`port-gsap`, `port-motion`, `port-css`) serve external ecosystems and surface explicit capability gaps where CSS/imperative tools fall short.

```text
  [Sources]   Websites (DOM + WAAPI) · Lottie/SVG · gerak scenes · Video (CoTracker)
                  │                       │              │               │
                  └───────────────────────┴──────────────┴───────────────┘
                                          ▼
                   [motion-atlas: Extractor] ──► CanonicalMotionUnit (agnostic IR)
                                          ▼
                   [motion-atlas: Compiler]  ──► Chem / Cooc / Core + FastICA + GMM (~1–3 MB)
                                          ▼
                   [motion-atlas: Query API] ──► CLI / TS SDK / MCP Server
                                          │
            ┌──────────────────┬──────────┴──────────┬──────────────────┐
            ▼                  ▼                     ▼                  ▼
      [port-gerak]       [port-gsap]          [port-motion]        [port-css]
     (100% lossless)   (timeline code)      (React Motion JSX)   (approx + warnings)
```

### Background: existing landscape vs. the gap

No existing project combines an Epicure-style `Chem` + `Cooc` + `Core` geometric map over real 2D/3D motion data with navigable axes and a verifiable code runtime. Today's ecosystem splits into four disconnected pieces:

- **AI motion skills & MCPs (`LottieFiles/motion-design-skill`, `@lottiefiles/creator-mcp`, `motiondivision/motion` MCP / `nox motion-ai`, `nexu-io/motion-anything`):** rely on hand-written prose heuristics (Disney's 12 principles, prompt recipes) rather than learned geometry mined from real corpora with SLERP navigation or curve projection.
- **Curated UI motion kits (`ibelick/motion-primitives`, `orocoa/TuneShape`):** flat component/parameter catalogs with no cross-actor `Cooc` choreography graph, no `role`-residualized character axes, and no agnostic IR porting across targets.
- **Academic motion embeddings (`CompVis/long-term-motion` ZipMo, *SAME*, `DK-Jang/motion_puzzle`):** learn latent spaces and style transfer for **human skeletal kinematics or video pixels**, not UI/graphics primitives, `VALUE_FIELDS`, or executable code moves.
- **Video-to-code benchmarks & diffusion (`anim2code/dataset`, `SeonmiP/KineTy` / [arXiv:2407.10476](https://arxiv.org/abs/2407.10476)):** evaluate video-to-HTML or synthesize uneditable raster pixels rather than providing a navigable code-level motion vocabulary.

The white space is **an Epicure "flavor map" for motion design**—mining real 2D/3D motion into a tiny, navigable `Chem` + `Cooc` atlas paired with `gerak` as its pure, checkable execution target.

## 2. Epicure-to-Motion Mapping

| Epicure ([arXiv:2605.22391](https://arxiv.org/abs/2605.22391)) | Agnostic `motion-atlas` Equivalent | `port-gerak` Mapping |
| --- | --- | --- |
| FlavorDB chemical compounds | Anatomical channels, phase laws, couplings, kinematic descriptors (`Chem`) | `MOVE_PARTS`, `VALUE_FIELDS`, `defineMove.recipe` |
| Canonical ingredients | Library-agnostic `CanonicalMotionUnit` archetypes | `defineMove` moves + calibrated `options` presets |
| Food groups (residualized out) | `role` (`enter`, `exit`, `emphasis`, `travel`, `reveal`, `follow`) + primary channel | `MoveRole` + `Pose2d`/`Pose3d` fields |
| Recipes / dishes (corpus) | Web DOM sections, Lottie comps, stage scenes (`Cooc`) | Stage modules (`combine`, `sequence`, `lanes`, `moments`) |
| `Chem` / `Cooc` / `Core` | Physical affinity (`Chem`), idiomatic pairing (`Cooc`), tunable blend (`Core`) | Same three vector tables loaded by `@gerak/tools` |
| FastICA axes & GMM modes | Orthogonal motion-character axes & named motion idioms | Character steering & `motion:review` mode checks |
| SLERP & linear probes | Agnostic spec navigation & brief-to-archetype lookup | Option-manifold SLERP & `defineMove` substitution |

> **Naming note:** `packages/moves/src/declare.ts` uses the field name `recipe` on `defineMove` for the list of `MOVE_PARTS` a single move is built from (e.g., `recipe: ["backEase"]`). In Epicure terms, `defineMove.recipe` is the **ingredient's chemical formula (`Motion-Chem`)**, whereas a **scene / web section** combining multiple moves (`combine`, `sequence`, `lanes`, `moments`) is the **cooking recipe (`Motion-Cooc`)**.

## 3. Agnostic Core IR (`CanonicalMotionUnit`) & Full Anatomy × Physics

### Guardrail: never dumb the schema down to CSS

An agnostic atlas must still carry **full motion anatomy and physics** (`gerak` + Lottie fidelity). Simpler ports (`port-css`) approximate or warn on features they lack (such as dynamic `contact`-triggered squash or spring `trail`), while `port-gerak` executes the full specification losslessly.

```ts
interface CanonicalMotionUnit {
  id: string;
  medium: "dom-2d" | "dom-3d" | "vector-2d" | "scene-3d" | "rig-3d" | "video";
  role: "enter" | "exit" | "emphasis" | "travel" | "reveal" | "follow" | "camera";
  anatomy: {
    channels: (
      | "x" | "y" | "z" | "rotation" | "rotationX" | "rotationY"
      | "scale" | "scaleX" | "scaleY" | "scaleZ" | "skewX" | "skewY"
      | "opacity" | "blur" | "color" | "shadow" | "drawn" | "clip" | "mask"
    )[];
    anchor: "center" | "bottom" | "top" | "left" | "right";
    phases: ("windup" | "impulse" | "contact" | "settle")[];
    couplings: (
      | "area-squash" | "volume-squash" | "tangent-heading"
      | "camera-aim" | "spring-drag" | "rig-ik" | "sibling-stagger"
    )[];
  };
  physics: {
    law: "bezier" | "spring" | "ballistic" | "damped-wave" | "noise" | "piecewise";
    params: Record<string, number>;
    kinematics: {
      durationRegime: "micro" | "short" | "travel" | "hold";
      timeToPeakVel: number;
      peakAccelNorm: number;
      peakJerkNorm: number;
      anticipationRatio: number;
      overshootRatio: number;
      ringCount: number;
      squashCoupling: number;
      settleShare: number;
    };
  };
  coocPeers: {
    relation: "simultaneous" | "sequential" | "stagger" | "moment-reaction";
    peerId: string;
    lagShare: number;
  }[];
}
```

### Current `gerak` primitives (`port-gerak` target) vs. gaps

- **Channels (`VALUE_FIELDS` in `packages/moves/src/pose.ts`):** 19 numeric fields (15 in `POSE_2D_NUMBERS`: `x`, `y`, `rotation`, `scale`, `scaleX`, `scaleY`, `opacity`, `blur`, `drawn`, `drawnFrom`, `clipX`, `clipY`, `clipRadius`, `clipWidth`, `clipHeight`; plus 4 3D fields: `z`, `rotationX`, `rotationY`, `scaleZ`) alongside `anchor` and `custom`.
- **Building blocks (`MOVE_PARTS` in `packages/tools/src/scene/parts.ts`):** 39 parts across 7 groups (`time`: 8, `eases`: 3, `blends`: 12, `paths`: 4, `follow-through`: 8, `events`: 3, `randomness`: 1). (`window` and `windowed` are exported in `packages/moves/src/index.ts` though not yet listed in `MOVE_PARTS`.)
- **Focused `gerak` gaps to match full Anatomy × Physics:**
  1. Continuous wave/noise parts (`wave`, `dampedWave`, `noise1d`) so moves like `apps/pieces/src/moves/launch.ts` and `squish.ts` declare `recipe` instead of inlining `Math.sin` / `Math.exp`.
  2. Progress remapping and envelopes (list `window` in `MOVE_PARTS`, plus `envelope` / `remap`).
  3. 2D spatial / ballistic / radial parts (`ballistic`, `polar` / `radial`).
  4. Missing `VALUE_FIELDS` channels: `color`, `shadow`, `skewX`/`skewY`, and arbitrary shape `mask` (`blur` already exists; `color`, `shadow`, and `mask` are flagged in `plan/roadmap.md`; lack of skew is noted in `docs/guide/agent-principles.md`).
  5. Typed `Chem` descriptors alongside `recipe` (ease polarity, channel footprint, anchor, coupling) rather than coarse `"ease"` / `"mix"` strings alone.

### `Motion-Chem` compound coverage (Anatomy × Physics)

- **Anatomy:** spatial DoFs (`have`), shear/skew (`missing`), optical/surface (`opacity`, `blur` `have`; `color`, `shadow` `missing`), topology/reveal (`drawn`, `clip*` `have`; general `mask` `missing`), phase structure (`have`), channel coupling (`squashed`, `squashed3d` `volume-squash`, `smear`/`smear3d`, `along`/`along3d`, `aim`/`orbit` `camera-aim`, `trail`/`trailTurn`, `rope`, `@gerak/rig` `rig-ik`, `lanes` `have`).
- **Physics:** timing/velocity (`have`), cubic Bezier & 3D `orbit` (`have`; 2D `ballistic`/`polar` `missing`), springs/damping/anticipation (`have`), gravity/bounce (`partial` inline in `drop`/`hop`), continuous waves/noise (`missing`), and emergent materiality (rigid, elastic, heavy, buoyant, viscous) captured by the 8 normalized `kinematics` descriptors (`checkMove` in `packages/tools/src/scene/moves.ts` already samples 62 steps over `example` and `optionSets`).

### `Motion-Cooc` (choreography & pairing across scenes)

Captures which moves co-occur in sections and scenes via NPMI across four relations: (1) `simultaneous` (`combine`), (2) `sequential` (`sequence`), (3) `stagger` (`lanes` / hero vs. supporting cast harmony), and (4) `moment-reaction` (`moments` call-and-response with timing lag).

## 4. Target End-State: Agnostic Queries & `port-gerak` Workflows

Any client (CSS/Motion/GSAP/agent via MCP) queries `motion-atlas`, and **`port-gerak`** renders the chosen specs into pure `@gerak/moves` + `@gerak/stage` code:

1. **Brief-to-palette grounding:** project brief adjectives through text probes onto `Motion-Core` to pick a coherent cross-role palette plus an anti-palette of moves pulling toward opposite poles.
2. **Hero vs. supporting cast separation:** place the hero in a high-salience GMM mode and pick supporting moves aligned in `Cooc` style yet orthogonal on the hero's dominant Snap/Elasticity axes.
3. **Cross-actor `moments` pairing:** query `Motion-Cooc` for call-and-response reactions (`port-gerak` binds cleanly via `move.moments`; `port-css` warns that dynamic contact triggers cannot be coupled).
4. **SLERP calibration after `motion:review`:** steer coupled options together on a move's parameter manifold (or substitute along `Chem`).
5. **Gap-driven `defineMove` invention:** detect empty pockets in `(role × Character)` space, inspect `MOVE_PARTS` bridges, author a new move, and verify novelty via fold-in.
6. **Brand and medium transfer:** shift a piece across GMM style modes via vector arithmetic while preserving roles, beats, and layout anchors.
7. **Inverse reference matching:** project scraped site trajectories (`motion:read`) or video tracks into `Motion-Chem` to retrieve native target code (`port-gerak` recipes or GSAP/Motion equivalents).
8. **Aesthetic linting:** flag cast mode outliers and discontinuous beat hand-offs inside `motion:review` via `port-gerak`.

### Anti-genericity and vocabulary growth rules

- **Avoid cliché convergence:** separate `Cooc` familiarity from `Chem` physical affinity—querying high-`Chem` / low-`Cooc` yields fresh combinations, and the ideation loop in `docs/guide/agent-motion.md` ("The loop", step 1) queries the high-`Cooc` centroid explicitly to mark and exclude the "obvious" answer while sampling distant GMM modes.
- **Crystallize new `gerak` moves cleanly:** mixing parts or moves produces a new `defineMove` only when parts **couple internally over `progress`**, its `Chem` coordinate sits beyond $\epsilon$ from existing moves, and its options generalize across briefs (otherwise compose via `combine` / `sequence`). For `motion:promote`, `Chem` duplicate checks complement the distinct-brief import rule in `plan/composition-four-plan.md`.

## 5. ML Architecture, Data Ladder, and Repo Split

### Repo boundary (`motion-atlas` vs. `motion5`)

- **`motion-atlas` (standalone repo):** Python (`torch`, `scikit-learn`, `numpy`) + Playwright extractor + MCP/CLI + target ports (`port-motion`, `port-gsap`, `port-css`). Owns crawling, normalization, and ML compilation into a ~1–3 MB static atlas artifact.
- **`motion5` (`@gerak/tools`):** Zero ML training or heavy corpora. Holds **`port-gerak`**: exports canonical `defineMove` kinematics/AST edges and consumes the ~1–3 MB static atlas via pure TypeScript math (`dot`, `slerp`, nearest mode, pairing lookup).

### Data sources differentiated by medium (4 tracks)

Instead of treating all animation sources as one generic web scrape, `motion-atlas` separates extraction into four medium-specific tracks feeding the same `CanonicalMotionUnit` schema (tagged with `medium` so missing channels in 2D DOM never bias 3D embeddings, while physics factors transfer across 2D and 3D):

| Track | Source Corpus | Extractor Method | What It Teaches |
| --- | --- | --- | --- |
| **1. `dom-2d` / `dom-3d`** | Curated live sites (Awwwards GSAP/Animation filters, Godly, Lenis Showcase, GSAP Showcase, Curated Design, Codrops DOM, Motion Primitives) | `motion:read` (`packages/tools/src/page/read.ts`, `curves.ts`) extended to 4×4 `DOMMatrix` + WAAPI/CDP (`load`, `scroll`, `hover`) | UI timing, scroll choreography, `lanes` staggers, CSS 3D card tilt (`rotateX/Y`, `translateZ`) |
| **2. `vector-2d`** | Public Lottie/SVG datasets (`MMLottie-2M`, `OmniLottie`, Rive) | Direct JSON AST parser (layers, Bezier handles, trim paths) | Expressive squash-stretch, `drawn` stroke reveals, `windup`, non-DOM motion |
| **3. `scene-3d` / `rig-3d`** | glTF/GLB animation clips + open Three.js/R3F repos (Codrops WebGL, `three.js` examples) + `@gerak/three` / `@gerak/rig` | glTF track parser + Three.js `Scene`/`Camera`/`Object3D` 16 ms frame sampler | Camera `orbit`/`aim`/dolly, `volume-squash`, quaternion turns, FK/IK rigs |
| **4. `video` (query-time / optional)** | Recorded MP4s, Dribbble shots, closed production WebGL `<canvas>` sites | CoTracker / Dense Optical Tracking + RDP simplification | Reference-matching queries rather than base graph training |

### Data scale and synthetic vs. real rule

| Component | Minimum Viable (PoC) | Solid Production (Tier 4) | Synthetic Policy |
| --- | --- | --- | --- |
| **`Motion-Chem`** | ~100–300 canonical curves | ~1,000–3,000 curves/presets | **100% synthetic sweeps help:** sweep `defineMove` options, springs, easings, and stacked modifiers (`overshoot(anticipate(...))`) for noise-free physics coverage. |
| **`Motion-Cooc`** | ~500–2,000 animated sections/comps | ~10,000–50,000 sections/comps | **Must be real human-crafted scenes:** pure LLM- or randomly generated choreography distills existing clichés or noise. Only safe invariant perturbations (left/right mirror, $\pm 15\%$ tempo, stagger count) should augment real sections. |
| **Text Probes** | ~200–500 tagged items | ~1,000–3,000 tagged items | **Synthetic captioning over real motion:** use an LLM/VLM only to tag/describe *real* captured sections and sheets, never to invent fake scenes. |

### Prerequisite: Motion vocabulary extractor tool (`motion-atlas`)

Before any Tier 4 ML training runs, modular extractors turn Tracks 1–3 into clean `CanonicalMotionUnit` training data without relying on noisy `<canvas>` pixel scraping:

- **Track 1 DOM extractor (over `motion:read`):** reuse `read.ts` and `curves.ts` (16 ms transform decomposition + reversal splitting + curve fitting), upgrade matrix decomposition to 4×4 `DOMMatrix` for CSS 3D, replace manual `--select` with automatic viewport DOM scanning plus WAAPI (`document.getAnimations({ subtree: true })`) and CDP `Animation.enable`, and run three passes per URL (`load`, stepped `scroll`, `hover`/`click`), skipping closed `<canvas>` elements (`docs/guide/agent-motion.md`).
- **Track 2 & Track 3 asset/scene extractors:** direct JSON/glTF parsers plus an instrumented Three.js/R3F scene-graph sampler for open 3D demos (no WebGL pixel CV in v1).
- **Canonicalization:** normalize amplitudes/durations into the 8 kinematic descriptors, infer `role` from start/end states, cluster sibling staggers into `stagger` relations rather than duplicate nodes, and emit section-level `coocPeers` (kept medium-aware for `Cooc`) with millisecond lags and directory style tags.

### 5-stage compiler (`motion-atlas`) & static artifact contract

1. **Tokenize:** anchor native `defineMove` / library presets + cluster scraped kinematics into discrete `MoveUnit` archetypes linked to `Part`, `Context`, and `Section/Scene` nodes.
2. **Graph embedding (`Metapath2Vec`):** train 64–128D skip-gram embeddings under three walk schemas (`Motion-Cooc`, `Motion-Chem`, `Motion-Core`, blending walks at ratio $\alpha$ with metric anchoring onto measured kinematics).
3. **Role-residualized factorization:** regress out `(role, primary channel)`, extract multi-seed-stable `FastICA` axes, and cluster `GMM` motion modes.
4. **Lightweight probes:** fit ridge/contrastive `Text -> Motion-Core` probes and an optional `1D-CNN/MLP` `Raw Curve -> Motion-Core` encoder.
5. **Procrustes-aligned static export (~1–3 MB):** align axes against the previous atlas's anchors and lock polarity (e.g., `+weight` toward `ballistic-drop`, away from `spring-pop`) to prevent coordinate drift across milestone rebuilds. Export contains `nodes` (`chem`/`cooc`/`core` vectors), `ica` matrix + axis labels, `modes`, `coocPairs` NPMI table, and `probes` + per-move option-sensitivity mappings.

### Retraining cadence

- **No continuous or per-scene retraining.** New local `gerak` moves fold in immediately in `@gerak/tools` by projecting 62-step `run()` kinematics + `recipe` onto the frozen basis.
- **Batch rebuilds in `motion-atlas`** run on milestones: major primitive/port expansions, periodic web/Lottie corpus refreshes, or accumulated edit telemetry.

## 6. Path Forward & Sequencing Discipline

To avoid splitting focus between two large projects before validating demand, **advance one primary track at a time** (finish `plan/composition-four-plan.md` + Publish `0.x` in `motion5` first, or validate the standalone `motion-atlas` extractor + zero-ML MVP first):

| Phase | Repo | Concrete Deliverable | Outcome |
| --- | --- | --- | --- |
| **0. Extractor Tools (Prerequisite)** | `motion-atlas` | Track 1 Playwright crawler (`motion:read` + 4×4 `DOMMatrix` + `load`/`scroll`/`hover` + WAAPI/CDP, skipping closed `<canvas>`), Track 2 Lottie parser, and Track 3 glTF / open Three.js sampler emitting medium-tagged `CanonicalMotionUnit`s. | Clean, medium-aware 2D & 3D corpus ready before any ML training starts. |
| **1. Canonicalize & Measure** | `motion5` | Add missing `gerak` primitives (`wave`, `dampedWave`, `noise1d`, `window`/envelopes in `MOVE_PARTS`), populate `recipe`s, compute the 8 `kinematics` descriptors alongside `checkMove`, and export AST `coocPeers`. | `motion5` emits clean `CanonicalMotionUnit` anchors and is ready for `port-gerak`. |
| **2. Zero-ML Geometry & Ports (Tier 1–2)** | `motion-atlas` + `motion5` | Pure-TS cosine similarity, duplicate/gap checks for `motion:promote`, local `Cooc` pairing hints, coupled option sliders, plus initial `port-gerak` / `port-motion` / `port-css` emitters. | Validates whether agents and developers get real leverage before investing in ML. |
| **3. Atlas Compiler (Tier 4)** | `motion-atlas` | Train `Metapath2Vec` (`Cooc`/`Chem`/`Core`) + residualized `FastICA` + `GMM` + probes on the Phase 0 corpus + Phase 1 anchors; emit Procrustes-aligned static export + MCP server. | Compact ~1–3 MB universal atlas grounded in real web/vector motion and full Anatomy × Physics. |
| **4. `port-gerak` & Instrument Integration** | `motion5` | Connect `port-gerak` in `@gerak/tools` (`motion:moves`, `motion:review`, `live.html`, future `da-lang`) to query the static atlas for brief palettes, SLERP steering, reference matching, and aesthetic checks. | Agents author coherent, non-generic `gerak` pieces faster; `gerak` stands as the atlas's lossless execution runtime. |
