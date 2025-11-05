"use client";
import { createContext, useState } from 'react';

export type SortBy = 'relevance' | 'price-asc' | 'price-desc' | 'rating';
export type Category = 'all' | 'interior' | 'exterior';

export interface FilterContextType {
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  category: Category;
  setCategory: (cat: Category) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  resetFilters: () => void;
}

export const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [sortBy, setSortBy] = useState<SortBy>('relevance');
  const [category, setCategory] = useState<Category>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const resetFilters = () => {
    setSortBy('relevance');
    setCategory('all');
  };

  return (
    <FilterContext.Provider value={{
      sortBy,
      setSortBy,
      category,
      setCategory,
      isFilterOpen,
      setIsFilterOpen,
      resetFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
}