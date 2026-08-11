# CI log archive: 31495251001

- Workflow: Recovery audit
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31495251001
- Captured: 2026-08-11T13:16:19Z

## Failed job output

```text
declaration build	Fail until declarations and public entries resolve	﻿2026-08-11T13:15:48.5246359Z ##[group]Run test "${BUILD_FAILED:-1}" = "0"
declaration build	Fail until declarations and public entries resolve	2026-08-11T13:15:48.5246676Z ^[[36;1mtest "${BUILD_FAILED:-1}" = "0"^[[0m
declaration build	Fail until declarations and public entries resolve	2026-08-11T13:15:48.5285106Z shell: /usr/bin/bash -e {0}
declaration build	Fail until declarations and public entries resolve	2026-08-11T13:15:48.5285349Z env:
declaration build	Fail until declarations and public entries resolve	2026-08-11T13:15:48.5285513Z   BUILD_FAILED: 1
declaration build	Fail until declarations and public entries resolve	2026-08-11T13:15:48.5286114Z ##[endgroup]
declaration build	Fail until declarations and public entries resolve	2026-08-11T13:15:48.5354183Z ##[error]Process completed with exit code 1.
mutation baseline	Fail until a mutation baseline exists	﻿2026-08-11T13:15:45.6649224Z ##[group]Run test "${MUTATION_FAILED:-1}" = "0"
mutation baseline	Fail until a mutation baseline exists	2026-08-11T13:15:45.6649528Z ^[[36;1mtest "${MUTATION_FAILED:-1}" = "0"^[[0m
mutation baseline	Fail until a mutation baseline exists	2026-08-11T13:15:45.6689534Z shell: /usr/bin/bash -e {0}
mutation baseline	Fail until a mutation baseline exists	2026-08-11T13:15:45.6689750Z env:
mutation baseline	Fail until a mutation baseline exists	2026-08-11T13:15:45.6689922Z   MUTATION_FAILED: 1
mutation baseline	Fail until a mutation baseline exists	2026-08-11T13:15:45.6690106Z ##[endgroup]
mutation baseline	Fail until a mutation baseline exists	2026-08-11T13:15:45.6756256Z ##[error]Process completed with exit code 1.
acceptance mapping	Fail until acceptance mapping is executable	﻿2026-08-11T13:15:43.3394124Z ##[group]Run test "${ACCEPTANCE_FAILED:-1}" = "0"
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T13:15:43.3394510Z ^[[36;1mtest "${ACCEPTANCE_FAILED:-1}" = "0"^[[0m
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T13:15:43.3438046Z shell: /usr/bin/bash -e {0}
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T13:15:43.3438300Z env:
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T13:15:43.3438500Z   ACCEPTANCE_FAILED: 1
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T13:15:43.3438725Z ##[endgroup]
acceptance mapping	Fail until acceptance mapping is executable	2026-08-11T13:15:43.3512558Z ##[error]Process completed with exit code 1.
contract surfaces	Fail when a contract surface is missing or red	﻿2026-08-11T13:15:46.9954946Z ##[group]Run test "${CONTRACT_FAILED:-1}" = "0"
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T13:15:46.9955339Z ^[[36;1mtest "${CONTRACT_FAILED:-1}" = "0"^[[0m
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T13:15:47.0009521Z shell: /usr/bin/bash -e {0}
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T13:15:47.0009786Z env:
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T13:15:47.0009984Z   CONTRACT_FAILED: 1
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T13:15:47.0010203Z ##[endgroup]
contract surfaces	Fail when a contract surface is missing or red	2026-08-11T13:15:47.0103115Z ##[error]Process completed with exit code 1.
```
