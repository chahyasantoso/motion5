import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const root = fileURLToPath(new URL("../../../../..", import.meta.url));

async function declarationFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await declarationFiles(path)));
    else if (entry.name.endsWith(".d.ts")) files.push(path);
  }
  return files;
}

function importedSpecifiers(source: string): string[] {
  const specifiers: string[] = [];
  for (const match of source.matchAll(/(?:from|import)\s*["']([^"']+)["']/g)) {
    const specifier = match[1];
    if (specifier !== undefined) specifiers.push(specifier);
  }
  return specifiers;
}

describe("public declaration surface (P1-9)", () => {
  it("scans the emitted entry declaration closure, not just source strings", async () => {
    const out = await mkdtemp(join(root, ".tmp-public-dts-"));
    try {
      await execFileAsync(
        "npx",
        [
          "tsc",
          "--declaration",
          "--emitDeclarationOnly",
          "--target",
          "ES2023",
          "--module",
          "ESNext",
          "--moduleResolution",
          "Bundler",
          "--strict",
          "--skipLibCheck",
          "--outDir",
          out,
          "packages/core/src/index.ts",
        ],
        { cwd: root },
      );
      const emitted = await declarationFiles(out);
      const entry = emitted.find((path) => path.endsWith("packages/core/src/index.d.ts"));
      expect(entry).toBeDefined();
      const reachable = new Set<string>();
      const queue = [entry!];
      while (queue.length > 0) {
        const current = queue.shift()!;
        if (reachable.has(current)) continue;
        reachable.add(current);
        expect(current.replaceAll("\\", "/")).not.toMatch(/\/(?:runtime|graph)\//);
        const source = await readFile(current, "utf8");
        for (const specifier of importedSpecifiers(source)) {
          if (!specifier.startsWith(".")) continue;
          const target = resolve(dirname(current), `${specifier}.d.ts`);
          if (emitted.includes(target)) queue.push(target);
        }
      }
      expect(reachable.size).toBeGreaterThan(0);
    } finally {
      await rm(out, { recursive: true, force: true });
    }
  });
});
