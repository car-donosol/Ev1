"use client"
import Link from "next/link"
import { SearchButton } from "@/components/client/search-button"
import { CartButton } from "@/components/client/cart-button"
import { UserMenu } from "@/components/client/user-menu"
import { useState, useEffect } from "react"
import type { User } from "@/hooks/useAuth"

export function MenuComponent() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('usuario');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (err) {
            console.error('Error loading user:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        setUser(null);
    };

    return (
        <header className="max-w-[1400px] mx-auto w-full">
            <nav className="w-full flex items-center justify-between p-[1.2rem] mt-2 desktop-md:px-20 transition-all duration-300 relative">
                <div className="mb-2 flex items-center justify-center space-x-10">
                    <Link href="/" className="cursor-pointer hover:opacity-70">
                        <img src="/logo.png" alt="Logo" className="h-14 desktop-md:h-12" />
                    </Link>
                </div>

                <ul className="hidden tablet:flex gap-8 mt-1 absolute left-1/2 transform -translate-x-1/2">
                    <li className="text-xl hover:opacity-70 desktop-md:text-[1.1rem]">
                        <Link href="/home">Home</Link>
                    </li>
                    <li className="text-xl hover:opacity-70 desktop-md:text-[1.1rem]">
                        <Link href="/">Catálogo</Link>
                    </li>
                    <li className="text-xl hover:opacity-70 desktop-md:text-[1.1rem]">
                        <Link href="/contact">Contacto</Link>
                    </li>
                </ul>

                <div className="hidden sm:flex items-center justify-center space-x-6">
                    {!isLoading && (
                        <>
                            {user ? (
                                <>
                                    <UserMenu user={user} onLogout={handleLogout} />
                                    <div className="w-[3px] h-[30px] bg-[#004E09]"></div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/account/login"
                                        className="text-[1.3rem] font-medium text-[#004E09] cursor-pointer hover:opacity-70 desktop-md:text-[1.1rem]"
                                    >
                                        Acceder
                                    </Link>
                                    <div className="w-[3px] h-[30px] bg-[#004E09]"></div>
                                </>
                            )}
                        </>
                    )}

                    <SearchButton />
                    <CartButton />
                </div>
            </nav>
        </header>
    )
}