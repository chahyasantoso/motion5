import { unreachable } from "@gerak/core";
import type { FollowState } from "../protocol";

/** Who drives the canvas: a pill while the agent does, and the way back when the person took over. */
export function FollowPill(props: {
  readonly state: FollowState;
  readonly onResume: () => void;
}): React.JSX.Element | null {
  switch (props.state) {
    case "idle":
      return null;
    case "following":
      return (
        <div className="follow-pill" data-follow="following">
          Agent driving
        </div>
      );
    case "detached":
      return (
        <div className="follow-pill" data-follow="detached">
          <span>Manual</span>
          <button type="button" aria-label="Resume follow" onClick={props.onResume}>
            Resume follow
          </button>
        </div>
      );
    default:
      return unreachable(props.state);
  }
}
