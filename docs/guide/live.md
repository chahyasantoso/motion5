# Live editing

`live.html` turns a scene file into an instrument: you edit the TypeScript file, or drag a number in the code panel,
and the stage answers on the next frame without losing its place in time.

## Open a scene

```bash
npm run motion:live -- timing
```

`motion:live` starts the Vite dev server (or reuses one already listening on the port) and prints the URL for
`live.html?scene=timing`. Every worked example (`timing`, `catch`, `splash`, `card`, `pile`, `principles`,
`principles3d`) and every scene made with `npm run motion:new` (DOM or `--three`) plays in it with no change to its
files.

## Save and keep your place

The scene file (`src/<name>-scene.ts`) is the only source of truth. When you save it in your editor:

- The player swaps the scene in place (`player.replace`) on the same clock driver, so the playhead, speed and loop
  range stay where they were.
- If you change the clock's duration, the host replaces the driver at the same elapsed millisecond.
- A physics scene (`simulate`) rebuilds its world and replays from snapshots to the current time.
- If an edit fails to compile or throws while sampling a frame, the stage keeps showing the last good values and a
  banner at the top reports the error until the next clean save.

## Timeline and keys

- **Play / Pause:** click the button or press `Space`.
- **Scrub:** drag the timeline scrubber, or turn the mouse wheel over the stage (`16 ms` per notch).
- **Single-frame step:** press `ArrowLeft` or `ArrowRight` to step backward or forward by `16 ms`.
- **Loop a beat:** drag across the loop track to bracket a start and end time; press `L` to toggle the loop range.
- **Slow down:** click `0.25x`, `0.5x` or `1x` to inspect fast motion or squash-and-stretch frames.
- **Marks:** any `span(from, to, duration)` and `cues` exported from the scene module appear as marks on the bar.

## Drag a number in the code

The code panel on the left reads `src/<name>-scene.ts` and underlines every numeric literal:

- Drag horizontally on a number to scrub its value live: integers step by `1` per pixel (`700` to `760`), and decimals
  step by `0.01` per pixel (`0.18` to `0.28`).
- When a literal sits inside a move call (`drop`, `hop`, `rope`, `trace`, `wipe`), the drag clamps to the `min` and
  `max` declared on that move's option.
- Each change writes straight back to `src/<name>-scene.ts` (refusing the write if the file changed underneath), and
  the stage updates through the normal hot swap.

## Watching an agent work

An agent edits `src/<name>-scene.ts` the same way you do. Leave `live.html?scene=<name>` open while the agent works and
every edit it makes lands on the stage in front of you without a page reload.
