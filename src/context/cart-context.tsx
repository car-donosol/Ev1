"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";

export type CartItem = {
  id: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

export type CartContextType = {
  carrito: CartItem[];
  visible: boolean;
  setVisible: (visible: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCarrito: () => void;
};

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addItem = (item: CartItem) => {
    setCarrito((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: number) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCarrito((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCarrito = () => {
    setCarrito([]);
  };

  if (!mounted) {
    return null;
  }

  return (
    <CartContext.Provider
      value={{
        carrito,
        visible,
        setVisible,
        addItem,
        removeItem,
        updateQuantity,
        clearCarrito,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}