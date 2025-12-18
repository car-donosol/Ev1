"use client";
import { useContext, useRef, useEffect } from "react";
import { FilterContext, type SortBy, type Category } from "@/context/filter-context";
import { CartContext } from "@/context/cart-context";
import { useCurrency } from "@/context/currency-context";

export function FilterMenu() {
  const context = useContext(FilterContext);
  const cartContext = useContext(CartContext);
  const { formatFromCLP } = useCurrency();
  const menuRef = useRef<HTMLDivElement>(null);

  if (!context) return null;

  const { 
    sortBy, 
    setSortBy, 
    category, 
    setCategory, 
    isFilterOpen, 
    setIsFilterOpen, 
    resetFilters,
    onlyOffers,
    setOnlyOffers,
    minRating,
    setMinRating,
    priceRange,
    setPriceRange
  } = context;

  // Cerrar menú de filtro cuando se abre el carrito
  useEffect(() => {
    if (cartContext?.visible) {
      setIsFilterOpen(false);
    }
  }, [cartContext?.visible, setIsFilterOpen]);

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [isFilterOpen]);

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
    { value: 'rating', label: 'Más populares (Rating)' },
    { value: 'name-asc', label: 'Nombre A-Z' },
    { value: 'name-desc', label: 'Nombre Z-A' }
  ];

  // Calcular rango de precios de productos
  const maxPrice = 15000;
  const minPrice = 0;

  return (
    <>
      {isFilterOpen && (
        <div
          onClick={() => setIsFilterOpen(false)}
          className="fixed inset-0 bg-black opacity-20 z-20 backdrop-blur-sm transition-opacity duration-200"
        />
      )}

      <div
        ref={menuRef}
        className={`fixed bottom-24 right-8 z-30 bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 transform max-h-[80vh] ${
          isFilterOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        } w-80 sm:w-96 md:w-80`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <h3 className="text-lg font-bold text-gray-800">Filtrar productos</h3>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          {/* Solo ofertas */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
              <input
                type="checkbox"
                checked={onlyOffers}
                onChange={(e) => setOnlyOffers(e.target.checked)}
                className="w-4 h-4 text-[#004E09] cursor-pointer accent-[#004E09]"
              />
              <span className="text-sm font-semibold text-gray-700">🏷️ Solo productos en oferta</span>
            </label>
          </div>

          <hr className="border-gray-200" />

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

          {/* Filtro por Rating */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
              Rating mínimo: {minRating === 0 ? 'Todos' : minRating}
            </h4>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={minRating}
              onChange={(e) => setMinRating(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#004E09]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Filtro por Precio */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
              Rango de precio
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Precio mínimo: {formatFromCLP(priceRange[0])}</label>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step="1000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#004E09]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Precio máximo: {formatFromCLP(priceRange[1])}</label>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#004E09]"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatFromCLP(minPrice)}</span>
                <span>{formatFromCLP(maxPrice)}</span>
              </div>
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
        {(category !== 'all' || sortBy !== 'relevance' || onlyOffers || minRating > 0 || priceRange[0] > minPrice || priceRange[1] < maxPrice) && (
          <div className="px-4 py-3 bg-green-50 border-t border-green-200 text-xs text-green-700">
            <p className="font-medium mb-1">Filtros activos:</p>
            <ul className="text-xs space-y-0.5">
              {onlyOffers && <li>• Solo ofertas</li>}
              {category !== 'all' && <li>• Categoría: {category}</li>}
              {sortBy !== 'relevance' && <li>• Orden: {sortOptions.find(s => s.value === sortBy)?.label}</li>}
              {minRating > 0 && <li>• Rating: {minRating} estrellas o más</li>}
              {(priceRange[0] > minPrice || priceRange[1] < maxPrice) && (
                <li>• Precio: {formatFromCLP(priceRange[0])} - {formatFromCLP(priceRange[1])}</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}