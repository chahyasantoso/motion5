# ADR-181: Live inputs

**Status:** Accepted, 2026-11-14

## Context

A rigged character could not follow numbers that arrive while it plays. An event carried a name, a time, a target
and a point, never a value; only the live event driver could log one by hand, not the stage; `follow` sprang towards
a goal fixed per event name, so it could not follow a stream; and a path member's outline was fixed, so a mouth could
not change shape. Tracking itself (a face tracker, a microphone's level, a slider) stays outside the base.

## Decision

- **A sample is an event with a value.** `MotionEvent` gains `value?: number`, and `isMotionEvent` accepts it. A
  scene stays a pure function of time and events, so a session replays, scrubs and renders like any other.
- **The stage takes samples by hand.** `MountedStage.send(name, value, target?)` logs one at the clock's time, and
  `MountedStage.events()` hands back the log, ready to save. A sample keeps the clock running past the story's end,
  as a watched member does, until `SAMPLE_SETTLE_MS` after the latest; a clock that stopped at its end starts again.
  A loop clears the log each pass, so a live piece does not loop its story; an idle motion loops inside the scene.
- **`motion:sample` takes samples too:** its event text reads `name=0.6@1234` and `name:target=0.6@1234`. The review
  reports cues after the story's end, which no clock reaches.
- **`follow` follows a stream.** An entry of its `on` may be `"value"`: the event's own value is the goal, and an
  event with none is skipped. There is no second spring helper. Each follow keeps the spring as the last event it took
  left it; a later call goes on from there while every event it took is still at its place in the log and none is
  after the time asked, and starts again otherwise. Its answers are exactly what a run from the start gives.
- **A recorded session is `cues`:** a JSON list of events a piece imports as its `cues`; there is no record command.
- **A path member may morph.** An actor gives `shapes`, outlines after its `path`; the value field `shape` blends
  them, 0 being `path` and 1.5 halfway between `shapes[0]` and `shapes[1]`. Outlines are matched once when the cast is
  read: a closed outline is turned to start nearest the first's start and to run the same way round, then each pair
  is split at its longest cubics until both have as many. Outlines with different counts of pieces are refused by
  member; a member's box stays its `path`'s.
- **Imported art goes into a bigger scene:** `motion:import-svg <file> --into <piece> --at x,y [--scale s] --prefix
  <word>` adds a drawing's parts, placed and scaled in the piece's frame, every name and defs id prefixed. It stays
  one stage module; there is no composition layer.
- **Switching needs nothing new.** Mouth parts drawn apart switch with `opacity`; a morph is for steps switching makes
  too visible.

## Consequences

- A session of thousands of samples costs each frame a check of the log by identity, a small share of springing
  through it again, while seeking backwards or a log that differs before the last event replays it once.
- Matching outlines by splitting keeps each exact but may pair a corner with a curve, so a blend can twist midway.
- A page that feeds `send` from a microphone needs a person; no test reaches it.
