import { ReactNode } from "react";
import AppLayout from "./AppLayout";
import Sidebar from "../components/Sidebar";

interface SidebarLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: ReactNode;
}

export default function SidebarLayout({ currentPath, onNavigate, children }: SidebarLayoutProps) {
  return (
    <AppLayout>
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
      <main className="flex-1 p-8">
        {children}
      </main>
    </AppLayout>
  );
}