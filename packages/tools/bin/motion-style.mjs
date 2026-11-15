import { tool } from "./load.mjs";
const { callerDir, piecesRoot } = await import(tool("page/root"));
const { checkStyle, measureStyle } = await import(tool("scene/style"));

const USAGE = "usage: motion:style measure|check <brief> [--root dir]";

async function main(argv) {
  const [command, brief, ...rest] = argv;
  if (
    (command !== "measure" && command !== "check") ||
    brief === undefined ||
    brief.startsWith("--")
  )
    return fail(USAGE);
  let flag;
  if (rest.length === 2 && rest[0] === "--root") flag = rest[1];
  else if (rest.length > 0) return fail(USAGE);
  const found = piecesRoot(callerDir(), flag);
  if (found.kind === "missing") return fail(found.message);
  const root = found.root;
  if (command === "measure") {
    const made = await measureStyle(root, brief);
    if (made.kind === "refused") return fail(made.message);
    console.log(made.file);
    for (const [field, [low, high]] of Object.entries(made.card.lively))
      console.log(`${field}: ${low} to ${high}`);
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
