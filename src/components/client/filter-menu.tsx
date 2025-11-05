"use client";
import { useContext, useRef, useEffect } from "react";
import { FilterContext, type SortBy, type Category } from "@/context/filter-context";

export function FilterMenu() {
  const context = useContext(FilterContext);
  const menuRef = useRef<HTMLDivElement>(null);

  if (!context) return null;

  const { sortBy, setSortBy, category, setCategory, isFilterOpen, setIsFilterOpen, resetFilters } = context;

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isFilterOpen, setIsFilterOpen]);

  const categoryOptions: Array<{ value: Category; label: string }> = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'interior', label: 'Interior' },
    { value: 'exterior', label: 'Exterior' }
  ];

  const sortOptions: Array<{ value: SortBy; label: string }> = [
    { value: 'relevance', label: 'Relevancia' },
    { value: 'price-asc', label: 'Menor precio' },
    { value: 'price-desc', label: 'Mayor precio' },
    { value: 'rating', label: 'Más populares (Rating)' }
  ];

  return (
    <>
      {isFilterOpen && (
        <div
          onClick={() => setIsFilterOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-20 z-20 backdrop-blur-sm transition-opacity duration-200"
        />
      )}

      <div
        ref={menuRef}
        className={`fixed bottom-24 right-8 z-30 bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 transform ${
          isFilterOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        } w-80`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Filtrar productos</h3>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-6 max-h-[500px] overflow-y-auto">
          {/* Filtro por Categoría */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
              Categoría
            </h4>
            <div className="space-y-2">
              {categoryOptions.map(opt => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                  <input
                    type="radio"
                    name="category"
                    value={opt.value}
                    checked={category === opt.value}
                    onChange={() => setCategory(opt.value)}
                    className="w-4 h-4 text-[#004E09] cursor-pointer accent-[#004E09]"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Filtro por Ordenamiento */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
              Ordenar por
            </h4>
            <div className="space-y-2">
              {sortOptions.map(opt => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                  <input
                    type="radio"
                    name="sort"
                    value={opt.value}
                    checked={sortBy === opt.value}
                    onChange={() => setSortBy(opt.value)}
                    className="w-4 h-4 text-[#004E09] cursor-pointer accent-[#004E09]"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Botón Reset */}
          <button
            onClick={resetFilters}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            Limpiar filtros
          </button>

          {/* Botón Aplicar */}
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-full px-4 py-2 bg-[#004E09] text-white rounded-lg hover:bg-[#003707] transition-colors font-medium text-sm"
          >
            Aplicar filtros
          </button>
        </div>

        {/* Resumen de filtros activos */}
        {(category !== 'all' || sortBy !== 'relevance') && (
          <div className="px-4 py-3 bg-green-50 border-t border-green-200 text-xs text-green-700">
            <p className="font-medium">Filtros activos:</p>
            <p className="text-xs">
              {category !== 'all' && `Categoría: ${category}`}
              {category !== 'all' && sortBy !== 'relevance' && ' • '}
              {sortBy !== 'relevance' && `Orden: ${sortBy === 'price-asc' ? 'Menor precio' : sortBy === 'price-desc' ? 'Mayor precio' : 'Rating'}`}
            </p>
          </div>
        )}
      </div>
    </>
  );
}