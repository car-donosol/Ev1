"use client";
import { useState, useContext } from "react";
import { addToCart } from "@/app/actions";
import { CartContext, type CartContextType } from "@/context/cart-context";

interface AddToCartButtonProps {
  productId: number;
  productTitle: string;
  productImage: string;
  productPrice: number;
  stock: number;
}

export function AddToCartButton({ productId, productTitle, productImage, productPrice, stock }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const context = useContext(CartContext);

  // Verificar que el contexto esté disponible
  if (!context) {
    return (
      <div className="text-red-500 text-sm">
        Error: CartContext no disponible
      </div>
    );
  }

  const { addItem, setVisible } = context;

  const handleAddToCart = async () => {
    if (quantity <= 0 || quantity > stock) return;

    setLoading(true);
    setMessage(null);

    try {
      const result = await addToCart(productId, quantity);
      
      if (result?.success) {
        // Agregar al contexto local
        addItem({
          id: productId,
          title: productTitle,
          image: productImage,
          price: productPrice,
          quantity,
        });
        
        setMessage("¡Producto agregado al carrito!");
        setVisible(true); // Mostrar el carrito
        
        // Limpiar mensaje después de 2 segundos
        setTimeout(() => setMessage(null), 2000);
      } else {
        setMessage(result?.message || "Error al agregar al carrito");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setMessage("Error inesperado al agregar al carrito");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Control de cantidad */}
      <div className="flex items-center gap-4">
        <label className="font-medium text-gray-700">Cantidad:</label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={loading || quantity <= 1}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            −
          </button>
          <span className="px-6 py-2 font-semibold text-gray-800 border-x border-gray-300">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            disabled={loading || quantity >= stock}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-500">
          {stock > 0 ? `${stock} disponibles` : "Sin stock"}
        </span>
      </div>

      {/* Mensaje de feedback */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm font-medium ${
            message.includes("Error")
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Botón de agregar al carrito */}
      <button
        onClick={handleAddToCart}
        disabled={loading || stock === 0}
        className="w-full px-6 py-4 bg-gradient-to-r from-[#004E09] to-[#006B0D] text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Agregando...</span>
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Agregar al carrito</span>
          </>
        )}
      </button>

      {stock > 0 && stock < 10 && (
        <p className="text-sm text-orange-600 font-medium">
          ⚠️ ¡Solo quedan {stock} unidades!
        </p>
      )}
    </div>
  );
}