import { useEffect, useState } from "react";

export function useNavigation() {
  const [pathname, setPathname] = useState(window.location.pathname);
  
  useEffect(() => {
    const handlePop = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);
  
  const navigate = (to: string) => {
    // Update history and notify all listeners (including App's hook instance)
    window.history.pushState({}, "", to);
    // Manually dispatch a popstate so other subscribers update their state
    window.dispatchEvent(new PopStateEvent("popstate"));
    setPathname(to);
  };
  
  return { pathname, navigate };
}
