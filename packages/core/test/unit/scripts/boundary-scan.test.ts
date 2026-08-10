import { describe, expect, it } from "vitest";
import {
  bannedSymbolFixture,
  cleanFixture,
  engineViolationFixture,
  publicExportViolationFixture,
  rendererViolationFixture,
} from "../../../../../scripts/boundary-scan-fixtures";

const importsBoundary = (source: string): boolean =>
  /(?:from|import)\s*[\"'](?:gsap|react|react-dom|@?motionpath|@?motion5|three|jsdom|happy-dom)(?:[\"'/]|$)/.test(
    source,
  );
const importsRenderer = (source: string): boolean =>
  /(?:from|import)\s*[\"'](?:react|react-dom|node:dom|domino|(?:\.\/|\.\.\/)[^\"']*(?:dom|renderer|react|gsap)[^\"']*)(?:[\"'/]|$)/i.test(
    source,
  );
const bannedSymbol = (source: string): boolean =>
  /(?:compatibility|facade|parityMode|rollout|capabilityFlag|observationAlias|groupHost)/i.test(
    source,
  );

describe("boundary scan planted violations", () => {
  it("passes a clean fixture", () => {
    expect(importsBoundary(cleanFixture)).toBe(false);
    expect(importsRenderer(cleanFixture)).toBe(false);
    expect(bannedSymbol(cleanFixture)).toBe(false);
  });

  it("fails on renderer and animation-engine imports", () => {
    expect(importsBoundary(rendererViolationFixture)).toBe(true);
    expect(importsRenderer(rendererViolationFixture)).toBe(true);
    expect(importsBoundary(engineViolationFixture)).toBe(true);
    expect(importsRenderer(engineViolationFixture)).toBe(true);
  });

  it("fails on banned compatibility vocabulary", () => {
    expect(bannedSymbol(bannedSymbolFixture)).toBe(true);
  });

  it("flags an export outside the public allow list", () => {
    const names = [
      ...publicExportViolationFixture.matchAll(/export\s+const\s+([A-Za-z_$][\w$]*)/g),
    ].map((match) => match[1]);
    expect(names).toEqual(["InternalGraphRuntime"]);
  });
});
