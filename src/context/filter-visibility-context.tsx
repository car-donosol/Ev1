"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CartContext } from "@/context/cart-context";

interface FilterVisibilityContextType {
  showFilterButton: boolean;
}

const FilterVisibilityContext = createContext<FilterVisibilityContextType | undefined>(undefined);

function FilterVisibilityProviderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const cartContext = useContext(CartContext);
  const [showFilterButton, setShowFilterButton] = useState(true);

  useEffect(() => {
    // Rutas donde NO mostrar el botón de filtro
    const hiddenRoutes = ['/contact', '/orders', '/profile', '/account/login', '/planta'];
    
    // Verificar si está en una ruta oculta
    const isHiddenRoute = hiddenRoutes.some(route => pathname.startsWith(route));
    
    // Verificar si el carrito está visible
    const isCartVisible = cartContext?.visible;
    
    // Ocultar el botón si está en ruta oculta O si el carrito está visible
    setShowFilterButton(!isHiddenRoute && !isCartVisible);
  }, [pathname, cartContext?.visible]);

  return (
    <FilterVisibilityContext.Provider value={{ showFilterButton }}>
      {children}
    </FilterVisibilityContext.Provider>
  );
}

export function FilterVisibilityProvider({ children }: { children: React.ReactNode }) {
  return (
    <FilterVisibilityProviderInner>
      {children}
    </FilterVisibilityProviderInner>
  );
}

export function useFilterVisibility() {
  const context = useContext(FilterVisibilityContext);
  if (!context) {
    throw new Error("useFilterVisibility must be used within FilterVisibilityProvider");
  }
  return context;
}