import { useAuthActions } from "@convex-dev/auth/react";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { signOut } = useAuthActions();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Task Master</h1>
          <button
            className="bg-slate-200 dark:bg-slate-800 text-dark dark:text-light rounded-md px-2 py-1"
            onClick={() => void signOut()}
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="flex flex-1">
        {children}
      </div>
    </div>
  );
}