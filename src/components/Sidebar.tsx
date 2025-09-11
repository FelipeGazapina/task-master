import { Home, Users, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: "/app", label: "Home", icon: Home },
  { path: "/app/teams", label: "Gerenciar Times", icon: Users },
  { path: "/app/projects", label: "Projetos", icon: Folder },
];

export default function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  return (
    <aside className="w-72 glass-subtle border-r border-border/30 p-6">
      <nav className="space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-12 text-base font-medium",
                isActive && "shadow-lg shadow-primary/25"
              )}
              onClick={() => onNavigate(item.path)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
