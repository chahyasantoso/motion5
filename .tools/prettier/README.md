# Retained Prettier

This directory retains the exact Prettier package used by the repository so an
implementor with Node.js but no network access can run formatting from a
snapshot. The package is stored as an archive because the sandbox can extract
it before running the formatter.

The retained package is Prettier 3.6.2. It has no runtime dependencies and
requires Node.js 14 or newer. The repository's normal minimum is Node.js 24.

Extract `prettier-3.6.2.tgz` into this directory, then run
`node package/bin/prettier.cjs . --check` or
`node package/bin/prettier.cjs . --write` from the repository root. npm and
internet access are not required after extraction.

The archive contains `THIRD-PARTY-NOTICES.md` and `LICENSE`. `SHA256SUMS`
records the archive hash.
