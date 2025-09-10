import { useEffect, useState } from "react";

export function useNavigation() {
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