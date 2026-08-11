# CI log archive: 31498105915

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31498105915
- Captured: 2026-08-11T13:48:56Z

## Failed job output

```text
boundaries (node 24)	Install locked dependencies	﻿2026-08-11T13:48:30.4071843Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:30.4072643Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:30.4132226Z shell: /usr/bin/bash -e {0}
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:30.4132769Z ##[endgroup]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3033869Z npm error code EUSAGE
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3098399Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3100321Z npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3101727Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3102271Z npm error Missing: react@19.2.8 from lock file
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3102864Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3103311Z npm error Clean install a project
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3103755Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3104096Z npm error Usage:
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3104774Z npm error npm ci
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3105119Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3105487Z npm error Options:
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3106277Z npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3107607Z npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3108810Z npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3109963Z npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3111026Z npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3112008Z npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3113016Z npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3114802Z npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3115739Z npm error [--no-bin-links] [--no-fund] [--dry-run]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3116659Z npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3117602Z npm error [--workspaces] [--include-workspace-root] [--install-links]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3118184Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3118624Z npm error   --install-strategy
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3119367Z npm error     Sets the strategy for installing packages in node_modules.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3120036Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3120401Z npm error   --legacy-bundling
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3121235Z npm error     Instead of hoisting package installs in `node_modules`, install packages
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3122007Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3122421Z npm error   --global-style
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3123174Z npm error     Only install direct dependencies in the top level `node_modules`,
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3123816Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3124146Z npm error   --omit
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3125057Z npm error     Dependency types to omit from the installation tree on disk.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3125675Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3126015Z npm error   --include
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3126791Z npm error     Option that allows for defining which types of dependencies to install.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3127460Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3127878Z npm error   --strict-peer-deps
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3128624Z npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3129225Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3129631Z npm error   --foreground-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3130335Z npm error     Run all build scripts (ie, `preinstall`, `install`, and
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3130904Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3131256Z npm error   --ignore-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3132013Z npm error     If true, npm does not run scripts specified in package.json files.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3132636Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3132999Z npm error   --allow-directory
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3133784Z npm error     Limits the ability for npm to install dependencies from directories.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3134599Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3134950Z npm error   --allow-file
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3135938Z npm error     Limits the ability for npm to install dependencies from tarball files.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3136607Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3136948Z npm error   --allow-git
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3137704Z npm error     Limits the ability for npm to fetch dependencies from git references.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3138354Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3138713Z npm error   --allow-remote
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3139434Z npm error     Limits the ability for npm to fetch dependencies from urls.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3140026Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3140384Z npm error   --allow-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3141179Z npm error     Comma-separated list of packages whose install-time lifecycle scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3141852Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3142263Z npm error   --strict-allow-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3143071Z npm error     If `true`, turn the install-script policy from a warning into a hard
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3143721Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3144443Z npm error   --dangerously-allow-all-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3145334Z npm error     If `true`, bypass the `allowScripts` policy entirely and run every
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3145959Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3146295Z npm error   --audit
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3147057Z npm error     When "true" submit audit reports alongside the current npm command to the
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3147741Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3148079Z npm error   --bin-links
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3148829Z npm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3149455Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3149788Z npm error   --fund
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3150483Z npm error     When "true" displays the message at the end of each `npm install`
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3151265Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3151594Z npm error   --dry-run
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3152364Z npm error     Indicates that you don't want npm to make any changes and that it should
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3153052Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3153404Z npm error   -w|--workspace
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3154399Z npm error     Enable running a command in the context of the configured workspaces of the
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3155111Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3155464Z npm error   --workspaces
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3156227Z npm error     Set to true to run the command in the context of **all** configured
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3156866Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3157292Z npm error   --include-workspace-root
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3158144Z npm error     Include the workspace root when workspaces are enabled for a command.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3158809Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3159164Z npm error   --install-links
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3159957Z npm error     When set file: protocol dependencies will be packed and installed as
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3160618Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3160921Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3161542Z npm error aliases: clean-install, ic, install-clean, isntall-clean
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3162123Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3162588Z npm error Run "npm help ci" for more info
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3163652Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-11T13_48_30_478Z-debug-0.log
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:31.3525280Z ##[error]Process completed with exit code 1.
integration (node 24)	Install locked dependencies	﻿2026-08-11T13:48:35.4092216Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
integration (node 24)	Install locked dependencies	2026-08-11T13:48:35.4092749Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
integration (node 24)	Install locked dependencies	2026-08-11T13:48:35.4150222Z shell: /usr/bin/bash -e {0}
integration (node 24)	Install locked dependencies	2026-08-11T13:48:35.4150554Z ##[endgroup]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0410540Z npm error code EUSAGE
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0476516Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0478513Z npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0480083Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0480744Z npm error Missing: react@19.2.8 from lock file
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0481365Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0481893Z npm error Clean install a project
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0482389Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0482766Z npm error Usage:
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0483473Z npm error npm ci
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0483872Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0484286Z npm error Options:
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0485209Z npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0486695Z npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0488060Z npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0489318Z npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0490537Z npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0491701Z npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0493638Z npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0494899Z npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0495953Z npm error [--no-bin-links] [--no-fund] [--dry-run]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0497012Z npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0498142Z npm error [--workspaces] [--include-workspace-root] [--install-links]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0498821Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0499291Z npm error   --install-strategy
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0500109Z npm error     Sets the strategy for installing packages in node_modules.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0500853Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0501279Z npm error   --legacy-bundling
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0502190Z npm error     Instead of hoisting package installs in `node_modules`, install packages
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0503260Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0503694Z npm error   --global-style
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0504627Z npm error     Only install direct dependencies in the top level `node_modules`,
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0505368Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0505785Z npm error   --omit
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0506631Z npm error     Dependency types to omit from the installation tree on disk.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0507341Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0507729Z npm error   --include
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0508605Z npm error     Option that allows for defining which types of dependencies to install.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0509374Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0509829Z npm error   --strict-peer-deps
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0510667Z npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0511366Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0511828Z npm error   --foreground-scripts
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0512636Z npm error     Run all build scripts (ie, `preinstall`, `install`, and
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0513628Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0514055Z npm error   --ignore-scripts
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0514910Z npm error     If true, npm does not run scripts specified in package.json files.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0515646Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0516167Z npm error   --allow-directory
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0517039Z npm error     Limits the ability for npm to install dependencies from directories.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0517790Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0518184Z npm error   --allow-file
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0519306Z npm error     Limits the ability for npm to install dependencies from tarball files.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0520067Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0520469Z npm error   --allow-git
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0521309Z npm error     Limits the ability for npm to fetch dependencies from git references.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0522059Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0522481Z npm error   --allow-remote
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0523506Z npm error     Limits the ability for npm to fetch dependencies from urls.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0524213Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0524624Z npm error   --allow-scripts
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0525518Z npm error     Comma-separated list of packages whose install-time lifecycle scripts
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0526287Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0526760Z npm error   --strict-allow-scripts
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0527643Z npm error     If `true`, turn the install-script policy from a warning into a hard
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0528386Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0528897Z npm error   --dangerously-allow-all-scripts
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0529826Z npm error     If `true`, bypass the `allowScripts` policy entirely and run every
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0530537Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0530914Z npm error   --audit
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0531756Z npm error     When "true" submit audit reports alongside the current npm command to the
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0532529Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0533146Z npm error   --bin-links
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0534004Z npm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0534743Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0535116Z npm error   --fund
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0536090Z npm error     When "true" displays the message at the end of each `npm install`
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0536806Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0537188Z npm error   --dry-run
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0538038Z npm error     Indicates that you don't want npm to make any changes and that it should
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0538818Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0539223Z npm error   -w|--workspace
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0540133Z npm error     Enable running a command in the context of the configured workspaces of the
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0540932Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0541325Z npm error   --workspaces
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0542146Z npm error     Set to true to run the command in the context of **all** configured
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0543055Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0543562Z npm error   --include-workspace-root
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0544487Z npm error     Include the workspace root when workspaces are enabled for a command.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0545231Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0545654Z npm error   --install-links
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0546595Z npm error     When set file: protocol dependencies will be packed and installed as
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0547323Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0547666Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0548335Z npm error aliases: clean-install, ic, install-clean, isntall-clean
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0548996Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0549468Z npm error Run "npm help ci" for more info
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0550664Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-11T13_48_35_475Z-debug-0.log
integration (node 24)	Install locked dependencies	2026-08-11T13:48:39.0911320Z ##[error]Process completed with exit code 1.
quality (node 24)	Install locked dependencies	﻿2026-08-11T13:48:38.2726696Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
quality (node 24)	Install locked dependencies	2026-08-11T13:48:38.2727257Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
quality (node 24)	Install locked dependencies	2026-08-11T13:48:38.2787896Z shell: /usr/bin/bash -e {0}
quality (node 24)	Install locked dependencies	2026-08-11T13:48:38.2788222Z ##[endgroup]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:39.9990656Z npm error code EUSAGE
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0052838Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0054579Z npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0055913Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0056435Z npm error Missing: react@19.2.8 from lock file
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0056992Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0057411Z npm error Clean install a project
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0057857Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0058184Z npm error Usage:
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0058515Z npm error npm ci
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0058852Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0059203Z npm error Options:
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0060023Z npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0061599Z npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0062805Z npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0063889Z npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0064912Z npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0065914Z npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0066946Z npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0068501Z npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0069388Z npm error [--no-bin-links] [--no-fund] [--dry-run]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0070298Z npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0071490Z npm error [--workspaces] [--include-workspace-root] [--install-links]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0072108Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0072511Z npm error   --install-strategy
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0073202Z npm error     Sets the strategy for installing packages in node_modules.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0073820Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0074186Z npm error   --legacy-bundling
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0075007Z npm error     Instead of hoisting package installs in `node_modules`, install packages
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0075738Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0076092Z npm error   --global-style
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0076838Z npm error     Only install direct dependencies in the top level `node_modules`,
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0077488Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0077822Z npm error   --omit
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0078501Z npm error     Dependency types to omit from the installation tree on disk.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0079112Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0079449Z npm error   --include
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0080203Z npm error     Option that allows for defining which types of dependencies to install.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0080881Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0081491Z npm error   --strict-peer-deps
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0082254Z npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0082863Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0083262Z npm error   --foreground-scripts
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0083966Z npm error     Run all build scripts (ie, `preinstall`, `install`, and
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0084533Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0084888Z npm error   --ignore-scripts
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0085632Z npm error     If true, npm does not run scripts specified in package.json files.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0086270Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0086634Z npm error   --allow-directory
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0087413Z npm error     Limits the ability for npm to install dependencies from directories.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0088060Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0088407Z npm error   --allow-file
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0089379Z npm error     Limits the ability for npm to install dependencies from tarball files.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0090036Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0090402Z npm error   --allow-git
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0091326Z npm error     Limits the ability for npm to fetch dependencies from git references.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0091993Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0092352Z npm error   --allow-remote
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0093055Z npm error     Limits the ability for npm to fetch dependencies from urls.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0093659Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0094014Z npm error   --allow-scripts
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0094798Z npm error     Comma-separated list of packages whose install-time lifecycle scripts
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0095489Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0095888Z npm error   --strict-allow-scripts
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0096676Z npm error     If `true`, turn the install-script policy from a warning into a hard
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0097341Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0097896Z npm error   --dangerously-allow-all-scripts
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0098737Z npm error     If `true`, bypass the `allowScripts` policy entirely and run every
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0099352Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0099681Z npm error   --audit
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0100439Z npm error     When "true" submit audit reports alongside the current npm command to the
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0101300Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0101650Z npm error   --bin-links
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0102393Z npm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0103027Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0103366Z npm error   --fund
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0104057Z npm error     When "true" displays the message at the end of each `npm install`
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0104847Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0105185Z npm error   --dry-run
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0105945Z npm error     Indicates that you don't want npm to make any changes and that it should
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0106632Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0106990Z npm error   -w|--workspace
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0107827Z npm error     Enable running a command in the context of the configured workspaces of the
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0108522Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0108875Z npm error   --workspaces
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0109602Z npm error     Set to true to run the command in the context of **all** configured
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0110236Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0110681Z npm error   --include-workspace-root
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0111666Z npm error     Include the workspace root when workspaces are enabled for a command.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0112326Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0112691Z npm error   --install-links
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0113468Z npm error     When set file: protocol dependencies will be packed and installed as
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0114127Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0114432Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0115027Z npm error aliases: clean-install, ic, install-clean, isntall-clean
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0115622Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0116060Z npm error Run "npm help ci" for more info
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0117139Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-11T13_48_38_344Z-debug-0.log
quality (node 24)	Install locked dependencies	2026-08-11T13:48:40.0488216Z ##[error]Process completed with exit code 1.
performance (node 24, advisory)	Install locked dependencies	﻿2026-08-11T13:48:40.4817879Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:40.4818400Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:40.6343322Z shell: /usr/bin/bash -e {0}
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:40.6343679Z ##[endgroup]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7349839Z npm error code EUSAGE
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7422100Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7423941Z npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7425362Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7425887Z npm error Missing: react@19.2.8 from lock file
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7426373Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7426782Z npm error Clean install a project
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7427207Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7427532Z npm error Usage:
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7427895Z npm error npm ci
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7428231Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7428565Z npm error Options:
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7429372Z npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7430615Z npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7431748Z npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7432989Z npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7433982Z npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7435305Z npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7436278Z npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7437325Z npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7438176Z npm error [--no-bin-links] [--no-fund] [--dry-run]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7439035Z npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7439992Z npm error [--workspaces] [--include-workspace-root] [--install-links]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7440601Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7440992Z npm error   --install-strategy
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7441655Z npm error     Sets the strategy for installing packages in node_modules.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7442259Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7442608Z npm error   --legacy-bundling
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7443762Z npm error     Instead of hoisting package installs in `node_modules`, install packages
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7444288Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7444543Z npm error   --global-style
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7445040Z npm error     Only install direct dependencies in the top level `node_modules`,
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7445455Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7445680Z npm error   --omit
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7446097Z npm error     Dependency types to omit from the installation tree on disk.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7446481Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7446705Z npm error   --include
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7447179Z npm error     Option that allows for defining which types of dependencies to install.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7447591Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7447844Z npm error   --strict-peer-deps
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7448305Z npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7448674Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7448927Z npm error   --foreground-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7449369Z npm error     Run all build scripts (ie, `preinstall`, `install`, and
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7449723Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7449965Z npm error   --ignore-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7450418Z npm error     If true, npm does not run scripts specified in package.json files.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7450793Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7451024Z npm error   --allow-directory
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7451481Z npm error     Limits the ability for npm to install dependencies from directories.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7451869Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7452082Z npm error   --allow-file
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7452982Z npm error     Limits the ability for npm to install dependencies from tarball files.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7453396Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7453868Z npm error   --allow-git
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7454315Z npm error     Limits the ability for npm to fetch dependencies from git references.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7454745Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7454973Z npm error   --allow-remote
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7455386Z npm error     Limits the ability for npm to fetch dependencies from urls.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7455763Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7456162Z npm error   --allow-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7456629Z npm error     Comma-separated list of packages whose install-time lifecycle scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7457029Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7457278Z npm error   --strict-allow-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7457740Z npm error     If `true`, turn the install-script policy from a warning into a hard
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7458134Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7458471Z npm error   --dangerously-allow-all-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7458972Z npm error     If `true`, bypass the `allowScripts` policy entirely and run every
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7459344Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7459554Z npm error   --audit
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7460005Z npm error     When "true" submit audit reports alongside the current npm command to the
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7460403Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7460615Z npm error   --bin-links
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7461048Z npm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7461619Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7461837Z npm error   --fund
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7462245Z npm error     When "true" displays the message at the end of each `npm install`
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7462618Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7463041Z npm error   --dry-run
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7463490Z npm error     Indicates that you don't want npm to make any changes and that it should
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7463913Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7464135Z npm error   -w|--workspace
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7464612Z npm error     Enable running a command in the context of the configured workspaces of the
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7465019Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7465241Z npm error   --workspaces
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7465679Z npm error     Set to true to run the command in the context of **all** configured
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7466060Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7466314Z npm error   --include-workspace-root
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7466795Z npm error     Include the workspace root when workspaces are enabled for a command.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7467202Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7467420Z npm error   --install-links
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7467877Z npm error     When set file: protocol dependencies will be packed and installed as
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7468262Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7468449Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7468811Z npm error aliases: clean-install, ic, install-clean, isntall-clean
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7469162Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7469419Z npm error Run "npm help ci" for more info
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7470049Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-11T13_48_40_696Z-debug-0.log
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:42.7846690Z ##[error]Process completed with exit code 1.
performance (node 24, advisory)	Upload benchmark report	﻿2026-08-11T13:48:42.7930919Z Node 20 is being deprecated. This workflow is running with Node 24 by default. If you need to temporarily use Node 20, you can set the ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true environment variable. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:42.7932152Z ##[group]Run actions/upload-artifact@v4
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:42.7932442Z with:
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:42.7932928Z   name: motion5-benchmark-report
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:42.7933231Z   path: performance/benchmark-report.json
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:42.7933526Z   if-no-files-found: error
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:42.7933772Z   compression-level: 6
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:42.7934001Z   overwrite: false
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:42.7934229Z   include-hidden-files: false
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:42.7934489Z ##[endgroup]
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:42.9580756Z (node:2300) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:42.9582187Z (Use `node --trace-deprecation ...` to show where the warning was created)
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:42.9614313Z ##[error]No files were found with the provided path: performance/benchmark-report.json. No artifacts will be uploaded.
```
