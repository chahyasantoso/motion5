import type { MotionHandle } from "../contract/motion-handle";
import type {
  AuthoredValues,
  RequireView,
  TrackHandle,
  TrackInputHandle,
  TrackRequiresHandle,
} from "../contract/track-handle";
import type {
  AuthoredProperty,
  MotionDefinition,
  PatchBatch,
  TrackDefinition,
  TrackInput,
} from "../contract/v5";
import { requireViews } from "./authored-values";
import type { StructuralEdit } from "./edit-types";

/**
 * The two capability handles a project issues, as classes over one host and the pair each captured.
 *
 * `track()` allocated an eighteen-member frozen object literal per call and `motion()` a ten-member
 * one, each closing over the runtime, an id and a token, and every member of both was a delegation.
 * So what those literals bought was a per-call allocation of twenty-six closures, plus the two
 * captured ids that were the only members of either literal not to be one, to express twenty-eight
 * members that never differ between calls. A class states them once, on one prototype, and a handle
 * becomes one instance over one host and the pair it captured. What is given back is seventeen
 * forwarding closures in the host below, allocated once per runtime rather than once per handle.
 *
 * That moves what a handle exposes, which is why step 8 is two slices rather than one. A literal's
 * members are own enumerable properties; a class's are inherited and non-enumerable, so
 * `Object.keys(handle)` answers nothing and `Object.getOwnPropertyDescriptor(handle, member)` answers
 * nothing for a member the handle plainly has. Six test files read a handle exactly that way, so the
 * reader they share landed first, green over the literals, and this conversion is measured against it
 * rather than against a list rewritten beside it. No member, no signature, no refusal and no ordering
 * moves here.
 *
 * One thing besides that surface moves, and it is declared rather than discovered later: a member
 * reached off a prototype reads its host from the receiver, so a member detached from its handle no
 * longer carries one and throws where the literal's own arrow still worked. Nothing in this
 * repository detaches one, and binding each member per instance would restore exactly the per-call
 * allocation this step exists to delete, so the requirement is stated and pinned instead of paid for.
 * Both prototypes are frozen at the end of this module for the same reason the instances are: every
 * member of a literal lived on the object, so freezing it froze them, and a shared prototype left
 * mutable would let one assignment rewrite a member of every handle a process issues.
 *
 * A class cannot reach `ProjectRuntime`'s private members, so what a handle may ask is a port rather
 * than a runtime: the host below is resolved once in that constructor, exactly as `ProjectPorts` is.
 * The direction is the opposite one, which is worth stating rather than leaving to the reader: a port
 * is what the runtime reaches outward for, and a host is what something it issued reaches back for.
 * Both are total, both are frozen, and no member of either is optional.
 *
 * What stays with a handle is what belongs to one: which id and token it captured, which
 * `StructuralEdit` each structural verb means, and the `RequireView` projection of a definition it
 * can already read. What stays with the runtime is every liveness ladder, every refusal and every
 * commit, so a handle decides nothing, which is the property `SH-7` measures. Instances are frozen
 * for the reason the literals were: a handle is a capability a caller holds, and nothing may hang
 * state on one. See ADR-026, ADR-056, ADR-061 and ADR-063.
 */

/**
 * What a track handle may ask of the runtime that owns its token.
 *
 * One member per question rather than one per handle member, which is why `requires` is absent: it is
 * `requireViews` of the definition this record already answers, and a second member for it would put
 * one projection in two places. Every member takes the id and the token, because a handle carries
 * nothing else, and each is one rung the runtime already owned. Which of the two liveness orders a
 * member gets is that class's decision and is unmoved: a read resolves the captured token, and a
 * write asks runtime liveness first. See ADR-056.
 */
export interface TrackHost {
  readonly live: (id: string, token: number) => boolean;
  readonly definition: (id: string, token: number) => TrackDefinition;
  readonly apply: (id: string, token: number, edit: StructuralEdit) => void;
  readonly setKeyframe: (
    id: string,
    token: number,
    plugin: string,
    key: string,
    value: AuthoredProperty,
  ) => PatchBatch;
  readonly removeKeyframe: (id: string, token: number, plugin: string, key: string) => PatchBatch;
  readonly write: (
    id: string,
    token: number,
    values: AuthoredValues,
    rebase: boolean,
  ) => PatchBatch;
}

