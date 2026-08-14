export interface ApiSurfaceOptions {
  readonly entrypoint?: string;
  readonly declarationText?: string;
}
export interface ApiSurfaceResult {
  readonly ok: boolean;
  readonly errors: readonly string[];
}
export function checkApiSurface(options?: ApiSurfaceOptions): Promise<ApiSurfaceResult>;
