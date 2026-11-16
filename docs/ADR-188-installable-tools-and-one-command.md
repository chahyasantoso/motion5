# ADR-188: Installable tools and one command

**Status:** Accepted, 2026-11-16

## Context

ADR-179 made the runtime installable but kept `@gerak/tools` source-only, its commands reachable only as this
repository's `npm run motion:*` scripts, and every command served this repository's `apps/pieces` when given no
`--root`. A person with their own project could install the runtime but could not make, review or check a piece.

## Decision

- **`@gerak/tools` is installable:** it builds to `dist`, joins `INSTALLABLE_PACKAGES` last, drops `private`, takes
  the workspace version, and declares `bin` (`gerak`), `files` (`dist`, `guide`) and `exports` to `dist`. This
  supersedes in part ADR-179's clause that the tools stay source-only. Publishing still waits.
- **One command, `gerak`:** `gerak <command>` runs what `npm run motion:<command>` ran, with the same arguments and
  output; `gerak --help` lists every command. One bin resolves both ways: beside `../src` it loads source, else
  `../dist`. The root `motion:*` scripts go.
- **The pieces folder is found, not assumed:** `piecesRoot(cwd, flag)` in `packages/tools/src/page/root.ts` owns it:
  the `--root` flag resolved from `cwd`; else the folder named by `gerak.pieces` in the nearest `package.json` at or
  above `cwd` that names one, resolved from that file; else a usage message naming both ways. A command's `cwd` is
  `INIT_CWD` when set, else the process's own. This repository names `apps/pieces`.
- **Pages ship compiled:** `stagePage`, `livePage` and `talkPage` in `@gerak/tools/pages` take the brief globs from
  the caller; a pieces folder holds only two-line page entries. React and React DOM become peers beside `vite` and
  `playwright-core`. Page commands inject their Vite plugins inline, so a pieces folder needs no `vite.config`.
- **`gerak init [folder]`** writes the page files, the `gerak.pieces` entry, the make-motion skill and an `AGENTS.md`
  pointing at the shipped guide, refusing any file that exists; `--refresh` rewrites only the page files.
- **The guide ships:** the build copies the agent guide pages and the skill into the package's `guide/`.

## Consequences

- A person's project makes and checks pieces with `npx gerak <command>` and nothing from this repository.
- A command run outside any project naming a pieces folder refuses with usage instead of serving a default.
- Page entries in a person's folder can drift on upgrade; `gerak init --refresh` rewrites them.
