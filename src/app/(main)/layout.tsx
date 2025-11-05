import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { SearchProvider } from "@/context/search-context";
import { CartProvider } from "@/context/cart-context";
import { FilterProvider } from "@/context/filter-context";
import { FilterVisibilityProvider } from "@/context/filter-visibility-context";

import { MenuComponent } from "@/components/menu-omponent";
import { CartComponent } from "@/components/client/cart-component";
import { SearchComponent } from "@/components/search-component";
import { FooterComponent } from "@/components/footer-component";
import { FilterButton } from "@/components/client/filter-button";
import { FilterMenu } from "@/components/client/filter-menu";

import "@/globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Huertabeja",
  description: "",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${poppins.className} min-h-screen flex flex-col`}>
        <SearchProvider>
          <CartProvider>
            <FilterProvider>
              <FilterVisibilityProvider>
                <MenuComponent />
                <CartComponent />
                <SearchComponent />
                <FilterButton />
                <FilterMenu />
                
                <main className="max-w-[1400px] mx-auto flex-1 w-full">
                  {children}
                </main>
                
                <FooterComponent />
              </FilterVisibilityProvider>
            </FilterProvider>
          </CartProvider>
        </SearchProvider>
      </body>
    </html>
  );
}