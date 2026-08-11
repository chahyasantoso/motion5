# CI log archive: 31495880105

- Workflow: Recovery audit
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31495880105
- Captured: 2026-08-11T13:23:55Z

## Failed job output

```text
acceptance mapping	Fail until acceptance mapping is executable	﻿2026-08-11T13:23:13.7422260Z ##[group]Run test "${ACCEPTANCE_FAILED:-1}" = "0"
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T13:23:13.7422696Z ^[[36;1mtest "${ACCEPTANCE_FAILED:-1}" = "0"^[[0m
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T13:23:13.7466204Z shell: /usr/bin/bash -e {0}
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T13:23:13.7466480Z env:
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T13:23:13.7466685Z   ACCEPTANCE_FAILED: 1
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T13:23:13.7466924Z ##[endgroup]
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T13:23:13.7548418Z ##[error]Process completed with exit code 1.
contract surfaces	Fail when a contract surface is missing or red	﻿2026-08-11T13:23:21.2256536Z ##[group]Run test "${CONTRACT_FAILED:-1}" = "0"
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T13:23:21.2257272Z ^[[36;1mtest "${CONTRACT_FAILED:-1}" = "0"^[[0m
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T13:23:21.2316037Z shell: /usr/bin/bash -e {0}
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T13:23:21.2316455Z env:
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T13:23:21.2316769Z   CONTRACT_FAILED: 1
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T13:23:21.2317094Z ##[endgroup]
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T13:23:21.2416035Z ##[error]Process completed with exit code 1.
mutation baseline	Fail until a mutation baseline exists	﻿2026-08-11T13:23:16.6813022Z ##[group]Run test "${MUTATION_FAILED:-1}" = "0"
mutation baseline	Fail until a mutation baseline exists	2026-08-11T13:23:16.6813458Z ^[[36;1mtest "${MUTATION_FAILED:-1}" = "0"^[[0m
mutation baseline	Fail until a mutation baseline exists	2026-08-11T13:23:16.6865596Z shell: /usr/bin/bash -e {0}
mutation baseline	Fail until a mutation baseline exists	2026-08-11T13:23:16.6865875Z env:
mutation baseline	Fail until a mutation baseline exists	2026-08-11T13:23:16.6866080Z   MUTATION_FAILED: 1
mutation baseline	Fail until a mutation baseline exists	2026-08-11T13:23:16.6866305Z ##[endgroup]
mutation baseline	Fail until a mutation baseline exists	2026-08-11T13:23:16.6951569Z ##[error]Process completed with exit code 1.
declaration build	Fail until declarations and public entries resolve	﻿2026-08-11T13:23:22.5615599Z ##[group]Run test "${BUILD_FAILED:-1}" = "0"
declaration build	Fail until declarations and public entries resolve	2026-08-11T13:23:22.5615968Z ^[[36;1mtest "${BUILD_FAILED:-1}" = "0"^[[0m
declaration build	Fail until declarations and public entries resolve	2026-08-11T13:23:22.5661412Z shell: /usr/bin/bash -e {0}
declaration build	Fail until declarations and public entries resolve	2026-08-11T13:23:22.5661859Z env:
declaration build	Fail until declarations and public entries resolve	2026-08-11T13:23:22.5662062Z   BUILD_FAILED: 1
declaration build	Fail until declarations and public entries resolve	2026-08-11T13:23:22.5662282Z ##[endgroup]
declaration build	Fail until declarations and public entries resolve	2026-08-11T13:23:22.5740483Z ##[error]Process completed with exit code 1.
```
