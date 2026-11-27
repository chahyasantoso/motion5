# Layout and changing place

Read this when poses depend on measured layout geometry or transitions when CSS layout changes (viewport resize, class toggle, expanding card, reordered list). Loop basics are in [stage.md](./stage.md).

## Reading measured rest boxes

- Entrances arrive at layout rest (start offsets relative to `rest`, rather than guessing coordinates).
- Read a member's measured box via `rest.get("dot")` (`{ x, y, width, height }` centered in frame px, returning `ZERO_BOX` when not yet measured). Run `gerak measure <brief>/<name>.html` so headless tools read the page's measured rest boxes.

## Re-measure transitions with `carry`

The page's HTML and CSS own the layout. When a viewport resize, font load, DOM mutation or `mounted.remeasure()` changes an element's CSS box, `carry` transitions it from its old rest box to its new one over `ms`:

```ts
import { ease } from "@gerak/core";
import { box, carry, scene } from "@gerak/stage";

export default scene(
  { length: 2500 },
  box("card").moves(carry({ ms: 450, ease: ease.cubicOut, mode: "scale" })),
);
```

- **Routes / absent boxes:** Members hidden (`display: none`) in the DOM report zero width/height and are omitted from scaling between visible/absent boxes.
- **`carry` modes:**
  - `"scale"` (default): translates center and scales width/height toward the previous/interrupted box, returning smoothly to `scale: 1`.
  - `"clip"`: crops without scaling (only suited where the new box encloses the old one).
  - `"keep"`: moves position while holding size unchanged.
- **Reordering within one state:** Pass `target: (past, rest) => rest.get(\`list.\${slotOf(past, index)}\`)` to carry an item across slot boxes driven by events as well as re-measures.
