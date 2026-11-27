# @gerak/dom: calls

Examples of the calls a scene makes; every export with its signature is in [the reference](./reference/README.md).

Writes a value onto an element, and the drivers that move a scene on the page's frames, scroll or pointer events.

```ts
import { ease, mix } from "@gerak/core";
import { applyValue, clockDriver, liveClock, scrollDriver } from "@gerak/dom";

player.subscribe("title", (pose) => applyValue(title, pose));
applyValue(cover, { clipRadius: mix(0, 1500, ease.cubicOut(time.progress)), clipX: 640, clipY: 360 });

export const clock = () => clockDriver({ duration: durationMs });
const scrolled = () => scrollDriver({ start: 0, end: 1200, length: durationMs });
const interactive = () => liveClock({ introMs: 900 });
```
