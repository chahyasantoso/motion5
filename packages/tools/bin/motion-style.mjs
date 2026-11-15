import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { DEFAULT_ROOT, fromCaller } = await import("../src/page/page.ts");
const { checkStyle, measureStyle } = await import("../src/scene/style.ts");

const USAGE = "usage: motion:style measure|check <brief> [--root dir]";

async function main(argv) {
  const [command, brief, ...rest] = argv;
  if (
    (command !== "measure" && command !== "check") ||
    brief === undefined ||
    brief.startsWith("--")
  )
    return fail(USAGE);
  let root = DEFAULT_ROOT;
  if (rest.length === 2 && rest[0] === "--root") root = fromCaller(rest[1]);
  else if (rest.length > 0) return fail(USAGE);
  if (command === "measure") {
    const made = await measureStyle(root, brief);
    if (made.kind === "refused") return fail(made.message);
    console.log(made.file);
    for (const [field, quality] of Object.entries(made.card.defaults))
      console.log(`${field}: ${quality}`);
    return;
  }
  const findings = await checkStyle(root, brief);
  if (findings.length === 0) console.log("ok");
  else {
    for (const finding of findings) console.log(finding);
    process.exitCode = 1;
  }
}

function fail(message) {
  console.log(message);
  process.exitCode = 1;
}

try {
  await main(process.argv.slice(2));
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
