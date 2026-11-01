import type { MotionHandle } from "../contract/motion-handle";
import type {
  RequireView,
  TrackHandle,
  TrackInputHandle,
  TrackRequiresHandle,
  TrackValuesHandle,
} from "../contract/track-handle";
import type {
  AuthoredCell,
  AuthoredValues as InputValues,
  CellAddress,
  MotionDefinition,
  PatchBatch,
  TrackDefinition,
  TrackInput,
  Value,
} from "../contract/v5";
import { requireViews } from "./authored-values";
import type { CheapEdit, LiveEdit, StructuralEdit } from "./edit-types";

// Track and motion capability handles: one frozen instance over a host and the (id, token) pair it
// captured. Every member delegates; liveness, refusal and commit stay with the runtime.

/** What a track handle may ask of the runtime owning its token; every member takes the captured id and token. */
export interface TrackHost {
  readonly live: (id: string, token: number) => boolean;
  readonly definition: (id: string, token: number) => TrackDefinition;
  readonly applyStructural: (id: string, token: number, edit: StructuralEdit) => void;
  readonly applyCheap: (id: string, token: number, edit: CheapEdit) => PatchBatch;
  readonly applyLive: (id: string, token: number, edit: LiveEdit) => PatchBatch;
}

/** What a motion handle may ask of the runtime owning its token; every member takes the captured id and token. */
export interface MotionHost {
  readonly live: (id: string, token: number) => boolean;
  readonly definition: (id: string, token: number) => MotionDefinition;
  readonly trackIds: (id: string, token: number) => readonly string[];
  readonly addTrack: (id: string, token: number, track: TrackDefinition) => TrackHandle;
  readonly track: (id: string, token: number, trackId: string) => TrackHandle;
  readonly tryTrack: (id: string, token: number, trackId: string) => TrackHandle | undefined;
  readonly setTrigger: (id: string, token: number, trigger: MotionDefinition["trigger"]) => void;
  readonly setStagger: (id: string, token: number, stagger: number | undefined) => void;
  readonly destroy: (id: string, token: number) => void;
}

/** The one host a runtime resolves, grouped by which of the two handles asks. */
export interface HandleHost {
  readonly track: TrackHost;
  readonly motion: MotionHost;
}

/** One track's capability handle: every member delegates; each edit verb mints one `StructuralEdit`, `CheapEdit` or `LiveEdit`, so the host keeps one application point per tier. */
export class RuntimeTrackHandle implements TrackHandle {
  readonly #host: TrackHost;
  readonly #id: string;
  readonly #token: number;

  constructor(host: TrackHost, id: string, token: number) {
    this.#host = host;
    this.#id = id;
    this.#token = token;
    Object.freeze(this);
  }

  get id(): string {
    return this.#id;
  }

  get live(): boolean {
    return this.#host.live(this.#id, this.#token);
  }

  get definition(): TrackDefinition {
    return this.#host.definition(this.#id, this.#token);
  }

  get requires(): readonly RequireView[] {
    return requireViews(this.#host.definition(this.#id, this.#token));
  }

  get input(): TrackInputHandle {
    return new RuntimeTrackInputHandle(this.#host, this.#id, this.#token);
  }

  remove(): void {
    this.#host.applyStructural(this.#id, this.#token, {
      kind: "remove-track",
      nodeId: this.#id,
    });
  }

  replace(next: TrackDefinition): void {
    this.#host.applyStructural(this.#id, this.#token, {
      kind: "replace-track",
      nodeId: this.#id,
      track: next,
    });
  }

  writeValues(value: Value): PatchBatch {
    return this.#host.applyLive(this.#id, this.#token, {
      kind: "write-live",
      nodeId: this.#id,
      value,
    });
  }

  releaseValues(): PatchBatch {
    return this.#host.applyLive(this.#id, this.#token, {
      kind: "release-live",
      nodeId: this.#id,
    });
  }
}

/** The `input` member of one track handle: one replacement verb, binding and values views. Each view is minted per read and holds nothing, so none goes stale. */
export class RuntimeTrackInputHandle implements TrackInputHandle {
  readonly #host: TrackHost;
  readonly #id: string;
  readonly #token: number;

  constructor(host: TrackHost, id: string, token: number) {
    this.#host = host;
    this.#id = id;
    this.#token = token;
    Object.freeze(this);
  }

