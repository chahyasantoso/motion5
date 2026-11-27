# @gerak/player: calls

Examples of the calls a scene makes; every export with its signature is in [the reference](./reference/README.md).

A scene is `(time, input) => targets`; `play` runs it on a driver, which owns an `inputLog` with typed `set` and `trigger` writers against a declared `Contract`.

```ts
const driver = liveClock();
const player = play(scene, driver, { cues });
driver.set(ui, "open", 1);
driver.trigger(ui, "catch");
player.on("catch", () => sound.play());
const stop = player.observe(value(ui, "open"), (open) => renderOpen(open));

const manual = manualDriver({ durationMs });
play(scene, manual);
manual.seekMs(1200);
```
