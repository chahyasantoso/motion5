export interface CommandIo {
  readonly cwd: string;
  readonly out: (text: string) => void;
  readonly err: (text: string) => void;
}

export function main(argv: readonly string[], io?: CommandIo): Promise<number>;
