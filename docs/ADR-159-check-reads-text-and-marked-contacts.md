# ADR-159: motion:check reads text and contacts the page marks

**Status:** Accepted, 2026-11-08

## Context

Agents hid meant contacts, such as a foot on a ball, by dropping elements from `--watch`, which also hid every real
overlap of those elements. Text that merges with its background, or runs off the page, raised nothing. A page that
scatters things with `Math.random` gave different frames on every run.

## Decision

- A page marks a meant contact in its own markup: `data-motion-touch="<selector>"` on one element lets it overlap the
  watched elements the selector matches, and an empty value lets it touch any. `motion:check` skips those pairs.
- On the last frame `motion:check` reads every element with its own text, watched or not. It photographs the page with
  all text made transparent, takes the median colour inside each text's visible box, blends the text's colour over it
  at the text's opacity, and reports a WCAG contrast under 3:1 for large text and 4.5:1 for the rest.
- It reports text whose line box shows less than 90% of itself on the page. A parent that clips text is taken as a
  mask and not reported.
- Every page the tools open has `Math.random` replaced by one fixed-seed generator before its scripts run.

## Consequences

The contrast check reads only the last frame: text that fades in over a matching background mid-way is not judged.
A line box runs past its ink, so text up to 10% over the edge passes.

## Rejected

- A `--allow` flag on the command: the page knows which contacts it means, and the flag would travel apart from it.
- Reporting text clipped by any parent: letters rising out of masked water were all flagged.
