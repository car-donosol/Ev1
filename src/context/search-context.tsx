"use client";
import { createContext, useState } from 'react';
import type { SearchContextType } from "@/types/search-types";

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <SearchContext.Provider value={{ visible, setVisible }}>
            {children}
        </SearchContext.Provider>
    );
}