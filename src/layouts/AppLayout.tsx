import { useAuthActions } from "@convex-dev/auth/react";
import { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggleCompact } from "@/components/ThemeToggle";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { signOut } = useAuthActions();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass-strong border-b border-border/30">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Task Master
          </h1>
          <div className="flex items-center gap-3">
            <ThemeToggleCompact />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void signOut()}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        {children}
      </div>
    </div>
  );
}