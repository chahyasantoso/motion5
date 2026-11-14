import { describe, expect, it } from "vitest";
import { addToPiece, type PieceAddition } from "../src/scene/piece-edit";

const css = (rules: string): string => `\`\n${rules}\n\``;

function piece(parts: {
  cast?: string;
  css?: string;
  defs?: string;
  frame?: string | null;
}): string {
  const defs = parts.defs === undefined ? "" : `\n    defs: \`${parts.defs}\`,`;
  return `import { actor, story } from "@gerak/stage";

${parts.frame === null ? "" : `export const frame = ${parts.frame ?? "{ width: 100, height: 80 }"};`}

export const cast = ${parts.cast ?? `{\n  "a": actor({ still: true }),\n}`};

export const skins = {
  dom: {
    css: ${parts.css ?? css('[data-cast="a"] { z-index: 1; }')},${defs}
  },
};
`;
}

const added: PieceAddition = {
  names: ["bB"],
  members: '  "bB": actor({ still: true }),',
  css: '[data-cast="bB"] { z-index: 1; }',
  defs: '<linearGradient id="b-g"/>',
  defIds: ["b-g"],
};

function edited(source: string, add: PieceAddition = added): string {
  const result = addToPiece(source, add);
  if (result.kind !== "edited") throw new Error(result.message);
  return result.source;
}

describe("addToPiece", () => {
  it("appends members and rules, adds defs when missing, and changes nothing else", () => {
    const before = piece({});
    const after = edited(before);
    expect(after).toBe(
      piece({
        cast: `{\n  "a": actor({ still: true }),\n  "bB": actor({ still: true }),\n}`,
        css: css('[data-cast="a"] { z-index: 1; }\n[data-cast="bB"] { z-index: 1; }'),
        defs: '<linearGradient id="b-g"/>',
      }),
    );
    expect(after.startsWith(before.slice(0, before.indexOf("export const cast")))).toBe(true);
  });

  it("appends to existing defs, through satisfies and as const, and reads the frame", () => {
    const before = piece({
      cast: `{\n  "a": actor({ still: true })\n} satisfies Record<string, unknown>`,
      defs: '<radialGradient id="a-g"/>\n',
    });
    const result = addToPiece(before, added);
    if (result.kind !== "edited") throw new Error(result.message);
    expect(result.frame).toEqual({ width: 100, height: 80 });
    expect(result.source).toContain(
      '  "a": actor({ still: true }),\n  "bB": actor({ still: true }),\n}',
    );
    expect(result.source).toContain('<radialGradient id="a-g"/>\n<linearGradient id="b-g"/>\n`');
    expect(edited(piece({ cast: `{ "a": actor({}) } as const` }))).toContain('"bB"');
  });

  it("refuses a cast that is not an object literal, a clash of names, and a clash of def ids", () => {
    const refused = (source: string, add: PieceAddition = added): string => {
      const result = addToPiece(source, add);
      if (result.kind !== "refused") throw new Error("edited");
      return result.message;
    };
    expect(refused(piece({ cast: "build()" }))).toMatch(/`cast` is not an object literal/);
    expect(refused(piece({ cast: "[]" }))).toMatch(/not an object literal/);
    expect(refused(piece({}), { ...added, names: ["a"] })).toMatch(/already has a member "a"/);
    expect(refused(piece({ defs: '<linearGradient id="b-g"/>' }))).toMatch(
      /already has the id "b-g"/,
    );
    expect(refused(piece({ css: "style()" }))).toMatch(/css/);
    expect(refused(piece({ frame: "size()" }))).toMatch(/frame/);
  });

  it("reads a piece with no frame as the stage's default 1280 by 720", () => {
    const result = addToPiece(piece({ frame: null }), added);
    if (result.kind !== "edited") throw new Error(result.message);
    expect(result.frame).toEqual({ width: 1280, height: 720 });
  });
});
