# CI log archive: 31498110390

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31498110390
- Captured: 2026-08-11T13:49:08Z

## Failed job output

```text
performance (node 24, advisory)	Install locked dependencies	﻿2026-08-11T13:48:37.1908760Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:37.1909177Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:37.1960083Z shell: /usr/bin/bash -e {0}
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:37.1960334Z ##[endgroup]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2405917Z npm error code EUSAGE
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2444017Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2445244Z npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2446227Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2446600Z npm error Missing: react@19.2.8 from lock file
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2447279Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2447687Z npm error Clean install a project
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2448016Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2448252Z npm error Usage:
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2448518Z npm error npm ci
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2448762Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2449028Z npm error Options:
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2449592Z npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2450181Z npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2450711Z npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2451222Z npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2451682Z npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2452135Z npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2452828Z npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2453534Z npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2454207Z npm error [--no-bin-links] [--no-fund] [--dry-run]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2454936Z npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2455670Z npm error [--workspaces] [--include-workspace-root] [--install-links]
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2456119Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2456440Z npm error   --install-strategy
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2456840Z npm error     Sets the strategy for installing packages in node_modules.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2457154Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2457371Z npm error   --legacy-bundling
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2457753Z npm error     Instead of hoisting package installs in `node_modules`, install packages
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2458118Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2458322Z npm error   --global-style
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2458687Z npm error     Only install direct dependencies in the top level `node_modules`,
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2459003Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2459178Z npm error   --omit
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2459500Z npm error     Dependency types to omit from the installation tree on disk.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2459805Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2459980Z npm error   --include
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2460334Z npm error     Option that allows for defining which types of dependencies to install.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2460653Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2460859Z npm error   --strict-peer-deps
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2461213Z npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2461503Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2461704Z npm error   --foreground-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2462040Z npm error     Run all build scripts (ie, `preinstall`, `install`, and
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2462331Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2462669Z npm error   --ignore-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2463077Z npm error     If true, npm does not run scripts specified in package.json files.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2463392Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2463575Z npm error   --allow-directory
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2463971Z npm error     Limits the ability for npm to install dependencies from directories.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2464281Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2464455Z npm error   --allow-file
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2465008Z npm error     Limits the ability for npm to install dependencies from tarball files.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2465320Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2465497Z npm error   --allow-git
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2465845Z npm error     Limits the ability for npm to fetch dependencies from git references.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2466153Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2466341Z npm error   --allow-remote
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2466671Z npm error     Limits the ability for npm to fetch dependencies from urls.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2466960Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2467141Z npm error   --allow-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2467517Z npm error     Comma-separated list of packages whose install-time lifecycle scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2467952Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2468160Z npm error   --strict-allow-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2468528Z npm error     If `true`, turn the install-script policy from a warning into a hard
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2468849Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2469136Z npm error   --dangerously-allow-all-scripts
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2469532Z npm error     If `true`, bypass the `allowScripts` policy entirely and run every
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2469827Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2470002Z npm error   --audit
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2470364Z npm error     When "true" submit audit reports alongside the current npm command to the
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2470693Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2470870Z npm error   --bin-links
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2471224Z npm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2471546Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2471725Z npm error   --fund
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2472064Z npm error     When "true" displays the message at the end of each `npm install`
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2472476Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2472659Z npm error   --dry-run
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2473029Z npm error     Indicates that you don't want npm to make any changes and that it should
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2473353Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2473543Z npm error   -w|--workspace
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2473927Z npm error     Enable running a command in the context of the configured workspaces of the
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2474259Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2474450Z npm error   --workspaces
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2474798Z npm error     Set to true to run the command in the context of **all** configured
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2475107Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2475317Z npm error   --include-workspace-root
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2475703Z npm error     Include the workspace root when workspaces are enabled for a command.
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2476027Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2476214Z npm error   --install-links
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2476585Z npm error     When set file: protocol dependencies will be packed and installed as
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2476895Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2477061Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2477346Z npm error aliases: clean-install, ic, install-clean, isntall-clean
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2477630Z npm error
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2477841Z npm error Run "npm help ci" for more info
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2478340Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-11T13_48_37_243Z-debug-0.log
performance (node 24, advisory)	Install locked dependencies	2026-08-11T13:48:38.2765107Z ##[error]Process completed with exit code 1.
performance (node 24, advisory)	Upload benchmark report	﻿2026-08-11T13:48:38.2834299Z Node 20 is being deprecated. This workflow is running with Node 24 by default. If you need to temporarily use Node 20, you can set the ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true environment variable. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:38.2835273Z ##[group]Run actions/upload-artifact@v4
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:38.2835509Z with:
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:38.2835684Z   name: motion5-benchmark-report
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:38.2835910Z   path: performance/benchmark-report.json
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:38.2836140Z   if-no-files-found: error
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:38.2836344Z   compression-level: 6
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:38.2836523Z   overwrite: false
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:38.2836703Z   include-hidden-files: false
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:38.2836907Z ##[endgroup]
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:38.4112790Z (node:2220) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:38.4113574Z (Use `node --trace-deprecation ...` to show where the warning was created)
performance (node 24, advisory)	Upload benchmark report	2026-08-11T13:48:38.4136808Z ##[error]No files were found with the provided path: performance/benchmark-report.json. No artifacts will be uploaded.
boundaries (node 24)	Install locked dependencies	﻿2026-08-11T13:48:46.6471983Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:46.6472507Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:46.6559014Z shell: /usr/bin/bash -e {0}
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:46.6559591Z ##[endgroup]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4831253Z npm error code EUSAGE
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4894706Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4896215Z npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4896953Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4897242Z npm error Missing: react@19.2.8 from lock file
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4897522Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4898064Z npm error Clean install a project
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4898336Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4898548Z npm error Usage:
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4898758Z npm error npm ci
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4898959Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4899340Z npm error Options:
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4899860Z npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4900570Z npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4901211Z npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4901801Z npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4902358Z npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4902898Z npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4903446Z npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4904056Z npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4904538Z npm error [--no-bin-links] [--no-fund] [--dry-run]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4905031Z npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4905571Z npm error [--workspaces] [--include-workspace-root] [--install-links]
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4905916Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4906167Z npm error   --install-strategy
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4906575Z npm error     Sets the strategy for installing packages in node_modules.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4906972Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4907326Z npm error   --legacy-bundling
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4908034Z npm error     Instead of hoisting package installs in `node_modules`, install packages
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4908437Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4908650Z npm error   --global-style
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4909074Z npm error     Only install direct dependencies in the top level `node_modules`,
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4909554Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4909762Z npm error   --omit
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4910154Z npm error     Dependency types to omit from the installation tree on disk.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4910512Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4910718Z npm error   --include
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4911192Z npm error     Option that allows for defining which types of dependencies to install.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4911581Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4911819Z npm error   --strict-peer-deps
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4912247Z npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4912599Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4912841Z npm error   --foreground-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4913255Z npm error     Run all build scripts (ie, `preinstall`, `install`, and
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4913589Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4913813Z npm error   --ignore-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4914241Z npm error     If true, npm does not run scripts specified in package.json files.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4914616Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4914835Z npm error   --allow-directory
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4915279Z npm error     Limits the ability for npm to install dependencies from directories.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4915651Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4915860Z npm error   --allow-file
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4916614Z npm error     Limits the ability for npm to install dependencies from tarball files.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4917186Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4917527Z npm error   --allow-git
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4918481Z npm error     Limits the ability for npm to fetch dependencies from git references.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4918921Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4919148Z npm error   --allow-remote
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4919730Z npm error     Limits the ability for npm to fetch dependencies from urls.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4920088Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4920300Z npm error   --allow-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4920754Z npm error     Comma-separated list of packages whose install-time lifecycle scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4921262Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4921509Z npm error   --strict-allow-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4921965Z npm error     If `true`, turn the install-script policy from a warning into a hard
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4922358Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4922637Z npm error   --dangerously-allow-all-scripts
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4923141Z npm error     If `true`, bypass the `allowScripts` policy entirely and run every
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4923601Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4923803Z npm error   --audit
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4924235Z npm error     When "true" submit audit reports alongside the current npm command to the
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4924613Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4924814Z npm error   --bin-links
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4925244Z npm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4925604Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4925800Z npm error   --fund
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4926196Z npm error     When "true" displays the message at the end of each `npm install`
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4926555Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4926769Z npm error   --dry-run
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4927203Z npm error     Indicates that you don't want npm to make any changes and that it should
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4927586Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4927795Z npm error   -w|--workspace
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4928261Z npm error     Enable running a command in the context of the configured workspaces of the
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4928665Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4928873Z npm error   --workspaces
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4929415Z npm error     Set to true to run the command in the context of **all** configured
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4929776Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4930063Z npm error   --include-workspace-root
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4930537Z npm error     Include the workspace root when workspaces are enabled for a command.
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4930916Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4931130Z npm error   --install-links
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4931569Z npm error     When set file: protocol dependencies will be packed and installed as
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4931942Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4932130Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4932683Z npm error aliases: clean-install, ic, install-clean, isntall-clean
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4933122Z npm error
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4933380Z npm error Run "npm help ci" for more info
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.4933972Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-11T13_48_46_712Z-debug-0.log
boundaries (node 24)	Install locked dependencies	2026-08-11T13:48:48.5119856Z ##[error]Process completed with exit code 1.
integration (node 24)	Install locked dependencies	﻿2026-08-11T13:48:41.7932357Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
integration (node 24)	Install locked dependencies	2026-08-11T13:48:41.7934604Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
integration (node 24)	Install locked dependencies	2026-08-11T13:48:41.8232093Z shell: /usr/bin/bash -e {0}
integration (node 24)	Install locked dependencies	2026-08-11T13:48:41.8233297Z ##[endgroup]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5891541Z npm error code EUSAGE
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5963804Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5967718Z npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5971106Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5972264Z npm error Missing: react@19.2.8 from lock file
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5973807Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5974867Z npm error Clean install a project
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5976051Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5977647Z npm error Usage:
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5978651Z npm error npm ci
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5979605Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5980628Z npm error Options:
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5982539Z npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5985795Z npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5989001Z npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5992489Z npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5995194Z npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5997463Z npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.5999757Z npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6002225Z npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6004540Z npm error [--no-bin-links] [--no-fund] [--dry-run]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6006560Z npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6008854Z npm error [--workspaces] [--include-workspace-root] [--install-links]
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6010442Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6011446Z npm error   --install-strategy
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6013176Z npm error     Sets the strategy for installing packages in node_modules.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6015639Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6017074Z npm error   --legacy-bundling
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6019592Z npm error     Instead of hoisting package installs in `node_modules`, install packages
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6021583Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6022494Z npm error   --global-style
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6024415Z npm error     Only install direct dependencies in the top level `node_modules`,
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6026118Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6027003Z npm error   --omit
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6028541Z npm error     Dependency types to omit from the installation tree on disk.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6030182Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6031083Z npm error   --include
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6032787Z npm error     Option that allows for defining which types of dependencies to install.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6034733Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6035708Z npm error   --strict-peer-deps
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6037363Z npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6039012Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6040009Z npm error   --foreground-scripts
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6041601Z npm error     Run all build scripts (ie, `preinstall`, `install`, and
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6043129Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6044148Z npm error   --ignore-scripts
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6045845Z npm error     If true, npm does not run scripts specified in package.json files.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6047509Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6048433Z npm error   --allow-directory
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6050201Z npm error     Limits the ability for npm to install dependencies from directories.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6051922Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6052824Z npm error   --allow-file
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6055020Z npm error     Limits the ability for npm to install dependencies from tarball files.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6056782Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6057681Z npm error   --allow-git
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6059371Z npm error     Limits the ability for npm to fetch dependencies from git references.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6061105Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6062009Z npm error   --allow-remote
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6063803Z npm error     Limits the ability for npm to fetch dependencies from urls.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6065410Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6066348Z npm error   --allow-scripts
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6068096Z npm error     Comma-separated list of packages whose install-time lifecycle scripts
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6069850Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6070822Z npm error   --strict-allow-scripts
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6072769Z npm error     If `true`, turn the install-script policy from a warning into a hard
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6074580Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6075845Z npm error   --dangerously-allow-all-scripts
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6077721Z npm error     If `true`, bypass the `allowScripts` policy entirely and run every
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6079362Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6080244Z npm error   --audit
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6081908Z npm error     When "true" submit audit reports alongside the current npm command to the
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6083863Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6084767Z npm error   --bin-links
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6086416Z npm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6088108Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6088992Z npm error   --fund
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6090520Z npm error     When "true" displays the message at the end of each `npm install`
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6092169Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6093051Z npm error   --dry-run
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6094921Z npm error     Indicates that you don't want npm to make any changes and that it should
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6096657Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6097566Z npm error   -w|--workspace
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6099409Z npm error     Enable running a command in the context of the configured workspaces of the
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6101232Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6102157Z npm error   --workspaces
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6104013Z npm error     Set to true to run the command in the context of **all** configured
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6105682Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6106710Z npm error   --include-workspace-root
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6108566Z npm error     Include the workspace root when workspaces are enabled for a command.
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6110305Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6111259Z npm error   --install-links
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6113044Z npm error     When set file: protocol dependencies will be packed and installed as
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6114884Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6115782Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6117178Z npm error aliases: clean-install, ic, install-clean, isntall-clean
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6118728Z npm error
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6119786Z npm error Run "npm help ci" for more info
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6122200Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-11T13_48_41_887Z-debug-0.log
integration (node 24)	Install locked dependencies	2026-08-11T13:48:42.6379424Z ##[error]Process completed with exit code 1.
quality (node 24)	Install locked dependencies	﻿2026-08-11T13:48:39.5145336Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
quality (node 24)	Install locked dependencies	2026-08-11T13:48:39.5145906Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
quality (node 24)	Install locked dependencies	2026-08-11T13:48:39.5251066Z shell: /usr/bin/bash -e {0}
quality (node 24)	Install locked dependencies	2026-08-11T13:48:39.5251517Z ##[endgroup]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3895707Z npm error code EUSAGE
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3961058Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3962929Z npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3964697Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3965329Z npm error Missing: react@19.2.8 from lock file
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3965890Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3966400Z npm error Clean install a project
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3966935Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3967808Z npm error Usage:
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3968224Z npm error npm ci
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3968625Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3969038Z npm error Options:
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3969981Z npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3971552Z npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3972906Z npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3974415Z npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3975631Z npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3976815Z npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3978028Z npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3979300Z npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3980345Z npm error [--no-bin-links] [--no-fund] [--dry-run]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3981398Z npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3982569Z npm error [--workspaces] [--include-workspace-root] [--install-links]
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3983244Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3983943Z npm error   --install-strategy
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3984785Z npm error     Sets the strategy for installing packages in node_modules.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3985525Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3985953Z npm error   --legacy-bundling
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3986885Z npm error     Instead of hoisting package installs in `node_modules`, install packages
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3987669Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3988067Z npm error   --global-style
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3988901Z npm error     Only install direct dependencies in the top level `node_modules`,
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3989633Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3990008Z npm error   --omit
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3990778Z npm error     Dependency types to omit from the installation tree on disk.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3991514Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3991893Z npm error   --include
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3992762Z npm error     Option that allows for defining which types of dependencies to install.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3993523Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3994260Z npm error   --strict-peer-deps
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3995119Z npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3995820Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3996283Z npm error   --foreground-scripts
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3997063Z npm error     Run all build scripts (ie, `preinstall`, `install`, and
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3997712Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3998122Z npm error   --ignore-scripts
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3998943Z npm error     If true, npm does not run scripts specified in package.json files.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.3999665Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4000068Z npm error   --allow-directory
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4000953Z npm error     Limits the ability for npm to install dependencies from directories.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4001687Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4002074Z npm error   --allow-file
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4003171Z npm error     Limits the ability for npm to install dependencies from tarball files.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4004154Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4004547Z npm error   --allow-git
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4005375Z npm error     Limits the ability for npm to fetch dependencies from git references.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4006108Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4006502Z npm error   --allow-remote
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4007269Z npm error     Limits the ability for npm to fetch dependencies from urls.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4007941Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4008336Z npm error   --allow-scripts
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4009226Z npm error     Comma-separated list of packages whose install-time lifecycle scripts
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4009987Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4010442Z npm error   --strict-allow-scripts
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4011497Z npm error     If `true`, turn the install-script policy from a warning into a hard
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4012274Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4012870Z npm error   --dangerously-allow-all-scripts
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4014062Z npm error     If `true`, bypass the `allowScripts` policy entirely and run every
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4014805Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4015189Z npm error   --audit
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4016034Z npm error     When "true" submit audit reports alongside the current npm command to the
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4016801Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4017186Z npm error   --bin-links
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4018024Z npm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4018777Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4019150Z npm error   --fund
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4019920Z npm error     When "true" displays the message at the end of each `npm install`
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4020630Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4021017Z npm error   --dry-run
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4021867Z npm error     Indicates that you don't want npm to make any changes and that it should
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4022641Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4023044Z npm error   -w|--workspace
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4024158Z npm error     Enable running a command in the context of the configured workspaces of the
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4024975Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4025374Z npm error   --workspaces
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4026182Z npm error     Set to true to run the command in the context of **all** configured
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4026879Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4027352Z npm error   --include-workspace-root
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4028279Z npm error     Include the workspace root when workspaces are enabled for a command.
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4029113Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4029517Z npm error   --install-links
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4030366Z npm error     When set file: protocol dependencies will be packed and installed as
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4031182Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4031536Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4032198Z npm error aliases: clean-install, ic, install-clean, isntall-clean
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4032862Z npm error
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4033338Z npm error Run "npm help ci" for more info
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4034781Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-11T13_48_39_587Z-debug-0.log
quality (node 24)	Install locked dependencies	2026-08-11T13:48:41.4398805Z ##[error]Process completed with exit code 1.
```
