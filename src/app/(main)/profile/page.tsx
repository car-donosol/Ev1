"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@/hooks/useAuth";

export default function ProfilePage() {
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mi Perfil</h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {/* Avatar y nombre */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#004E09] rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <hr className="my-6" />

          {/* Información de la cuenta */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de la Cuenta</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">ID de Usuario</label>
                <p className="text-gray-800 font-medium">{user.id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Nombre</label>
                <p className="text-gray-800 font-medium">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Correo Electrónico</label>
                <p className="text-gray-800 font-medium">{user.email}</p>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          {/* Acciones rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/orders"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-6 h-6 text-[#004E09]"
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
              <div>
                <p className="font-semibold text-gray-800">Mis Pedidos</p>
                <p className="text-sm text-gray-600">Ver historial de pedidos</p>
              </div>
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem('usuario');
                window.location.href = '/account/login';
              }}
              className="flex items-center gap-3 p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-left"
            >
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <div>
                <p className="font-semibold text-red-600">Cerrar Sesión</p>
                <p className="text-sm text-gray-600">Salir de tu cuenta</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}