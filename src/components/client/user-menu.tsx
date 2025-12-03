"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { User } from "@/types/user.types";

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

/**
 * Helper function to format user's display name (primer nombre + apellido paterno)
 * Se muestra en el navbar para mantener compacto
 */
function getUserDisplayName(user: User): string {
  return `${user.pnombre} ${user.appaterno}`;
}

/**
 * Helper function to format user's full name (for menu details)
 */
function getUserFullName(user: User): string {
  const parts = [
    user.pnombre,
    user.snombre,
    user.appaterno,
    user.apmaterno
  ].filter(Boolean);
  return parts.join(' ');
}

/**
 * Helper function to get user's initials
 */
function getUserInitials(user: User): string {
  if (user.pnombre && user.appaterno) {
    return `${user.pnombre.charAt(0)}${user.appaterno.charAt(0)}`.toUpperCase();
  }
  return user.pnombre?.charAt(0).toUpperCase() || 'U';
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  const displayName = getUserDisplayName(user); // Para el navbar
  const fullName = getUserFullName(user);       // Para el menú desplegable
  const initials = getUserInitials(user);

  return (
    <div ref={menuRef} className="relative">
      {/* Botón del usuario */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 bg-[#004E09] rounded-full flex items-center justify-center text-white text-sm font-bold">
          {initials}
        </div>
        <span className="text-[1.1rem] font-medium text-gray-800 hidden md:inline">
          {displayName}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 hidden md:inline ${isOpen ? "rotate-180" : ""
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {/* Menú flotante */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header con info del usuario */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm text-gray-600">Sesión iniciada como</p>
            <p className="font-semibold text-gray-800">{fullName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          {/* Opciones del menú */}
          <div className="py-2">
            <Link
              href="/orders"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="w-4 h-4 text-[#004E09]"
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
              <span>Ver pedidos</span>
            </Link>

            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="w-4 h-4 text-[#004E09]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Mi perfil</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-gray-100 mt-2 pt-2"
            >
              <svg
                className="w-4 h-4"
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
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}