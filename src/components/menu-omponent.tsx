"use client"
import Link from "next/link"
import { SearchButton } from "@/components/client/search-button"
import { CartButton } from "@/components/client/cart-button"
import { UserMenu } from "@/components/client/user-menu"
import { useState, useEffect } from "react"
import type { User } from "@/hooks/useAuth"
import { useCurrency } from "@/context/currency-context"

export function MenuComponent() {
    const [account, setAccount] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { currency, setCurrency } = useCurrency();

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
        <header className="max-w-[1400px] mx-auto w-full relative z-50">
            <nav className="w-full flex items-center justify-between p-[1.2rem] mt-2 desktop-md:px-20 transition-all duration-300">

                {/* Logo */}
                <div className="mb-2 flex items-center justify-center space-x-10">
                    <Link href="/" className="cursor-pointer hover:opacity-70">
                        <img src="/logo.png" alt="Logo" className="h-14 desktop-md:h-12" />
                    </Link>
                </div>

                {/* Menú principal Desktop */}
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

                {/* Acciones derecha */}
                <div className="flex items-center gap-4">
                    
                    {/* Desktop: Login y Moneda */}
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

                        <div className="flex items-center gap-2">
                            <label htmlFor="currency-desktop" className="text-sm text-gray-700">Moneda</label>
                            <select
                                id="currency-desktop"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value as any)}
                                className="text-sm border border-gray-300 rounded px-2 py-1 hover:border-gray-400"
                            >
                                <option value="CLP">CLP</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>
                    </div>

                    {/* Siempre visibles: Search y Cart */}
                    <div className="flex items-center gap-2">
                        <SearchButton />
                        <CartButton />
                        
                        {/* Mobile Toggle */}
                        <button 
                            className="sm:hidden p-2 text-[#004E09]"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Menú"
                        >
                            {mobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="sm:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 p-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                    <ul className="flex flex-col gap-4 text-center">
                        <li className="text-lg font-medium hover:text-[#004E09]">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
                        </li>
                        <li className="text-lg font-medium hover:text-[#004E09]">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Catálogo</Link>
                        </li>
                        <li className="text-lg font-medium hover:text-[#004E09]">
                            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contacto</Link>
                        </li>
                    </ul>

                    <hr className="border-gray-200" />

                    <div className="flex flex-col items-center gap-4">
                        {!loading && (
                            <>
                                {account ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="font-medium">
                                            Hola, {(account as any)?.pnombre ?? account.name ?? account.email?.split("@")[0] ?? "Usuario"}
                                        </span>
                                        <button 
                                            onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                            className="text-red-600 text-sm hover:underline"
                                        >
                                            Cerrar sesión
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/account/login"
                                        className="text-lg font-medium text-[#004E09] hover:opacity-70"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Acceder
                                    </Link>
                                )}
                            </>
                        )}

                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded w-full justify-center">
                            <label htmlFor="currency-mobile" className="text-sm text-gray-700">Moneda:</label>
                            <select
                                id="currency-mobile"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value as any)}
                                className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                            >
                                <option value="CLP">CLP</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
