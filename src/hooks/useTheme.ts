import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  // Carrega o tema do localStorage após o componente montar
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    
    const applyTheme = (newTheme: Theme) => {
      root.classList.remove("light", "dark");
      
      if (newTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
        return;
      }
      
      root.classList.add(newTheme);
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  return {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
  };
}