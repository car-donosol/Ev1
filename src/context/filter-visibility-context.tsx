"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface FilterVisibilityContextType {
  showFilterButton: boolean;
}

const FilterVisibilityContext = createContext<FilterVisibilityContextType | undefined>(undefined);

export function FilterVisibilityProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showFilterButton, setShowFilterButton] = useState(true);

  useEffect(() => {
    // Rutas donde NO mostrar el botón de filtro
    const hiddenRoutes = ['/contact', '/orders', '/profile', '/account/login'];
    
    const shouldHide = hiddenRoutes.some(route => pathname.startsWith(route));
    setShowFilterButton(!shouldHide);
  }, [pathname]);

  return (
    <FilterVisibilityContext.Provider value={{ showFilterButton }}>
      {children}
    </FilterVisibilityContext.Provider>
  );
}

export function useFilterVisibility() {
  const context = useContext(FilterVisibilityContext);
  if (!context) {
    throw new Error("useFilterVisibility must be used within FilterVisibilityProvider");
  }
  return context;
}