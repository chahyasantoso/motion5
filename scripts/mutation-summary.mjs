import { readFile } from "node:fs/promises";

const path = process.argv[2] ?? "reports/mutation/mutation.json";
const report = JSON.parse(await readFile(path, "utf8"));
const mutants = Object.values(report.files ?? {}).flatMap((file) => file.mutants ?? []);
const counts = {};
for (const mutant of mutants) {
  if (mutant.status !== "NoCoverage") counts[mutant.status] = (counts[mutant.status] ?? 0) + 1;
}
const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
const killed = counts.Killed ?? 0;
const score = total === 0 ? 0 : (killed / total) * 100;
const threshold = Number(process.env.MUTATION_THRESHOLD ?? report.thresholds?.break ?? 0);
const result = { total, score: Number(score.toFixed(2)), threshold, counts };
console.log(JSON.stringify(result, null, 2));
if (!Number.isFinite(score) || score < threshold) process.exitCode = 1;
