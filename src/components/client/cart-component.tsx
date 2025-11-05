'use client';
import { useEffect, useState, Activity } from "react"
import { CartContext } from "@/context/cart-context";
import { useContext } from "react";
import type { VisibleTypes } from "@/types/visible.types";
import { getCarrito, removeFromCart, updateCartItem, clearCart } from "@/app/actions";

interface CarritoItem {
    id: number;
    title: string;
    image: string;
    price: number;
    quantity: number;
}

export function CartComponent() {
    const [carrito, setCarrito] = useState<CarritoItem[]>([]);
    const { visible, setVisible } = useContext(CartContext) as VisibleTypes;
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getCarrito();
                setCarrito(data as CarritoItem[]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [])

    const handleClose = () => {
        setVisible(false);
    };

    const refresh = async () => {
        setLoading(true);
        try {
            const data = await getCarrito();
            setCarrito(data as CarritoItem[]);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id: number) => {
        setLoading(true);
        try {
            await removeFromCart(id);
            await refresh();
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
            await refresh();
        } catch (err) {
            console.error('update error', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Activity mode={visible ? "visible" : "hidden"}>
            <nav className="w-[450px] h-full p-5 bg-white shadow-lg absolute right-0 z-20 overflow-hidden">
                <div className="flex justify-between items-center mt-3 border-b border-gray-400 pb-4">
                    <h2 className="text-2xl">Carrito</h2>
                    <button onClick={handleClose}>Cerrar</button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-[85dvh]">
                        <p className="text-center mt-10">Cargando...</p>
                    </div>
                ) : carrito.length === 0 ? (
                    <div className="flex justify-center items-center h-[85dvh]">
                        <p className="text-center mt-10">El carrito está vacío</p>
                    </div>
                ) : (
                    <div className="mt-4">
                        <ul className="space-y-4">
                            {carrito.map(item => (
                                <li key={item.id} className="flex items-center gap-4">
                                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.title}</h3>
                                        <p className="text-sm text-gray-600">${item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                                    </div>
                                    <div>
                                        <button onClick={() => handleRemove(item.id)} className="text-red-600">Eliminar</button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 border-t pt-4">
                            <p className="font-semibold">Total: ${carrito.reduce((s, i) => s + i.price * i.quantity, 0)}</p>
                        </div>

                        <div className="mt-4 flex gap-3">
                            <button onClick={async () => { setLoading(true); try { await clearCart(); await refresh(); } finally { setLoading(false); } }} className="px-3 py-2 bg-red-600 text-white rounded">Vaciar carrito</button>
                            <a href="/checkout">
                                <button className="px-3 py-2 bg-green-600 text-white rounded">Proceder al pago</button>
                            </a>
                        </div>
                    </div>
                )}
            </nav>
            <div className="bg-[#00000042] backdrop-blur-[2px] w-full h-full fixed top-0 left-0 z-10"></div>
        </Activity>
    )
}