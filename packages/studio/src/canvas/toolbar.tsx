import { useState } from "react";
import { Glyph } from "./icons";
import { toggleTheme, type Theme } from "./theme";
import { effectiveTheme } from "./theme";

/** The piece name, a frame-all button and the theme switch, over the canvas. */
export function Toolbar(props: {
  readonly piece: string;
  readonly onFrame: () => void;
}): React.JSX.Element {
  const [theme, setTheme] = useState<Theme>(effectiveTheme);
  return (
    <div className="studio-toolbar">
      <strong className="piece-name">{props.piece}</strong>
      <button type="button" onClick={props.onFrame} title="Frame all (F)">
        Frame all
      </button>
      <button
        type="button"
        className="icon-button"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        onClick={() => setTheme(toggleTheme())}
      >
        <Glyph name="theme" />
      </button>
    </div>
  );
}
