"use client";
import { CartContext } from "@/context/cart-context";
import { useContext } from "react";
import { VisibleTypes } from "@/types/visible.types";

export function CartButton() {
    const { visible, setVisible } = useContext(CartContext) as VisibleTypes;

    const handleClick = () => {
        setVisible(!visible);
    };

    return (
        <button onClick={handleClick} className="bg-[#004E09] h-[40px] w-[40px] flex items-center justify-center rounded-full">
            <CartIcon />
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