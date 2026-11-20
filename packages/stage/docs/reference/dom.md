# @gerak/stage: dom

Browser CSS custom property helpers exported from `@gerak/stage/dom` (`cssVariables`, `isTokenName`).

- **`cssVariables`** `(tokens: Readonly<Record<string, string>>): string`: Builds a `:host { ... }` CSS rule setting each token as a custom property in order.
- **`isTokenName`** `(name: string): boolean`: Whether `name` is a valid CSS custom property name (`--` then letters, digits, `-`, `_`).
