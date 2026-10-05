import { afterCleanup, disposeInOrder } from "./cleanup";
import type { PlaygroundRuntime } from "./playground-runtime";
import { unreachable } from "./unreachable";

/**
 * Everything the App renders, as one value: a rig without goals, an error beside a live rig or a
 * weight without a rig cannot be spelled.
 */
export type PlaygroundView =
  | { readonly kind: "loading" }
  | { readonly kind: "ready"; readonly runtime: PlaygroundRuntime; readonly weight: number }
  | { readonly kind: "failed"; readonly error: unknown };

export const LOADING_VIEW: PlaygroundView = Object.freeze({ kind: "loading" });

export interface PlaygroundSessionOptions {
  /** Starts the asynchronous load. A synchronous throw (building ports) releases the host. */
  readonly load: () => Promise<PlaygroundRuntime>;
  /** Releases what the host created for this session (the clock), after the runtime. */
  readonly releaseHost: () => void;
  /** The node whose ready `sourceProgress` is the published weight. */
  readonly weightNode: string;
  /** Every view change while the session is current; never called after stop. Must not throw. */
  readonly onView: (view: PlaygroundView) => void;
  /** A failure no view can show: disposing a runtime that arrived after stop. */
  readonly onOrphanFailure: (error: unknown) => void;
}

/** What the session owns right now; each arm names exactly what stop must release. */
type Lifecycle =
  | { readonly kind: "loading" }
  | {
      readonly kind: "active";
      readonly runtime: PlaygroundRuntime;
      readonly unsubscribe: () => void;
    }
  | { readonly kind: "ended" };

const ENDED: Lifecycle = Object.freeze({ kind: "ended" });
const RESOURCE_FAILURE = "IK resource cleanup failed.";
const SETUP_FAILURE = "IK setup and cleanup failed.";

/**
 * The playground's one lifecycle owner between an asynchronous load and a synchronous host. Stop
 * is idempotent and releases subscription, project, then host; a load that settles after stop is
 * disposed or ignored without publishing; a failure while current releases once and becomes a
 * `failed` view, because a promise callback cannot reach a React error boundary by throwing.
 */
export function startPlaygroundSession(options: PlaygroundSessionOptions): () => void {
  const { releaseHost, onView } = options;
  let lifecycle: Lifecycle = { kind: "loading" };

  const fail = (error: unknown, steps: readonly (() => void)[]) => {
    lifecycle = ENDED;
    onView({
      kind: "failed",
      error: afterCleanup(error, () => disposeInOrder(steps, RESOURCE_FAILURE), SETUP_FAILURE),
    });
  };

  const activate = (runtime: PlaygroundRuntime) => {
    if (lifecycle.kind === "ended") {
      try {
        runtime.project.dispose();
      } catch (error) {
        options.onOrphanFailure(error);
      }
      return;
    }
    try {
      onView({ kind: "ready", runtime, weight: 0 });
      const unsubscribe = runtime.project.subscribeNode(options.weightNode, (patch) => {
        if (lifecycle.kind !== "ended" && patch.status === "ready")
          onView({ kind: "ready", runtime, weight: patch.sourceProgress });
      });
      lifecycle = { kind: "active", runtime, unsubscribe };
    } catch (error) {
      fail(error, [() => runtime.project.dispose(), releaseHost]);
    }
  };

  const refuse = (error: unknown) => {
    if (lifecycle.kind !== "ended") fail(error, [releaseHost]);
  };

  let pending: Promise<PlaygroundRuntime>;
  try {
    pending = options.load();
  } catch (error) {
    lifecycle = ENDED;
    throw afterCleanup(error, releaseHost, SETUP_FAILURE);
  }
  void pending.then(activate, refuse);

  return () => {
    const owned = lifecycle;
    lifecycle = ENDED;
    switch (owned.kind) {
      case "loading":
        releaseHost();
        return;
      case "active":
        disposeInOrder(
          [owned.unsubscribe, () => owned.runtime.project.dispose(), releaseHost],
          RESOURCE_FAILURE,
        );
        return;
      case "ended":
        return;
      default:
        return unreachable(owned, "playground lifecycle");
    }
  };
}
