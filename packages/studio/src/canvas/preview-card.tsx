import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Card, PortType } from "../graph";
import { Frame } from "./card-frame";
import { StudioContext, useStudio, type StudioValue } from "./context";
import { Glyph } from "./icons";
import { pageSrc } from "./page-src";
import { StageCapture, StageMarks } from "./pin-marks";
import { fitFrame, presetOf, PRESETS } from "./presets";
import { SafeOverlay } from "./safe-overlay";

function useSize(): readonly [
  React.RefObject<HTMLDivElement | null>,
  { width: number; height: number },
] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const element = ref.current;
    if (element === null) return undefined;
    const read = (): void => setSize({ width: element.clientWidth, height: element.clientHeight });
    read();
    const watcher = new ResizeObserver(read);
    watcher.observe(element);
    return () => watcher.disconnect();
  }, []);
  return [ref, size];
}

function Toolbar(props: { readonly id: string }): React.JSX.Element {
  const studio = useStudio();
  const { preview, zones } = studio;
  const on = preview.safeZone !== undefined;
  const profile = preview.safeZone ?? zones[0]?.name ?? "";
  return (
    <div className="toolbar nodrag nopan nowheel">
      <select
        aria-label="Size preset"
        value={presetOf(preview.preset).id}
        onChange={(event) =>
          studio.setPreview({
            preset: event.target.value,
            ...(on ? { safeZone: profile } : {}),
          })
        }
      >
        {PRESETS.map((each) => (
          <option key={each.id} value={each.id}>
            {each.label}
          </option>
        ))}
      </select>
      <label className="toggle">
        <input
          type="checkbox"
          aria-label="Safe zones"
          checked={on}
          disabled={zones.length === 0}
          onChange={(event) =>
            studio.setPreview({
              preset: preview.preset,
              ...(event.target.checked ? { safeZone: profile } : {}),
            })
          }
        />
        Safe zones
      </label>
      <select
        aria-label="Safe zone profile"
        value={profile}
        disabled={!on}
        onChange={(event) =>
          studio.setPreview({ preset: preview.preset, safeZone: event.target.value })
        }
      >
        {zones.map((zone) => (
          <option key={zone.name} value={zone.name}>
            {zone.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="record-button"
        aria-label="Record events"
        aria-pressed={studio.presets.recording}
        onClick={() => studio.presets.toggleRecord()}
      >
        {studio.presets.recording ? "■ Stop" : "● Record"}
      </button>
      <select
        aria-label="Events preset"
        value={studio.presets.selected ?? ""}
        onChange={(event) =>
          studio.presets.select(event.target.value === "" ? undefined : event.target.value)
        }
      >
        <option value="">None</option>
        {studio.presets.names.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="icon-button spacer"
        aria-label={studio.maximised === props.id ? "Restore preview" : "Maximise preview"}
        title={studio.maximised === props.id ? "Restore" : "Maximise"}
        onClick={() => studio.setMaximised(studio.maximised === props.id ? undefined : props.id)}
      >
        <Glyph name={studio.maximised === props.id ? "restore" : "maximise"} />
      </button>
    </div>
  );
}

function Surface(props: { readonly id: string }): React.JSX.Element {
  const studio = useStudio();
  const entry = studio.previews.find((each) => each.id === props.id);
  const frame = useRef<HTMLIFrameElement | null>(null);
  const [stageRef, available] = useSize();
  const { playhead } = studio;
  useEffect(() => {
    const element = frame.current;
    if (element === null) return undefined;
    playhead.attach(element);
    return () => playhead.detach();
  }, [playhead, studio.page]);
  const preset = presetOf(studio.preview.preset);
  const size = preset.size ?? { width: available.width, height: available.height };
  const fit = fitFrame(size, available);
  const zone = studio.zones.find((each) => each.name === studio.preview.safeZone);
  return (
    <div
      className="preview-surface"
      data-preview-card={props.id}
      data-source={entry?.source ?? ""}
      data-active={studio.activePreview === props.id}
      onPointerDownCapture={() => studio.activate(props.id)}
    >
      <Toolbar id={props.id} />
      <div className="preview-stage nodrag nopan nowheel" ref={stageRef}>
        {studio.page === null ? (
          <p className="dim">This piece has no page to preview.</p>
        ) : (
          <div
            className="preview-frame"
            data-preset={preset.id}
            style={{ width: fit.width, height: fit.height }}
          >
            <iframe
              ref={frame}
              title="Preview"
              data-preview=""
              data-preview-id={props.id}
              src={pageSrc(studio.page)}
              style={{
                width: size.width,
                height: size.height,
                transform: `scale(${fit.scale})`,
              }}
            />
            {zone === undefined ? null : <SafeOverlay zone={zone} />}
            <StageMarks scale={fit.scale} />
            <StageCapture pageWidth={size.width} />
          </div>
        )}
      </div>
    </div>
  );
}

/** A preview card: the real page in an iframe with its own playhead, at a size preset, with safe zones. */
export function PreviewCard(props: {
  readonly card: Card;
  readonly ports: readonly PortType[];
  readonly selected: boolean;
}): React.JSX.Element {
  const base = useStudio();
  const id = props.card.id;
  const own: StudioValue = {
    ...base,
    playhead: base.playheadOf(id),
    preview: base.previewOf(id),
    setPreview: (next) => base.setPreviewOf(id, next),
  };
  const shown = base.maximised === id && base.host !== null;
  return (
    <StudioContext.Provider value={own}>
      <Frame card={props.card} ports={props.ports} selected={props.selected}>
        {shown ? <p className="dim">Maximised</p> : <Surface id={id} />}
        {shown && base.host !== null
          ? createPortal(
              <div className="preview-maximised" data-maximised="">
                <Surface id={id} />
              </div>,
              base.host,
            )
          : null}
      </Frame>
    </StudioContext.Provider>
  );
}
