import { Suspense } from "react";
import Productos from "@/components/server/productos";

export default function Home() {
  return (
    <div className="">
      <Suspense fallback={<div>Cargando productos...</div>}>
        <Productos />
      </Suspense>
    </div>
  );
}
