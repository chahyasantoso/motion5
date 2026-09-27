import React from "react";

/**
 * Keeps one renderer's failure inside its tab. Without it a throwing stage (a browser without
 * WebGL, say) unmounts the whole page, which is how a renderer bug reads as a blank playground.
 */
export class StageBoundary extends React.Component<
  { readonly children: React.ReactNode },
  { readonly error: unknown }
> {
  override state: { readonly error: unknown } = { error: undefined };

  static getDerivedStateFromError(error: unknown): { readonly error: unknown } {
    return { error };
  }

  override render(): React.ReactNode {
    if (this.state.error === undefined) return this.props.children;
    const message = this.state.error instanceof Error ? this.state.error.message : "unknown error";
    return (
      <p className="stage-error" role="alert">
        This renderer could not start: {message}
      </p>
    );
  }
}
