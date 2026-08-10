import { readFile } from "node:fs/promises";

const files = [
  "packages/core/src/index.ts",
  "packages/react/src/index.ts",
];
const required = ["AUTHORED_SCHEMA_VERSION", "validateV5", "createManualClock", "CORE_VERSION"];
for (const path of files) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  if (path.endsWith("core/src/index.ts")) {
    const missing = required.filter((name) => !source.includes(name));
    if (missing.length > 0) {
      console.error(`public entrypoint is missing: ${missing.join(", ")}`);
      process.exitCode = 1;
    }
  }
}
if (process.exitCode !== 1) console.log("public entrypoint smoke check passed");
