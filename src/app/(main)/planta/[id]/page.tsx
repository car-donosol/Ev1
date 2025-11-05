import Link from "next/link";
import { products } from "@/db/products";
import { AddToCartButton } from "@/components/client/add-to-cart-button";

interface PageProps {
  params: Promise<{ id: string }>; // 👈 es una Promise
}

export default async function ProductPage({ params }: PageProps) {
  // ✅ Desempaquetamos la promesa correctamente
  const { id } = await params;

  console.log("🧩 Params recibido:", id);

  // Buscar producto
  const product = products.find((p) => p.slug === id);

  // Si no lo encuentra
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          😕 Producto no encontrado
        </h1>
        <p className="text-gray-600 mb-8">
          Es posible que el producto haya sido eliminado o que el enlace sea incorrecto.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#004E09] text-white px-6 py-3 rounded-lg hover:bg-[#003707] transition-colors font-medium"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Producto principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="flex items-center justify-center">
          <div className="relative w-full pt-[120%] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <img
              src={product.image}
              alt={product.title}
              className="absolute top-0 left-0 w-full h-full object-contain p-8 hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Detalles */}
        <div className="flex flex-col justify-start">
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#004E09] transition-colors">
              Inicio
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">{product.title}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
            {product.title}
          </h1>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.round(product.rating.rate)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="font-semibold text-gray-800">
                {product.rating.rate}
              </span>
            </div>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600">
              {product.rating.count} reseñas
            </span>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-5xl font-bold text-[#004E09]">
              ${product.price.toLocaleString("es-CL")}
            </p>
            <p className="text-sm text-gray-500 mt-2">Precio por unidad</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Descripción
            </h3>
            <p className="text-gray-600 leading-relaxed text-base">
              {product.description}
            </p>
          </div>

          <div
            className={`mb-6 p-4 rounded-lg ${
              product.stock > 10
                ? "bg-green-50 border border-green-200"
                : product.stock > 0
                ? "bg-orange-50 border border-orange-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p className="text-gray-700">
              <span className="font-semibold">Stock disponible:</span>
              <span
                className={`ml-2 font-bold ${
                  product.stock > 10
                    ? "text-green-600"
                    : product.stock > 0
                    ? "text-orange-600"
                    : "text-red-600"
                }`}
              >
                {product.stock} unidades
              </span>
            </p>
            {product.stock <= 5 && product.stock > 0 && (
              <p className="text-xs text-orange-600 mt-2">
                ⚠️ Pocas unidades disponibles
              </p>
            )}
          </div>

          <div className="mb-6">
            <AddToCartButton productId={product.id} stock={product.stock} />
          </div>

          <Link
            href="/"
            className="inline-block text-center px-6 py-3 border-2 border-[#004E09] text-[#004E09] rounded-lg hover:bg-[#004E09] hover:text-white transition-all duration-300 font-medium"
          >
            ← Volver al catálogo
          </Link>
        </div>
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="border-t-2 border-gray-200 pt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Productos relacionados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/planta/${p.slug}`} className="group">
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full hover:translate-y-[-4px]">
                  <div className="relative w-full pt-[80%] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-2 group-hover:text-[#004E09] transition-colors">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="font-semibold text-xs text-gray-800">
                        {p.rating.rate}
                      </span>
                      <span className="text-gray-400 text-xs">
                        ({p.rating.count})
                      </span>
                    </div>
                    <div className="mt-auto">
                      <p className="font-bold text-lg text-[#004E09] mb-2">
                        ${p.price.toLocaleString("es-CL")}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          p.stock > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {p.stock > 0
                          ? `${p.stock} disponibles`
                          : "Agotado"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
