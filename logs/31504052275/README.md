# CI log archive: 31504052275

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31504052275
- Captured: 2026-08-11T15:58:15Z

Detailed failed-job output: [failed-jobs.log](./failed-jobs.log)
Job and step outcomes: [jobs.json](./jobs.json)

## Job outcomes

- boundaries (node 24): success
- quality (node 24): failure — failed steps: Typecheck (failure)
- integration (node 24): success
- performance (node 24, advisory): success

## Failed job output

```text
quality (node 24)	UNKNOWN STEP	﻿2026-08-11T14:53:47.0871701Z Current runner version: '2.336.0'
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0896060Z ##[group]Runner Image Provisioner
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0897057Z Hosted Compute Agent
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0897699Z Version: 20260707.563
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0898319Z Commit: 02667638d2b423fbc733a8e32a88b44996a3ba6e
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0899089Z Build Date: 2026-07-07T19:33:50Z
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0899780Z Worker ID: {60079b69-ac75-4b03-ae37-87b1591c8de3}
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0900477Z Azure Region: westus
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0901154Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0902869Z ##[group]Operating System
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0903659Z Ubuntu
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0904196Z 24.04.4
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0904702Z LTS
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0905297Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0905846Z ##[group]Runner Image
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0906420Z Image: ubuntu-24.04
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0907037Z Version: 20260720.247.2
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0908225Z Included Software: https://github.com/actions/runner-images/blob/ubuntu24/20260720.247/images/ubuntu/Ubuntu2404-Readme.md
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0909815Z Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu24%2F20260720.247
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0910746Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0911927Z ##[group]GITHUB_TOKEN Permissions
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0913999Z Contents: read
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0914729Z Metadata: read
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0915288Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0917653Z Secret source: Actions
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.0918822Z Prepare workflow directory
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.1245105Z Prepare all required actions
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.1296511Z Getting action download info
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:47.5143102Z Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.0081082Z Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.2691833Z Complete job name: quality (node 24)
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3445779Z Node 20 is being deprecated. This workflow is running with Node 24 by default. If you need to temporarily use Node 20, you can set the ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true environment variable. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3454713Z ##[group]Run actions/checkout@v4
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3455450Z with:
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3455886Z   repository: chahyasantoso/motion5
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3459708Z   token: ***
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3460134Z   ssh-strict: true
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3460565Z   ssh-user: git
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3460999Z   persist-credentials: true
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3461475Z   clean: true
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3461907Z   sparse-checkout-cone-mode: true
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3462404Z   fetch-depth: 1
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3463119Z   fetch-tags: false
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3463615Z   show-progress: true
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3464109Z   lfs: false
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3464552Z   submodules: false
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3464993Z   set-safe-directory: true
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3465488Z   allow-unsafe-pr-checkout: false
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.3466274Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4441757Z Syncing repository: chahyasantoso/motion5
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4444522Z ##[group]Getting Git version info
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4445638Z Working directory is '/home/runner/work/motion5/motion5'
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4447231Z [command]/usr/bin/git version
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4520432Z git version 2.54.0
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4543587Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4560310Z Temporarily overriding HOME='/home/runner/work/_temp/a31628fc-bf21-432a-8a3f-2401001a0a88' before making global git config changes
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4562992Z Adding repository directory to the temporary git global config as a safe directory
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4566618Z [command]/usr/bin/git config --global --add safe.directory /home/runner/work/motion5/motion5
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4623058Z Deleting the contents of '/home/runner/work/motion5/motion5'
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4633077Z ##[group]Initializing the repository
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4634339Z [command]/usr/bin/git init /home/runner/work/motion5/motion5
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4746216Z hint: Using 'master' as the name for the initial branch. This default branch name
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4747734Z hint: will change to "main" in Git 3.0. To configure the initial branch name
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4748709Z hint: to use in all of your new repositories, which will suppress this warning,
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4749466Z hint: call:
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4749881Z hint:
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4750421Z hint: 	git config --global init.defaultBranch <name>
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4751067Z hint:
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4751677Z hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4753028Z hint: 'development'. The just-created branch can be renamed via this command:
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4753867Z hint:
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4754305Z hint: 	git branch -m <name>
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4754811Z hint:
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4755508Z hint: Disable this message with "git config set advice.defaultBranchName false"
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4761678Z Initialized empty Git repository in /home/runner/work/motion5/motion5/.git/
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4773821Z [command]/usr/bin/git remote add origin https://github.com/chahyasantoso/motion5
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4851191Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4852364Z ##[group]Disabling automatic garbage collection
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4855386Z [command]/usr/bin/git config --local gc.auto 0
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4888419Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4889768Z ##[group]Setting up auth
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4895392Z [command]/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.4947473Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.5315732Z [command]/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.5355262Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.5579419Z [command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\.gitdir:
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.5615188Z [command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.5837883Z [command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.5878100Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.5879588Z ##[group]Fetching the repository
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:48.5890017Z [command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +8333cbc7d2ce475e91f7c664cf790df0018bca94:refs/remotes/origin/fix/C2-react-public-surface
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.1733975Z From https://github.com/chahyasantoso/motion5
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.1735877Z  * [new ref]         8333cbc7d2ce475e91f7c664cf790df0018bca94 -> origin/fix/C2-react-public-surface
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.1785955Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.1788114Z ##[group]Determining the checkout info
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.1790807Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.1792194Z [command]/usr/bin/git sparse-checkout disable
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.1835479Z [command]/usr/bin/git config --local --unset-all extensions.worktreeConfig
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.1869993Z ##[group]Checking out the ref
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.1874164Z [command]/usr/bin/git checkout --progress --force -B fix/C2-react-public-surface refs/remotes/origin/fix/C2-react-public-surface
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.2000942Z Switched to a new branch 'fix/C2-react-public-surface'
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.2006690Z branch 'fix/C2-react-public-surface' set up to track 'origin/fix/C2-react-public-surface'.
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.2017075Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.2059304Z [command]/usr/bin/git log -1 --format=%H
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.2087196Z 8333cbc7d2ce475e91f7c664cf790df0018bca94
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.2508644Z Node 20 is being deprecated. This workflow is running with Node 24 by default. If you need to temporarily use Node 20, you can set the ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true environment variable. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.2514926Z ##[group]Run actions/setup-node@v4
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.2516000Z with:
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.2516762Z   node-version: 24
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.2517603Z   cache: npm
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.2518419Z   always-auth: false
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.2519311Z   check-latest: false
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.2530061Z   token: ***
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.2530876Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.4038409Z Found in cache @ /opt/hostedtoolcache/node/24.18.0/x64
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.4042932Z (node:2168) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.4046970Z (Use `node --trace-deprecation ...` to show where the warning was created)
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:49.4049482Z ##[group]Environment details
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:54.1857375Z node: v24.18.0
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:54.1858083Z npm: 11.16.0
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:54.1858669Z yarn: 1.22.22
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:54.1860635Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:54.1903605Z [command]/opt/hostedtoolcache/node/24.18.0/x64/bin/npm config get cache
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:54.5830861Z /home/runner/.npm
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:54.9057447Z Cache hit for: node-cache-Linux-x64-npm-ba50ea521bc1b83c7c3f4a5c6ad3f21f6eb233088e33284689971c45031b5af1
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:54.9171301Z (node:2168) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:56.1889085Z Received 5618665 of 22395881 (25.1%), 5.4 MBs/sec
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:56.4101776Z Received 22395881 of 22395881 (100.0%), 17.5 MBs/sec
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:56.4102933Z Cache Size: ~21 MB (22395881 B)
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:56.4132432Z [command]/usr/bin/tar -xf /home/runner/work/_temp/140e312a-0330-4d02-b699-a4cc5c6a1dad/cache.tzst -P -C /home/runner/work/motion5/motion5 --use-compress-program unzstd
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:56.4620556Z Cache restored successfully
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:56.4635454Z Cache restored from key: node-cache-Linux-x64-npm-ba50ea521bc1b83c7c3f4a5c6ad3f21f6eb233088e33284689971c45031b5af1
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:56.4857286Z ##[group]Run npm ci --ignore-scripts --no-audit --no-fund
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:56.4857830Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund^[[0m
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:56.4981337Z shell: /usr/bin/bash -e {0}
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:56.4981655Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:59.5388232Z 
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:59.5398109Z added 56 packages in 3s
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:59.5874056Z ##[group]Run npm run format:check
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:59.5874407Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:59.5921851Z shell: /usr/bin/bash -e {0}
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:59.5922153Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:59.6962170Z 
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:59.6962769Z > motion5@0.0.0 format:check
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:59.6963714Z > prettier . --check
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:59.6963941Z 
quality (node 24)	UNKNOWN STEP	2026-08-11T14:53:59.8317111Z Checking formatting...
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:01.7005894Z All matched files use Prettier code style!
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:01.7480309Z ##[group]Run npm run typecheck
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:01.7480650Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:01.7526438Z shell: /usr/bin/bash -e {0}
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:01.7526761Z ##[endgroup]
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:01.8483308Z 
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:01.8483930Z > motion5@0.0.0 typecheck
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:01.8484467Z > tsc --noEmit -p tsconfig.json
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:01.8484745Z 
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.3156711Z ##[error]packages/react/test/public-hook-render.test.ts(30,39): error TS2769: No overload matches this call.
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.3166750Z   The last overload gave the following error.
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.3167950Z     Argument of type '() => unknown' is not assignable to parameter of type 'string | FunctionComponent<{}> | ComponentClass<{}, any>'.
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.3169522Z       Type '() => unknown' is not assignable to type 'FunctionComponent<{}>'.
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.3170429Z         Type 'unknown' is not assignable to type 'ReactNode | Promise<ReactNode>'.
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.3426534Z ##[error]Process completed with exit code 2.
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.3575500Z Node 20 is being deprecated. This workflow is running with Node 24 by default. If you need to temporarily use Node 20, you can set the ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true environment variable. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.3576744Z Post job cleanup.
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.4425353Z [command]/usr/bin/git version
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.4468596Z git version 2.54.0
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.4540026Z Temporarily overriding HOME='/home/runner/work/_temp/f3e571f7-6ef2-4636-b50f-6f7c78ef56f5' before making global git config changes
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.4541629Z Adding repository directory to the temporary git global config as a safe directory
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.4545291Z [command]/usr/bin/git config --global --add safe.directory /home/runner/work/motion5/motion5
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.4582789Z [command]/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.4623678Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.4870404Z [command]/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.4897775Z http.https://github.com/.extraheader
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.4909869Z [command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.4945229Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.5211807Z [command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\.gitdir:
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.5255886Z [command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.5651647Z Cleaning up orphan processes
quality (node 24)	UNKNOWN STEP	2026-08-11T14:54:03.5925732Z ##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
```
