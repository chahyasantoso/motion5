import { describe, expect, it } from "vitest";

import { AUTHORED_SCHEMA_VERSION, CORE_VERSION } from "../../src/index";

describe("@motion5/core placeholder surface", () => {
  it("pins the authored schema contract at version 5", () => {
    expect(AUTHORED_SCHEMA_VERSION).toBe(5);
  });

  it("versions the runtime independently of the authored schema", () => {
    expect(CORE_VERSION).not.toBe(String(AUTHORED_SCHEMA_VERSION));
  });
});
