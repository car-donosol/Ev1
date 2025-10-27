import Link from "next/link"
import { SearchButton } from "@/components/client/search-button"
import { CartButton } from "@/components/client/cart-button"

export function MenuComponent() {
    return (
        <header className="max-w-[1400px] mx-auto w-full">
            <nav className="w-full flex items-center justify-between p-[1.2rem] mt-2 xss:mt-6 transition-all duration-300 relative">
                <div className="mb-2 flex items-center justify-center space-x-10">
                    <Link href="/" className="cursor-pointer hover:opacity-70">
                        <img src="/logo.png" alt="Logo" className="h-14" />
                    </Link>
                </div>

                <ul className="hidden tablet:flex gap-8 mt-1 absolute left-1/2 transform -translate-x-1/2">
                    <li className="text-xl hover:opacity-70">
                        <Link href="/">Inicio</Link>
                    </li>
                    <li className="text-xl hover:opacity-70">
                        <Link href="/">Catalogo</Link>
                    </li>
                    <li className="text-xl hover:opacity-70">
                        <Link href="/">Contacto</Link>
                    </li>
                </ul>

                <div className="hidden sm:flex items-center justify-center space-x-6">
                    <button className="text-[1.3rem] font-medium text-[#004E09] cursor-pointer hover:opacity-70">
                        <Link href="/account/login">Acceder</Link>
                    </button>
                    <div className="w-[3px] h-[30px] bg-[#004E09]"></div>

                    <SearchButton />
                    <CartButton />
                </div>
            </nav>
        </header>
    )
}