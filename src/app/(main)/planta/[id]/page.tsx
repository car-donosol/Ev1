import { products } from "@/db/products";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = products.find(p => p.slug === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="relative w-full pt-[100%] bg-white rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="absolute top-0 left-0 w-full h-full object-contain p-4"
            />
          </div>
        </div>

        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-gray-600">{product.rating.rate}</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{product.rating.count} reseñas</span>
          </div>

          <p className="text-2xl font-bold text-[#004E09] mb-6">
            ${product.price.toLocaleString()}
          </p>

          <p className="text-gray-600 mb-6">
            {product.description}
          </p>

          <div className="mb-6">
            <p className="text-gray-700">
              Stock disponible: <span className="font-medium">{product.stock} unidades</span>
            </p>
          </div>

          <button className="w-full md:w-auto px-8 py-3 bg-[#004E09] text-white rounded-md hover:bg-[#003707] transition-colors duration-300">
            Agregar al carrito
          </button>

          <Link 
            href="/"
            className="mt-4 inline-block text-[#004E09] hover:underline"
          >
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}