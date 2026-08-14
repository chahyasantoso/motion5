import { readFile } from "node:fs/promises";

const path = process.argv[2] ?? "reports/mutation/mutation.json";
const baselinePath = process.argv[3] ?? "performance/mutation-baseline.json";
const report = JSON.parse(await readFile(path, "utf8"));
const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
const mutants = Object.values(report.files ?? {}).flatMap((file) => file.mutants ?? []);
const counts = {};
const files = {};
for (const [filePath, file] of Object.entries(report.files ?? {})) {
  const fileCounts = {};
  for (const mutant of file.mutants ?? []) {
    if (mutant.status !== "NoCoverage") fileCounts[mutant.status] = (fileCounts[mutant.status] ?? 0) + 1;
  }
  const total = Object.values(fileCounts).reduce((sum, value) => sum + value, 0);
  const killed = fileCounts.Killed ?? 0;
  files[filePath] = { total, killed, score: total === 0 ? 0 : Number(((killed / total) * 100).toFixed(2)), counts: fileCounts };
  for (const [status, count] of Object.entries(fileCounts)) counts[status] = (counts[status] ?? 0) + count;
}
const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
const killed = counts.Killed ?? 0;
const score = total === 0 ? 0 : (killed / total) * 100;
const threshold = Number(process.env.MUTATION_THRESHOLD ?? report.thresholds?.break ?? baseline.threshold);
const regressions = [];
for (const [filePath, expected] of Object.entries(baseline.files ?? {})) {
  const actual = files[filePath];
  if (actual && actual.score < expected.score) regressions.push({ filePath, expected: expected.score, actual: actual.score });
}
const result = { total, score: Number(score.toFixed(2)), threshold, counts, files, regressions };
console.log(JSON.stringify(result, null, 2));
if (!Number.isFinite(score) || score < threshold || regressions.length > 0) process.exitCode = 1;
