# Lessons

Lessons become one line in `SKILL.md` or are dropped. Older entries live in git history.

## Inbox (at most five, not yet placed)

- A lenient reader hides a bad export: a malformed `rest` fell back to none in silence. Readers refuse with a reason.
  (A code rule, not a workflow one; kept here until the repository's conventions take it.)

- A review limit set for one unit hides a defect in another: `--turn 150` passed a 133 degree bone flip, and blink,
  a 0-1 custom number, is judged by the position `--jump`. The review could take limits per field kind or per target.

- A measure that passes against a defective rule proves nothing: the first `launch-day` passed a card measured with
  a windup bug the measure itself exposed. Fix the rule, re-measure the card, and run the measure again.

- The browser tests time out under full-suite load at the base too (1 run in 3 on 2026-11-16, a different test each
  time). Rerun once, and run the base, before blaming a slice for a browser timeout.

- A gate a builder cannot find is a gate the lead must find: the lead added a size test beside an older one in
  `agent-reference.test.ts`, and two builders hit the older ceiling. Grep for an existing gate before adding one.

## What a wave costs

Measured over 40 waves, 2026-11-11 to 11-14; the rows are in git history. The lead's own cost is never shown.

- A Sonnet builder slice: 70k to 260k tokens, most near 90k to 130k, 5 to 15 minutes.
- A measure: on Opus 110k to 250k; on Sonnet 84k to 214k (three runs).
- A Sonnet cold review: 90k to 135k, 15 to 30 calls; it finds about ten things, and five to eight are worth fixing.
- Fixed on combining: 0 to 3 per wave once briefs follow the template.

Add a line here only when a wave falls outside these ranges, or a new kind of worker or model is tried.

- 2026-11-14, overlay measure `dragon-intro` on Sonnet at medium effort: 214k, 106 calls, 22 min. It passed; a
  10 s piece with five beats costs a cheap worker an Opus-sized budget, mostly in render rounds for eyelids and holds.
- 2026-11-15, anatomy A1b (pieces into brief folders, examples merged) on Sonnet at medium effort: 323k, 216 calls,
  34 min, for 178 files, 30 reviews before and after and several full checks; one fix on combining. The lead's
  scripted folder move of `@gerak/moves` (A1) cost a fraction of that.
- 2026-11-15, anatomy V3 (the vocabulary card, per-field shapes, fit at options, tested and renderer filters and the
  design query, one builder) on Sonnet at medium effort: 306k, 248 calls, 25 min, for four features in one file;
  the lead then fixed its scoring, which the plan had specified wrongly. A slice of four features in one file is
  better split into two waves.
- 2026-11-19, principles plan B (every move to a plain function, 21 piece moves, 30 pieces, tests) on Sonnet at
  medium effort: 265k, 147 calls, 23 min, one builder for one API change; every piece sampled bit-exact.
