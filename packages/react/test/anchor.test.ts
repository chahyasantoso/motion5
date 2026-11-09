import { describe, expect, it } from "vitest";
import { mergeRefs } from "@motion5/react";

describe("mergeRefs", () => {
  it("lets several ref callbacks bind one element", () => {
    const seen: string[] = [];
    const merged = mergeRefs<string>(
      (value) => void seen.push(`a:${value}`),
      (value) => void seen.push(`b:${value}`),
    );
    merged("el");
    expect(seen).toEqual(["a:el", "b:el"]);
  });
});
