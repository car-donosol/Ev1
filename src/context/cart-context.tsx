"use client";
import { createContext, useState, type ReactNode } from 'react';
import type { VisibleTypes } from "@/types/visible.types";

export const CartContext = createContext<VisibleTypes | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <CartContext.Provider value={{ visible, setVisible }}>
            {children}
        </CartContext.Provider>
    );
}