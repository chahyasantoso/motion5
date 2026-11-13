# ADR-178: Layouts the stage measures, and carrying between boxes

**Status:** Accepted, 2026-11-13

## Context

A member rests in one place: the stage measures one `Rest`, and the scene moves things relative to it. A route
change, a reordering list and a card opening each move an element between two places the layout decides, and no part
of the stage measured the second place. Carrying an element was hand arithmetic over boxes nobody measured, and a
second click while it was moving had nothing to start from but the old rest.

## Decision

- **A layout is named, and the stage measures every one.** A stage module may export `layouts`, a list of names; the
  DOM skin styles each under `[data-layout="<name>"]` on the frame. The scene's fourth argument is
  `layouts: Layouts<L>`, every layout's `Rest`; its third, `rest`, stays the rest of the layout in force.
- **The layout in force is a function of the events alone:** `layout: (events) => L`. The moment of a change is the
  time of the event that caused it, so nothing stores it. With no `layout`, the first layout is in force.
- **A route is a layout.** A member a route does not show is hidden by its skin; its box there is zero.
- **`carry(own, from, to, progress, size)`** answers the pose that draws a member resting at `own` on `from` at 0 and
  on `to` at 1, by `"scale"`, `"clip"` or `"keep"`. It is not a move: its options are boxes.
- **`carried` owns every change of place.** Given `at: (events) => Box`, it carries from where the member was drawn
  at each event that changed the answer, so an interrupted carry never jumps. Scenes call `carried`.
- **Tools read layouts:** a module with `layouts` gives tools `rests`, one `Rest` per layout, instead of `rest`.
- **Joining two stage modules waits for the video stage;** on a site, two scenes are two layouts of one module.
- **A move is promoted when pieces from two briefs import it.** A piece file may export `const brief`; candidates
  count distinct briefs, and a file with none counts as its own.

## Consequences

- A piece without `layouts` reads, samples and frames exactly as before.
- A reorder moves items by transform; the page's own order stays the first one until the site reorders its data.
- Every layout is measured on mount, font load and resize, never per frame.
