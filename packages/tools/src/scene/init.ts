import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { pageFiles } from "./page-files";

/** What `gerak init` did: the files it wrote, or why it wrote nothing. */
export type InitResult =
  | { readonly kind: "written"; readonly files: readonly string[] }
  | { readonly kind: "refused"; readonly message: string };

/** The command line: set a project up in a folder, or refresh the page files of the folder it names. */
export type InitArgs =
  | { readonly kind: "init"; readonly folder: string; readonly refresh: boolean }
  | { readonly kind: "usage"; readonly message: string };

const USAGE = "usage: gerak init [folder] [--refresh]";
const SKILL_FILE = ".claude/skills/make-motion/SKILL.md";
const SKILL_IN_GUIDE = "skill/make-motion/SKILL.md";
const GUIDE_LINK = "../../../node_modules/@gerak/tools/guide/";

export function parseInitArgs(argv: readonly string[]): InitArgs {
  const positional = argv.filter((arg) => !arg.startsWith("-"));
  const flags = argv.filter((arg) => arg.startsWith("-"));
  const unknown = flags.find((flag) => flag !== "--refresh");
  if (unknown !== undefined)
    return { kind: "usage", message: `Unknown option ${unknown}. ${USAGE}` };
  if (positional.length > 1) return { kind: "usage", message: USAGE };
  const refresh = flags.length > 0;
  if (refresh && positional.length > 0)
    return { kind: "usage", message: `--refresh takes no folder. ${USAGE}` };
  return { kind: "init", folder: positional[0] ?? "pieces", refresh };
}

function manifestFolder(start: string): string | undefined {
  for (let dir = resolve(start); ; dir = dirname(dir)) {
    if (existsSync(join(dir, "package.json"))) return dir;
    if (dirname(dir) === dir) return undefined;
  }
}

function parseManifest(file: string): Record<string, unknown> | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return undefined;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return undefined;
  return Object.fromEntries(Object.entries(parsed));
}

function agentsText(folder: string): string {
  return [
    "# Agent instructions",
    "",
    "This project makes motion with gerak, a TypeScript library of moves, scenes and pages.",
    "",
    "- Read `node_modules/@gerak/tools/guide/agent-motion.md` before making motion.",
    `- The pieces folder is \`${folder}\`.`,
    "",
  ].join("\n");
}

function write(file: string, text: string): void {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
}

/** Sets the project at or above `cwd` up for gerak, writing nothing when any file it would write exists. */
export function initProject(
  cwd: string,
  folderArg: string,
  guide: Readonly<Record<string, string>>,
): InitResult {
  const project = manifestFolder(cwd);
  if (project === undefined)
    return { kind: "refused", message: "No package.json: run gerak init inside your project." };
  const manifestFile = join(project, "package.json");
  const manifest = parseManifest(manifestFile);
  if (manifest === undefined)
    return { kind: "refused", message: "package.json is not a JSON object." };
  const gerak = manifest.gerak;
  if (gerak !== undefined && (typeof gerak !== "object" || gerak === null || Array.isArray(gerak)))
    return { kind: "refused", message: 'package.json\'s "gerak" is not an object.' };
  const folder = relative(project, resolve(cwd, folderArg)).split("\\").join("/");
  if (folder === "" || folder === ".." || folder.startsWith("../") || isAbsolute(folder))
    return { kind: "refused", message: "The pieces folder must be inside the project." };
  const target = join(project, folder);
  if (existsSync(target) && !statSync(target).isDirectory())
    return { kind: "refused", message: `${folder} is a file, not a folder.` };
  const skill = guide[SKILL_IN_GUIDE];
  if (skill === undefined) return { kind: "refused", message: "The shipped guide has no skill." };
  const pages = pageFiles();
  const targets = [
    ...Object.keys(pages).map((name) => `${folder}/${name}`),
    SKILL_FILE,
    "AGENTS.md",
  ];
  const existing = targets.filter((target) => existsSync(join(project, target)));
  const named = gerak !== undefined && gerak !== null && Reflect.get(gerak, "pieces") !== undefined;
  const clash = [...existing, ...(named ? ["package.json (gerak.pieces)"] : [])];
  if (clash.length > 0)
    return { kind: "refused", message: `Already set up, nothing written: ${clash.join(", ")}.` };
  for (const [name, text] of Object.entries(pages)) write(join(project, folder, name), text);
  write(join(project, SKILL_FILE), skill.replaceAll("../../", GUIDE_LINK));
  write(join(project, "AGENTS.md"), agentsText(folder));
  const kept = gerak === undefined || gerak === null ? [] : Object.entries(gerak);
  const next = { ...manifest, gerak: { ...Object.fromEntries(kept), pieces: folder } };
  write(manifestFile, `${JSON.stringify(next, null, 2)}\n`);
  return { kind: "written", files: [...targets, "package.json"] };
}

/** Rewrites the six page files of an existing pieces folder and nothing else. */
export function refreshPages(root: string): InitResult {
  const pages = pageFiles();
  for (const [name, text] of Object.entries(pages)) write(join(root, name), text);
  return { kind: "written", files: Object.keys(pages).map((name) => join(root, name)) };
}
