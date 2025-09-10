import { useConvexAuth } from "convex/react";
import { useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import InvitePage from "./pages/InvitePage";
import SidebarLayout from "./layouts/SidebarLayout";
import { useNavigation } from "./hooks/useNavigation";

export default function App() {
  const { isAuthenticated } = useConvexAuth();
  const { pathname, navigate } = useNavigation();

  useEffect(() => {
    if (pathname === "/" && isAuthenticated) {
      navigate("/app");
    } else if (pathname.startsWith("/app") && !isAuthenticated) {
      navigate("/");
    }
  }, [pathname, isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderAppContent = () => {
    switch (pathname) {
      case "/app":
        return <HomePage />;
      case "/app/invite":
        return <InvitePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <SidebarLayout currentPath={pathname} onNavigate={navigate}>
      {renderAppContent()}
    </SidebarLayout>
  );
}

