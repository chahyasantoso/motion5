# CI log archive: 31499145179

- Workflow: Recovery audit
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31499145179
- Captured: 2026-08-11T14:00:52Z

## Failed job output

```text
acceptance mapping	Fail until acceptance mapping is executable	﻿2026-08-11T14:00:09.5212991Z ##[group]Run test "${ACCEPTANCE_FAILED:-1}" = "0"
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T14:00:09.5213379Z ^[[36;1mtest "${ACCEPTANCE_FAILED:-1}" = "0"^[[0m
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T14:00:09.5257987Z shell: /usr/bin/bash -e {0}
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T14:00:09.5258250Z env:
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T14:00:09.5258452Z   ACCEPTANCE_FAILED: 1
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T14:00:09.5258672Z ##[endgroup]
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T14:00:09.5333543Z ##[error]Process completed with exit code 1.
declaration build	Fail until declarations and public entries resolve	﻿2026-08-11T14:00:20.3530491Z ##[group]Run test "${BUILD_FAILED:-1}" = "0"
declaration build	Fail until declarations and public entries resolve	2026-08-11T14:00:20.3531075Z ^[[36;1mtest "${BUILD_FAILED:-1}" = "0"^[[0m
declaration build	Fail until declarations and public entries resolve	2026-08-11T14:00:20.3571045Z shell: /usr/bin/bash -e {0}
declaration build	Fail until declarations and public entries resolve	2026-08-11T14:00:20.3571478Z env:
declaration build	Fail until declarations and public entries resolve	2026-08-11T14:00:20.3571821Z   BUILD_FAILED: 1
declaration build	Fail until declarations and public entries resolve	2026-08-11T14:00:20.3572144Z ##[endgroup]
declaration build	Fail until declarations and public entries resolve	2026-08-11T14:00:20.3653968Z ##[error]Process completed with exit code 1.
mutation baseline	Fail until a mutation baseline exists	﻿2026-08-11T14:00:05.8711054Z ##[group]Run test "${MUTATION_FAILED:-1}" = "0"
mutation baseline	Fail until a mutation baseline exists	2026-08-11T14:00:05.8711535Z ^[[36;1mtest "${MUTATION_FAILED:-1}" = "0"^[[0m
mutation baseline	Fail until a mutation baseline exists	2026-08-11T14:00:05.8739471Z shell: /usr/bin/bash -e {0}
mutation baseline	Fail until a mutation baseline exists	2026-08-11T14:00:05.8739819Z env:
mutation baseline	Fail until a mutation baseline exists	2026-08-11T14:00:05.8740110Z   MUTATION_FAILED: 1
mutation baseline	Fail until a mutation baseline exists	2026-08-11T14:00:05.8740412Z ##[endgroup]
mutation baseline	Fail until a mutation baseline exists	2026-08-11T14:00:05.8797401Z ##[error]Process completed with exit code 1.
contract surfaces	Fail when a contract surface is missing or red	﻿2026-08-11T14:00:06.3632762Z ##[group]Run test "${CONTRACT_FAILED:-1}" = "0"
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T14:00:06.3633057Z ^[[36;1mtest "${CONTRACT_FAILED:-1}" = "0"^[[0m
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T14:00:06.3671381Z shell: /usr/bin/bash -e {0}
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T14:00:06.3671589Z env:
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T14:00:06.3671750Z   CONTRACT_FAILED: 1
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T14:00:06.3671928Z ##[endgroup]
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T14:00:06.3735250Z ##[error]Process completed with exit code 1.
```
