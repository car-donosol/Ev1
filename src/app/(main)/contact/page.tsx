"use client";
import { useState } from "react";
import Link from "next/link";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validar campos
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setMessage({
        type: "error",
        text: "Por favor completa todos los campos requeridos",
      });
      setLoading(false);
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({
        type: "error",
        text: "Por favor ingresa un email válido",
      });
      setLoading(false);
      return;
    }

    try {
      // Simular envío de formulario
      await new Promise(resolve => setTimeout(resolve, 1500));

      setMessage({
        type: "success",
        text: "¡Mensaje enviado exitosamente! Te contactaremos pronto.",
      });

      // Limpiar formulario
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setMessage({
        type: "error",
        text: "Error al enviar el mensaje. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Contacto</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          ¿Tienes preguntas sobre nuestros productos? ¡Nos encantaría escucharte! Completa el formulario y nos pondremos en contacto contigo pronto.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
        {/* Información de contacto */}
        <div className="lg:col-span-1 space-y-6">
          {/* Ubicación */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#004E09] rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Ubicación</h3>
                <p className="text-gray-600 text-sm">Santiago, Chile</p>
                <p className="text-gray-600 text-sm">Región Metropolitana</p>
              </div>
            </div>
          </div>

          {/* Teléfono */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#004E09] rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Teléfono</h3>
                <a href="tel:+56912345678" className="text-[#004E09] hover:underline">
                  +56 9 1234 5678
                </a>
                <p className="text-gray-600 text-sm mt-1">Disponible de Lun-Vie 9:00-18:00</p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#004E09] rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                <a href="mailto:info@huertabeja.com" className="text-[#004E09] hover:underline">
                  info@huertabeja.com
                </a>
                <p className="text-gray-600 text-sm mt-1">Responderemos en 24 horas</p>
              </div>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-800 mb-4">Síguenos</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-[#004E09] rounded-full flex items-center justify-center text-white hover:bg-[#003707] transition-colors"
                title="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#004E09] rounded-full flex items-center justify-center text-white hover:bg-[#003707] transition-colors"
                title="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-.001.02c-.001.246-.019.492-.057.734-.001.006.001.012 0 .018C17.41 11.382 16.75 13.19 15.5 14.441 14.25 15.691 12.442 16.352 10.625 16.352 8.809 16.352 7 15.691 5.75 14.441 4.5 13.191 3.84 11.383 3.84 9.566 3.84 7.75 4.5 5.942 5.75 4.691 7 3.441 8.809 2.78 10.625 2.78c1.8 0 3.548.64 4.867 1.83l1.418-1.418c-1.666-1.445-3.877-2.295-6.285-2.295-5.207 0-9.434 4.227-9.434 9.434 0 5.207 4.227 9.434 9.434 9.434 5.207 0 9.434-4.227 9.434-9.434 0-.203-.008-.405-.02-.606z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#004E09] rounded-full flex items-center justify-center text-white hover:bg-[#003707] transition-colors"
                title="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.734.732 5.41 2.124 7.738L3.61 21.413l8.332-2.191c2.236 1.214 4.75 1.854 7.322 1.854 5.46 0 9.971-4.504 9.997-10.007C21.999 6.463 17.48 1.979 11.977 1.979" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Formulario de contacto */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Envíanos un mensaje</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Juan Pérez"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004E09] focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004E09] focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+56 9 1234 5678"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004E09] focus:border-transparent transition-all"
              />
            </div>

            {/* Asunto */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Asunto *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004E09] focus:border-transparent transition-all"
                required
              >
                <option value="">Selecciona un asunto</option>
                <option value="consulta">Consulta general</option>
                <option value="pedido">Pregunta sobre pedido</option>
                <option value="producto">Información de producto</option>
                <option value="devolucion">Devolución o cambio</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* Mensaje */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Cuéntanos tu consulta en detalle..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004E09] focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            {/* Mensaje de estado */}
            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Botón enviar */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#004E09] text-white hover:bg-[#003707] active:scale-95"
              }`}
            >
              {loading ? "Enviando..." : "Enviar mensaje"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Los campos marcados con * son obligatorios
            </p>
          </form>
        </div>
      </div>

      {/* Preguntas frecuentes */}
      <div className="bg-gray-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Preguntas Frecuentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-[#004E09]">✓</span>
              ¿Cuáles son los tiempos de envío?
            </h3>
            <p className="text-gray-600 text-sm">
              Ofrecemos envíos a todo Chile con entrega en 2-3 días hábiles. Las plantas llegan en perfectas condiciones.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-[#004E09]">✓</span>
              ¿Puedo devolver un producto?
            </h3>
            <p className="text-gray-600 text-sm">
              Sí, aceptamos devoluciones dentro de 30 días. Las plantas deben estar en buen estado.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-[#004E09]">✓</span>
              ¿Qué métodos de pago aceptan?
            </h3>
            <p className="text-gray-600 text-sm">
              Aceptamos tarjetas de crédito, débito y transferencia bancaria. Todos los pagos son seguros.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-[#004E09]">✓</span>
              ¿Cómo cuido mis plantas?
            </h3>
            <p className="text-gray-600 text-sm">
              Cada planta incluye instrucciones de cuidado. También puedes contactarnos para consejos personalizados.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-[#004E09] text-white rounded-lg hover:bg-[#003707] transition-colors font-medium"
        >
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}