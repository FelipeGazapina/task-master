import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname);
  useEffect(() => {
    const handlePop = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);
  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setPathname(to);
  };
  return { pathname, navigate };
}

export default function App() {
  const { isAuthenticated } = useConvexAuth();
  const { pathname, navigate } = usePathname();

  useEffect(() => {
    if (pathname === "/" && isAuthenticated) {
      navigate("/app");
    } else if (pathname === "/app" && !isAuthenticated) {
      navigate("/");
    }
  }, [pathname, isAuthenticated, navigate]);

  if (pathname === "/app") {
    return <DashboardPage />;
  }
  return <LoginPage />;
}

