# S3 stage decision: plugin ownership

Motion5 keeps the two-stage vocabulary `prepare | compose` rather than importing the oracle's six-stage vocabulary. `contribute` is compile-time work and therefore requires `stage: "prepare"`; `compose` is runtime work. `priority` is a finite integer within a stage.

Exact `keys` and `inputs` are single-owner declarations indexed at registration. Predicate-only key claims are fallback-only, and exact ownership wins. Conflicts fail before a plugin enters the registry, so resolution cannot silently become last-write-wins.
