"use client";
import { useContext } from "react";
import { SearchContext } from "@/context/search-context";
import type { SearchContextType } from "@/types/search-types";

export function SearchButton() {
    const { visible, setVisible } = useContext(SearchContext) as SearchContextType;

    return (
        <button
            className="cursor-pointer hover:opacity-60"
            onClick={() => setVisible(!visible)}
        >
            <SearchIcon />
        </button>
    );
}

function SearchIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={28}
            height={28}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            className="icon icon-tabler icons-tabler-outline icon-tabler-search"
            viewBox="0 0 24 24"
        >
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M3 10a7 7 0 1 0 14 0 7 7 0 1 0-14 0M21 21l-6-6" />
        </svg>
    )
}