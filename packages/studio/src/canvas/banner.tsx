import type { Problem } from "./api";

/** The last problem, over the canvas: the file and line when known, then the message, a fix-pin button and the agent slot. */
export function Banner(props: {
  readonly problem: Problem | undefined;
  readonly onQueueFix: () => void;
}): React.JSX.Element | null {
  const { problem } = props;
  if (problem === undefined) return null;
  const where =
    problem.file === undefined
      ? undefined
      : problem.line === undefined
        ? problem.file
        : `${problem.file}:${problem.line}`;
  return (
    <div className="banner" role="alert" data-banner="">
      <strong>The last good frame is kept.</strong>
      {where === undefined ? null : <span className="mono">{where}</span>}
      <span className="banner-message">{problem.message}</span>
      <button type="button" onClick={props.onQueueFix}>
        Queue fix pin
      </button>
      <span data-agent-slot="banner" />
    </div>
  );
}
