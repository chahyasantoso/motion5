export interface RepoMetrics {
  alwaysReadBytes: number;
  srcCommentBytes: number;
  markdownBytes: number;
  testOutputBytes: number | undefined;
}

export function bytesOf(path: string): number;
export function alwaysReadPaths(agentsSource: string): string[];
export function commentBytes(source: string): number;
export function trackedFiles(repoRoot?: string): string[];
export function readCachedTestOutput(repoRoot?: string): number | undefined;
export function measure(repoRoot?: string): RepoMetrics;
export function missingAlwaysRead(repoRoot?: string): string[];
export function formatLine(metrics: RepoMetrics): string;
export function measureTestOutput(repoRoot?: string): string | undefined;
export function scan(repoRoot?: string): string[];
export function main(argv?: string[], repoRoot?: string): number;
