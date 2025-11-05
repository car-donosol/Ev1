"use client";
import Link from "next/link";
import { useContext, useMemo } from "react";
import { FilterContext } from "@/context/filter-context";
import type { SortBy, Category } from "@/context/filter-context";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  rating: { rate: number; count: number };
  stock: number;
  slug: string;
  category: "interior" | "exterior";
}

interface ProductosClientProps {
  products: Product[];
}

export function ProductosClient({ products }: ProductosClientProps) {
  const context = useContext(FilterContext);

  const filteredAndSortedProducts = useMemo(() => {
    if (!context) return products;

    let result = [...products];

    // Filtrar por categoría
    if (context.category !== 'all') {
      result = result.filter(p => p.category === context.category);
    }

    // Ordenar
    switch (context.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'relevance':
      default:
        // Mantener orden original
        break;
    }

    return result;
  }, [products, context]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {filteredAndSortedProducts.length > 0 ? (
        filteredAndSortedProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col max-w-[300px] mx-auto w-full"
          >
            {/* Imagen del producto */}
            <div className="relative w-full pt-[80%]">
              <img
                className="absolute top-0 left-0 w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                src={product.image}
                alt={product.title}
              />
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <h2 className="font-medium text-lg text-gray-800 mb-2 line-clamp-2">
                {product.title}
              </h2>
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-lg text-[#004E09]">
                  ${product.price.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span>★</span>
                  <span>{product.rating.rate}</span>
                  <span>({product.rating.count})</span>
                </div>
              </div>
              <Link href={`/planta/${product.slug}`} className="mt-auto">
                <button
                  className="w-full bg-[#004E09] text-white py-2 rounded-md hover:bg-[#003707] transition-colors duration-300 mt-auto"
                >
                  Ver producto
                </button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <svg
            className="w-16 h-16 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-600 text-lg font-medium">No se encontraron productos</p>
          <p className="text-gray-500 text-sm">Intenta cambiar los filtros</p>
        </div>
      )}
    </div>
  );
}