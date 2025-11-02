'use client';
import { useEffect, useState, Activity } from "react"
import { getCarrito } from "@/app/actions";

interface CarritoItem {
    id: number;
    title: string;
    image: string;
    price: number;
    quantity: number;
}

export function CartComponent() {
    const [carrito, setCarrito] = useState<CarritoItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setCarrito(await getCarrito());
        };
        fetchData();
    }, [])

    return (
        <Activity mode="hidden">
            <nav className="w-[450px] h-full p-5 bg-white shadow-lg absolute right-0 z-20 overflow-hidden">
                <div className="flex justify-between items-center mt-3 border-b border-gray-400 pb-4">
                    <h2 className="text-2xl">Carrito</h2>
                    <button>Cerrar</button>
                </div>

                {carrito.length === 0 ? (
                    <div className="flex justify-center items-center h-[85dvh]">
                        <p className="text-center mt-10">El carrito está vacío</p>
                    </div>
                ) : (
                    <p>hola</p>
                )}
            </nav>
            <div className="bg-[#00000042] backdrop-blur-[2px] w-full h-full fixed top-0 left-0 z-10"></div>
        </Activity>
    )
}