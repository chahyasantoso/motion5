# Scroll browser smoke and acceptance

## Opt-in automation

PR #353 has a temporary workflow at .github/workflows/scroll-browser-353.yml, explicitly scoped to same-repository PR 353 synchronization events. It is not a required branch-protection check and does not change the trusted automation runner pin. The browser job checks out the exact PR head without persisted credentials, installs project dependencies with lifecycle scripts disabled, and installs a pinned Playwright toolchain outside the project. It does not edit package manifests or lockfiles.

The candidate job has contents-read permission and no writer secret. It exercises installed GSAP/ScrollTrigger in Chromium, not a fake DOM or fake producer. A separate reporting job does not check out or execute candidate code. It reads a bounded regular-file JSON artifact, checks the reported revision, escapes its content, and posts observations to the fixed PR. That job has only the permissions needed to download artifacts and post the report. A successful reporting job is not a successful browser job.

Read the report's exact tested SHA and compare it with the current head. The run includes browser version, operating system, GSAP version, per-scenario observed values, failures and console/page errors. Screenshots, the Playwright trace, server log and report.json are retained as Actions artifacts for seven days; download them before expiry for longer retention. The PR comment retains bounded textual observations. Required CI must pass separately on the final head.

## What is exercised

The isolated browser fixture creates actual ScrollTrigger over a scrollable document and observes deferred restored snapshots, refresh hold, late-subscriber freshness, unchanged-position suppression, refreshed-geometry updates, clamped-endpoint movement, producer/pin cleanup, remount and cancellation. Changing the fixture's GSAP end value is test setup, not application-side normalization.

The walking checks load the actual app through Vite, read the rendered pose rather than just its progress label, cross both arm thresholds, reload from nonzero scroll and resize while checking pin-spacer count. A reload that returns the physical document to zero is a failed history-restoration scenario, not proof that the adapter received nonzero progress and dropped it. Do not convert such a result into a nonzero-restoration pass.

## Remaining acceptance

For BOTH walking and the reconciled IK consumer, record the source commit, browser/version, OS, scenario, measured physical scroll and progress, published pose/intent state, and pass/fail. Exercise history back/forward as well as reload, instance and global refresh, resize across thresholds, unchanged-position callbacks, endpoint movement, React StrictMode/remount, disposal and pin-spacer removal. The temporary job is partial acceptance, not a claim that every one of these has been exercised.

For IK, stage goals and flips at zero, partial and full weight. Verify staging does not change the published pose, refresh does not consume staged intent, and the next qualifying progress-change update applies it. Scroll beyond the clipped endpoint with unchanged progress and verify pending intent remains pending. Return to rest and check authored rest pose, retained bindings and segment lengths. Pointer capture/cancel, keyboard controls and narrow/mobile interaction require their own recorded observations. Do not import the IK feature into the shared fix merely to claim coverage.

Run npm ci followed by npm run dev for walking or npm run dev:ik on the reconciled feature branch. These commands start the demos; they do not themselves verify acceptance. Never report a requested workflow, uploaded artifact, screenshot alone or green deterministic suite as a browser pass.

## Retirement

This job is deliberately PR-specific. It becomes inert for other PR numbers and is not a permanent per-PR browser rollout. Removal of the temporary workflow is a separate, explicitly confirmed cleanup; neither removing it nor weakening its assertions is a way to satisfy a failing acceptance gate.
