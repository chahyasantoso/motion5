# @gerak/core: events

An event is something that happened at a moment, such as a hover, a press or a landing, carried beside the scene's time. Reach for it to react to the page or to mark moments for other moves.

- **`NO_EVENTS`** `const NO_EVENTS: Events`: The empty event list; share it rather than allocating one.
- **`isMotionEvent`** `(value: unknown): value is MotionEvent`: Whether `value` is a `MotionEvent`: a `name`, an `at` and, when given, a `target`, an `x`, `y`, a `value`, a `point` of numbers and an `other`.
- **`mergeEvents`** `(...lists: readonly Events[]): Events`: Several event lists as one, oldest first; a scene's own cues joined with the page's events.
- **`EventPoint`** `type EventPoint = { x: number; y: number; z?: number }`: A point an event happened at, in the scene's units; `z` only in 3D.
- **`Events`** `type Events = readonly MotionEvent[]`: Every event so far, oldest first; a scene reads it beside its time.
- **`MotionEvent`** `type MotionEvent = { name: string; at: number; target?: string; x?: number; y?: number; value?: number; point?: EventPoint; other?: string }`: Something that happened at `at` ms on the scene's clock: a hover, a press, a landing, or a sample of a live number; `target` names where.
- **`eventLog`** `(): EventLog`: A log of events that only grows, so a state reading it again folds only the events added at its end.
- **`EventLog`** `type EventLog = { events: Events; add: (event: MotionEvent) => void; clear: () => void }`: A log that only grows: each event goes in at its time, after any at the same ms, and none is replaced.
