# @gerak/moves

Plain moves for a scene: each is a function from typed options to a function of time, so a scene writes `drop({ distance: 400 })(time)`. An option a move refuses throws a `RangeError` when the move is built.

- `drop`: falls from above, then lands and recovers from its squash; `DROP_LANDING` is where it lands.
- `rise`: rises from below, decelerating to rest.
- `slide`: slides in from one side, decelerating to rest.
- `pop`: grows past full size, then settles to full size.
- `fade`: fades in from clear to opaque.
- `unfold`: grows along one axis to full size, held at one edge.
- `swing`: hangs in from a turn and swings to rest.
- `hop`: lands several times, each flight lower, and settles; `hopLandings` is where it lands.
- `pulse`: grows a little and returns to its size.
- `shake`: shakes side to side, dying away.
- `wobble`: turns back and forth, dying away.
- `nod`: dips down and comes back up, once.
- `trace`: draws a stroked path on from its start.
- `wipe`: reveals through a circle that grows from a point.
- `smudge`: blurs from sharp as speed builds.
- `rope`: bends a chain of points from straight into their shape, link by link.
- `overshoot`: plays a signal, then goes a little past its end and settles back.
- `squashed`, `squashed3d`: a pose squashed against a side, or a body shortened along an axis.
- `follow`, `react`, `noise1d`: signals from events and time.

[Docs](./docs/README.md)
