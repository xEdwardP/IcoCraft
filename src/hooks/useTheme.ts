import { useCallback, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "icocraft-theme";

function readCurrentTheme(): Theme {
  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

function applyTheme(next: Theme) {
  const root = document.documentElement;
  root.classList.add("no-transitions");
  root.classList.toggle("dark", next === "dark");
  void getComputedStyle(root).color;
  requestAnimationFrame(() => root.classList.remove("no-transitions"));
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readCurrentTheme);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode): the theme still works this session.
    }
    setTheme(next);
  }, [theme]);

  return { theme, toggleTheme };
}