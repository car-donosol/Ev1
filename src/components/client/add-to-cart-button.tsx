"use client";

import { useState, useContext } from "react";
import { addToCart } from "@/app/actions";
import { CartContext, type CartContextType } from "@/context/cart-context";
import { products } from "@/db/products";

interface AddToCartButtonProps {
  productId: number;
  stock: number;
}

export function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { addItem, setVisible } = useContext(CartContext) as CartContextType;

  const handleAddToCart = async () => {
    if (quantity <= 0 || quantity > stock) return;

    setLoading(true);
    setMessage(null);

    try {
      // Llamar a la acción del servidor
      const result = await addToCart(productId, quantity);

      if (result.success) {
        // Encontrar el producto para obtener sus detalles
        const product = products.find((p) => p.id === productId);

        if (product) {
          // Actualizar el contexto del carrito en tiempo real
          addItem({
            id: product.id,
            title: product.title,
            image: product.image,
            price: product.price,
            quantity: quantity,
          });
        }

        setMessage("¡Producto agregado al carrito!");
        setQuantity(1);

        // Abrir el carrito automáticamente
        setTimeout(() => {
          setVisible(true);
        }, 500);

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage(result.message || "Error al agregar al carrito");
      }
    } catch (err) {
      setMessage("Error al agregar al carrito");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || stock === 0}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            −
          </button>
          <span className="px-6 py-2 font-semibold text-gray-800">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            disabled={quantity >= stock || stock === 0}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-600">({stock} disponibles)</span>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={loading || stock === 0}
        className={`w-full py-3 rounded-md font-semibold transition-colors duration-300 ${
          stock === 0
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-[#004E09] text-white hover:bg-[#003707] disabled:opacity-50"
        }`}
      >
        {loading ? "Agregando..." : stock === 0 ? "Agotado" : "Agregar al carrito"}
      </button>

      {message && (
        <p
          className={`text-center text-sm font-medium ${
            message.includes("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}