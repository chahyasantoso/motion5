# Layout and changing place

Read this when poses depend on measured layout geometry or transitions across layout states (route switch, expanding card, reordered list). Loop basics are in [stage.md](./stage.md).

## Reading measured rest boxes

- Entrances arrive at layout rest (start offsets relative to `rest`, rather than guessing coordinates).
- Read a member's measured box via `rest.get("dot")` (`{ x, y, width, height }` centered in frame px, returning `ZERO_BOX` before browser measurement or in headless mode).

## Multi-layout transitions with `carry`

Declare `layouts: { names, pick, rests? }` in the scene's options, style each view in CSS with `[data-layout="<name>"] [data-cast="..."]`, and give each element a `carry` motion to move it between layouts deterministically:

```ts
import { ease } from "@gerak/core";
import { box, carry, sceneBuilder } from "@gerak/stage";

export default sceneBuilder({
  length: 2500,
  layouts: {
    names: ["list", "detail"],
    pick: (events) =>
      events.findLast((event) => event.name === "click")?.target === "card" ? "detail" : "list",
  },
  cues: [{ name: "click", at: 1200, target: "card" }],
})
  .element(box("card", { watch: true }))
  .motion(carry({ ms: 450, ease: ease.cubicOut, mode: "scale" }));
```

- **State switching (`pick`):** Derive active layout from `events` alone (never from `time`). The first entry in `layouts.names` is active at `[]`.
- **Routes / absent boxes:** Members hidden (`display: none`) in a layout report zero width/height and are omitted from scaling between visible/absent layouts.
- **`carry` modes:**
  - `"scale"` (default): translates center and scales width/height toward the previous/interrupted layout box, returning smoothly to `scale: 1`.
  - `"clip"`: crops without scaling (only suited where resting size encloses both layouts).
  - `"keep"`: moves position while holding size unchanged.
- **Reordering within one layout:** Keep layout single or per-view and pass `target: (past, reader) => reader.get(\`list.\${slotOf(past, index)}\`)` to carry an item across slot boxes without multiplying layout names.
