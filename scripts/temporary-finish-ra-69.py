from pathlib import Path

path = Path("packages/core/src/runtime/project-runtime.ts")
source = path.read_text()


def replace_once(old: str, new: str) -> None:
    global source
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"expected one match, found {count}: {old[:80]!r}")
    source = source.replace(old, new, 1)


replace_once(
    "  AuthoredKeyframe,\n  AuthoredPluginGroup,",
    "  AuthoredKeyframe,\n  AuthoredPluginGroup,\n  AuthoredProperty,",
)
replace_once(
    "  readBoundGroup,\n  readsAsProperty,\n  removeGroup,\n  removeRequire,\n  setGroup,\n  setRequire,",
    "  readBoundGroup,\n  readsAsProperty,\n  removeGroup,\n"
    "  removeKeyframe as removeAuthoredKeyframe,\n  removeRequire,\n  setGroup,\n"
    "  setKeyframe as setAuthoredKeyframe,\n  setRequire,",
)
replace_once(
    "      removeGoal: (plugin: string, memberId: string) =>\n"
    "        runtime.#removeGoal(id, token, plugin, memberId),\n"
    "      overrideValues:",
    "      removeGoal: (plugin: string, memberId: string) =>\n"
    "        runtime.#removeGoal(id, token, plugin, memberId),\n"
    "      setKeyframe: (plugin: string, key: string, value: AuthoredProperty) =>\n"
    "        runtime.#setKeyframe(id, token, plugin, key, value),\n"
    "      removeKeyframe: (plugin: string, key: string) =>\n"
    "        runtime.#removeKeyframe(id, token, plugin, key),\n"
    "      overrideValues:",
)
marker = "  #replaceWithObservation(\n"
implementation = '''  /** One value-tier flush, shared by authored-property recompiles and no-ops. */
  #invalidateOne(nodeId: string) {
    const batch = this.#graph.invalidate([nodeId]);
    this.#diagnostics.recordAll(batch.diagnostics);
    return batch;
  }
  /**
   * Recompiles one edited authored record in place, preserving this node's playhead.
   *
   * Validation and the registry resolve both run before the live Track is touched. The read through
   * `writeValues` then supplies the progress the existing Track owns, and the staged replacement is
   * re-seeked after it becomes live. No graph operation is involved because a leaf carries no edge.
   */
  #recompileKeyframes(
    nodeId: string,
    entry: TrackEntry,
    keyframes: AuthoredKeyframes,
    verb: string,
  ) {
    const next: MutableTrack = { ...entry.track };
    if (Object.keys(keyframes).length === 0) delete next.keyframes;
    else next.keyframes = keyframes;
    const validation = validateTrackDefinition(next, `${verb}(${nodeId})`);
    if (!validation.valid || !validation.value)
      throw new TypeError(describeDiagnostics(validation.diagnostics));
    const accepted = validation.value;
    const resolved = this.#resolve(nodeId, accepted);
    if (resolved?.diagnostics.some(({ severity }) => severity === "error"))
      throw new TypeError(describeDiagnostics(resolved.diagnostics));
    const written = this.#writeValuesHook(
      nodeId,
      authoredValues(entry.track),
      Object.keys(entry.overlay).length === 0 ? undefined : NO_OVERLAY,
      true,
    );
    const staged = this.#stageTrack?.(accepted, nodeId);
    this.#tracks.set(nodeId, { ...entry, track: accepted, overlay: NO_OVERLAY });
    staged?.commit();
    if (written !== undefined) this.#setProgress(nodeId, written.progress);
    return this.#invalidateOne(nodeId);
  }
  /**
   * Edits one property of a plugin group this node already authors.
   *
   * An existing leaf goes through the live-write owner, preserving its per-key refusal ordering. A
   * new or removed leaf cannot be expressed as a mask, so the authored candidate is validated,
   * resolved, and recompiled in place instead. The bound-group precondition keeps every path in the
   * value tier: the plugin is already in the chain and no edge can move.
   */
  #setKeyframe(
    nodeId: string,
    token: number,
    plugin: string,
    key: string,
    value: AuthoredProperty,
  ) {
    const entry = this.#liveEntry(nodeId, token);
    this.#refuseInsideRecipe("setKeyframe");
    const keyframes = entry.track.keyframes;
    const bound = keyframes === undefined ? undefined : readBoundGroup(keyframes, plugin);
    if (keyframes === undefined || bound === undefined) unboundGroup(nodeId, plugin);
    if (Object.hasOwn(bound.group.values ?? {}, key))
      return this.#writeValues(nodeId, entry, { [key]: value }, true);
    const edited = setAuthoredKeyframe(keyframes, bound, key, value);
    return this.#recompileKeyframes(nodeId, entry, edited, "setKeyframe");
  }
  #removeKeyframe(nodeId: string, token: number, plugin: string, key: string) {
    const entry = this.#liveEntry(nodeId, token);
    this.#refuseInsideRecipe("removeKeyframe");
    const keyframes = entry.track.keyframes;
    const bound = keyframes === undefined ? undefined : readBoundGroup(keyframes, plugin);
    if (keyframes === undefined || bound === undefined) unboundGroup(nodeId, plugin);
    const edited = removeAuthoredKeyframe(keyframes, bound, key);
    if (edited === keyframes) return this.#invalidateOne(nodeId);
    return this.#recompileKeyframes(nodeId, entry, edited, "removeKeyframe");
  }
'''
replace_once(marker, implementation + marker)
path.write_text(source)
