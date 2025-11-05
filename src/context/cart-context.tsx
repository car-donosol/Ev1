"use client";
import { createContext, useState, type ReactNode, useEffect } from 'react';
import type { VisibleTypes } from "@/types/visible.types";

export interface CartItem {
  id: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface CartContextType extends VisibleTypes {
  carrito: CartItem[];
  setCarrito: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCarrito: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'huertabeja_carrito';

export function CartProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState<boolean>(false);
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    try {
      const savedCarrito = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCarrito) {
        setCarrito(JSON.parse(savedCarrito));
      }
    } catch (err) {
      console.error('Error loading cart from localStorage:', err);
    }
    setIsHydrated(true);
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
      } catch (err) {
        console.error('Error saving cart to localStorage:', err);
      }
    }
  }, [carrito, isHydrated]);

  const addItem = (item: CartItem) => {
    setCarrito(prevCarrito => {
      const existingItem = prevCarrito.find(i => i.id === item.id);
      if (existingItem) {
        return prevCarrito.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prevCarrito, item];
    });
  };

  const removeItem = (id: number) => {
    setCarrito(prevCarrito => prevCarrito.filter(i => i.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCarrito(prevCarrito =>
      prevCarrito.map(i =>
        i.id === id ? { ...i, quantity } : i
      )
    );
  };

  const clearCarrito = () => {
    setCarrito([]);
  };

  if (!isHydrated) {
    return <>{children}</>;
  }

  return (
    <CartContext.Provider value={{ visible, setVisible, carrito, setCarrito, addItem, removeItem, updateQuantity, clearCarrito }}>
      {children}
    </CartContext.Provider>
  );
}