# @gerak/dom: calls

Examples of the calls a scene makes; every export with its signature is in [the reference](./reference/README.md).

Writes a value onto an element, and the drivers that move a scene on the page's frames, scroll or pointer events.

```ts
player.subscribe("title", (pose) => applyValue(title, pose));
applyValue(cover, wipe({ radius: 1500, x: 640, y: 360 }, time));

export const clock = () => clockDriver({ duration: durationMs });
const scrolled = () => scrollDriver({ start: 0, end: 1200, length: durationMs });
export const clock = () => eventDriver({ introMs: 900 });
```
