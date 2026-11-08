# ADR-164: Physics bodies turn

**Status:** Accepted, 2026-11-08

## Context

ADR-163 kept port bodies from turning, so TUMBLE's letters fell without tipping and a confetti heap lay flat; the
owner preferred the repo's confetti on the condition that its pile be fixed. The same benchmark found the built-in
engine pushed sliding bodies the wrong way along their contact, so friction above about 0.5 threw resting pieces
upward, and the conformance suite had no case that slid.

## Decision

- Port bodies turn. `BodySpec` takes `angle`, `spin` and `fixedRotation`; `BodyState` and `sim.pose` give
  `rotation`, and `BodyState` gives `spin`, in degrees, clockwise on screen.
- The built-in engine is rebuilt to solve contacts at points: a box's outline is clipped against the other's face for
  up to two points, circles and half planes give one, and ten passes of accumulated impulses at each point move and
  turn both bodies, with friction bounded by the push and opposing the slide. Overlap is corrected through the
  velocity, and restitution applies only above a resting speed.
- A body whose speed, and the speed of its edge from turning, stay under 4 px a second for half a second sleeps; a
  sleeping body counts as fixed until an awake body faster than 30 px a second touches it.
- The Rapier adapter stops locking rotation, except for `fixedRotation`.
- The conformance suite adds a sliding box that friction stops without lifting, a heap of forty sticky bodies that
  settles with none thrown up, a box that tips flat from its corner, a ball that rolls without slipping, a stack of
  three that stands, and a fixed body that never turns. Both engines pass.

## Consequences

Measured here: the built-in engine steps 200 bodies in 0.53 ms and 1000 in 5.7 ms, Rapier in 0.38 ms and 2.6 ms; the
guide points to Rapier past a few hundred. An element moved by `sim.pose` turns around its centre, so a squash from
a foot goes on a child element. Rapier holds angles in 32-bit floats, so the suite compares them to three decimals.

## Rejected

- Keeping bodies from turning and faking a tilt in the scene: a heap's shape comes from bodies catching on each
  other's corners.
- Warm-starting impulses from the last step: stable enough stacks came without it, and it would need contact ids
  carried in snapshots.
