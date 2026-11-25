import type { ZoneMargins } from "./api";
import { safeBands } from "./presets";

/** The reserved margins of a platform, drawn over the frame as bands. */
export function SafeOverlay(props: { readonly zone: ZoneMargins }): React.JSX.Element {
  const band = safeBands(props.zone);
  return (
    <div className="safe-overlay" data-safe-zone={props.zone.name} aria-hidden="true">
      <span className="safe-band safe-top" style={{ height: `${band.top}%` }} />
      <span className="safe-band safe-bottom" style={{ height: `${band.bottom}%` }} />
      <span
        className="safe-band safe-left"
        style={{ top: `${band.top}%`, bottom: `${band.bottom}%`, width: `${band.left}%` }}
      />
      <span
        className="safe-band safe-right"
        style={{ top: `${band.top}%`, bottom: `${band.bottom}%`, width: `${band.right}%` }}
      />
    </div>
  );
}
