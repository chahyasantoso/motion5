# ADR-179: Installable outside the repository, and not published

**Status:** Accepted, 2026-11-13

## Context

Every package was `private` at `0.0.0`, its `exports` pointing at TypeScript source, so nothing outside this
repository could use gerak. No one outside needs it yet, and the npm names are held, so publishing would buy
nothing; a project of the owner's own, or the web overlay on any page, will need it installed from outside.

## Decision

- **The runtime is made installable:** `@gerak/rig`, `moves`, `player`, `stage`, `dom`, `react`, `three`, `physics`
  and `rapier`, one version for all, `0.1.0`. `@gerak/tools` stays source-only. There is no umbrella package.
- **Built, not source:** each ships ESM JavaScript and `.d.ts` built from `src` into `dist`, and `exports` point
  there; inside the repository `@gerak/*` still resolves to source, so no gate needs a build.
- **Peers stay peers:** `react` and `three`.
- **Packing is checked by installing:** `npm run pack:check` installs the tarballs into an empty project and imports
  each export. Nothing in the repository publishes.
- **The app boundary is in the check:** a package never imports an app, an app imports a package only by its
  declared exports, and an app never imports another app.
- **The review without a browser says what it cannot see:** a module with `layouts` and no `rests` gets one finding
  naming the browser review, in place of "never moved".
- **When it is published:** MIT, copyright Chahya Santoso, under the `latest` tag.

## Consequences

- Using gerak elsewhere is packing and installing the tarballs; publishing is one later command.
- Source and build can drift; the pack check is what catches it.