/**
 * What a motion handle may ask of it, on the same rule and with the same two orders.
 *
 * `write` has no twin here, because tier 0 is two named seams rather than one mechanism with a flag:
 * which of a trigger and a stagger an edit asks is half of what that edit claims. Child resolution is
 * two members for the reason it is two verbs on the handle: one refuses a child this Motion does not
 * own and the other answers about it. See ADR-061.
 */
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

/**
 * One graph node's capability handle: three fields and eleven members on one prototype.
 *
 * Every member delegates, so there is no branch and no sequencing here. The three structural verbs
 * and the two under `input` mint one `StructuralEdit` each rather than naming five host members, so
 * the host stays one application point however the edit surface grows. See ADR-056, ADR-063 and
 * ADR-065.
 */
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
    this.#host.apply(this.#id, this.#token, { kind: "remove-track", nodeId: this.#id });
  }

  replace(next: TrackDefinition): void {
    this.#host.apply(this.#id, this.#token, {
      kind: "replace-track",
      nodeId: this.#id,
      track: next,
    });
  }

  setKeyframe(plugin: string, key: string, value: AuthoredProperty): PatchBatch {
    return this.#host.setKeyframe(this.#id, this.#token, plugin, key, value);
  }

  removeKeyframe(plugin: string, key: string): PatchBatch {
    return this.#host.removeKeyframe(this.#id, this.#token, plugin, key);
  }

  overrideValues(next: AuthoredValues): PatchBatch {
    return this.#host.write(this.#id, this.#token, next, false);
  }

  setValues(next: AuthoredValues): PatchBatch {
    return this.#host.write(this.#id, this.#token, next, true);
  }
}

/**
 * The `input` member of one track handle: one replacement verb and one binding view.
 *
 * The view is allocated per read and holds nothing of its own, so no stale copy of an input can
 * outlive the definition it came from; each verb resolves the token its track handle captured, and
 * the runtime decides both liveness and the edit. See ADR-056 and ADR-063.
 */
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
    this.#host.apply(this.#id, this.#token, {
      kind: "replace-input",
      nodeId: this.#id,
      ...(input === undefined ? {} : { input }),
    });
  }

  get requires(): TrackRequiresHandle {
    return new RuntimeTrackRequiresHandle(this.#host, this.#id, this.#token);
  }
}

/**
 * The bindings half of one track's input: two verbs over the same host, id and token.
 *
 * A structural edit is built here rather than in the runtime so the runtime keeps one application
 * point for all five shapes. An absent member key is omitted rather than written as `undefined`, so
 * an edit replayed from a fixture addresses the same slot it did in memory.
 */
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
    this.#host.apply(this.#id, this.#token, {
      kind: "bind",
      nodeId: this.#id,
      slot,
      source,
      ...(memberKey === undefined ? {} : { memberKey }),
    });
  }

  remove(slot: string, memberKey?: string): void {
    this.#host.apply(this.#id, this.#token, {
      kind: "unbind",
      nodeId: this.#id,
      slot,
      ...(memberKey === undefined ? {} : { memberKey }),
    });
  }
}

/**
 * One Motion's capability handle: the same three fields, and ten members on one prototype.
 *
 * `definition` projects the tracks the Motion currently owns rather than the entry's stored array,
 * which is the runtime's projection and stays there. See ADR-061.
 */
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

// The capability half of what freezing a literal used to cover. An instance freeze stops a caller
// hanging state on one handle; these stop one assignment rewriting a member of all of them.
Object.freeze(RuntimeTrackHandle.prototype);
Object.freeze(RuntimeTrackInputHandle.prototype);
Object.freeze(RuntimeTrackRequiresHandle.prototype);
Object.freeze(RuntimeMotionHandle.prototype);
