import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { registerSourceLoader } from "../scripts/source-loader.mjs";

// Times a frame with its scene, and the stage alone with the scene replayed, reading what a renderer reads.
// usage: node performance/stage-benchmark.mjs [--write <file>] [--compare <file>]
registerSourceLoader();

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PIECES = join(ROOT, "apps/pieces");
const STEP_MS = 16;
const ROUNDS = 7;

const args = process.argv.slice(2);
const flag = (name) => {
  const index = args.indexOf(name);
  return index < 0 ? undefined : args[index + 1];
};

const stageApi = await import("@gerak/stage");
const renderApi = await import("@gerak/stage/render").catch(() => ({}));
const { timeAt } = await import("@gerak/core");

async function stageFiles() {
  const files = [];
  for (const brief of await readdir(PIECES, { withFileTypes: true })) {
    if (!brief.isDirectory()) continue;
    const src = join(PIECES, brief.name, "src");
    let names = [];
    try {
      names = await readdir(src);
    } catch {
      continue;
    }
    for (const name of names) {
      if (!name.endsWith(".ts")) continue;
      const text = await readFile(join(src, name), "utf8");
      if (text.includes("export default defineStage")) files.push(join(src, name));
    }
  }
  return files.sort();
}

function consumeValue(value) {
  if (typeof value === "function") return 1;
  if (Array.isArray(value)) return value.length;
  return value === undefined ? 0 : 1;
}

/** One frame through whichever stage API is installed, reading everything a renderer would. */
function frameRunner(stage) {
  if (typeof stageApi.frame === "function") {
    const { frame, listPose } = stageApi;
    const { morphAt } = renderApi;
    return (time) => {
      const out = frame(stage, { time });
      let read = 0;
      for (const member of stage.members) {
        if (!out.visible[member.name]) continue;
        const value = out.targets[member.name];
        switch (member.kind) {
          case "list":
            for (let index = 0; index < member.items.length; index += 1) {
              const pose = listPose(value, index, member.items.length);
              const item = member.items[index];
              if (item?.kind === "morph") read += morphAt(item, pose).length;
              read += pose === undefined ? 0 : 1;
            }
            break;
          case "actor":
            if (member.content.kind === "morph") read += morphAt(member.content, value).length;
            if (member.content.kind === "readout") read += member.content.format(time).length;
            read += consumeValue(value);
            break;
          case "group":
            read += consumeValue(value);
            break;
          default:
            throw new Error(`unknown member kind ${member.kind}`);
        }
      }
      return read;
    };
  }
  const { evaluateFrame } = stageApi;
  return (time) => {
    const out = evaluateFrame(stage, { time });
    if (!out.ok) throw new Error(JSON.stringify(out.errors));
    let read = 0;
    for (const value of Object.values(out.poses)) read += consumeValue(value);
    for (const cubics of Object.values(out.morphs)) read += cubics.length;
    for (const text of Object.values(out.readouts)) read += text.length;
    for (const shown of Object.values(out.visibility)) read += shown ? 1 : 0;
    return read;
  };
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

let sink = 0;

function timeRounds(run, times) {
  for (const time of times) sink += run(time);
  const rounds = [];
  for (let round = 0; round < ROUNDS; round += 1) {
    const started = performance.now();
    for (const time of times) sink += run(time);
    rounds.push(((performance.now() - started) * 1000) / times.length);
  }
  return Math.round(median(rounds) * 10) / 10;
}

function compiled(definition, name) {
  const result = stageApi.compileStage(definition);
  if (!result.ok)
    throw new Error(`${name}: ${result.errors.map(stageApi.formatStageError).join("; ")}`);
  return result.stage;
}

/** The scene's outputs at each time, recorded through one real pass. */
function recordOutputs(definition, times, name) {
  const outputs = [];
  const recording = compiled(
    {
      ...definition,
      scene: (context) => {
        const output = definition.scene(context);
        outputs.push(output);
        return output;
      },
    },
    name,
  );
  const run = frameRunner(recording);
  for (const time of times) run(time);
  return outputs.slice(0, times.length).map((output) => settled(recording, output));
}

/** An output whose list functions answer recorded poses, so a replay leaves the piece's work out. */
function settled(stage, output) {
  if (!Array.isArray(stage.members)) return output;
  const out = { ...output };
  for (const member of stage.members) {
    const value = output[member.name];
    if (member.kind !== "list" || typeof value !== "function") continue;
    const poses = member.items.map((_, index) => value(index, member.items.length));
    out[member.name] = (index) => poses[index];
  }
  return out;
}

/** The definition with its scene replaced by a replay of `outputs`, so a frame costs only the stage. */
function replayed(definition, outputs) {
  let next = 0;
  return {
    ...definition,
    scene: () => {
      const output = outputs[next % outputs.length];
      next += 1;
      return output;
    },
  };
}

const results = {};
for (const file of await stageFiles()) {
  const name = relative(PIECES, file).replaceAll("\\", "/");
  const definition = (await import(pathToFileURL(file).href)).default;
  const stage = compiled(definition, name);
  const durationMs = stage.durationMs ?? stage.beats.durationMs;
  const base = { progress: 0, clock: { kind: "timed", elapsed: 0, length: durationMs } };
  const times = [];
  for (let ms = 0; ms <= durationMs; ms += STEP_MS) times.push(timeAt(base, ms));
  const outputs = recordOutputs(definition, times, name);
  results[name] = {
    frame: timeRounds(frameRunner(stage), times),
    stage: timeRounds(frameRunner(compiled(replayed(definition, outputs), name)), times),
  };
}

const compareFile = flag("--compare");
const before =
  compareFile === undefined ? undefined : JSON.parse(await readFile(compareFile, "utf8"));
for (const [name, { frame, stage }] of Object.entries(results)) {
  const was = before?.pieces?.[name]?.stage;
  const ratio = was === undefined ? "" : `  stage was ${was}, x${(was / stage).toFixed(2)}`;
  const cells = `frame ${String(frame).padStart(8)} us  stage ${String(stage).padStart(6)} us`;
  console.log(`${name.padEnd(32)} ${cells}${ratio}`);
}
const sum = (key) =>
  Math.round(Object.values(results).reduce((total, row) => total + row[key], 0) * 10) / 10;
const count = Object.keys(results).length;
console.log(`total frame ${sum("frame")} us, stage ${sum("stage")} us over ${count} pieces`);
if (sink < 0) console.log(sink);

const writeTo = flag("--write");
if (writeTo !== undefined)
  await writeFile(
    writeTo,
    `${JSON.stringify({ unit: "microseconds per frame", stepMs: STEP_MS, pieces: results }, null, 2)}\n`,
  );
