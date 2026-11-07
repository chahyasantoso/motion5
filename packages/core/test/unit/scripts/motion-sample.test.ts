import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gsap } from "gsap";
import { afterAll, describe, expect, it } from "vitest";
import { Engine, PluginCatalog, createManualClock, type ProjectDefinition } from "@motion5/core";
import { createGsapInterpolator } from "@motion5/core/adapters";
import { Spec, defineModel, definePlugin } from "@motion5/core/plugin-api";
import { createFakeScheduler } from "@motion5/core/testing";
import {
  parseSampleArgs,
  sampleProject,
  type NodeSample,
  type SampleResult,
} from "../../../../../scripts/motion-tools/sample";

const Value = defineModel({ id: "SampleFixtureValue", spec: Spec.record({ x: Spec.number() }) });

const broken = definePlugin({
  id: "sample-broken",
  inputs: {},
  outputs: { values: Value },
  // A string where the model's closed contract wants a number.
  transform: () => ({ values: { x: "bad" } }),
});

function catalog(): PluginCatalog {
  return new PluginCatalog({ models: [Value], plugins: [broken] });
}

function track(id: string, to = 100, ease?: string) {
  return {
    id,
    input: {
      values: {
        x: [
          { p: 0, v: 0 },
          { p: 1, v: to, ...(ease === undefined ? {} : { ease }) },
        ],
      },
    },
    output: { model: "SampleFixtureValue" },
  };
}

function timeProject(
  options: { stagger?: number; tracks?: ReturnType<typeof track>[] } = {},
): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "m",
        trigger: { type: "time", duration: 1000, autoplay: true },
        ...(options.stagger === undefined ? {} : { stagger: options.stagger }),
        tracks: options.tracks ?? [track("a")],
      },
    ],
  };
}

function accepted(result: SampleResult) {
  if (result.kind !== "accepted") throw new Error(`Expected accepted, got ${result.kind}.`);
  return result;
}

function ready(sample: NodeSample | undefined) {
  if (sample?.status !== "ready") throw new Error(`Expected ready, got ${sample?.status}.`);
  return sample;
}

describe("sampleProject", () => {
  it("is deterministic", () => {
    const request = { kind: "time", ms: [0, 250, 500] } as const;
    const project = timeProject({ stagger: 0.25, tracks: [track("a"), track("b")] });
    expect(sampleProject(project, catalog(), request)).toEqual(
      sampleProject(project, catalog(), request),
    );
  });

  it("matches a hand-driven engine under stagger", () => {
    const project = timeProject({ stagger: 0.25, tracks: [track("a"), track("b")] });
    const result = accepted(
      sampleProject(project, catalog(), { kind: "time", ms: [250, 500, 1000] }),
    );
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const handle = new Engine({
      clock,
      interpolator: createGsapInterpolator(gsap),
      scheduler,
      plugins: catalog(),
    }).load(project);
    handle.mount("m/a");
    handle.mount("m/b");
    let previous = 0;
    for (const sample of result.samples) {
      clock.tick(sample.at - previous);
      previous = sample.at;
      scheduler.flush();
      for (const id of ["m/a", "m/b"]) {
        const expected = handle.get(id);
        if (expected?.status !== "ready") throw new Error(`${id} is not ready.`);
        const actual = ready(sample.nodes[id]);
        expect(actual.progress).toBe(expected.sourceProgress);
        expect(actual.outputs).toEqual(expected.outputs);
      }
    }
    handle.dispose();
  });

  it("applies real eases", () => {
    const project = timeProject({ tracks: [track("a", 100, "bounce.out")] });
    const result = accepted(sampleProject(project, catalog(), { kind: "time", ms: [250] }));
    const values = ready(result.samples[0]?.nodes["m/a"]).outputs["values"];
    expect(values).toMatchObject({ x: expect.closeTo(47.265625) });
  });

  it("reports a contract-breaking plugin as an error with diagnostics", () => {
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "time", duration: 1000, autoplay: true },
          tracks: [{ id: "a", output: { plugin: "sample-broken" } }],
        },
      ],
    };
    const result = accepted(sampleProject(project, catalog(), { kind: "time", ms: [500] }));
    const node = result.samples[0]?.nodes["m/a"];
    expect(node?.status).toBe("error");
    if (node?.status === "error") expect(node.diagnostics.length).toBeGreaterThan(0);
  });

  it("reports the signalled progress for a manual motion", () => {
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [{ id: "m", trigger: { type: "manual" }, tracks: [track("a")] }],
    };
    const result = accepted(
      sampleProject(project, catalog(), { kind: "progress", progress: [0.5] }),
    );
    expect(ready(result.samples[0]?.nodes["m/a"]).progress).toBeCloseTo(0.5);
  });

  it.each([
    ["scroll under time", { type: "scroll" }, { kind: "time", ms: [0] }],
    ["manual under time", { type: "manual" }, { kind: "time", ms: [0] }],
    ["time under progress", { type: "time", duration: 1000 }, { kind: "progress", progress: [0] }],
  ] as const)("refuses to guess for %s", (_name, trigger, request) => {
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [{ id: "hero", trigger, tracks: [track("a")] }],
    };
    const result = sampleProject(project, catalog(), request);
    if (result.kind !== "unsupported") throw new Error(`Got ${result.kind}.`);
    expect(result.reasons).toHaveLength(1);
    expect(result.reasons[0]).toContain("hero");
    expect(result.reasons[0]).toContain(trigger.type);
  });

  it("refuses an invalid project with its rule id", () => {
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "time", duration: 1000 },
          tracks: [{ id: "a", output: { plugin: "no-such-plugin" } }],
        },
      ],
    };
    const result = sampleProject(project, catalog(), { kind: "time", ms: [0] });
    if (result.kind !== "refused") throw new Error(`Got ${result.kind}.`);
    expect(result.diagnostics.map(({ ruleId }) => ruleId)).toContain("plugin-unknown");
  });

  it("reports an unknown node as absent", () => {
    const result = accepted(
      sampleProject(timeProject(), catalog(), { kind: "time", ms: [0] }, ["m/nope"]),
    );
    expect(result.samples[0]?.nodes).toEqual({ "m/nope": { status: "absent" } });
  });

  it("refuses an unknown ease, which only the loaded engine can check", () => {
    const project = timeProject({ tracks: [track("a", 100, "nonsense.out")] });
    const result = sampleProject(project, catalog(), { kind: "time", ms: [0] });
    if (result.kind !== "refused") throw new Error(`Expected refused, got ${result.kind}.`);
    expect(result.diagnostics.map(({ ruleId }) => ruleId)).toEqual(["ease-unknown"]);
  });

  it("advances a time motion that names no autoplay", () => {
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [{ id: "m", trigger: { type: "time", duration: 1000 }, tracks: [track("a")] }],
    };
    const result = accepted(sampleProject(project, catalog(), { kind: "time", ms: [500] }));
    expect(ready(result.samples[0]?.nodes["m/a"]).progress).toBe(0.5);
  });

  it("samples a free track under its qualified id", () => {
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [],
      freeTracks: [track("free", 100)],
    };
    const result = accepted(sampleProject(project, catalog(), { kind: "time", ms: [0] }));
    expect(Object.keys(result.samples[0]?.nodes ?? {})).toEqual(["~/free"]);
    expect(ready(result.samples[0]?.nodes["~/free"]).status).toBe("ready");
  });

  it("reports a manual track that has not moved as absent, because it published nothing", () => {
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        { id: "m", trigger: { type: "manual" }, stagger: 0.5, tracks: [track("a"), track("b")] },
      ],
    };
    const result = accepted(
      sampleProject(project, catalog(), { kind: "progress", progress: [0.25, 0.75] }),
    );
    expect(result.samples[0]?.nodes["m/b"]).toEqual({ status: "absent" });
    expect(ready(result.samples[1]?.nodes["m/b"]).progress).toBe(0.25);
  });
});

