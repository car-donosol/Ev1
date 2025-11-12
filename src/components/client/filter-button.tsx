"use client";
import { useContext } from "react";
import { FilterContext } from "@/context/filter-context";
import { useFilterVisibility } from "@/context/filter-visibility-context";

export function FilterButton() {
  const context = useContext(FilterContext);
  const { showFilterButton } = useFilterVisibility();

  if (!context || !showFilterButton) return null;

  const { isFilterOpen, setIsFilterOpen } = context;

  return (
    <button
      onClick={() => setIsFilterOpen(!isFilterOpen)}
      className="fixed bottom-6 right-6 z-30 bg-[#004E09] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 border-4 border-white md:w-14 md:h-14"
      title="Filtrar productos"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7 md:w-6 md:h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        />
      </svg>
    </button>
  );
}