  replace(input?: TrackInput): void {
    this.#host.applyStructural(this.#id, this.#token, {
      kind: "replace-input",
      nodeId: this.#id,
      ...(input === undefined ? {} : { input }),
    });
  }

  get requires(): TrackRequiresHandle {
    return new RuntimeTrackRequiresHandle(this.#host, this.#id, this.#token);
  }

  get values(): TrackValuesHandle {
    return new RuntimeTrackValuesHandle(this.#host, this.#id, this.#token);
  }
}

/** The bindings half of one track's input: two verbs over the same host, id and token. An absent member key is omitted, not written as `undefined`, so a replayed edit addresses the same slot. */
export class RuntimeTrackRequiresHandle implements TrackRequiresHandle {
  readonly #host: TrackHost;
  readonly #id: string;
  readonly #token: number;

  constructor(host: TrackHost, id: string, token: number) {
    this.#host = host;
    this.#id = id;
    this.#token = token;
    Object.freeze(this);
  }

  set(slot: string, source: string, memberKey?: string): void {
    this.#host.applyStructural(this.#id, this.#token, {
      kind: "bind",
      nodeId: this.#id,
      slot,
      source,
      ...(memberKey === undefined ? {} : { memberKey }),
    });
  }

  remove(slot: string, memberKey?: string): void {
    this.#host.applyStructural(this.#id, this.#token, {
      kind: "unbind",
      nodeId: this.#id,
      slot,
      ...(memberKey === undefined ? {} : { memberKey }),
    });
  }
}

/** The authored values of one track: both verbs mint one `CheapEdit`; the runtime plans it against the committed contract and returns the one publication batch. */
export class RuntimeTrackValuesHandle implements TrackValuesHandle {
  readonly #host: TrackHost;
  readonly #id: string;
  readonly #token: number;

  constructor(host: TrackHost, id: string, token: number) {
    this.#host = host;
    this.#id = id;
    this.#token = token;
    Object.freeze(this);
  }

  set(values: InputValues): PatchBatch {
    return this.#host.applyCheap(this.#id, this.#token, {
      kind: "set-values",
      nodeId: this.#id,
      values,
    });
  }

  setField(address: CellAddress, cell: AuthoredCell): PatchBatch {
    return this.#host.applyCheap(this.#id, this.#token, {
      kind: "set-field",
      nodeId: this.#id,
      address,
      cell,
    });
  }
}

/** One Motion's capability handle: every member delegates; `definition` projects the tracks the Motion currently owns. */
export class RuntimeMotionHandle implements MotionHandle {
  readonly #host: MotionHost;
  readonly #id: string;
  readonly #token: number;

  constructor(host: MotionHost, id: string, token: number) {
    this.#host = host;
    this.#id = id;
    this.#token = token;
    Object.freeze(this);
  }

  get id(): string {
    return this.#id;
  }

  get live(): boolean {
    return this.#host.live(this.#id, this.#token);
  }

  get definition(): MotionDefinition {
    return this.#host.definition(this.#id, this.#token);
  }

  get trackIds(): readonly string[] {
    return this.#host.trackIds(this.#id, this.#token);
  }

  addTrack(track: TrackDefinition): TrackHandle {
    return this.#host.addTrack(this.#id, this.#token, track);
  }

  track(trackId: string): TrackHandle {
    return this.#host.track(this.#id, this.#token, trackId);
  }

  tryTrack(trackId: string): TrackHandle | undefined {
    return this.#host.tryTrack(this.#id, this.#token, trackId);
  }

  setTrigger(trigger: MotionDefinition["trigger"]): void {
    this.#host.setTrigger(this.#id, this.#token, trigger);
  }

  setStagger(stagger?: number): void {
    this.#host.setStagger(this.#id, this.#token, stagger);
  }

  destroy(): void {
    this.#host.destroy(this.#id, this.#token);
  }
}

// Instance freeze blocks caller state on one handle; prototype freeze blocks one assignment
// rewriting every handle. A member detached from its handle carries no host and throws.
Object.freeze(RuntimeTrackHandle.prototype);
Object.freeze(RuntimeTrackInputHandle.prototype);
Object.freeze(RuntimeTrackRequiresHandle.prototype);
Object.freeze(RuntimeTrackValuesHandle.prototype);
Object.freeze(RuntimeMotionHandle.prototype);