describe("parseSampleArgs", () => {
  it("parses a valid time request with nodes", () => {
    expect(parseSampleArgs(["p.json", "--at", "0,250,500", "--nodes", "m/a,m/b"])).toEqual({
      kind: "ok",
      file: "p.json",
      request: { kind: "time", ms: [0, 250, 500] },
      nodes: ["m/a", "m/b"],
    });
  });

  it("parses a valid progress request", () => {
    expect(parseSampleArgs(["--progress", "0,0.5,1", "p.json"])).toEqual({
      kind: "ok",
      file: "p.json",
      request: { kind: "progress", progress: [0, 0.5, 1] },
    });
  });

  it.each([
    ["both flags", ["p.json", "--at", "0", "--progress", "0"]],
    ["neither flag", ["p.json"]],
    ["descending values", ["p.json", "--at", "500,250"]],
    ["a non-number", ["p.json", "--at", "0,abc"]],
    ["a negative number", ["p.json", "--at", "-1"]],
    ["progress above 1", ["p.json", "--progress", "2"]],
    ["a missing file", ["--at", "0"]],
    ["an unknown flag", ["p.json", "--at", "0", "--bogus", "1"]],
  ])("gives usage for %s", (_name, argv) => {
    expect(parseSampleArgs(argv).kind).toBe("usage");
  });
});

describe("motion:sample entry", () => {
  const dir = mkdtempSync(join(tmpdir(), "motion-sample-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  function run(project: unknown) {
    const file = join(dir, `p-${Math.random().toString(36).slice(2)}.json`);
    writeFileSync(file, JSON.stringify(project));
    return spawnSync(process.execPath, ["scripts/motion-sample.mjs", file, "--at", "500"], {
      cwd: process.cwd(),
      encoding: "utf8",
    });
  }

  it("prints an accepted result and exits 0", () => {
    const out = run({
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "time", duration: 1000, autoplay: true },
          tracks: [
            {
              id: "a",
              input: {
                values: {
                  x: [
                    { p: 0, v: 0 },
                    { p: 1, v: 10 },
                  ],
                  y: 0,
                  rotation: 0,
                },
              },
              output: { model: "Point2d" },
            },
          ],
        },
      ],
    });
    expect(out.status).toBe(0);
    expect(JSON.parse(out.stdout).kind).toBe("accepted");
  });

  it("prints a refused result and exits 1", () => {
    const out = run({
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "time", duration: 1000 },
          tracks: [{ id: "a", output: { plugin: "no-such-plugin" } }],
        },
      ],
    });
    expect(out.status).toBe(1);
    expect(JSON.parse(out.stdout).kind).toBe("refused");
  });
});
