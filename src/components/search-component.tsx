"use client";
import { Activity, useContext } from "react";
import { SearchContext } from "@/context/search-context";
import type { SearchContextType } from "@/types/visible.types";

export function SearchComponent() {
    const { visible, setVisible } = useContext(SearchContext) as SearchContextType;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.id === "overlay") setVisible(false);
    };

    return (
        <Activity mode={visible ? "visible" : "hidden"}>
            <div className="absolute top-30 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-11 animate-fade-in" style={{ animationDuration: "350ms" }}>
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="bg-white w-[20rem] h-[3rem] tablet:w-[28.125rem] rounded-full px-5 placeholder:text-[1rem] placeholder:font-medium shadow-md transition-all duration-300 border-[transparent] focus:outline-0 border-[2px] focus:border-[#004E09]"
                />
            </div>

            <div
                id="overlay" 
                onClick={handleOverlayClick}
                className="bg-[#00000042] animate-fade-in backdrop-blur-[2px] w-full h-full fixed top-0 left-0 z-10"
                style={{ animationDuration: "100ms" }}
            >
            </div>
        </Activity>
    )
}