# @gerak/core: events

An event is something that happened at a moment, such as a hover, a press or a landing, carried beside the scene's time. Reach for it to react to the page or to mark moments for other moves.

- **`NO_EVENTS`** `const NO_EVENTS: Events`: The empty event list; share it rather than allocating one.
- **`isMotionEvent`** `(value: unknown): value is MotionEvent`: Whether `value` is a `MotionEvent`: a `name`, an `at` and, when given, a `target`, an `x`, `y`, a `value`, a `point` of numbers and an `other`.
- **`mergeEvents`** `(...lists: readonly Events[]): Events`: Several event lists as one, oldest first; a scene's own cues joined with the page's events.
- **`EventPoint`** `type EventPoint = { x: number; y: number; z?: number }`: A point an event happened at, in the scene's units; `z` only in 3D.
- **`Events`** `type Events = readonly MotionEvent[]`: Every event so far, oldest first; a scene reads it beside its time.
- **`MotionEvent`** `type MotionEvent = { name: string; at: number; target?: string; x?: number; y?: number; value?: number; point?: EventPoint; other?: string }`: Something that happened at `at` ms on the scene's clock: a hover, a press, a landing, or a sample of a live number; `target` names where.
- **`attachOnEvent`** `(events: Events, listener: (event: MotionEvent) => void): (() => void) | undefined`: Subscribes to every synchronous `add(event)` on the log backing `events`, returning an unsubscribe handle.
- **`baseIndexOf`** `(events: Events): number | undefined`: Logical count of prefix events compacted away from `events`, or undefined for non-log lists.
- **`baselineOf`** `(events: Events): ReadonlyMap<string, number> | undefined`: Latest sample values per continuous input channel preserved across prefix compaction.
- **`compactEvents`** `(events: Events, beforeMs: number): number`: Compacts the backing `EventLog` of `events` strictly before `beforeMs`, returning removed count.
- **`compactedBeforeOf`** `(events: Events): number | undefined`: Earliest ms retained in `events` after compaction (`-Infinity` if never compacted), or undefined for non-logs.
- **`derivedEvents`** `(): DerivedEvents`: Creates a cached `Events` merger/filter that avoids rebuilding unchanged windows across frames.
- **`eventLog`** `(options?: EventLogOptions): EventLog`: A log of events that only grows, supporting optional retention compaction and synchronous streaming.
- **`eventSerialsOf`** `(events: Events): readonly number[] | undefined`: Monotonic insertion serials aligned with `events` when backed by an `eventLog`.
- **`generationOf`** `(events: Events): number | undefined`: An `eventLog` list's count of changes other than adding at its end, or undefined for any other list.
- **`sourceStreamOf`** `(events: Events): object | undefined`: Stream identity token preserved across `derivedEvents` time-window slicing of a single log.
- **`versionOf`** `(events: Events): number | undefined`: An `eventLog` list's count of every change, adding included, or undefined for any other list.
- **`DerivedEvents`** `type DerivedEvents = { resolve: (cues: Events, page: Events, maxAt: number | undefined) => Events }`: Cached derived view over event lists filtered by elapsed ms while keeping monotonic metadata.
- **`EventLog`** `type EventLog = { events: Events; add: (event: MotionEvent) => void; compact: (beforeMs: number) => number; clear: () => void }`: A log that only grows: each event goes in at its time, after any at the same ms, and none is replaced.
- **`EventLogOptions`** `type EventLogOptions = { retention?: RetentionPolicy; onEvent?: (event: MotionEvent) => void }`: Settings of `eventLog`: retention policy and an optional synchronous event stream callback.
- **`RetentionPolicy`** `type RetentionPolicy = { readonly kind: "all"; } | { readonly kind: "live"; readonly windowMs?: number; } | { readonly kind: "window"; readonly windowMs: number; readonly maxCheckpoints?: number; }`: How an event log retains or compacts historical events over time.
