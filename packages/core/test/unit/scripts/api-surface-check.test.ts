import { describe, expect, it } from "vitest";
import { checkApiSurface } from "../../../../scripts/api-surface-check.mjs";

describe("P6-01 API surface checker", () => {
  it("accepts the committed public declaration surface", async () => {
    await expect(checkApiSurface()).resolves.toEqual({ ok: true, errors: [] });
  });

  it("rejects an extra public export in a generated declaration fixture", async () => {
    await expect(
      checkApiSurface({
        declarationText: "export declare const CORE_VERSION: string;\nexport declare const HACK: string;\n",
      }),
    ).resolves.toEqual({
      ok: false,
      errors: ["Unexpected value export: HACK"],
    });
  });

  it("rejects a missing public export", async () => {
    await expect(
      checkApiSurface({ declarationText: "export declare const CORE_VERSION: string;\n" }),
    ).resolves.toEqual({
      ok: false,
      errors: ["Missing value export: AUTHORED_SCHEMA_VERSION"],
    });
  });

  it("rejects reachable implementation declarations", async () => {
    await expect(
      checkApiSurface({
        declarationText:
          'export declare const CORE_VERSION: string;\nexport type Leaked = import("./runtime/project-runtime").ProjectRuntime;\n',
      }),
    ).resolves.toEqual({
      ok: false,
      errors: ["Forbidden declaration path: ./runtime/project-runtime"],
    });
  });

  it("keeps the internal entrypoint outside the public report", async () => {
    await expect(checkApiSurface({ entrypoint: "packages/core/src/internal.ts" })).resolves.toEqual({
      ok: true,
      errors: [],
    });
  });
});
