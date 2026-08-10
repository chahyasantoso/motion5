# Documentation index

## Read first

- [SESSION-STATUS.md](./SESSION-STATUS.md) - where the project actually is, and the next action. Always current or it is a bug.

## Charter and contracts

- [PRD.md](./PRD.md) - problem, users, goals, requirements, release criteria.
- [ARCHITECTURE.md](./ARCHITECTURE.md) - ownership model, invariants, layers, algorithms.
- [AUTHORED-SCHEMA.md](./AUTHORED-SCHEMA.md) - the authored `schemaVersion: 4` input contract.
- [DECISIONS.md](./DECISIONS.md) - architectural decision records.

## Delivery

- [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) - phases, pull requests, exit gates.
- [PR-WORKFLOW.md](./PR-WORKFLOW.md) - branching, sizing, review, merge policy.
- [CI-WORKFLOW.md](./CI-WORKFLOW.md) - the gate matrix and its rollout.
- [FORMATTING.md](./FORMATTING.md) - the manual Prettier workflow.
- [TESTING-STRATEGY.md](./TESTING-STRATEGY.md) - test tiers and evidence rules.

## Rules for these documents

- A document that describes intent must say so. A document that describes reality must be true on the day it is read.
- Status lives in one file. Do not scatter progress notes across plans, reviews, and handoffs.
- When a decision changes, edit `DECISIONS.md` and record the reversal. Do not leave two contradictory documents in the tree.
- Delete documents that describe deleted code in the same pull request that deletes the code.
