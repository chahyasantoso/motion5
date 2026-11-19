# delivered: design

Obvious answer: a box falls, squashes, bounces, an ellipse shadow shrinks, colour tweens, text fades in.
Dropped: (a) the doorstep rises to meet a hanging parcel; (b) the parcel unfolds from a flat sheet on the step.
Chosen: the parcel hangs on a tether, the tether lets go and whips up, the parcel falls.

Three lines:
1. A tether releases and retracts; the parcel falls, lands, jiggles; it turns orange to green; "Delivered" rises in after.
2. Heavy: slow start, one hard landing, a short loose jiggle, a long settle; the word is calm.
3. The moment: the landing, where the shadow tightens and the colour begins to turn.

## Fields and parts by kind

- The fall (parcel): `y` heavy, a `ballistic` path or an ease with a slow start (ease). `tether` `scaleY` quick (ease).
- The landing (parcel): `scaleY` loose (envelope x oscillation), `rotation` loose (envelope x oscillation),
  `shadowBlur` heavy during the fall (blend, ease): wide and far in the air, tight on contact.
- The colour (parcel): `tint` calm (ease, blend), orange to green through the skin's `--gerak-tint-to`.
- The word (letters): `opacity` and `y` calm (ease), letters staggered (lane).

## Choices

- Fall: use `drop` (distance 140, squash 0.12). Landing: write `thud` (crush plus tip about the base, ringing).
- Colour and shadow: glue in the scene as `mix` on `tint`, `shadowY`, `shadowBlur`; shadow follows the height above the step.
- Tether: a `mix` of `scaleY`. Word: an eased `y` plus `fade`.
