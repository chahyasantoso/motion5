# CI log archive: 31510727665

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31510727665
- Captured: 2026-08-11T16:08:04Z

Detailed failed-job output: [failed-jobs.log](./failed-jobs.log)
Job and step outcomes: [jobs.json](./jobs.json)

## Job outcomes

- integration (node 24): failure — failed steps: Install locked dependencies (failure)
- performance (node 24, advisory): failure — failed steps: Install locked dependencies (failure); Upload benchmark report (failure)
- boundaries (node 24): failure — failed steps: Install locked dependencies (failure)
- quality (node 24): failure — failed steps: Install locked dependencies (failure)

## Failed job output

```text
integration (node 24)	Install locked dependencies	﻿2026-08-11T16:07:31.9195125Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
integration (node 24)	Install locked dependencies	2026-08-11T16:07:31.9195784Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
integration (node 24)	Install locked dependencies	2026-08-11T16:07:31.9235432Z shell: /usr/bin/bash -e {0}
integration (node 24)	Install locked dependencies	2026-08-11T16:07:31.9235798Z ##[endgroup]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.8992444Z npm error code EUSAGE
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9051723Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9053582Z npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9054960Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9055651Z npm error Missing: @types/node@24.3.0 from lock file
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9056435Z npm error Missing: undici-types@7.10.0 from lock file
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9057131Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9057421Z npm error Clean install a project
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9057693Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9058076Z npm error Usage:
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9058305Z npm error npm ci
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9058517Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9058785Z npm error Options:
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9059280Z npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9059940Z npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9060633Z npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9061254Z npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9061830Z npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9062394Z npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9063008Z npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9063710Z npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9064214Z npm error [--no-bin-links] [--no-fund] [--dry-run]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9065153Z npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9066203Z npm error [--workspaces] [--include-workspace-root] [--install-links]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9066822Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9067118Z npm error   --install-strategy
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9067575Z npm error     Sets the strategy for installing packages in node_modules.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9068097Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9068335Z npm error   --legacy-bundling
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9068828Z npm error     Instead of hoisting package installs in `node_modules`, install packages
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9069219Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9069442Z npm error   --global-style
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9069909Z npm error     Only install direct dependencies in the top level `node_modules`,
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9070276Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9070479Z npm error   --omit
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9070891Z npm error     Dependency types to omit from the installation tree on disk.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9071258Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9071478Z npm error   --include
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9071936Z npm error     Option that allows for defining which types of dependencies to install.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9072327Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9072576Z npm error   --strict-peer-deps
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9073029Z npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9073389Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9073642Z npm error   --foreground-scripts
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9074069Z npm error     Run all build scripts (ie, `preinstall`, `install`, and
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9074410Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9074648Z npm error   --ignore-scripts
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9075113Z npm error     If true, npm does not run scripts specified in package.json files.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9075490Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9075718Z npm error   --allow-directory
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9076184Z npm error     Limits the ability for npm to install dependencies from directories.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9076805Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9077030Z npm error   --allow-file
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9077494Z npm error     Limits the ability for npm to install dependencies from tarball files.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9078069Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9078295Z npm error   --allow-git
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9078770Z npm error     Limits the ability for npm to fetch dependencies from git references.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9079159Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9079392Z npm error   --allow-remote
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9079944Z npm error     Limits the ability for npm to fetch dependencies from urls.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9080501Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9080730Z npm error   --allow-scripts
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9081204Z npm error     Comma-separated list of packages whose install-time lifecycle scripts
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9081702Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9081956Z npm error   --strict-allow-scripts
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9082469Z npm error     If `true`, turn the install-script policy from a warning into a hard
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9082925Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9083208Z npm error   --dangerously-allow-all-scripts
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9083705Z npm error     If `true`, bypass the `allowScripts` policy entirely and run every
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9084087Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9084303Z npm error   --audit
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9084766Z npm error     When "true" submit audit reports alongside the current npm command to the
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9085162Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9085388Z npm error   --bin-links
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9085841Z npm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9086216Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9086422Z npm error   --fund
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9086839Z npm error     When "true" displays the message at the end of each `npm install`
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9087208Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9087420Z npm error   --dry-run
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9088088Z npm error     Indicates that you don't want npm to make any changes and that it should
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9088498Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9088722Z npm error   -w|--workspace
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9089224Z npm error     Enable running a command in the context of the configured workspaces of the
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9089620Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9089837Z npm error   --workspaces
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9090284Z npm error     Set to true to run the command in the context of **all** configured
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9090659Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9090921Z npm error   --include-workspace-root
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9091426Z npm error     Include the workspace root when workspaces are enabled for a command.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9091812Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9092038Z npm error   --install-links
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9092539Z npm error     When set file: protocol dependencies will be packed and installed as
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9092917Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9093109Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9093489Z npm error aliases: clean-install, ic, install-clean, isntall-clean
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9093837Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9094114Z npm error Run "npm help ci" for more info
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9094788Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-11T16_07_31_980Z-debug-0.log
integration (node 24)	Install locked dependencies	2026-08-11T16:07:32.9278085Z ##[error]Process completed with exit code 1.
performance (node 24, advisory)	Install locked dependencies	﻿2026-08-11T16:07:37.4666551Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:37.4667230Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:37.4765953Z shell: /usr/bin/bash -e {0}
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:37.4766652Z ##[endgroup]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8224694Z npm error code EUSAGE
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8281567Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8284015Z npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8285351Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8286760Z npm error Missing: @types/node@24.3.0 from lock file
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8287408Z npm error Missing: undici-types@7.10.0 from lock file
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8287859Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8288242Z npm error Clean install a project
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8288624Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8288900Z npm error Usage:
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8289200Z npm error npm ci
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8289503Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8289899Z npm error Options:
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8290577Z npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8291580Z npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8292584Z npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8293486Z npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8294334Z npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8295158Z npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8296417Z npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8297407Z npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8297961Z npm error [--no-bin-links] [--no-fund] [--dry-run]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8298512Z npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8299113Z npm error [--workspaces] [--include-workspace-root] [--install-links]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8299489Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8299738Z npm error   --install-strategy
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8300206Z npm error     Sets the strategy for installing packages in node_modules.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8300578Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8300799Z npm error   --legacy-bundling
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8301313Z npm error     Instead of hoisting package installs in `node_modules`, install packages
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8301743Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8301959Z npm error   --global-style
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8302413Z npm error     Only install direct dependencies in the top level `node_modules`,
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8302810Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8303012Z npm error   --omit
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8303452Z npm error     Dependency types to omit from the installation tree on disk.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8303830Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8304045Z npm error   --include
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8304505Z npm error     Option that allows for defining which types of dependencies to install.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8304924Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8305168Z npm error   --strict-peer-deps
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8305617Z npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8305998Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8306521Z npm error   --foreground-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8306979Z npm error     Run all build scripts (ie, `preinstall`, `install`, and
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8307336Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8307558Z npm error   --ignore-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8308021Z npm error     If true, npm does not run scripts specified in package.json files.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8308416Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8308644Z npm error   --allow-directory
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8309108Z npm error     Limits the ability for npm to install dependencies from directories.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8309760Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8309973Z npm error   --allow-file
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8310426Z npm error     Limits the ability for npm to install dependencies from tarball files.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8310831Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8311045Z npm error   --allow-git
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8311491Z npm error     Limits the ability for npm to fetch dependencies from git references.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8311880Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8312093Z npm error   --allow-remote
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8312508Z npm error     Limits the ability for npm to fetch dependencies from urls.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8313008Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8313222Z npm error   --allow-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8313691Z npm error     Comma-separated list of packages whose install-time lifecycle scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8314093Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8314347Z npm error   --strict-allow-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8314836Z npm error     If `true`, turn the install-script policy from a warning into a hard
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8315321Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8315598Z npm error   --dangerously-allow-all-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8316090Z npm error     If `true`, bypass the `allowScripts` policy entirely and run every
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8316629Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8316836Z npm error   --audit
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8317285Z npm error     When "true" submit audit reports alongside the current npm command to the
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8317697Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8317906Z npm error   --bin-links
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8318348Z npm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8318736Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8318944Z npm error   --fund
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8319352Z npm error     When "true" displays the message at the end of each `npm install`
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8319725Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8319928Z npm error   --dry-run
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8320386Z npm error     Indicates that you don't want npm to make any changes and that it should
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8320795Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8321005Z npm error   -w|--workspace
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8321478Z npm error     Enable running a command in the context of the configured workspaces of the
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8321889Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8322098Z npm error   --workspaces
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8322538Z npm error     Set to true to run the command in the context of **all** configured
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8322914Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8323165Z npm error   --include-workspace-root
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8323648Z npm error     Include the workspace root when workspaces are enabled for a command.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8324045Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8324270Z npm error   --install-links
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8324739Z npm error     When set file: protocol dependencies will be packed and installed as
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8325136Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8325326Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8325693Z npm error aliases: clean-install, ic, install-clean, isntall-clean
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8326052Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8326598Z npm error Run "npm help ci" for more info
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8327253Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-11T16_07_37_540Z-debug-0.log
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:39.8711820Z ##[error]Process completed with exit code 1.
performance (node 24, advisory)	Upload benchmark report	﻿2026-08-11T16:07:39.8800648Z Node 20 is being deprecated. This workflow is running with Node 24 by default. If you need to temporarily use Node 20, you can set the ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true environment variable. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:39.8801970Z ##[group]Run actions/upload-artifact@v4
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:39.8802259Z with:
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:39.8802468Z   name: motion5-benchmark-report
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:39.8802750Z   path: performance/benchmark-report.json
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:39.8803040Z   if-no-files-found: error
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:39.8803275Z   compression-level: 6
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:39.8803490Z   overwrite: false
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:39.8803705Z   include-hidden-files: false
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:39.8803950Z ##[endgroup]
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:40.0514821Z (node:2270) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:40.0516078Z (Use `node --trace-deprecation ...` to show where the warning was created)
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:40.0550432Z ##[error]No files were found with the provided path: performance/benchmark-report.json. No artifacts will be uploaded.
boundaries (node 24)	Install locked dependencies	﻿2026-08-11T16:07:32.3178031Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:32.3178601Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:32.3239316Z shell: /usr/bin/bash -e {0}
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:32.3239663Z ##[endgroup]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3772337Z npm error code EUSAGE
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3827296Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3828853Z npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3829667Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3830040Z npm error Missing: @types/node@24.3.0 from lock file
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3830507Z npm error Missing: undici-types@7.10.0 from lock file
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3830869Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3831465Z npm error Clean install a project
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3831783Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3832006Z npm error Usage:
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3832250Z npm error npm ci
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3832477Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3832784Z npm error Options:
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3833299Z npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3834024Z npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3834743Z npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3835443Z npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3836072Z npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3836921Z npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3837515Z npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3838211Z npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3838804Z npm error [--no-bin-links] [--no-fund] [--dry-run]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3839347Z npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3839940Z npm error [--workspaces] [--include-workspace-root] [--install-links]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3840355Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3840636Z npm error   --install-strategy
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3841404Z npm error     Sets the strategy for installing packages in node_modules.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3842032Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3842393Z npm error   --legacy-bundling
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3843020Z npm error     Instead of hoisting package installs in `node_modules`, install packages
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3843460Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3843707Z npm error   --global-style
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3844177Z npm error     Only install direct dependencies in the top level `node_modules`,
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3844596Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3844830Z npm error   --omit
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3845260Z npm error     Dependency types to omit from the installation tree on disk.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3845657Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3845884Z npm error   --include
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3846530Z npm error     Option that allows for defining which types of dependencies to install.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3847010Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3847279Z npm error   --strict-peer-deps
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3847750Z npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3848148Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3848429Z npm error   --foreground-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3848876Z npm error     Run all build scripts (ie, `preinstall`, `install`, and
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3849262Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3849503Z npm error   --ignore-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3849970Z npm error     If true, npm does not run scripts specified in package.json files.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3850386Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3850623Z npm error   --allow-directory
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3851097Z npm error     Limits the ability for npm to install dependencies from directories.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3851733Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3851965Z npm error   --allow-file
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3852440Z npm error     Limits the ability for npm to install dependencies from tarball files.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3852859Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3853093Z npm error   --allow-git
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3853553Z npm error     Limits the ability for npm to fetch dependencies from git references.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3853970Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3854207Z npm error   --allow-remote
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3854640Z npm error     Limits the ability for npm to fetch dependencies from urls.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3855028Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3855261Z npm error   --allow-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3855747Z npm error     Comma-separated list of packages whose install-time lifecycle scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3856419Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3856690Z npm error   --strict-allow-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3857204Z npm error     If `true`, turn the install-script policy from a warning into a hard
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3857732Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3858025Z npm error   --dangerously-allow-all-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3858566Z npm error     If `true`, bypass the `allowScripts` policy entirely and run every
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3858971Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3859206Z npm error   --audit
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3859675Z npm error     When "true" submit audit reports alongside the current npm command to the
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3860093Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3860328Z npm error   --bin-links
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3860788Z npm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3861200Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3861423Z npm error   --fund
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3861864Z npm error     When "true" displays the message at the end of each `npm install`
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3862273Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3862504Z npm error   --dry-run
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3862985Z npm error     Indicates that you don't want npm to make any changes and that it should
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3863416Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3863654Z npm error   -w|--workspace
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3864142Z npm error     Enable running a command in the context of the configured workspaces of the
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3864583Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3864817Z npm error   --workspaces
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3865274Z npm error     Set to true to run the command in the context of **all** configured
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3865671Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3865949Z npm error   --include-workspace-root
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3866573Z npm error     Include the workspace root when workspaces are enabled for a command.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3866999Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3867247Z npm error   --install-links
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3867730Z npm error     When set file: protocol dependencies will be packed and installed as
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3868160Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3868381Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3868764Z npm error aliases: clean-install, ic, install-clean, isntall-clean
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3869157Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3869437Z npm error Run "npm help ci" for more info
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.3870100Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-11T16_07_32_392Z-debug-0.log
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:33.4259559Z ##[error]Process completed with exit code 1.
quality (node 24)	Install locked dependencies	﻿2026-08-11T16:07:32.1696874Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
quality (node 24)	Install locked dependencies	2026-08-11T16:07:32.1697537Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
quality (node 24)	Install locked dependencies	2026-08-11T16:07:32.1759564Z shell: /usr/bin/bash -e {0}
quality (node 24)	Install locked dependencies	2026-08-11T16:07:32.1760148Z ##[endgroup]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0701286Z npm error code EUSAGE
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0754204Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0755799Z npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0756582Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0756953Z npm error Missing: @types/node@24.3.0 from lock file
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0757410Z npm error Missing: undici-types@7.10.0 from lock file
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0757743Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0758495Z npm error Clean install a project
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0758772Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0758990Z npm error Usage:
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0759209Z npm error npm ci
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0759440Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0759732Z npm error Options:
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0760555Z npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0761263Z npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0761944Z npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0762583Z npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0763192Z npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0763750Z npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0764330Z npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0764967Z npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0765517Z npm error [--no-bin-links] [--no-fund] [--dry-run]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0766050Z npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0766616Z npm error [--workspaces] [--include-workspace-root] [--install-links]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0766985Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0767252Z npm error   --install-strategy
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0767734Z npm error     Sets the strategy for installing packages in node_modules.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0768105Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0768408Z npm error   --legacy-bundling
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0769210Z npm error     Instead of hoisting package installs in `node_modules`, install packages
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0769959Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0770189Z npm error   --global-style
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0770646Z npm error     Only install direct dependencies in the top level `node_modules`,
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0771226Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0771440Z npm error   --omit
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0771849Z npm error     Dependency types to omit from the installation tree on disk.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0772243Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0772461Z npm error   --include
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0772911Z npm error     Option that allows for defining which types of dependencies to install.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0773306Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0773551Z npm error   --strict-peer-deps
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0773998Z npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0774356Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0774608Z npm error   --foreground-scripts
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0775039Z npm error     Run all build scripts (ie, `preinstall`, `install`, and
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0775389Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0775623Z npm error   --ignore-scripts
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0776071Z npm error     If true, npm does not run scripts specified in package.json files.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0776455Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0776683Z npm error   --allow-directory
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0777150Z npm error     Limits the ability for npm to install dependencies from directories.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0777801Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0778026Z npm error   --allow-file
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0778479Z npm error     Limits the ability for npm to install dependencies from tarball files.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0778875Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0779100Z npm error   --allow-git
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0779541Z npm error     Limits the ability for npm to fetch dependencies from git references.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0780044Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0780264Z npm error   --allow-remote
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0780675Z npm error     Limits the ability for npm to fetch dependencies from urls.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0781053Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0781274Z npm error   --allow-scripts
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0781740Z npm error     Comma-separated list of packages whose install-time lifecycle scripts
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0782303Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0782562Z npm error   --strict-allow-scripts
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0783069Z npm error     If `true`, turn the install-script policy from a warning into a hard
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0783527Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0783820Z npm error   --dangerously-allow-all-scripts
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0784344Z npm error     If `true`, bypass the `allowScripts` policy entirely and run every
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0784727Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0784944Z npm error   --audit
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0785403Z npm error     When "true" submit audit reports alongside the current npm command to the
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0785812Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0786037Z npm error   --bin-links
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0786481Z npm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0786864Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0787080Z npm error   --fund
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0787501Z npm error     When "true" displays the message at the end of each `npm install`
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0787912Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0788130Z npm error   --dry-run
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0788597Z npm error     Indicates that you don't want npm to make any changes and that it should
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0789008Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0789253Z npm error   -w|--workspace
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0789730Z npm error     Enable running a command in the context of the configured workspaces of the
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0790274Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0790496Z npm error   --workspaces
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0790935Z npm error     Set to true to run the command in the context of **all** configured
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0791338Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0791602Z npm error   --include-workspace-root
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0792104Z npm error     Include the workspace root when workspaces are enabled for a command.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0792500Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0792726Z npm error   --install-links
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0793194Z npm error     When set file: protocol dependencies will be packed and installed as
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0793595Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0793793Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0794156Z npm error aliases: clean-install, ic, install-clean, isntall-clean
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0794535Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0794800Z npm error Run "npm help ci" for more info
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.0795418Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-11T16_07_32_244Z-debug-0.log
quality (node 24)	Install locked dependencies	2026-08-11T16:07:33.1193239Z ##[error]Process completed with exit code 1.
```
