import { useState, useCallback } from "react";

// Custom hook - returns state & toggle fn, NOT JSX
function useMobile() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  return { isMobileOpen, toggleMobile };
}

export default useMobile;
