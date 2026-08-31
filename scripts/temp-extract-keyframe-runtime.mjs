import { readFileSync, writeFileSync } from "node:fs";

const path = "packages/core/src/runtime/project-runtime.ts";
const source = readFileSync(path, "utf8");

function replaceOnce(text, before, after, label) {
  const count = text.split(before).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly one match, found ${count}`);
  return text.replace(before, after);
}

let next = source;

const mutableTrack = `type MutableTrack = { -readonly [K in keyof TrackDefinition]: TrackDefinition[K] };`;
const withKeyframes = `${mutableTrack}
/** Builds a track with an edited authored keyframe record, omitting an empty record. */
function withKeyframes(track: TrackDefinition, keyframes: AuthoredKeyframes): TrackDefinition {
  const next: MutableTrack = { ...track };
  if (Object.keys(keyframes).length === 0) delete next.keyframes;
  else next.keyframes = keyframes;
  return Object.freeze(next);
}`;
next = replaceOnce(next, mutableTrack, withKeyframes, "withKeyframes insertion");

const validationCall = "    const validation = validateTrackDefinition(next, `${verb}(${nodeId})`);";
const oldRecompile = `    const next: MutableTrack = { ...entry.track };
    if (Object.keys(keyframes).length === 0) delete next.keyframes;
    else next.keyframes = keyframes;
${validationCall}`;
const newRecompile = `    const next = withKeyframes(entry.track, keyframes);
${validationCall}`;
next = replaceOnce(next, oldRecompile, newRecompile, "recompile rewrite");

const oldEditRequire = `  #editRequire(
    id: string,
    token: number,
    plugin: string,
    edit: (keyframes: AuthoredKeyframes, bound: BoundGroup) => AuthoredKeyframes,
  ): void {
    const entry = this.#liveEntry(id, token);
    const keyframes = entry.track.keyframes;
    const bound = keyframes === undefined ? undefined : readBoundGroup(keyframes, plugin);
    if (keyframes === undefined || bound === undefined) unboundGroup(id, plugin);
    const next = edit(keyframes, bound);
    if (next === keyframes) return;
    this.#writeKeyframes(id, token, entry.track, next);
  }`;
const newEditRequire = `  #boundGroup(
    nodeId: string,
    entry: TrackEntry,
    plugin: string,
  ): { keyframes: AuthoredKeyframes; bound: BoundGroup } {
    const keyframes = entry.track.keyframes;
    const bound = keyframes === undefined ? undefined : readBoundGroup(keyframes, plugin);
    if (keyframes === undefined || bound === undefined) unboundGroup(nodeId, plugin);
    return { keyframes, bound };
  }
  #editRequire(
    id: string,
    token: number,
    plugin: string,
    edit: (keyframes: AuthoredKeyframes, bound: BoundGroup) => AuthoredKeyframes,
  ): void {
    const entry = this.#liveEntry(id, token);
    const { keyframes, bound } = this.#boundGroup(id, entry, plugin);
    const next = edit(keyframes, bound);
    if (next === keyframes) return;
    this.#writeKeyframes(id, token, entry.track, next);
  }`;
next = replaceOnce(next, oldEditRequire, newEditRequire, "bound-group extraction");

const oldSetLookup = `    const entry = this.#liveEntry(nodeId, token);
    this.#refuseInsideRecipe("setKeyframe");
    const keyframes = entry.track.keyframes;
    const bound = keyframes === undefined ? undefined : readBoundGroup(keyframes, plugin);
    if (keyframes === undefined || bound === undefined) unboundGroup(nodeId, plugin);`;
const newSetLookup = `    const entry = this.#liveEntry(nodeId, token);
    this.#refuseInsideRecipe("setKeyframe");
    const { keyframes, bound } = this.#boundGroup(nodeId, entry, plugin);`;
next = replaceOnce(next, oldSetLookup, newSetLookup, "setKeyframe lookup");

const oldRemoveLookup = `    const entry = this.#liveEntry(nodeId, token);
    this.#refuseInsideRecipe("removeKeyframe");
    const keyframes = entry.track.keyframes;
    const bound = keyframes === undefined ? undefined : readBoundGroup(keyframes, plugin);
    if (keyframes === undefined || bound === undefined) unboundGroup(nodeId, plugin);`;
const newRemoveLookup = `    const entry = this.#liveEntry(nodeId, token);
    this.#refuseInsideRecipe("removeKeyframe");
    const { keyframes, bound } = this.#boundGroup(nodeId, entry, plugin);`;
next = replaceOnce(next, oldRemoveLookup, newRemoveLookup, "removeKeyframe lookup");

const oldWriteKeyframes = `    const next: MutableTrack = { ...track };
    if (Object.keys(keyframes).length === 0) delete next.keyframes;
    else next.keyframes = keyframes;
    this.#replaceTrack(id, token, next);`;
const newWriteKeyframes = `    this.#replaceTrack(id, token, withKeyframes(track, keyframes));`;
next = replaceOnce(next, oldWriteKeyframes, newWriteKeyframes, "writeKeyframes rewrite");

if ((next.match(/readBoundGroup\(/g) ?? []).length !== 1)
  throw new Error("readBoundGroup must have exactly one call in #boundGroup");
if ((next.match(/function withKeyframes\(/g) ?? []).length !== 1)
  throw new Error("withKeyframes was not installed exactly once");
if (next.includes("const next: MutableTrack = { ...entry.track };\n    if (Object.keys(keyframes).length"))
  throw new Error("recompile still owns the keyframes rewrite");
if (next.includes("const next: MutableTrack = { ...track };\n    if (Object.keys(keyframes).length"))
  throw new Error("writeKeyframes still owns the keyframes rewrite");

writeFileSync(path, next);
console.log("Applied guarded extraction: #boundGroup and withKeyframes.");
