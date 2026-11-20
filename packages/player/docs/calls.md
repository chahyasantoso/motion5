# @gerak/player: calls

Examples of the calls a scene makes; every export with its signature is in [the reference](./reference/README.md).

A scene is `(time, events) => targets`; `play` runs it on a driver.

```ts
const player = play(scene, clock(), { cues });
player.on("catch", () => sound.play());

const driver = manualDriver({ durationMs });
play(scene, driver);
driver.seekMs(1200);
```
