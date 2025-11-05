"use client";
import { CartContext } from "@/context/cart-context";
import { useContext, useEffect, useState } from "react";
import type { VisibleTypes } from "@/types/visible.types";
import { getCarrito } from "@/app/actions";

export function CartButton() {
    const { visible, setVisible } = useContext(CartContext) as VisibleTypes;
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        let mounted = true;
        const fetchCount = async () => {
            try {
                const items = await getCarrito();
                if (!mounted) return;
                const total = (items || []).reduce((s: number, it: any) => s + (it.quantity ?? 0), 0);
                setCount(total);
            } catch (err) {
                console.error('Failed to fetch cart count', err);
            }
        };
        fetchCount();
        return () => { mounted = false };
    }, []);

    const handleClick = async () => {

        setVisible(!visible);
        try {
            const items = await getCarrito();
            const total = (items || []).reduce((s: number, it: any) => s + (it.quantity ?? 0), 0);
            setCount(total);
        } catch (err) {
            console.error('Failed to refresh cart after toggle', err);
        }
    };

    return (
        <button onClick={handleClick} className="relative bg-[#004E09] h-[40px] w-[40px] flex items-center justify-center rounded-full">
            <CartIcon />
            {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{count}</span>
            )}
        </button>
    )
}

function CartIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-[24px] h-[24px]" fill="none">
            <g
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                clipPath="url(#a)"
            >
                <path d="M6.331 8H17.67a2 2 0 0 1 1.977 2.304l-1.255 8.152A3 3 0 0 1 15.426 21H8.574a3 3 0 0 1-2.965-2.544l-1.255-8.152A2 2 0 0 1 6.331 8Z" />
                <path d="M9 11V6a3 3 0 1 1 6 0v5" />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M0 0h24v24H0z" />
                </clipPath>
            </defs>
        </svg>
    )
}