/** A `:host` rule setting each token as a custom property, in the tokens' order; empty for none. */
export function cssVariables(tokens: Readonly<Record<string, string>>): string {
  const entries = Object.entries(tokens);
  if (entries.length === 0) return "";
  const lines = entries.map(([name, value]) => {
    if (!name.startsWith("--")) throw new Error(`token "${name}" does not start with "--"`);
    if (/[;{}]/.test(value)) throw new Error(`token "${name}" holds ";", "{" or "}"`);
    return `${name}: ${value};`;
  });
  return `:host { ${lines.join(" ")} }`;
}
