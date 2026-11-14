# Lessons

Lessons become one line in `SKILL.md` or are dropped. Older entries live in git history.

## Inbox (at most five, not yet placed)

- A lenient reader hides a bad export: a malformed `rest` fell back to none in silence. Readers refuse with a reason.
  (A code rule, not a workflow one; kept here until the repository's conventions take it.)

- Two of three builders wrote code before tests and said so; a test never seen red may guard nothing, as wave 1's
  cost test did. Briefs could ask for the failing output of each new test in the report.

## Cost per wave

| Date | Plan, wave | Workers | Tokens | Fixed on combining |
| --- | --- | --- | --- | --- |
| 2026-11-11 | authoring 2 | 2 builders | 186k | 3 |
| 2026-11-11 | authoring 3 | 2 builders + review | 173k + 92k | 0; review 7 of 12 |
| 2026-11-11 | authoring 4 | lead + review | not shown + 88k | review 5 of 12 |
| 2026-11-11 | authoring 5 proof | 5 Sonnet cold runs | 383k+ | — |
| 2026-11-11 | second proof | 4 Sonnet + 2 Opus | 295k + 339k | 1 |
| 2026-11-12 | values 1–2 | Opus + Sonnet + review | 156k + 87k + 120k | review 7 of 10 |
| 2026-11-12 | stage 2 | Opus + Sonnet | 131k + 118k (after resume) | 2 |
| 2026-11-12 | stage 3 | Sonnet | 261k, 161 calls, 24 min | 0 |
| 2026-11-12 | stage 4 measure | Opus | 190k, 62 calls, 14 min | — |
| 2026-11-12 | stage 4 cold run + review | Sonnet | 134k, 48 calls, 7 min | 8 of 10 fixed |
| 2026-11-12 | composition 2 | Opus + Sonnet | 186k + 121k | 3 (re-export, clock switch, clock stopped at end) |
| 2026-11-13 | composition 3 measure | Opus | 242k, 72 calls, 17 min | — |
| 2026-11-13 | composition 3 cold review | Sonnet | 121k, 28 calls, 4 min | 6 of 10 fixed |
| 2026-11-13 | composition-two 2 | Opus + Sonnet | 163k + 148k | 0 |
| 2026-11-13 | composition-two 3 measure | Opus | 252k, 84 calls, 19 min | — |
| 2026-11-13 | composition-two 3 cold review | Sonnet | 110k, 27 calls, 4 min | 7 of 7 fixed |
| 2026-11-13 | composition-three 2 | Opus + Sonnet | 162k (after resume) + 88k | 0 |
| 2026-11-13 | composition-three 3 measure | Opus | 189k, 46 calls, 11 min | — |
| 2026-11-13 | composition-three 3 cold review | Sonnet | 119k, 29 calls, 5 min | 8 of 10 fixed |
| 2026-11-13 | composition-four 2 | Opus + 2 Sonnet | 126k + 81k + 133k, 143 calls, 7 min | 3 (overshoot clamped, clip a circle, comment length) |
| 2026-11-13 | composition-four 3 cold review | Sonnet | 91k, 15 calls, 2 min | 8 of 10 fixed |
| 2026-11-13 | composition-four 3 measure | Opus | 112k, 33 calls, 7 min | — |
| 2026-11-13 | publish 2 | 2 Sonnet | 92k + 90k, 79 calls, 7 min | 2 (tools pin, reference without dist) |
| 2026-11-13 | publish 3 measure | Sonnet | 84k, 35 calls, 3 min | — |
| 2026-11-13 | publish 3 cold review | Sonnet | 97k, 16 calls, 3 min | 8 of 10 fixed |
| 2026-11-13 | artwork 2 | 3 Sonnet | 70k + 115k + 194k, 118 calls, 15 min | 2 (moving-base test, compare within one pixel) |
| 2026-11-13 | artwork 3 cold review | Sonnet | 121k, 32 calls, 4 min | 6 of 10 fixed; bar moved to 15 |
| 2026-11-13 | artwork 3 measure | Opus | 180k, 60 calls, 14 min | — |
| 2026-11-14 | live-inputs 1 | Conductor | not shown | 1 (a cost test that passed without the cache it guards) |
| 2026-11-14 | live-inputs 2 | 3 Sonnet | 192k + 93k + 77k, 170 calls, 14 min | 1 (a sliced symbol's lost clip, noted and tested) |
| 2026-11-14 | live-inputs 3 | Sonnet | 121k, 55 calls, 7 min | 1 (imported parts painted under the piece's own) |
| 2026-11-14 | live-inputs 4 measure | Opus | 213k, 136 calls, 22 min | 1 (`--into` refused a piece with no frame) |
| 2026-11-14 | live-inputs 4 cold review | Sonnet | 98k, 13 calls, 2 min | 2 of 9 fixed (follow cache, data-id) |
