export const cleanFixture = "export const value = 1;";
export const rendererViolationFixture = "import React from 'react';";
export const engineViolationFixture = "import gsap from 'gsap';";
export const consumerInternalViolationFixture =
  "import type { Patch } from '../../core/src/runtime/patch-registry';";
export const appInternalViolationFixture =
  "import { createFakeScheduler } from '../../core/src/domain/track';";
export const testingEntrypointViolationFixture =
  "import { createFakeScheduler } from '@motion5/core/testing';";
export const bannedSymbolFixture = "const compatibilityFacade = true;";
export const publicExportViolationFixture = "export const InternalGraphRuntime = 1;";
