import { readFile } from "node:fs/promises";

const path = process.argv[2] ?? "reports/mutation/mutation.json";
const report = JSON.parse(await readFile(path, "utf8"));
const counts = {};
for (const file of Object.values(report.files ?? {})) {
  for (const mutant of file.mutants ?? []) counts[mutant.status] = (counts[mutant.status] ?? 0) + 1;
}
const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
const killed = counts.Killed ?? 0;
const score = total === 0 ? 0 : (killed / total) * 100;
console.log(JSON.stringify({ total, score: Number(score.toFixed(2)), counts }, null, 2));
