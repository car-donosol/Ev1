"use client";
import { useContext, useState, useEffect } from "react";
import { SearchContext } from "@/context/search-context";
import type { VisibleTypes } from "@/types/visible.types";
import { products } from "@/db/products";
import Link from "next/link";

export function SearchComponent() {
    const { visible, setVisible } = useContext(SearchContext) as VisibleTypes;
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<typeof products>([]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSearchResults([]);
            return;
        }

        const filtered = products.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSearchResults(filtered);
    }, [searchTerm]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.id === "overlay") {
            setVisible(false);
            setSearchTerm("");
        }
    };

    const handleProductClick = () => {
        setVisible(false);
        setSearchTerm("");
    };

    if (!visible) return null;

    return (
        <>
            <div
                id="overlay" 
                onClick={handleOverlayClick}
                className="bg-[#00000042] animate-fade-in backdrop-blur-[2px] w-full h-full fixed top-0 left-0 z-60"
                style={{ animationDuration: "100ms" }}
            />

            <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-70 w-[20rem] tablet:w-[28.125rem] animate-fade-in" style={{ animationDuration: "350ms" }}>
                {/* Input de búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white w-full h-[3rem] rounded-full px-5 placeholder:text-[1rem] placeholder:font-medium shadow-md transition-all duration-300 border-[transparent] focus:outline-0 border-[2px] focus:border-[#004E09]"
                    autoFocus
                />

                {/* Resultados de búsqueda */}
                {searchTerm.trim() !== "" && (
                    <div className="bg-white mt-2 max-h-[400px] overflow-y-auto rounded-lg shadow-lg border border-gray-200 animate-fade-in" style={{ animationDuration: "350ms" }}>
                        {searchResults.length > 0 ? (
                            <div className="p-2">
                                <p className="text-xs text-gray-500 px-3 py-2 font-medium">
                                    {searchResults.length} {searchResults.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                                </p>
                                <div className="space-y-1">
                                    {searchResults.map(product => (
                                        <Link
                                            key={product.id}
                                            href={`/planta/${product.slug}`}
                                            onClick={handleProductClick}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full h-full object-contain p-1"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm text-gray-800 truncate">
                                                    {product.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 line-clamp-1">
                                                    {product.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="font-bold text-sm text-[#004E09]">
                                                        ${product.price.toLocaleString()}
                                                    </span>
                                                    {product.priceOffer > 0 && (
                                                        <span className="text-xs text-gray-400 line-through">
                                                            ${product.priceOffer.toLocaleString()}
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-1 ml-auto">
                                                        <span className="text-yellow-400 text-xs">★</span>
                                                        <span className="text-xs text-gray-600">{product.rating.rate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <svg
                                    className="w-12 h-12 text-gray-300 mx-auto mb-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="text-gray-600 font-medium">No se encontraron resultados</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Intenta con otro término de búsqueda
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}