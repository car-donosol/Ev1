import { Suspense } from "react";
import Productos from "@/components/server/productos";

import HomePage from "@/app/(main)/home/page";


export default function Home() {
  return (
    <div className="desktop-md:px-6">
      <Suspense fallback={<div>Cargando productos...</div>}>
        <HomePage />
      </Suspense>
    </div>
  );
}
