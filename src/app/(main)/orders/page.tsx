"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@/hooks/useAuth";

export default function OrdersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('usuario');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Redirigir a login si no hay usuario
        window.location.href = '/account/login';
      }
    } catch (err) {
      console.error('Error loading user:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Link 
        href="/"
        className="text-[#004E09] hover:opacity-70 font-medium mb-6 inline-block"
      >
        ← Volver al inicio
      </Link>

      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Pedidos</h1>
        <p className="text-gray-600 mb-6">Hola {user.name}, aquí puedes ver tus pedidos</p>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay pedidos aún</h3>
            <p className="text-gray-600 mb-4">Realiza tu primer pedido ahora</p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-[#004E09] text-white rounded-lg hover:bg-[#003707] transition-colors"
            >
              Ir al catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}