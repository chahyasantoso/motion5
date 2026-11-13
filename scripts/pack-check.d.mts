import type { InstallableManifest } from "./installable-packages.mjs";

export function allSpecifiers(
  directories?: readonly string[],
  read?: (directory: string) => InstallableManifest,
): string[];
export function formatResult(specifier: string, error?: string): string;
export function firstErrorLine(stderr: string): string;
export function missingExportFiles(
  manifest: Pick<InstallableManifest, "name" | "exports">,
  exists: (file: string) => boolean,
): { specifier: string; error: string }[];
export function peerVersions(
  lock: { packages?: Record<string, { version?: string }> },
  names?: readonly string[],
): string[];
export function typeCheckFiles(specifiers: readonly string[]): Record<string, string>;
export function packCheck(options?: { keep?: boolean; log?: (text: string) => void }): number;
