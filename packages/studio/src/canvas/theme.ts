export type Theme = "dark" | "light";

const KEY = "gerak-studio-theme";

function saved(): Theme | undefined {
  try {
    const value = window.localStorage.getItem(KEY);
    return value === "dark" || value === "light" ? value : undefined;
  } catch {
    return undefined;
  }
}

/** Applies the theme saved in this browser; with none saved, the page follows the system. */
export function applySavedTheme(): void {
  const theme = saved();
  if (theme !== undefined) document.documentElement.dataset["theme"] = theme;
}

/** The theme in effect: the saved choice, else the system's, else dark. */
export function effectiveTheme(): Theme {
  const set = document.documentElement.dataset["theme"];
  if (set === "dark" || set === "light") return set;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/** Switches to the other theme and remembers it where the browser allows. */
export function toggleTheme(): Theme {
  const next: Theme = effectiveTheme() === "dark" ? "light" : "dark";
  document.documentElement.dataset["theme"] = next;
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    return next;
  }
  return next;
}
