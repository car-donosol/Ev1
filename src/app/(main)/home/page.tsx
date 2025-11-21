"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/db/supabase";
import type { Product } from "@/db/products";

export default function HomePage() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [homeProducts, setHomeProducts] = useState<Product[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cargar productos destacados desde Supabase
  useEffect(() => {
    async function loadFeaturedProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('home', true)
        .limit(6);

      if (!error && data) {
        setHomeProducts(data);
      }
    }
    loadFeaturedProducts();
  }, []);

  const categories = [
    { name: "Plantas de exterior", slug: "exterior" },
    { name: "Plantas de interior", slug: "interior" }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] md:min-h-screen overflow-hidden bg-gradient-to-b from-[#1a4d2e] via-[#2d5a3d] to-[#0f3d1f]">
        {/* Background Image con parallax */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "url('https://pahjkcjiwxhohqfuurhw.supabase.co/storage/v1/object/sign/home/sala_estar.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MGY1NjYyOS1hZmNmLTQ0YTItYTE3NS0xNzVjMjE3MTJlNWEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJob21lL3NhbGFfZXN0YXIud2VicCIsImlhdCI6MTc2MzY4NzM4MiwiZXhwIjoxNzY0MjkyMTgyfQ.C_a4QpDh_wpRI964ijWqGOa83d2jUqUsXUlE6SObhaI')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateX(${scrollPosition * 0.1}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />

        {/* Overlay decorativo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a4d2e]/80 to-transparent" />

        {/* Contenido Hero */}
        <div className="relative z-10 h-full flex flex-col justify-center items-start px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            {/* Etiqueta */}
            <div className="inline-block mb-4 md:mb-6">
              <p className="text-green-300 text-sm md:text-base font-semibold uppercase tracking-widest">
                Huertabeja
              </p>
            </div>

            {/* Título principal */}
            <h1 className="text-5xl md:text-7xl lg:text-6xl font-black text-white mb-6 md:mb-6 leading-tight">
              Llena tu hogar de vida
            </h1>

            {/* Descripción */}
            <p className="text-gray-200 text-base md:text-lg max-w-xl mb-8 md:mb-10 leading-relaxed">
              Explora nuestra selección completa de plantas, sustratos y maceteros para interior y exterior.
            </p>

            {/* CTA Button */}
            <Link
              href="/#productos"
              className="inline-block px-8 md:px-10 py-4 md:py-5 bg-white text-[#1a4d2e] rounded-full font-bold text-base md:text-lg hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Explorar la colección
            </Link>
          </div>
        </div>

        {/* Stats Card */}
        <div className="absolute bottom-10 left-6 md:left-12 lg:left-250 z-20 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-6 md:px-8 py-6 md:py-8 max-w-xs">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-4xl md:text-5xl font-black text-white mb-2">
                100+
              </p>
              <p className="text-white/80 text-sm md:text-base">
                Queremos que nuestros visitantes se inspiren para ensuciarse las manos
              </p>
            </div>
            <div className="hidden sm:block w-20 h-24 bg-gradient-to-br from-green-300 to-green-600 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src="/cala de color.jpeg"
                alt="Plant"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 z-20 text-white/60 animate-bounce">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Section: Plants for the People */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                Plants for the People
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                Queremos que nuestros visitantes se inspiren para ensuciarse las manos y disfrutar de la naturaleza. Cada planta es seleccionada cuidadosamente para garantizar calidad y belleza.
              </p>
              <button className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors">
                Learn More
              </button>
            </div>

            {/* Right: Video/Image */}
            <div className="relative group">
              <div className="relative w-full pt-[66%] bg-gray-300 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/monstera deliciosa.jpeg"
                  alt="Plants"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <button className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-all">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-8 h-8 text-gray-900 ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Quality Assurance */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left: Image */}
            <div className="relative group order-2 md:order-1">
              <div className="relative w-full pt-[66%] bg-gradient-to-br from-green-100 to-green-50 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/ficus-trenzado.jpeg"
                  alt="Quality Plants"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="order-1 md:order-2">
              <div className="inline-block mb-4 px-4 py-2 bg-green-100 rounded-full">
                <p className="text-green-700 text-sm font-semibold">🌿 Calidad garantizada</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                Cada planta es cuidada
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                Cada una de nuestras plantas es cuidada por nuestros expertos en horticultura, para que estén tan felices y saludables como sea posible. Garantizamos plantas de la más alta calidad.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <p className="text-gray-700">Plantas verificadas y saludables</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <p className="text-gray-700">Expertos en horticultura</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <p className="text-gray-700">Envío cuidadoso y rápido</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-12 text-center">
            Explora por categoría
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/?category=${category.slug}`}
                className="px-6 md:px-8 py-3 md:py-4 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 hover:scale-105 first:bg-gray-900 first:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="productos" className="py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              Productos destacados
            </h2>
            <Link
              href="/#"
              className="text-[#004E09] hover:text-[#003707] font-bold text-lg transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {homeProducts.map((product) => (
              <Link
                key={product.id}
                href={`/planta/${product.slug}`}
                className="group"
              >
                <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative w-full pt-[100%] bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                    {product.price_offer > 0 && (
                      <div className="absolute top-4 right-4 z-10 bg-[#004E09] text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{Math.round(((product.price - product.price_offer) / product.price) * 100)}%
                      </div>
                    )}
                    <img
                      src={product.image}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#004E09] transition-colors">
                      {product.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < Math.round(product.rating.rate)
                              ? "text-yellow-400"
                              : "text-gray-300"
                              }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.rating.count})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-black text-[#004E09]">
                        ${product.price_offer > 0 ? product.price_offer.toLocaleString() : product.price.toLocaleString()}
                      </span>
                      {product.price_offer > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          ${product.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Stock status */}
                    <p
                      className={`text-xs font-semibold ${product.stock > 0
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} disponibles`
                        : "Agotado"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* See All Button */}
          <div className="text-center mt-12">
            <Link
              href="/#"
              className="inline-block px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-bold text-lg hover:bg-gray-900 hover:text-white transition-all duration-300 hover:scale-105"
            >
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-6 md:px-12 lg:px-20 bg-gradient-to-r from-[#1a4d2e] to-[#0f3d1f] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            ¿Listo para crecer?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Descubre nuestras colecciones exclusivas y transforma tu espacio en un oasis verde
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#"
              className="px-8 py-4 bg-white text-[#1a4d2e] rounded-full font-bold text-lg hover:bg-green-50 transition-all duration-300 hover:scale-105"
            >
              Explorar catálogo
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-[#1a4d2e] transition-all duration-300 hover:scale-105"
            >
              Contactanos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}