# Live inputs

Read this when a piece follows numbers that arrive while it plays: a microphone's level, a slider, a recorded session.
The loop is in [the agent guide](./agent-motion.md).

A rig can follow numbers that arrive while it plays: how far a mouth is open, whether an eye is shut, a slider. Each
number is a sample, an event with a value: `{ name: "mouthOpen", at: 1234, value: 0.6 }`. A scene stays a function of
time and events, so a session of samples replays, scrubs and renders like any other piece.

- **Read samples through `follow`.** `follow({ start: 0, on: { mouthOpen: "value" } })` springs to each sample's own
  value, which smooths a jittery source and turns back with no jump; `stiffness` and `damping` set how fast. Give each
  stream its own `follow`, made once outside the scene, and map its answer to the parts: a beak's `rotation`, an
  eyelid's `scaleY`. Never read `events` by hand to find the latest sample.
- **A recording is `cues`.** A JSON list of samples is a session: `import talk from "../references/<file>.json" with
  { type: "json" }` (the tools run in Node, which needs the attribute) and `export const cues = talk`. Make the story at least as long as the recording; the review reports cues after its end,
  which no clock reaches.
- **A live source calls `send`.** `mountStage(...).send("mouthOpen", level)` logs a sample at the clock's time and
  keeps the clock running past the story's end until it settles; `events()` hands back the log, ready to save as
  `cues`. `talk.html?piece=<name>` does this from the microphone. A loop of the story would clear the log each pass,
  so a live piece does not loop its story: an idle motion such as breathing loops inside the scene, on `time`'s
  elapsed ms, while the clock runs on.
- **Switch or morph a mouth.** Parts drawn apart (`beakShut`, `beakOpen`) switch with `opacity` from the scene. Where
  the step shows, morph: `actor({ path, shapes: [open, wide] })` and the value field `shape` blends them, 0 being
  `path`, 1 `shapes[0]` and 1.5 halfway to `shapes[1]`. Each outline must have as many separate pieces as `path`;
  the member's box stays its `path`'s. Look at the midway frames: a blend pairs cubics by order, and can twist.
  Draw the outlines in the SVG beside the part, with ids `<part>-shape1`, `<part>-shape2` (hidden with
  `opacity="0"` if you like): the import makes them the part's `shapes` instead of parts, and lists any it cannot.
- **How much has been said is `tally`.** `tally({ start: 0, on: { mouthOpen: "value" } })` answers the area under
  the samples so far, each held until the next, and `.total(events)` the whole recording's, so `said(time, events) /
  said.total(events)` runs 0 to 1 through the speech: reveal a caption's `words` by that share, or fill a progress
  bar. It is exact, seeks for free, and costs the same at the end as at the start. Never sum a `follow` from the
  start of the talk to find it.
- **Test a sample by hand** with `motion:sample <file>.ts --at 1300 --events "mouthOpen=0.6@1234"`
  (`name:target=value@ms` for a target).
- **Check** that no part is cut by the frame with the mouth at its widest, and that the review is clean with the
  recording as `cues`: it also seeks the scene back and forth and reports a value that differs from playing to it,
  which a scene keeping state between frames shows.
