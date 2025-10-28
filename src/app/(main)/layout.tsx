import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { SearchProvider } from "@/context/search-context";

import { MenuComponent } from "@/components/menu-omponent";
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
          <MenuComponent />
          <SearchComponent />
          
          <main className="max-w-[1400px] mx-auto flex-1 w-full">
            {children}
          </main>
          
          <FooterComponent />
        </SearchProvider>
      </body>
    </html>
  );
}