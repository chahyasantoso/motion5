export const COMMANDS: Readonly<
  Record<string, { readonly file: string; readonly summary: string }>
>;

/** An installed `@gerak/*` package: its name, real folder and `gerak` manifest field. */
export interface InstalledPackage {
  readonly name: string;
  readonly folder: string;
  readonly gerak: {
    readonly commands?: string;
    readonly review?: string;
  };
}

export function installedPackages(starts?: readonly string[]): readonly InstalledPackage[];

export interface ListedCommand {
  readonly url: string;
  readonly summary: string;
  readonly from: string;
}

export function listCommands(options?: {
  readonly starts?: readonly string[];
}): Promise<Readonly<Record<string, ListedCommand>>>;
