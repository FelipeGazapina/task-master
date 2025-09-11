import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };


  return (
    <Select value={theme} onValueChange={(value: "light" | "dark" | "system") => setTheme(value)}>
      <SelectTrigger className="w-auto gap-2 glass-subtle border-gray-300 hover:glass hover:border-gray-400">
        {getThemeIcon()}
        <SelectValue placeholder="Tema" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Claro</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>Escuro</span>
          </div>
        </SelectItem>
        <SelectItem value="system">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>Sistema</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export function ThemeToggleCompact() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes: ("light" | "dark" | "system")[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="glass-subtle hover:glass border-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
      title={`Tema atual: ${theme === "light" ? "Claro" : theme === "dark" ? "Escuro" : "Sistema"}`}
    >
      {getThemeIcon()}
    </Button>
  );
}