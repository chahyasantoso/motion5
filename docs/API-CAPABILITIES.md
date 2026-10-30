# API-only capability map

This is navigation and an activation contract, not a second status file. [SESSION-STATUS.md](./SESSION-STATUS.md) owns shipped state. The implementation PR owns exact-SHA results and outstanding live exercises.

## Supported through repository APIs

- Read complete files at an immutable SHA, create a branch, open a PR, and read checks and comments. Availability is connection-specific; a missing Actions dispatch method is not a GitHub limitation.
- Standard contribution workflow: plain git branches and pull requests targeting `main`. The AI edit, checkpoint and handover automation was retired in [ADR-142](./ADR-142-the-ai-edit-checkpoint-and-handover-automation-is-removed.md).

## Human-dispatch-only through the current connection

- **Format manually**, [format.yml](../.github/workflows/format.yml), is the deliberate mechanical repair escape hatch: a repository-wide `npm run format` on a branch a maintainer names, and nothing else.
- **Recovery audit**, [recovery-audit.yml](../.github/workflows/recovery-audit.yml), owns its additional mutation and acceptance evidence.

## Maintenance not activated

Dependency and general maintenance operations are refused, including when a PAT is configured. There is no arbitrary shell, npm argument, plugin, workflow-generation, or package-install request. The only maintenance paths that exist are the human-dispatch workflows named above, and retiring one is its own confirmed change rather than a consequence of this map.
