import { existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import { registerStudioAgentTransport, startStudio } from "../src";

const pieces = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));
const gerak = join(pieces, ".gerak");
const hadGerak = existsSync(gerak);

describe("agent transport", () => {
  afterAll(() => {
    if (!hadGerak) rmSync(gerak, { recursive: true, force: true });
  });

  it("replaces and returns the previous transport", () => {
    const one = { provider: "one", configureServer: () => undefined };
    const two = { provider: "two", configureServer: () => undefined };
    registerStudioAgentTransport(one);
    expect(registerStudioAgentTransport(two)).toBe(one);
    expect(registerStudioAgentTransport(one)).toBe(two);
  });

  it("runs the registered transport inside the studio's own configureServer", async () => {
    let seen: unknown;
    registerStudioAgentTransport({
      provider: "probe",
      configureServer: (server) => {
        seen = server.middlewares;
      },
    });
    mkdirSync(gerak, { recursive: true });
    const started = await startStudio({ root: pieces, piece: "reel", port: 0 });
    try {
      expect(seen).toBeDefined();
    } finally {
      await started.close();
      registerStudioAgentTransport({ provider: "none", configureServer: () => undefined });
    }
  }, 60000);
});
