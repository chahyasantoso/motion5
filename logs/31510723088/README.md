# CI log archive: 31510723088

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31510723088
- Captured: 2026-08-11T16:08:19Z

Detailed failed-job output: [failed-jobs.log](./failed-jobs.log)
Job and step outcomes: [jobs.json](./jobs.json)

## Job outcomes

- boundaries (node 24): failure — failed steps: Install locked dependencies (failure)
- quality (node 24): failure — failed steps: Install locked dependencies (failure)
- performance (node 24, advisory): failure — failed steps: Install locked dependencies (failure); Upload benchmark report (failure)
- integration (node 24): failure — failed steps: Install locked dependencies (failure)

## Failed job output

```text
boundaries (node 24)	Install locked dependencies	﻿2026-08-11T16:07:28.2866296Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:28.2866859Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:28.2983561Z shell: /usr/bin/bash -e {0}
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:28.2983900Z ##[endgroup]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5410118Z npm error code EUSAGE
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5469891Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5472069Z npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5473653Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5474314Z npm error Missing: @types/node@24.3.0 from lock file
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5475165Z npm error Missing: undici-types@7.10.0 from lock file
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5475908Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5476409Z npm error Clean install a project
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5476922Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5477295Z npm error Usage:
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5477696Z npm error npm ci
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5478115Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5478635Z npm error Options:
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5479603Z npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5481265Z npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5482615Z npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5483892Z npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5485125Z npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5486226Z npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5487872Z npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5489115Z npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5490127Z npm error [--no-bin-links] [--no-fund] [--dry-run]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5491459Z npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5492512Z npm error [--workspaces] [--include-workspace-root] [--install-links]
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5493178Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5493639Z npm error   --install-strategy
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5494500Z npm error     Sets the strategy for installing packages in node_modules.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5495178Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5495586Z npm error   --legacy-bundling
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5496489Z npm error     Instead of hoisting package installs in `node_modules`, install packages
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5497245Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5497642Z npm error   --global-style
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5498480Z npm error     Only install direct dependencies in the top level `node_modules`,
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5499207Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5499579Z npm error   --omit
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5500327Z npm error     Dependency types to omit from the installation tree on disk.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5501308Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5501698Z npm error   --include
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5502542Z npm error     Option that allows for defining which types of dependencies to install.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5503286Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5503718Z npm error   --strict-peer-deps
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5504534Z npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5505221Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5505659Z npm error   --foreground-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5506436Z npm error     Run all build scripts (ie, `preinstall`, `install`, and
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5507077Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5507467Z npm error   --ignore-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5508315Z npm error     If true, npm does not run scripts specified in package.json files.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5509023Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5509420Z npm error   --allow-directory
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5510284Z npm error     Limits the ability for npm to install dependencies from directories.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5511507Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5511917Z npm error   --allow-file
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5512775Z npm error     Limits the ability for npm to install dependencies from tarball files.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5513526Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5513913Z npm error   --allow-git
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5514746Z npm error     Limits the ability for npm to fetch dependencies from git references.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5515485Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5515879Z npm error   --allow-remote
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5516645Z npm error     Limits the ability for npm to fetch dependencies from urls.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5517319Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5517718Z npm error   --allow-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5518599Z npm error     Comma-separated list of packages whose install-time lifecycle scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5519341Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5519783Z npm error   --strict-allow-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5520938Z npm error     If `true`, turn the install-script policy from a warning into a hard
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5521795Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5522303Z npm error   --dangerously-allow-all-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5523214Z npm error     If `true`, bypass the `allowScripts` policy entirely and run every
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5523916Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5524305Z npm error   --audit
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5525135Z npm error     When "true" submit audit reports alongside the current npm command to the
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5525879Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5526264Z npm error   --bin-links
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5527094Z npm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5527805Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5528180Z npm error   --fund
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5529212Z npm error     When "true" displays the message at the end of each `npm install`
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5529918Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5530302Z npm error   --dry-run
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5531402Z npm error     Indicates that you don't want npm to make any changes and that it should
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5532168Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5532563Z npm error   -w|--workspace
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5533474Z npm error     Enable running a command in the context of the configured workspaces of the
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5534260Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5534639Z npm error   --workspaces
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5535462Z npm error     Set to true to run the command in the context of **all** configured
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5536164Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5536649Z npm error   --include-workspace-root
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5537562Z npm error     Include the workspace root when workspaces are enabled for a command.
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5538286Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5538694Z npm error   --install-links
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5539540Z npm error     When set file: protocol dependencies will be packed and installed as
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5540259Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5540824Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5541498Z npm error aliases: clean-install, ic, install-clean, isntall-clean
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5542161Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5542633Z npm error Run "npm help ci" for more info
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5543807Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-11T16_07_28_362Z-debug-0.log
boundaries (node 24)	Install locked dependencies	2026-08-11T16:07:30.5914922Z ##[error]Process completed with exit code 1.
quality (node 24)	Install locked dependencies	﻿2026-08-11T16:07:29.3534111Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
quality (node 24)	Install locked dependencies	2026-08-11T16:07:29.3534682Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
quality (node 24)	Install locked dependencies	2026-08-11T16:07:29.3594566Z shell: /usr/bin/bash -e {0}
quality (node 24)	Install locked dependencies	2026-08-11T16:07:29.3594918Z ##[endgroup]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4305245Z npm error code EUSAGE
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4366516Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4368479Z npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4370080Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4370765Z npm error Missing: @types/node@24.3.0 from lock file
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4371710Z npm error Missing: undici-types@7.10.0 from lock file
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4372713Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4373219Z npm error Clean install a project
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4373722Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4374087Z npm error Usage:
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4374508Z npm error npm ci
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4374897Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4375402Z npm error Options:
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4376360Z npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4377687Z npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4379024Z npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4380314Z npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4381460Z npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4383427Z npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4384660Z npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4385990Z npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4387029Z npm error [--no-bin-links] [--no-fund] [--dry-run]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4388029Z npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4389111Z npm error [--workspaces] [--include-workspace-root] [--install-links]
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4389802Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4390279Z npm error   --install-strategy
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4391144Z npm error     Sets the strategy for installing packages in node_modules.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4392075Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4392506Z npm error   --legacy-bundling
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4393446Z npm error     Instead of hoisting package installs in `node_modules`, install packages
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4394241Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4394670Z npm error   --global-style
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4395505Z npm error     Only install direct dependencies in the top level `node_modules`,
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4396241Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4396642Z npm error   --omit
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4397405Z npm error     Dependency types to omit from the installation tree on disk.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4398124Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4398527Z npm error   --include
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4399376Z npm error     Option that allows for defining which types of dependencies to install.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4400152Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4400625Z npm error   --strict-peer-deps
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4401471Z npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4402444Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4402927Z npm error   --foreground-scripts
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4403728Z npm error     Run all build scripts (ie, `preinstall`, `install`, and
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4404390Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4404817Z npm error   --ignore-scripts
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4405681Z npm error     If true, npm does not run scripts specified in package.json files.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4406417Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4406915Z npm error   --allow-directory
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4407800Z npm error     Limits the ability for npm to install dependencies from directories.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4408797Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4409221Z npm error   --allow-file
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4410070Z npm error     Limits the ability for npm to install dependencies from tarball files.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4410819Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4411222Z npm error   --allow-git
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4412344Z npm error     Limits the ability for npm to fetch dependencies from git references.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4413121Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4413533Z npm error   --allow-remote
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4414323Z npm error     Limits the ability for npm to fetch dependencies from urls.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4415017Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4415444Z npm error   --allow-scripts
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4416324Z npm error     Comma-separated list of packages whose install-time lifecycle scripts
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4417090Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4417567Z npm error   --strict-allow-scripts
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4418497Z npm error     If `true`, turn the install-script policy from a warning into a hard
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4419377Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4419888Z npm error   --dangerously-allow-all-scripts
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4420818Z npm error     If `true`, bypass the `allowScripts` policy entirely and run every
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4421527Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4422111Z npm error   --audit
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4422998Z npm error     When "true" submit audit reports alongside the current npm command to the
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4423758Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4424149Z npm error   --bin-links
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4424986Z npm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4425906Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4426319Z npm error   --fund
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4427090Z npm error     When "true" displays the message at the end of each `npm install`
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4427802Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4428199Z npm error   --dry-run
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4429058Z npm error     Indicates that you don't want npm to make any changes and that it should
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4429820Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4430235Z npm error   -w|--workspace
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4431149Z npm error     Enable running a command in the context of the configured workspaces of the
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4432146Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4432572Z npm error   --workspaces
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4433394Z npm error     Set to true to run the command in the context of **all** configured
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4434107Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4434601Z npm error   --include-workspace-root
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4435557Z npm error     Include the workspace root when workspaces are enabled for a command.
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4436342Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4436790Z npm error   --install-links
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4437658Z npm error     When set file: protocol dependencies will be packed and installed as
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4438404Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4438768Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4439427Z npm error aliases: clean-install, ic, install-clean, isntall-clean
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4440099Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4440582Z npm error Run "npm help ci" for more info
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4441768Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-11T16_07_29_424Z-debug-0.log
quality (node 24)	Install locked dependencies	2026-08-11T16:07:30.4822529Z ##[error]Process completed with exit code 1.
performance (node 24, advisory)	Install locked dependencies	﻿2026-08-11T16:07:54.4753107Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:54.4753678Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:54.4876615Z shell: /usr/bin/bash -e {0}
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:54.4876939Z ##[endgroup]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4842838Z npm error code EUSAGE
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4897609Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4898892Z npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4900005Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4900490Z npm error Missing: @types/node@24.3.0 from lock file
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4901202Z npm error Missing: undici-types@7.10.0 from lock file
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4901701Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4902097Z npm error Clean install a project
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4902514Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4902839Z npm error Usage:
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4903188Z npm error npm ci
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4903514Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4904141Z npm error Options:
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4904949Z npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4906016Z npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4907085Z npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4908063Z npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4908976Z npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4910250Z npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4911177Z npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4912167Z npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4912973Z npm error [--no-bin-links] [--no-fund] [--dry-run]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4913947Z npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4914875Z npm error [--workspaces] [--include-workspace-root] [--install-links]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4915454Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4915842Z npm error   --install-strategy
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4916444Z npm error     Sets the strategy for installing packages in node_modules.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4916821Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4917052Z npm error   --legacy-bundling
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4917570Z npm error     Instead of hoisting package installs in `node_modules`, install packages
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4917994Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4918222Z npm error   --global-style
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4918668Z npm error     Only install direct dependencies in the top level `node_modules`,
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4919053Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4919260Z npm error   --omit
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4919660Z npm error     Dependency types to omit from the installation tree on disk.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4920043Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4920254Z npm error   --include
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4920695Z npm error     Option that allows for defining which types of dependencies to install.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4921090Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4921329Z npm error   --strict-peer-deps
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4921772Z npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4922127Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4922373Z npm error   --foreground-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4922783Z npm error     Run all build scripts (ie, `preinstall`, `install`, and
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4923134Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4923360Z npm error   --ignore-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4924082Z npm error     If true, npm does not run scripts specified in package.json files.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4924465Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4924686Z npm error   --allow-directory
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4925148Z npm error     Limits the ability for npm to install dependencies from directories.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4925807Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4926027Z npm error   --allow-file
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4926473Z npm error     Limits the ability for npm to install dependencies from tarball files.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4926864Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4927081Z npm error   --allow-git
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4927523Z npm error     Limits the ability for npm to fetch dependencies from git references.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4927911Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4928126Z npm error   --allow-remote
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4928537Z npm error     Limits the ability for npm to fetch dependencies from urls.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4928908Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4929128Z npm error   --allow-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4929583Z npm error     Comma-separated list of packages whose install-time lifecycle scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4929972Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4930219Z npm error   --strict-allow-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4930712Z npm error     If `true`, turn the install-script policy from a warning into a hard
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4931194Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4931464Z npm error   --dangerously-allow-all-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4931958Z npm error     If `true`, bypass the `allowScripts` policy entirely and run every
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4932327Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4932533Z npm error   --audit
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4932974Z npm error     When "true" submit audit reports alongside the current npm command to the
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4933381Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4933606Z npm error   --bin-links
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4934277Z npm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4934821Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4935031Z npm error   --fund
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4935450Z npm error     When "true" displays the message at the end of each `npm install`
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4935823Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4936034Z npm error   --dry-run
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4936484Z npm error     Indicates that you don't want npm to make any changes and that it should
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4936892Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4937119Z npm error   -w|--workspace
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4937591Z npm error     Enable running a command in the context of the configured workspaces of the
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4938004Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4938220Z npm error   --workspaces
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4938651Z npm error     Set to true to run the command in the context of **all** configured
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4939034Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4939294Z npm error   --include-workspace-root
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4939783Z npm error     Include the workspace root when workspaces are enabled for a command.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4940169Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4940394Z npm error   --install-links
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4940864Z npm error     When set file: protocol dependencies will be packed and installed as
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4941249Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4941437Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4941789Z npm error aliases: clean-install, ic, install-clean, isntall-clean
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4942154Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4942403Z npm error Run "npm help ci" for more info
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.4943017Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-11T16_07_54_549Z-debug-0.log
performance (node 24, advisory)	Install locked dependencies	2026-08-11T16:07:56.5325473Z ##[error]Process completed with exit code 1.
performance (node 24, advisory)	Upload benchmark report	﻿2026-08-11T16:07:56.5410918Z Node 20 is being deprecated. This workflow is running with Node 24 by default. If you need to temporarily use Node 20, you can set the ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true environment variable. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:56.5412156Z ##[group]Run actions/upload-artifact@v4
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:56.5412444Z with:
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:56.5412664Z   name: motion5-benchmark-report
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:56.5412963Z   path: performance/benchmark-report.json
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:56.5413261Z   if-no-files-found: error
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:56.5413517Z   compression-level: 6
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:56.5413953Z   overwrite: false
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:56.5414198Z   include-hidden-files: false
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:56.5414452Z ##[endgroup]
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:56.7065144Z (node:2432) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:56.7066026Z (Use `node --trace-deprecation ...` to show where the warning was created)
performance (node 24, advisory)	Upload benchmark report	2026-08-11T16:07:56.7097116Z ##[error]No files were found with the provided path: performance/benchmark-report.json. No artifacts will be uploaded.
integration (node 24)	Install locked dependencies	﻿2026-08-11T16:07:28.5953900Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
integration (node 24)	Install locked dependencies	2026-08-11T16:07:28.5954496Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
integration (node 24)	Install locked dependencies	2026-08-11T16:07:28.6016502Z shell: /usr/bin/bash -e {0}
integration (node 24)	Install locked dependencies	2026-08-11T16:07:28.6016869Z ##[endgroup]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9448318Z npm error code EUSAGE
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9499971Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9501594Z npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9502646Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9503138Z npm error Missing: @types/node@24.3.0 from lock file
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9503855Z npm error Missing: undici-types@7.10.0 from lock file
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9504391Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9504804Z npm error Clean install a project
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9505419Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9505733Z npm error Usage:
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9506071Z npm error npm ci
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9506406Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9506914Z npm error Options:
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9507677Z npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9508541Z npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9509213Z npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9509840Z npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9510453Z npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9511021Z npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9511967Z npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9512641Z npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9513229Z npm error [--no-bin-links] [--no-fund] [--dry-run]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9513767Z npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9514350Z npm error [--workspaces] [--include-workspace-root] [--install-links]
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9514727Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9515005Z npm error   --install-strategy
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9515889Z npm error     Sets the strategy for installing packages in node_modules.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9516283Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9516530Z npm error   --legacy-bundling
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9517066Z npm error     Instead of hoisting package installs in `node_modules`, install packages
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9517496Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9517720Z npm error   --global-style
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9518178Z npm error     Only install direct dependencies in the top level `node_modules`,
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9518578Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9518792Z npm error   --omit
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9519199Z npm error     Dependency types to omit from the installation tree on disk.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9519580Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9519800Z npm error   --include
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9520260Z npm error     Option that allows for defining which types of dependencies to install.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9520680Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9520952Z npm error   --strict-peer-deps
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9521522Z npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9521899Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9522153Z npm error   --foreground-scripts
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9522576Z npm error     Run all build scripts (ie, `preinstall`, `install`, and
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9522942Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9523170Z npm error   --ignore-scripts
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9523626Z npm error     If true, npm does not run scripts specified in package.json files.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9524004Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9524230Z npm error   --allow-directory
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9524697Z npm error     Limits the ability for npm to install dependencies from directories.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9525498Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9525723Z npm error   --allow-file
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9526186Z npm error     Limits the ability for npm to install dependencies from tarball files.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9526590Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9526818Z npm error   --allow-git
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9527264Z npm error     Limits the ability for npm to fetch dependencies from git references.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9527671Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9527899Z npm error   --allow-remote
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9528324Z npm error     Limits the ability for npm to fetch dependencies from urls.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9528705Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9528937Z npm error   --allow-scripts
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9529427Z npm error     Comma-separated list of packages whose install-time lifecycle scripts
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9529841Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9530109Z npm error   --strict-allow-scripts
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9530584Z npm error     If `true`, turn the install-script policy from a warning into a hard
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9530982Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9531257Z npm error   --dangerously-allow-all-scripts
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9531754Z npm error     If `true`, bypass the `allowScripts` policy entirely and run every
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9532143Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9532365Z npm error   --audit
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9532825Z npm error     When "true" submit audit reports alongside the current npm command to the
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9533239Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9533460Z npm error   --bin-links
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9533917Z npm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9534304Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9534674Z npm error   --fund
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9535092Z npm error     When "true" displays the message at the end of each `npm install`
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9535662Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9535879Z npm error   --dry-run
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9536337Z npm error     Indicates that you don't want npm to make any changes and that it should
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9536748Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9536978Z npm error   -w|--workspace
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9537467Z npm error     Enable running a command in the context of the configured workspaces of the
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9537885Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9538107Z npm error   --workspaces
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9538557Z npm error     Set to true to run the command in the context of **all** configured
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9538948Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9539225Z npm error   --include-workspace-root
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9539724Z npm error     Include the workspace root when workspaces are enabled for a command.
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9540116Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9540384Z npm error   --install-links
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9540932Z npm error     When set file: protocol dependencies will be packed and installed as
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9541330Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9541527Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9541890Z npm error aliases: clean-install, ic, install-clean, isntall-clean
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9542258Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9542523Z npm error Run "npm help ci" for more info
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9543192Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-11T16_07_28_665Z-debug-0.log
integration (node 24)	Install locked dependencies	2026-08-11T16:07:30.9937736Z ##[error]Process completed with exit code 1.
```
