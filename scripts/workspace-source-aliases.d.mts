export function workspaceSourceAliases(...packageDirectories: readonly string[]): readonly {
  readonly find: RegExp;
  readonly replacement: string;
}[];

export function builtInMovesPlugin(): {
  readonly name: string;
  readonly resolveId: (id: string) => string | null;
};
