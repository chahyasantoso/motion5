# Follower benchmark

Per-frame cost of N `bezier` followers on one path of M segments, published through a real `Engine` by
`npm run bench:follower`. This covers evaluation and publication only: no DOM write and no GSAP. Timing
is not a CI gate under [ADR-008](./ADR-008-gates-measure-behavior-not-prose.md).

## Conditions

Node `v24.21.0`, 12th Gen Intel i5-12500H, 60 frames per sample, median of 7 samples, against a 60 fps
budget of 16.67 ms.

## Results

| Followers | Segments | ms per frame | Share of budget |
| --------- | -------- | ------------ | --------------- |
| 1         | 2        | 0.048        | 0.3%            |
| 50        | 2        | 0.373        | 2.2%            |
| 500       | 2        | 3.651        | 21.9%           |
| 1         | 20       | 0.066        | 0.4%            |
| 50        | 20       | 0.463        | 2.8%            |
| 500       | 20       | 4.452        | 26.7%           |
| 1         | 200      | 0.493        | 3.0%            |
| 50        | 200      | 1.681        | 10.1%           |
| 500       | 200      | 13.555       | 81.3%           |

## Reading

Cost grows linearly with followers. Each follower costs about 7 µs at 2 segments and about 25 µs at 200.
That fits `pointAtArcFraction` recomputing every segment's length on each call, though the benchmark does
not isolate it. One follower on 200 segments already costs 0.49 ms, so segment count also adds a cost that
does not scale with followers.

## Decision

No arc-length track and no segment cache. At 50 followers on 20 segments the cost is under 3% of a frame.
Only 500 followers on 200 segments comes near the budget, far beyond the one follower in `apps/react-demo`.
Measure again when a real project passes 200 followers on a path of more than 50 segments.
