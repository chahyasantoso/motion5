import type { StudioCommand } from "./protocol";

function text(from: unknown, key: string): string | undefined {
  const found: unknown = Reflect.get(Object(from), key);
  return typeof found === "string" ? found : undefined;
}

function amount(value: unknown, key: string, min: number): number | undefined | "bad" {
  const found: unknown = Reflect.get(Object(value), key);
  if (found === undefined) return undefined;
  return typeof found === "number" && Number.isFinite(found) && found >= min ? found : "bad";
}

function optionalText(value: unknown, key: string): string | undefined | "bad" {
  const found: unknown = Reflect.get(Object(value), key);
  if (found === undefined) return undefined;
  return typeof found === "string" ? found : "bad";
}

function focusOf(target: unknown): Extract<StudioCommand, { kind: "focus" }>["target"] | undefined {
  switch (text(target, "kind")) {
    case "all":
      return { kind: "all" };
    case "scene": {
      const name = text(target, "name");
      return name === undefined ? undefined : { kind: "scene", name };
    }
    case "shot": {
      const name = text(target, "name");
      return name === undefined ? undefined : { kind: "shot", name };
    }
    case "shot-index": {
      const index = amount(target, "index", 0);
      return typeof index === "number" && Number.isInteger(index)
        ? { kind: "shot-index", index }
        : undefined;
    }
    default:
      return undefined;
  }
}

function seekOf(target: unknown): Extract<StudioCommand, { kind: "seek" }>["target"] | undefined {
  switch (text(target, "kind")) {
    case "ms": {
      const ms = amount(target, "ms", 0);
      return typeof ms === "number" ? { kind: "ms", ms } : undefined;
    }
    case "scroll": {
      const px = amount(target, "px", 0);
      return typeof px === "number" ? { kind: "scroll", px } : undefined;
    }
    case "selector": {
      const selector = text(target, "selector");
      return selector === undefined ? undefined : { kind: "selector", selector };
    }
    default:
      return undefined;
  }
}

/** The largest page side a check may ask for, in px. */
const MAX_SIDE = 8192;

function sizesOf(
  value: unknown,
): Extract<StudioCommand, { kind: "check" }>["sizes"] | "bad" | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return "bad";
  const list: readonly unknown[] = value;
  const sizes: { width: number; height: number }[] = [];
  for (const each of list) {
    const width = amount(each, "width", 1);
    const height = amount(each, "height", 1);
    if (typeof width !== "number" || typeof height !== "number") return "bad";
    if (width > MAX_SIDE || height > MAX_SIDE) return "bad";
    sizes.push({ width, height });
  }
  return sizes;
}

/** A request body read into a command, or undefined when it names no command or a malformed one. */
export function parseCommand(body: unknown): StudioCommand | undefined {
  switch (text(body, "kind")) {
    case "status":
      return { kind: "status" };
    case "graph":
      return { kind: "graph" };
    case "focus": {
      const target = focusOf(Reflect.get(Object(body), "target"));
      return target === undefined ? undefined : { kind: "focus", target };
    }
    case "viewport": {
      const preset = text(body, "preset");
      const zone = optionalText(body, "safeZone");
      return preset === undefined || zone === "bad"
        ? undefined
        : { kind: "viewport", preset, safeZone: zone };
    }
    case "seek": {
      const target = seekOf(Reflect.get(Object(body), "target"));
      return target === undefined ? undefined : { kind: "seek", target };
    }
    case "play": {
      const from = amount(body, "from", 0);
      const to = amount(body, "to", 0);
      const speed = amount(body, "speed", 0);
      if (from === "bad" || to === "bad" || speed === "bad" || speed === 0) return undefined;
      return { kind: "play", from, to, speed };
    }
    case "select": {
      const card = text(body, "card");
      return card === undefined ? undefined : { kind: "select", card };
    }
    case "inspect": {
      const card = optionalText(body, "card");
      return card === "bad" ? undefined : { kind: "inspect", card };
    }
    case "check": {
      const sizes = sizesOf(Reflect.get(Object(body), "sizes"));
      const zone = optionalText(body, "safeZone");
      const to = amount(body, "to", 1);
      return sizes === "bad" || zone === "bad" || to === "bad"
        ? undefined
        : { kind: "check", sizes, safeZone: zone, to };
    }
    case "act": {
      const actions = text(body, "actions");
      const savePreset = optionalText(body, "savePreset");
      return actions === undefined || savePreset === "bad"
        ? undefined
        : { kind: "act", actions, savePreset };
    }
    default:
      return undefined;
  }
}
