"use client";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/context/cart-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  orderNumber: number;
  date: string;
  items: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    region: string;
    postalCode: string;
  };
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
}

export default function CheckoutPage() {
  const context = useContext(CartContext);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [currentOrderNumber, setCurrentOrderNumber] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    // Información personal
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // Dirección
    address: "",
    city: "",
    region: "",
    postalCode: "",
    // Pago
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !context) {
    return null;
  }

  const { carrito, clearCarrito } = context;

  // Cálculos
  const subtotal = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.19; // IVA 19%
  const shipping = subtotal > 30000 ? 0 : 3990; // Envío gratis sobre $30.000
  const total = subtotal + tax + shipping;

  // Validación
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Información personal
    if (!formData.firstName.trim()) newErrors.firstName = "Nombre requerido";
    if (!formData.lastName.trim()) newErrors.lastName = "Apellido requerido";
    if (!formData.email.trim()) newErrors.email = "Email requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";
    if (!formData.phone.trim()) newErrors.phone = "Teléfono requerido";

    // Dirección
    if (!formData.address.trim()) newErrors.address = "Dirección requerida";
    if (!formData.city.trim()) newErrors.city = "Ciudad requerida";
    if (!formData.region.trim()) newErrors.region = "Región requerida";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Código postal requerido";

    // Pago
    if (!formData.cardNumber.trim()) newErrors.cardNumber = "Número de tarjeta requerido";
    else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Número de tarjeta inválido (16 dígitos)";
    }
    if (!formData.cardName.trim()) newErrors.cardName = "Nombre en tarjeta requerido";
    if (!formData.expiryDate.trim()) newErrors.expiryDate = "Fecha de expiración requerida";
    else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Formato inválido (MM/AA)";
    }
    if (!formData.cvv.trim()) newErrors.cvv = "CVV requerido";
    else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = "CVV inválido (3-4 dígitos)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Formatear número de tarjeta
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: "" }));
  };

  // Formatear fecha de expiración
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setFormData(prev => ({ ...prev, expiryDate: value }));
    if (errors.expiryDate) setErrors(prev => ({ ...prev, expiryDate: "" }));
  };

  // Guardar orden en localStorage
  const saveOrder = (orderNumber: number) => {
    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber,
      date: new Date().toISOString(),
      items: carrito.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      },
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        region: formData.region,
        postalCode: formData.postalCode,
      },
      subtotal,
      tax,
      shipping,
      total,
      status: "processing",
    };

    // Obtener órdenes existentes
    const existingOrders = localStorage.getItem("orders");
    const orders: Order[] = existingOrders ? JSON.parse(existingOrders) : [];
    
    // Agregar nueva orden
    orders.push(order);
    
    // Guardar en localStorage
    localStorage.setItem("orders", JSON.stringify(orders));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll al primer error
      const firstError = Object.keys(errors)[0];
      document.getElementById(firstError)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);
    
    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generar número de orden
    const orderNumber = Math.floor(Math.random() * 1000000);
    setCurrentOrderNumber(orderNumber);
    
    // Guardar orden
    saveOrder(orderNumber);
    
    // Limpiar carrito y mostrar confirmación
    clearCarrito();
    setOrderComplete(true);
    setLoading(false);
  };

  // Página de confirmación
  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Pedido confirmado!</h1>
            <p className="text-gray-600">
              Tu pedido ha sido procesado exitosamente. Recibirás un correo con los detalles.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-2">Número de orden</h2>
            <p className="text-2xl font-bold text-[#004E09]">#{currentOrderNumber}</p>
          </div>

          <div className="space-y-3">
            <Link href="/orders" className="block w-full px-6 py-3 bg-[#004E09] text-white rounded-lg hover:bg-[#003707] transition-colors font-medium">
              Ver mis pedidos
            </Link>
            <Link href="/" className="block w-full px-6 py-3 border-2 border-[#004E09] text-[#004E09] rounded-lg hover:bg-[#004E09] hover:text-white transition-colors font-medium">
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Carrito vacío
  if (carrito.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">Agrega productos para continuar con tu compra</p>
          <Link href="/" className="inline-block px-6 py-3 bg-[#004E09] text-white rounded-lg hover:bg-[#003707] transition-colors font-medium">
            Ir al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Finalizar compra</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#004E09] transition-colors">Inicio</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-medium">Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información personal */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#004E09] text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Información personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E09] ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E09] ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E09] ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E09] ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Dirección de envío */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#004E09] text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Dirección de envío
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E09] ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad *
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E09] ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                      Región *
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E09] ${
                        errors.region ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Seleccionar</option>
                      <option value="metropolitana">Metropolitana</option>
                      <option value="valparaiso">Valparaíso</option>
                      <option value="biobio">Biobío</option>
                      <option value="araucania">Araucanía</option>
                      <option value="los-lagos">Los Lagos</option>
                    </select>
                    {errors.region && <p className="text-xs text-red-500 mt-1">{errors.region}</p>}
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Código Postal *
                    </label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E09] ${
                        errors.postalCode ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Información de pago */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#004E09] text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Información de pago
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de tarjeta *
                  </label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E09] ${
                      errors.cardNumber ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
                </div>
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre en la tarjeta *
                  </label>
                  <input
                    id="cardName"
                    name="cardName"
                    type="text"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="JUAN PEREZ"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E09] ${
                      errors.cardName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.cardName && <p className="text-xs text-red-500 mt-1">{errors.cardName}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de expiración *
                    </label>
                    <input
                      id="expiryDate"
                      name="expiryDate"
                      type="text"
                      value={formData.expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/AA"
                      maxLength={5}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E09] ${
                        errors.expiryDate ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.expiryDate && <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>}
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV *
                    </label>
                    <input
                      id="cvv"
                      name="cvv"
                      type="text"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E09] ${
                        errors.cvv ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Tu información de pago está protegida y encriptada</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-[#004E09] text-white rounded-lg hover:bg-[#003707] transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pagar ${total.toLocaleString("es-CL")}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del pedido</h2>
            
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {carrito.map(item => (
                <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                    <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    ${(item.price * item.quantity).toLocaleString("es-CL")}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-300">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-800">${subtotal.toLocaleString("es-CL")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IVA (19%)</span>
                <span className="font-medium text-gray-800">${tax.toLocaleString("es-CL")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío</span>
                <span className="font-medium text-gray-800">
                  {shipping === 0 ? (
                    <span className="text-green-600 font-semibold">Gratis</span>
                  ) : (
                    `$${shipping.toLocaleString("es-CL")}`
                  )}
                </span>
              </div>
              {subtotal < 30000 && (
                <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  💡 Envío gratis en compras sobre $30.000
                </p>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-300">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-[#004E09]">
                ${total.toLocaleString("es-CL")}
              </span>
            </div>

            <div className="mt-6 space-y-2 text-xs text-gray-500">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Pago 100% seguro</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Entrega en 2-3 días hábiles</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Garantía de satisfacción</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}