import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { SearchProvider } from "@/context/search-context";
import { CartProvider } from "@/context/cart-context";

import { MenuComponent } from "@/components/menu-omponent";
import { CartComponent } from "@/components/client/cart-component";
import { SearchComponent } from "@/components/search-component";
import { FooterComponent } from "@/components/footer-component";

import "@/globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Huertabeja",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${poppins.className} min-h-screen flex flex-col`}>
        <SearchProvider>
          <CartProvider>
            <MenuComponent />
            <CartComponent />
            <SearchComponent />
            
            <main className="max-w-[1400px] mx-auto flex-1 w-full">
              {children}
            </main>
            
            <FooterComponent />
          </CartProvider>
        </SearchProvider>
      </body>
    </html>
  );
}