export interface StepResult {
  code: number;
  log: string;
}

export const STEPS: string[];
export function run(
  check?: (step: string) => StepResult,
  steps?: string[],
  log?: (text: string) => void,
): number;
export function main(repoRoot?: string): number;
