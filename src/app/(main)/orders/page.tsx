"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders).reverse()); // Más recientes primero
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "processing":
        return "En proceso";
      case "completed":
        return "Completado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis pedidos</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#004E09] transition-colors">
            Inicio
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-medium">Pedidos</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No tienes pedidos aún
          </h2>
          <p className="text-gray-600 mb-6">
            Comienza a comprar para ver tus pedidos aquí
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#004E09] text-white rounded-lg hover:bg-[#003707] transition-colors font-medium"
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Header del pedido */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Pedido</p>
                      <p className="font-bold text-[#004E09]">
                        #{order.orderNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fecha</p>
                      <p className="font-medium text-gray-800">
                        {formatDate(order.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-bold text-gray-800">
                        ${order.total.toLocaleString("es-CL")}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              {/* Productos del pedido */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Productos ({order.items.length})
                </h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 pb-3 border-b border-gray-200 last:border-0"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ${(item.price * item.quantity).toLocaleString("es-CL")}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Información de envío */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Información de envío
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Destinatario</p>
                      <p className="font-medium text-gray-800">
                        {order.customerInfo.firstName}{" "}
                        {order.customerInfo.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Teléfono</p>
                      <p className="font-medium text-gray-800">
                        {order.customerInfo.phone}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600">Dirección</p>
                      <p className="font-medium text-gray-800">
                        {order.shippingAddress.address},{" "}
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.region} -{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desglose de costos */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-2 max-w-xs ml-auto">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-800">
                        ${order.subtotal.toLocaleString("es-CL")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">IVA (19%)</span>
                      <span className="font-medium text-gray-800">
                        ${order.tax.toLocaleString("es-CL")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Envío</span>
                      <span className="font-medium text-gray-800">
                        {order.shipping === 0 ? (
                          <span className="text-green-600 font-semibold">
                            Gratis
                          </span>
                        ) : (
                          `$${order.shipping.toLocaleString("es-CL")}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-300">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="font-bold text-[#004E09] text-lg">
                        ${order.total.toLocaleString("es-CL")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}