import { useState } from "react";
import { atToken } from "../agent-port-pin";
import type { StudioPromptContext } from "../agent-port";

/** Over the canvas while one card is selected: the capability label, a copy-reference button and the agent slot. */
export function SelectionToolbar(props: {
  readonly label: string;
  readonly context: () => StudioPromptContext;
}): React.JSX.Element {
  const [token, setToken] = useState("");
  const copy = (): void => {
    const next = atToken(props.context());
    setToken(next);
    void navigator.clipboard.writeText(next).catch(() => undefined);
  };
  return (
    <div className="selection-toolbar" data-selection-toolbar="">
      <span className="dim" data-capability="">
        {props.label}
      </span>
      <button type="button" data-token={token} onClick={copy}>
        Copy @card
      </button>
      <span data-agent-slot="selection" />
    </div>
  );
}
