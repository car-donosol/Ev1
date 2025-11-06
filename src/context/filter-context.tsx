"use client";
import { createContext, useState, type ReactNode } from "react";

export type SortBy = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'name-asc' | 'name-desc';
export type Category = 'all' | 'interior' | 'exterior';

interface FilterContextType {
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  category: Category;
  setCategory: (cat: Category) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  onlyOffers: boolean;
  setOnlyOffers: (offers: boolean) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  resetFilters: () => void;
}

export const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [sortBy, setSortBy] = useState<SortBy>('relevance');
  const [category, setCategory] = useState<Category>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);

  const resetFilters = () => {
    setSortBy('relevance');
    setCategory('all');
    setOnlyOffers(false);
    setMinRating(0);
    setPriceRange([0, 15000]);
  };

  return (
    <FilterContext.Provider
      value={{
        sortBy,
        setSortBy,
        category,
        setCategory,
        isFilterOpen,
        setIsFilterOpen,
        onlyOffers,
        setOnlyOffers,
        minRating,
        setMinRating,
        priceRange,
        setPriceRange,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}