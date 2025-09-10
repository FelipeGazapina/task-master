interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: "/app", label: "Home", icon: "🏠" },
  { path: "/app/invite", label: "Convitar Usuário", icon: "📧" },
];

export default function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 transition-colors ${
              currentPath === item.path
                ? "bg-blue-500 text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}