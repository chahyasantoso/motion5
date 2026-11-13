export function withExtensions(
  text: string,
  directory: string,
  exists?: (path: string) => boolean,
  file?: string,
): string;
export function build(directories?: readonly string[], log?: (text: string) => void): number;
