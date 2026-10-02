import { unreachable } from "../filler/unreachable";
import type { LandmarkSource, SourceSample } from "./source";
import type { SourceSpec } from "./sources";

/** Why a running source ended, a closed union: the page reports a failure and nothing else. */
export type SessionEnd =
  | { readonly kind: "stopped" }
  | { readonly kind: "failed"; readonly error: unknown };

/**
 * A sample stamped by the session that delivered it: `session` counts started sources from 1 and
 * `sequence` counts that source's samples from 0, so a consumer can tell a new subject from a late
 * sample of an old one without trusting the source's clock to say so.
 */
export interface SessionSample extends SourceSample {
  readonly session: number;
  readonly sequence: number;
}

/** What the page does around one source; the session decides when, the hooks decide what. */
export interface SessionHooks {
  /** Builds the source for a spec; creating one must acquire nothing (`createLandmarkSource`). */
  create(spec: SourceSpec): LandmarkSource;
  /** Before the source starts. Resetting subject state is the ingest gate's, on the first sample. */
  begin(spec: SourceSpec): void;
  /** One stamped sample of the running source. A throw ends the session as `failed`. */
  sample(sample: SessionSample): void;
  /** Exactly once per started source, after it is stopped, whichever way it ended. */
  end(spec: SourceSpec, ending: SessionEnd): void;
}

export interface SourceSession {
  /** The running source's spec, or `undefined` when none runs. */
  readonly running: SourceSpec | undefined;
  /** Ends any running source as `stopped`, then begins and starts `spec`. */
  start(spec: SourceSpec): void;
  /** Ends the running source as `stopped`; a no-op when none runs. */
  stop(): void;
}

/**
 * The one owner of the live source's lifecycle: at most one source runs, every started source ends
 * exactly once, and an end is reported after the source is stopped. A consumer that throws, a start
 * that rejects and an explicit stop all end the same way, through `end`, so the page has one place
 * to finish a recording and reset its controls. A late rejection or sample from a source that was
 * already replaced is ignored: it belongs to a session that has ended.
 */
export function createSourceSession(hooks: SessionHooks): SourceSession {
  let current: { readonly spec: SourceSpec; readonly source: LandmarkSource } | undefined;
  let sessions = 0;
  const finish = (ending: SessionEnd) => {
    const ended = current;
    if (ended === undefined) return;
    current = undefined;
    ended.source.stop();
    hooks.end(ended.spec, ending);
  };
  const session: SourceSession = {
    get running() {
      return current?.spec;
    },
    start(spec) {
      finish({ kind: "stopped" });
      hooks.begin(spec);
      const source = hooks.create(spec);
      const mine = { spec, source };
      current = mine;
      sessions += 1;
      const session = sessions;
      let sequence = 0;
      const fail = (error: unknown) => {
        if (current === mine) finish({ kind: "failed", error });
      };
      source
        .start((sample) => {
          if (current !== mine) return;
          try {
            hooks.sample({ ...sample, session, sequence: sequence++ });
          } catch (error) {
            fail(error);
          }
        })
        .catch(fail);
    },
    stop() {
      finish({ kind: "stopped" });
    },
  };
  return session;
}

/** What the page says about one ending; `undefined` for an ordinary stop. */
export function describeEnd(label: string, ending: SessionEnd): string | undefined {
  switch (ending.kind) {
    case "stopped":
      return undefined;
    case "failed":
      return `${label} failed: ${String(ending.error)}`;
    default:
      return unreachable(ending, "session end");
  }
}
