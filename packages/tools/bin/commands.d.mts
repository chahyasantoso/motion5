export const COMMANDS: Readonly<
  Record<string, { readonly file: string; readonly summary: string }>
>;

export interface ListedCommand {
  readonly url: string;
  readonly summary: string;
  readonly from: string;
}

export function listCommands(options?: {
  readonly starts?: readonly string[];
}): Promise<Readonly<Record<string, ListedCommand>>>;
