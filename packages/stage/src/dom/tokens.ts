/** Whether `name` is a valid CSS custom property name (`--` then letters, digits, `-`, `_`). */
export function isTokenName(name: string): boolean {
  return /^--[A-Za-z0-9_-]+$/.test(name);
}

/** Builds a `:host { ... }` CSS rule setting each token as a custom property in order. */
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
