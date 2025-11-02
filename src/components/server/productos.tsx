"use server"
import Link from "next/link";
import { products } from "@/db/products";

export default async function Productos() {
    await new Promise(resolve => setTimeout(() => resolve(""), 2000));
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {products.map(product => (
                <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col max-w-[300px] mx-auto w-full"
                >
                    <div className="relative w-full pt-[80%]"> {/* Reduced from 100% to 80% for smaller height */}
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
            ))}
        </div>
    )
}