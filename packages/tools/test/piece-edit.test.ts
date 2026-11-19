import { describe, expect, it } from "vitest";
import { addToPiece, type PieceAddition } from "../src/scene/piece-edit";

const css = (rules: string): string => `\`\n${rules}\n\``;

function piece(parts: {
  chain?: string;
  css?: string;
  defs?: string;
  frame?: string | null;
}): string {
  const defs = parts.defs === undefined ? "" : `\n  defs: \`${parts.defs}\`,`;
  const options =
    parts.frame === null ? "" : `{ frame: ${parts.frame ?? "{ width: 100, height: 80 }"} }`;
  return `import { box, sceneBuilder } from "@gerak/stage";

export const skin = {
  css: ${parts.css ?? css('[data-cast="a"] { z-index: 1; }')},${defs}
};

export default ${parts.chain ?? `sceneBuilder(${options}).element(box("a"))`};
`;
}

const added: PieceAddition = {
  names: ["bB"],
  members: '  .element(box("bB"))',
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
  it("appends elements to the chain and rules to the skin, adds defs when missing, and changes nothing else", () => {
    const before = piece({});
    const after = edited(before);
    expect(after).toBe(
      piece({
        chain: `sceneBuilder({ frame: { width: 100, height: 80 } }).element(box("a"))\n  .element(box("bB"))`,
        css: css('[data-cast="a"] { z-index: 1; }\n[data-cast="bB"] { z-index: 1; }'),
        defs: '<linearGradient id="b-g"/>',
      }),
    );
    expect(after.startsWith(before.slice(0, before.indexOf("export const skin")))).toBe(true);
  });

  it("appends to existing defs and reads the frame", () => {
    const before = piece({ defs: '<radialGradient id="a-g"/>\n' });
    const result = addToPiece(before, added);
    if (result.kind !== "edited") throw new Error(result.message);
    expect(result.frame).toEqual({ width: 100, height: 80 });
    expect(result.source).toContain('<radialGradient id="a-g"/>\n<linearGradient id="b-g"/>\n`');
  });

  it("refuses a piece with no scene chain, a clash of names, a clash of def ids, and an unreadable skin or frame", () => {
    const refused = (source: string, add: PieceAddition = added): string => {
      const result = addToPiece(source, add);
      if (result.kind !== "refused") throw new Error("edited");
      return result.message;
    };
    expect(refused(`export const x = 1;`)).toMatch(/sceneBuilder/);
    expect(refused(piece({ chain: "build()" }))).toMatch(/sceneBuilder/);
    expect(refused(piece({}), { ...added, names: ["a"] })).toMatch(/already has an element "a"/);
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
