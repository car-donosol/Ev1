"use client";
import { createContext, useState } from 'react';
import type { VisibleTypes } from "@/types/visible.types";

export const SearchContext = createContext<VisibleTypes | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <SearchContext.Provider value={{ visible, setVisible }}>
            {children}
        </SearchContext.Provider>
    );
}