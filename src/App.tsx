import { useConvexAuth } from "convex/react";
import { useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import InvitePage from "./pages/InvitePage";
import CreateTeamPage from "./pages/CreateTeamPage";
import ProjectsPage from "./pages/ProjectsPage";
import TeamsPage from "./pages/TeamsPage";
import TeamDetailsPage from "./pages/TeamDetailsPage";
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
    console.log("Current pathname:", pathname);

    // Handle dynamic routes for team details
    if (pathname.startsWith("/app/teams/")) {
      // Extract only the team id segment, ignoring trailing slash, query or hash
      const match = pathname.match(/^\/app\/teams\/([^\/\?#]+)/);
      const teamId = match?.[1];
      console.log("Extracted teamId:", teamId);
      if (teamId) {
        console.log("Rendering TeamDetailsPage for teamId:", teamId);
        return <TeamDetailsPage teamId={teamId} />;
      }
    }

    // Robust handling for static routes that may include trailing slash, query or hash
    if (
      pathname === "/app/teams" ||
      pathname === "/app/teams/" ||
      pathname.startsWith("/app/teams?") ||
      pathname.startsWith("/app/teams#")
    ) {
      return <TeamsPage />;
    }

    if (
      pathname === "/app/projects" ||
      pathname === "/app/projects/" ||
      pathname.startsWith("/app/projects?") ||
      pathname.startsWith("/app/projects#")
    ) {
      return <ProjectsPage />;
    }

    switch (pathname) {
      case "/app":
        return <HomePage />;
      case "/app/create-team":
        return <CreateTeamPage />;
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
