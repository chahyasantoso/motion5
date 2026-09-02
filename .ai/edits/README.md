# AI edit requests

Drop one request file here, named `<something>.json`, and push it. The **AI edit** workflow applies it, formats what it touched, commits, removes the request, and comments the result back.

The contract is `docs/AI-EDIT-WORKFLOW.md`. Read it before writing a request.

One request at a time. The workflow applies the first file this directory lists, not the file your push added, so if a second request is waiting here yours is not the one that runs.

This directory is normally empty, and it is covered by `.prettierignore` so that a hand-written request cannot fail `format:check` before it is applied. This file exists to keep the directory in the repository.
