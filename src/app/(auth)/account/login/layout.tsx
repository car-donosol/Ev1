import type { Metadata } from "next";
import { Poppins } from "next/font/google";

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
          <main className="max-w-[1400px] mx-auto flex-1 w-full">
            {children}
          </main>
      </body>
    </html>
  );
}