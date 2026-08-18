# motion5 user guide

This directory is written for someone using motion5. Everything else under `docs/` is written for someone building it.

The guide documents the surface the package declares in its `exports` map and nothing else. If a symbol or subpath is not listed here, treat it as internal even when a workspace checkout lets you import it through a source path.

## Read in this order

1. [Getting started](./getting-started.md): supply the three ports, load a project, drive it, tear it down.
2. [Triggers](./triggers.md): `time`, `scroll`, and `manual`, and which one accepts which control call.
3. [Rendering patches](./rendering-patches.md): the DOM adapter, the React hook, and writing your own consumer.
4. [Runtime changes](./runtime-changes.md): adding and removing motions and tracks on a live project.
5. [Errors and diagnostics](./errors-and-diagnostics.md): what rejects, what warns, and what throws where.
6. [API reference](./api-reference.md): every public export, grouped by the entrypoint that ships it.

## What this guide is not

The authored input contract is normative in [AUTHORED-SCHEMA.md](../AUTHORED-SCHEMA.md). This guide shows how to drive that input and does not restate its field rules. Where the two disagree, the schema document wins and the guide is the bug.

Phase plans, audits, implementation contracts, and decision records live one directory up. They explain how motion5 is built and why. You do not need any of them to use it.

## Status of this guide

Written against `feat/adopt-motion-track`. The runtime mutation model, the trigger drivers, and compiled Track ownership have all landed; [SESSION-STATUS.md](../SESSION-STATUS.md) is the only document allowed to claim what is true today, so check it before trusting a claim here about what is finished.

Three gaps are real and are called out where they bite rather than papered over: no `Scheduler` implementation ships, the `Clock` and `Scheduler` types are not exported, and neither package is published. See [the gaps section of the API reference](./api-reference.md#known-gaps).
