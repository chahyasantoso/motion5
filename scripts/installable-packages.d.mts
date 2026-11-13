export interface InstallableManifest {
  readonly name: string;
  readonly version: string;
  readonly private?: boolean;
  readonly files?: readonly string[];
  readonly license?: string;
  readonly types?: string;
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly peerDependencies?: Readonly<Record<string, string>>;
  readonly exports: Readonly<Record<string, { readonly types: string; readonly default: string }>>;
}
export const INSTALLABLE_PACKAGES: readonly string[];
export function readManifest(directory: string): InstallableManifest;
export function exportSpecifiers(manifest: Pick<InstallableManifest, "name" | "exports">): string[];
