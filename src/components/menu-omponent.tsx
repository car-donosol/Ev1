"use client"
import Link from "next/link"
import { SearchButton } from "@/components/client/search-button"
import { CartButton } from "@/components/client/cart-button"
import { UserMenu } from "@/components/client/user-menu"
import { useState, useEffect } from "react"
import type { User } from "@/hooks/useAuth"

export function MenuComponent() {
    const [account, setAccount] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("account");
            if (stored) {
                setAccount(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error reading account", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("account");
        setAccount(null);
    };

    return (
        <header className="max-w-[1400px] mx-auto w-full">
            <nav className="w-full flex items-center justify-between p-[1.2rem] mt-2 desktop-md:px-20 transition-all duration-300 relative">

                {/* Logo */}
                <div className="mb-2 flex items-center justify-center space-x-10">
                    <Link href="/" className="cursor-pointer hover:opacity-70">
                        <img src="/logo.png" alt="Logo" className="h-14 desktop-md:h-12" />
                    </Link>
                </div>

                {/* Menú principal */}
                <ul className="hidden tablet:flex gap-8 mt-1 absolute left-1/2 transform -translate-x-1/2">
                    <li className="text-xl hover:opacity-70 desktop-md:text-[1.1rem]">
                        <Link href="/">Inicio</Link>
                    </li>
                    <li className="text-xl hover:opacity-70 desktop-md:text-[1.1rem]">
                        <Link href="/">Catálogo</Link>
                    </li>
                    <li className="text-xl hover:opacity-70 desktop-md:text-[1.1rem]">
                        <Link href="/contact">Contacto</Link>
                    </li>
                </ul>

                {/* Acciones */}
                <div className="hidden sm:flex items-center justify-center space-x-6">

                    {!loading && (
                        <>
                            {account ? (
                                <>
                                    <UserMenu user={account} onLogout={handleLogout} />
                                    <div className="w-[3px] h-[30px] bg-[#004E09]" />
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/account/login"
                                        className="text-[1.3rem] font-medium text-[#004E09] cursor-pointer hover:opacity-70 desktop-md:text-[1.1rem]"
                                    >
                                        Acceder
                                    </Link>
                                    <div className="w-[3px] h-[30px] bg-[#004E09]" />
                                </>
                            )}
                        </>
                    )}

                    <SearchButton />
                    <CartButton />
                </div>
            </nav>
        </header>
    );
}
