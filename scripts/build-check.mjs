import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../packages/core/src/index.ts", import.meta.url), "utf8");
const required = ["AUTHORED_SCHEMA_VERSION", "validateV5", "createManualClock", "CORE_VERSION"];
const missing = required.filter((name) => !source.includes(name));
if (missing.length > 0) {
  console.error(`public entrypoint is missing: ${missing.join(", ")}`);
  process.exitCode = 1;
} else {
  console.log("public entrypoint smoke check passed");
}
