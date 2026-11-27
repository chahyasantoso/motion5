import { createStore, inputLog, liveAt, pageInputs, withStore, type Input } from "@gerak/core";
import { compileScene, formatStageError, frame, listPose3d, pose3dOf } from "@gerak/stage";
import { describe, expect, it } from "vitest";
import {
  BUILDER_CAPACITY,
  BUILDER_CRUMB_COUNT,
  BUILDER_EXIT_POOL,
  cookieInputs,
} from "../cookie/src/contract";
import { INITIAL_JAR, addCookie, mixJar, removeFlavor, type JarUpdate } from "../cookie/src/jar";
import { builderScene } from "../cookie/src/scene-builder";
import { spotlightScene } from "../cookie/src/scene-spotlight";

const compiledBuilder = compileScene(builderScene);
if (!compiledBuilder.ok) {
  throw new Error(compiledBuilder.errors.map(formatStageError).join("\n"));
}
const builderStage = compiledBuilder.stage;

const compiledSpotlight = compileScene(spotlightScene);
if (!compiledSpotlight.ok) {
  throw new Error(compiledSpotlight.errors.map(formatStageError).join("\n"));
}
const spotlightStage = compiledSpotlight.stage;

const BUILDER_COUNTS = {
  builderCookies: BUILDER_CAPACITY,
  builderExitCookies: BUILDER_EXIT_POOL,
  builderCrumbs: BUILDER_CRUMB_COUNT,
} as const;

const SPOTLIGHT_COUNTS = {
  flavorCookies: 4,
  spotlightTints: 4,
  flavorTitles: 4,
  flavorNums: 4,
  flavorNotes: 4,
  flavorDots: 4,
} as const;

function sendJarUpdate(log: ReturnType<typeof inputLog>, at: number, update: JarUpdate) {
  for (const send of update.sends) {
    switch (send.kind) {
      case "value":
        log.set(at, cookieInputs, send.name, send.value);
        break;
      case "trigger":
        log.trigger(at, cookieInputs, send.name, send.value);
        break;
    }
  }
  return update.jar;
}

function evaluateBuilderAt(ms: number, events: Input) {
  const out = frame(builderStage, {
    time: liveAt(ms),
    events,
    counts: BUILDER_COUNTS,
  });
  const cookies = Array.from({ length: BUILDER_CAPACITY }, (_, index) =>
    listPose3d(out.targets["builderCookies"], index, BUILDER_CAPACITY),
  );
  const exitCookies = Array.from({ length: BUILDER_EXIT_POOL }, (_, index) =>
    listPose3d(out.targets["builderExitCookies"], index, BUILDER_EXIT_POOL),
  );
  return {
    jarRoot: pose3dOf(out.targets["builderJarRoot"]),
    jarLid: pose3dOf(out.targets["builderJarLid"]),
    cookies,
    exitCookies,
  };
}

describe("cookie builder scene contract readers", () => {
  it("gives each exit cookie its own slot flavor when two jar-remove triggers arrive in the same ms", () => {
    const log = inputLog();
    let jar = INITIAL_JAR;
    jar = sendJarUpdate(log, 100, addCookie(jar, 0));
    jar = sendJarUpdate(log, 200, addCookie(jar, 1));
    jar = sendJarUpdate(log, 300, addCookie(jar, 2));

    // Both removes happen at 800 ms on slot 1: first flavor 1 exits, then flavor 2 (shifted into slot 1) exits.
    jar = sendJarUpdate(log, 800, removeFlavor(jar, 1));
    jar = sendJarUpdate(log, 800, removeFlavor(jar, 2));

    const evaluated = withStore(createStore(), () => evaluateBuilderAt(850, log.input));
    expect(evaluated.exitCookies[0]?.custom?.["flavor"]).toBe(1);
    expect(evaluated.exitCookies[1]?.custom?.["flavor"]).toBe(2);
    expect(evaluated.cookies[0]?.custom?.["flavor"]).toBe(0);
    expect(evaluated.cookies[1]?.scale).toBe(0);
  });

  it("does not refold earlier jar entries across 60 frames of only pageInputs scroll and pointer changes", () => {
    const store = createStore();
    const log = inputLog();
    let jar = INITIAL_JAR;
    jar = sendJarUpdate(log, 100, addCookie(jar, 0));
    jar = sendJarUpdate(log, 200, addCookie(jar, 1));
    jar = sendJarUpdate(log, 300, removeFlavor(jar, 0));
    jar = sendJarUpdate(log, 500, mixJar(jar));

    const jarEntryCount = log.input.length;
    expect(jarEntryCount).toBeGreaterThan(0);

    withStore(store, () => evaluateBuilderAt(900, log.input));

    let jarEntryReads = 0;
    for (let i = 0; i < jarEntryCount; i += 1) {
      const entry = log.input[i];
      Object.defineProperty(log.input, i, {
        configurable: true,
        enumerable: true,
        get() {
          jarEntryReads += 1;
          return entry;
        },
      });
    }

    withStore(store, () => {
      for (let f = 1; f <= 60; f += 1) {
        const at = 900 + f * 16;
        log.set(at, pageInputs, "scroll", f * 10);
        log.set(at, pageInputs, "pointer-x", (f % 10) / 10);
        log.set(at, pageInputs, "pointer-y", ((f + 5) % 10) / 10);
        evaluateBuilderAt(at, log.input);
      }
    });

    expect(jarEntryReads).toBe(0);
  });

  it("drives spotlight flavor selection through cookieInputs and scroll without raw event folding", () => {
    const store = createStore();
    const log = inputLog();
    log.set(100, pageInputs, "scroll", 2200);
    log.set(200, cookieInputs, "flavor-select", 2);

    const out = withStore(store, () =>
      frame(spotlightStage, {
        time: liveAt(950),
        events: log.input,
        counts: SPOTLIGHT_COUNTS,
      }),
    );
    const cookie2 = listPose3d(out.targets["flavorCookies"], 2, 4);
    expect(cookie2?.scale).toBeGreaterThan(0);

    // Moving scroll past a subsequent zone updates the active cookie again.
    log.set(1000, pageInputs, "scroll", 3000);
    const afterScroll = withStore(store, () =>
      frame(spotlightStage, {
        time: liveAt(1800),
        events: log.input,
        counts: SPOTLIGHT_COUNTS,
      }),
    );
    const cookie1 = listPose3d(afterScroll.targets["flavorCookies"], 1, 4);
    expect(cookie1?.scale).toBeGreaterThan(0);
    expect(listPose3d(afterScroll.targets["flavorCookies"], 2, 4)?.scale).toBe(0);
  });
});
