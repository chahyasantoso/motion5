import { createElement, useState, type FC } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clockDriver } from "@gerak/dom";
import { clockLengthMs, LiveStage } from "../src/live/host";

const One: FC = () => {
  const [label] = useState("one");
  return createElement("p", null, label);
};

const Two: FC = () => {
  const [left] = useState("two");
  const [right] = useState("hooks");
  return createElement("p", null, `${left} ${right}`);
};

const Broken: FC = () => {
  throw new Error("this component cannot render");
};

describe("LiveStage", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const shown = (root: ReactTestRenderer): unknown => root.toJSON();

  it("mounts a swapped component afresh when its hooks no longer line up, and reports nothing", async () => {
    const errors: string[] = [];
    const onError = (message: string): void => {
      errors.push(message);
    };
    let root: ReactTestRenderer | undefined;
    await act(async () => {
      root = create(createElement(LiveStage, { Component: One, onError }));
    });
    if (root === undefined) throw new Error("Render failed");
    const rendered = root;
    await act(async () => {
      rendered.update(createElement(LiveStage, { Component: Two, onError }));
    });
    expect(shown(rendered)).toMatchObject({ type: "p", children: ["two hooks"] });
    expect(errors).toEqual([]);
  });

  it("reports a component that cannot render, stays up, and shows the next one that can", async () => {
    const errors: string[] = [];
    const onError = (message: string): void => {
      errors.push(message);
    };
    let root: ReactTestRenderer | undefined;
    await act(async () => {
      root = create(createElement(LiveStage, { Component: One, onError }));
    });
    if (root === undefined) throw new Error("Render failed");
    const rendered = root;
    await act(async () => {
      rendered.update(createElement(LiveStage, { Component: Broken, onError }));
    });
    expect(shown(rendered)).toBeNull();
    expect(errors).toEqual(["this component cannot render"]);
    await act(async () => {
      rendered.update(createElement(LiveStage, { Component: One, onError }));
    });
    expect(shown(rendered)).toMatchObject({ type: "p", children: ["one"] });
  });
});

describe("clockLengthMs", () => {
  it("reads the length from the driver's own clock, and 0 where there is none", () => {
    const frames = { requestFrame: () => 1, cancelFrame: () => undefined };
    expect(clockLengthMs(clockDriver({ duration: 4200, autoplay: false, frames }))).toBe(4200);
    expect(clockLengthMs(undefined)).toBe(0);
  });
});
