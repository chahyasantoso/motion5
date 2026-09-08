# Scroll browser smoke and acceptance

## Retired opt-in automation

The temporary .github/workflows/scroll-browser-353.yml and .github/workflows/ik-browser-351.yml workflows were removed from their respective PR branches after the recorded automated browser runs. They are not available as current workflows. Neither introduced a required branch-protection check, changed the trusted automation runner pin, or modified project dependencies or lockfiles. The execution model below describes the retired workflows, not an active browser gate.

The candidate jobs checked out the exact PR head without persisted credentials, installed project dependencies with lifecycle scripts disabled, and installed a pinned Playwright toolchain outside the project. They had contents-read permission and no writer secret, and exercised installed GSAP/ScrollTrigger in Chromium rather than a fake producer. Separate reporters did not check out or execute candidate code: they validated bounded JSON observations and posted escaped reports. Reporter success alone was not browser-test success.

Read the report's exact tested SHA and compare it with the current head. The run includes browser version, operating system, GSAP version, per-scenario observed values, failures and console/page errors. Screenshots, the Playwright trace, server log and report.json are retained as Actions artifacts for seven days; download them before expiry for longer retention. The PR comment retains bounded textual observations. Required CI must pass separately on the final head.

The retired IK workflow posted its observations to shared PR #353 and recorded the shared source Git blob alongside the IK commit. Matching source blobs establish implementation parity, not parity of the two applications. The source/walking report covers 15 named scenarios at 2cca39be37674d5f25f94dd5dd559fb2eaa7b3f2; the IK report covers 14 at e17a525b741597b18fa95e0241463a12da44e751. Both passed with no page or console errors in Chromium 140.0.7339.16, Playwright 1.55.0, GSAP 3.15.0 on Linux 6.17.0-1022-azure x64. Exact report and CI links remain in the PRs; later cleanup or integration commits are not claimed as browser-tested revisions.

## What is exercised

The isolated browser fixture creates actual ScrollTrigger over a scrollable document and observes deferred restored snapshots, refresh hold, late-subscriber freshness, unchanged-position suppression, refreshed-geometry updates, clamped-endpoint movement, producer/pin cleanup, remount and cancellation. Changing the fixture's GSAP end value is test setup, not application-side normalization.

The walking checks load the actual app through Vite with its development StrictMode bootstrap, read the rendered pose rather than just its progress label, cross both arm thresholds, reload from nonzero scroll and resize while checking pin-spacer count. Named required scenario identities detect missing, unexpected or duplicate coverage instead of relying on a guessed case count. Instance and global refresh are separate source scenarios; resize is checked at a verified nonzero pose even if an earlier reload fails. A reload that returns the physical document to zero is a failed history-restoration scenario, not proof that the adapter received nonzero progress and dropped it. Do not convert such a result into a nonzero-restoration pass.

The IK workflow reads real rendered bone coordinates, lengths, applied targets, pending targets, flip controls and published weight. It stages keyboard goals/flips at zero, partial and full weight, checks instance/global refresh and stationary hold, applies on the next qualifying update, verifies clipped-endpoint hold with test-only space outside the trigger element, returns to authored rest, reloads and resizes. It locates the actual app-loaded ScrollTrigger module and uses its measured range, not a fake producer. The recorded exact-commit report passed these named scenarios; it did not exercise actual target dragging.

## Acceptance decision and unverified scope

On 2026-09-09 (Asia/Jakarta), the repository owner approved proceeding with PR #353 followed by PR #351 and explicitly excluded additional manual or target-drag checks. Those checks are waived for this merge decision, not executed or passed. Existing automated evidence and green CI on each final integrated head remain the basis for merging. No temporary browser workflow is being restored.

Pointer capture/cancel, physical mobile/touch, history back/forward, other browser engines and exhaustive injected application cleanup failures remain outside the recorded automated evidence. The following exploratory checklist is retained for future testing, not as a manual merge gate for these two PRs.

For BOTH walking and the reconciled IK consumer, record the source commit, browser/version, OS, scenario, measured physical scroll and progress, published pose/intent state, and pass/fail. Exercise history back/forward as well as reload, instance and global refresh, resize across thresholds, unchanged-position callbacks, endpoint movement, React StrictMode/remount, disposal and pin-spacer removal. The temporary job is partial acceptance, not a claim that every one of these has been exercised.

For IK, stage goals and flips at zero, partial and full weight. Verify staging does not change the published pose, refresh does not consume staged intent, and the next qualifying progress-change update applies it. Scroll beyond the clipped endpoint with unchanged progress and verify pending intent remains pending. Return to rest and check authored rest pose, retained bindings and segment lengths. Any future claim about pointer capture/cancel or narrow/mobile interaction needs its own recorded observations; existing keyboard observations do not prove dragging. Do not import the IK feature into the shared fix merely to claim coverage.

Run npm ci followed by npm run dev for walking or npm run dev:ik on the reconciled feature branch. These commands start the demos; they do not themselves verify acceptance. Never report a requested workflow, uploaded artifact, screenshot alone or green deterministic suite as a browser pass.

## Retirement

Both PR-specific jobs have been retired by the owner. Their historical reports remain evidence only for their exact tested revisions and named scenarios; seven-day artifact retention is unchanged. Retirement does not turn a failed or unexecuted scenario into a pass, and no permanent per-PR browser rollout or branch-protection change is part of these PRs.
