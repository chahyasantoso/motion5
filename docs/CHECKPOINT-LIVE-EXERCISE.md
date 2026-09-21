# Checkpoint live exercise

This file exists to exercise [the checkpoint transport](./AI-CHECKPOINT-WORKFLOW.md) against a real
CI run rather than a fixture. It is created by patch one of a two-patch stack and modified by patch
two, so the run measures the chain as well as a single application.

What a green run proves: the push-path filter fires, the trusted runner pin resolves, the stack
applies in a disposable checkout with no credential, every declared post-image is re-hashed and
matched, the surviving tip is formatted exactly once in its own commit, and the reporter publishes
one commit per patch with the three trailers before a consumption commit deletes the store.

## Chain

Patch two declares this file's pre-image as patch one's post-image, which is the whole of ADR-101:

- the interior of a stack needs no commits, because a blob id is content-addressed
- only the earliest pre-image per path is ever compared against the real repository
