export const cleanFixture = "export const value = 1;";
export const rendererViolationFixture = "import React from 'react';";
export const engineViolationFixture = "import gsap from 'gsap';";
export const consumerInternalViolationFixture =
  "import type { Patch } from '../../core/src/runtime/patch-registry';";
export const bannedSymbolFixture = "const compatibilityFacade = true;";
export const publicExportViolationFixture = "export const InternalGraphRuntime = 1;";
export const appCoreInternalViolationFixture =
  "import type { Track } from '../../../packages/core/src/domain/track';";
export const testingEntrypointViolationFixture =
  "import { createFakeScheduler } from '@motion5/core/testing';";
export const testingSourcePathViolationFixture =
  "import { createFakeScheduler } from '../../core/src/testing/fakes';";
export const coreEntrypointFixture = "import { Engine } from '@motion5/core';";
export const pluginEntrypointFixture = "import { fkPlugin } from '@motion5/core/plugins/fk';";
export const adapterEntrypointFixture =
  "import { createBrowserClock } from '@motion5/core/adapters/browser-clock';";
