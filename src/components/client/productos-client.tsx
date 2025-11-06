"use client";
import Link from "next/link";
import { useContext, useMemo } from "react";
import { FilterContext } from "@/context/filter-context";

interface Product {
  id: number;
  title: string;
  price: number;
  priceOffer: number;
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

    // Filtrar por solo ofertas
    if (context.onlyOffers) {
      result = result.filter(p => p.priceOffer > 0);
    }

    // Filtrar por categoría
    if (context.category !== 'all') {
      result = result.filter(p => p.category === context.category);
    }

    // Filtrar por rating con rangos exactos
    if (context.minRating > 0) {
      result = result.filter(p => {
        const rating = p.rating.rate;
        const minRange = context.minRating;
        const maxRange = context.minRating + 0.9;
        return rating >= minRange && rating <= maxRange;
      });
    }

    // Filtrar por rango de precio
    result = result.filter(p => {
      const effectivePrice = p.priceOffer > 0 ? p.priceOffer : p.price;
      return effectivePrice >= context.priceRange[0] && effectivePrice <= context.priceRange[1];
    });

    // Ordenar
    switch (context.sortBy) {
      case 'price-asc':
        result.sort((a, b) => {
          const priceA = a.priceOffer > 0 ? a.priceOffer : a.price;
          const priceB = b.priceOffer > 0 ? b.priceOffer : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        result.sort((a, b) => {
          const priceA = a.priceOffer > 0 ? a.priceOffer : a.price;
          const priceB = b.priceOffer > 0 ? b.priceOffer : b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'relevance':
      default:
        // Mantener orden original
        break;
    }

    return result;
  }, [products, context]);

  const calculateDiscount = (price: number, offer: number) => {
    return Math.round((1 - offer / price) * 100);
  };

  // Mensaje personalizado cuando no hay productos
  const getEmptyMessage = () => {
    if (!context) return "No se encontraron productos";
    
    if (context.minRating > 0) {
      return `No hay productos con ${context.minRating} estrellas`;
    }
    
    return "No se encontraron productos con los filtros seleccionados";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {filteredAndSortedProducts.length > 0 ? (
        filteredAndSortedProducts.map(product => {
          const hasOffer = product.priceOffer > 0;
          const discount = hasOffer ? calculateDiscount(product.price, product.priceOffer) : 0;

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col max-w-[300px] mx-auto w-full"
            >
              {/* Imagen del producto */}
              <div className="relative w-full h-64 bg-gray-50">
                {hasOffer && (
                  <div className="absolute top-2 right-2 bg-[#004E09] text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                    -{discount}%
                  </div>
                )}
                <img
                  className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                  src={product.image}
                  alt={product.title}
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h2 className="font-medium text-lg text-gray-800 mb-2 line-clamp-2">
                  {product.title}
                </h2>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    {hasOffer ? (
                      <>
                        <p className="font-bold text-lg text-[#004E09]">
                          ${product.priceOffer.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          ${product.price.toLocaleString()}
                        </p>
                      </>
                    ) : (
                      <p className="font-bold text-lg text-[#004E09]">
                        ${product.price.toLocaleString()}
                      </p>
                    )}
                  </div>
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
          );
        })
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
          <p className="text-gray-600 text-lg font-medium">{getEmptyMessage()}</p>
          <p className="text-gray-500 text-sm">Intenta cambiar los filtros</p>
        </div>
      )}
    </div>
  );
}