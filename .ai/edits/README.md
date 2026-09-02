# AI edit requests

Drop one request file here, named `<something>.json`, and push it. The **AI edit** workflow applies it, formats what it touched, commits, removes the request, and comments the result back.

The contract is `docs/AI-EDIT-WORKFLOW.md`. Read it before writing a request.

One request per push. The workflow reads the request from the paths your commit added or modified, not from whatever this directory holds, so a push carrying two requests is refused rather than one of them being chosen for you. A refused request stays here: correct that same file and push it again.

This directory is normally empty, and it is covered by `.prettierignore` so that a hand-written request cannot fail `format:check` before it is applied. This file exists to keep the directory in the repository.
