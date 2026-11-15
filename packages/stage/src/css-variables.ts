import { isTokenName } from "@gerak/moves";

/** A `:host` rule setting each token as a custom property, in the tokens' order; empty for none. */
export function cssVariables(tokens: Readonly<Record<string, string>>): string {
  const entries = Object.entries(tokens);
  if (entries.length === 0) return "";
  const lines = entries.map(([name, value]) => {
    if (!isTokenName(name))
      throw new Error(`token "${name}" is not "--" and letters, digits, "-" or "_"`);
    if (/[;{}]/.test(value)) throw new Error(`token "${name}" holds ";", "{" or "}"`);
    return `${name}: ${value};`;
  });
  return `:host { ${lines.join(" ")} }`;
}
