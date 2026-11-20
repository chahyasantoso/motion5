# @gerak/core reference

Generated from doc comments by `npm run reference -- --write`; one page per source folder.

- [fields](./fields.md), 13 exports: Pose fields, rest values, combining rules, and lifting 2D poses to 3D.
- [time](./time.md), 30 exports: Time is a number over a span; this group reads it, shapes it (loop, chain, reversed, repeated) and arranges phases or lanes into one timeline.
- [blend](./blend.md), 8 exports: Blending turns two values or poses into the value between them, and keyframes turns a list of keys into a curve.
- [ease](./ease.md), 9 exports: Easing reshapes progress so motion accelerates or settles; spring and back are the eases with overshoot.
- [envelope](./envelope.md), 5 exports: An envelope is an amount over time: an arch up and down, an attack, a decay, a taper or a wave.
- [geometry](./geometry.md), 58 exports: Geometry holds the vector, matrix and quaternion maths, the 3D camera lens, and the path tools: shape outlines, arcs, resampling, reversal, transforms, bounds and area.
- [path](./path.md), 5 exports: Motion along a curve or through the air: a point and tangent along a path, its length, and a ballistic arc.
- [measure](./measure.md), 5 exports: Measures read a signal back: how fast it moves, and the area under a stream of samples.
- [events](./events.md), 8 exports: An event is something that happened at a moment, such as a hover, a press or a landing, carried beside the scene's time.
- [utility](./utility.md), 3 exports: Small shared helpers: a seeded random, a clamp and an exhaustive-switch guard.
- [principles](./principles.md), 25 exports: The motion principles as signal transforms: squash and stretch, anticipation, follow-through, overlap, arcs, exaggeration and secondary action, each built from its options then given a signal.
- [state](./state.md), 14 exports: State from events: a fold of the event log up to a time, and values that spring or ease when the state changes.
