import { tool } from "./load.mjs";
const { parseInitArgs, initProject, refreshPages } = await import(tool("scene/init"));
const { shippedSkill } = await import(tool("scene/skill"));
const { callerDir, piecesRoot } = await import(tool("page/root"));

const args = parseInitArgs(process.argv.slice(2));
const result = (() => {
  if (args.kind === "usage") return { kind: "refused", message: args.message };
  if (!args.refresh) return initProject(callerDir(), args.folder, shippedSkill());
  const found = piecesRoot(callerDir());
  return found.kind === "missing"
    ? { kind: "refused", message: found.message }
    : refreshPages(found.root);
})();
console.log(JSON.stringify(result));
if (result.kind !== "written") process.exitCode = 1;
