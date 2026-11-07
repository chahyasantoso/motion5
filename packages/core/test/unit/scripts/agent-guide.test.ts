import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const ROOT = new URL("../../../../../", import.meta.url);
const guide = readFileSync(new URL("docs/guide/agent-motion.md", ROOT), "utf8");
const manifest: { readonly scripts: Readonly<Record<string, string>> } = JSON.parse(
  readFileSync(new URL("package.json", ROOT), "utf8"),
);

describe("agent guide", () => {
  it("names only npm scripts that exist", () => {
    const named = [...guide.matchAll(/npm run ([\w:-]+)|`(motion:[\w-]+)`/g)].map(
      (match) => match[1] ?? match[2] ?? "",
    );
    expect(named.length).toBeGreaterThan(0);
    for (const script of named) expect(Object.keys(manifest.scripts)).toContain(script);
  });

  it("points only at paths that exist", () => {
    const paths = [...guide.matchAll(/`((?:apps|packages)\/[\w./-]+)`/g)].map((match) => match[1]);
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) expect(existsSync(new URL(path ?? "", ROOT)), path).toBe(true);
    for (const page of ["src/timing-main.tsx", "src/TimingBeat.tsx"])
      expect(existsSync(new URL(`apps/react-demo/${page}`, ROOT)), page).toBe(true);
  });

  it("stays reachable from the guide index and the agent rules", () => {
    expect(readFileSync(new URL("docs/guide/README.md", ROOT), "utf8")).toContain(
      "./agent-motion.md",
    );
    expect(readFileSync(new URL("AGENTS.md", ROOT), "utf8")).toContain(
      "docs/guide/agent-motion.md",
    );
  });
});
