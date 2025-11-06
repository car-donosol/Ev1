'use client';
import { useState, useContext, useEffect } from "react"
import { CartContext, type CartContextType } from "@/context/cart-context";
import { removeFromCart, updateCartItem, clearCart } from "@/app/actions";
import { Activity } from "react";
import Link from "next/link";

export function CartComponent() {
  const context = useContext(CartContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !context) {
    return null;
  }

  const { visible, setVisible, carrito, removeItem, updateQuantity, clearCarrito } = context as CartContextType;

  const handleClose = () => {
    setVisible(false);
  };

  const handleRemove = async (id: number) => {
    setLoading(true);
    try {
      await removeFromCart(id);
      removeItem(id);
    } catch (err) {
      console.error('remove error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (id: number, qty: number) => {
    if (qty < 0) return;
    setLoading(true);
    try {
      await updateCartItem(id, qty);
      updateQuantity(id, qty);
    } catch (err) {
      console.error('update error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    setLoading(true);
    try {
      await clearCart();
      clearCarrito();
    } catch (err) {
      console.error('clear error', err);
    } finally {
      setLoading(false);
    }
  };

  const total = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Activity mode={visible ? "visible" : "hidden"}>
      <nav className="w-[450px] h-full p-5 bg-white shadow-lg absolute right-0 z-70 overflow-hidden">
        <div className="flex justify-between items-center mt-3 border-b border-gray-400 pb-4">
          <h2 className="text-2xl font-bold">Carrito</h2>
          <button 
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[85dvh]">
            <p className="text-center mt-10">Cargando...</p>
          </div>
        ) : carrito.length === 0 ? (
          <div className="flex justify-center items-center h-[85dvh]">
            <p className="text-center mt-10 text-gray-600">El carrito está vacío</p>
          </div>
        ) : (
          <div className="mt-4 flex flex-col h-[calc(100%-80px)]">
            <ul className="space-y-4 flex-1 overflow-y-auto pr-2">
              {carrito.map(item => (
                <li key={item.id} className="flex items-center gap-4 pb-4 border-b">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">${item.price.toLocaleString("es-CL")}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 border border-gray-300 rounded">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} 
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        disabled={loading}
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} 
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        disabled={loading}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => handleRemove(item.id)} 
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="text-lg font-bold text-[#004E09]">
                  ${total.toLocaleString("es-CL")}
                </span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleClearCart} 
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  disabled={loading}
                >
                  Vaciar
                </button>
                <Link 
                  href="/checkout"
                  onClick={handleClose}
                  className="flex-1 px-3 py-2 bg-[#004E09] text-white rounded hover:bg-[#003707] transition-colors text-center"
                >
                  Proceder al pago
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
      <div
        id="overlay"
        onClick={handleClose}
        className="bg-[#00000042] backdrop-blur-[2px] w-full h-full fixed top-0 left-0 z-10"
      />
    </Activity>
  );
}