"use client"
import { useState } from "react";
import { login } from "@/app/actions"

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            const result = await login(formData);
            if (result?.success) {
                setMessage("Inicio de sesión exitoso.");
            } else {
                setMessage(result?.message || "Credenciales inválidas.");
            }
            console.log("login result:", result);
        } catch (err) {
            console.error(err);
            setMessage("Error inesperado al iniciar sesión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="laptop:flex laptop:items-center laptop:justify-between laptop:h-dvh laptop:gap-12">
            <div className="flex items-center flex-col justify-center h-dvh max-w-[520px] px-0 tablet:px-4 tablet:mx-auto laptop:mx-[0] laptop:w-[520px]">
                <div className="mb-6 mobile:mb-8">
                    <img src="/logo.png" alt="Logo" className="h-14" />
                </div>

                <h1 className="text-[1.5rem] mobile:text-[1.8rem] font-semibold uppercase tracking-[0.080em]">
                    Iniciar sesión
                </h1>

                <form className="mt-2 mobile:mt-4 w-full" onSubmit={handleSubmit}>
                    <label className="text-[.900rem] mobile:text-[1rem] text-[#696969] tracking-[0.20em] uppercase font-medium flex flex-col gap-2 relative">
                        Email:
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="tucorreo@ejemplo.com"
                            className="bg-white text-[1.05rem] font-medium rounded-full h-[3rem] mobile:h-[3.4rem] text-black w-full shadow-sm tracking-normal px-5 border-[transparent] transition-all duration-300 focus:outline-0 border-[2px] focus:border-[#004E09]"
                        />
                    </label>

                    <label className="mt-3 mobile:mt-4 text-[.900rem] mobile:text-[1rem] text-[#696969] tracking-[0.20em] uppercase font-medium flex flex-col gap-2 relative">
                        Password:
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            className="bg-white text-[1.05rem] font-medium rounded-full h-[3rem] mobile:h-[3.4rem] text-black w-full shadow-sm tracking-normal px-5 border-[transparent] transition-all duration-300 focus:outline-0 border-[2px] focus:border-[#004E09]"
                        />
                    </label>

                    <button
                        type="submit"
                        className={`mt-6 w-full rounded-full ${loading ? "opacity-70" : "hover:opacity-90"} bg-[#004E09] text-white h-[3.6rem] mobile:h-[4rem] text-[1.05rem] font-semibold transition-all duration-200`}
                        aria-busy={loading ? "true" : "false"}
                    >
                        {loading ? "Ingresando..." : "Iniciar sesión"}
                    </button>

                    {message && (
                        <p className="mt-4 text-center text-sm text-[#333]">{message}</p>
                    )}
                </form>
            </div>

            {/* Right-side illustration: visible on laptop and larger screens */}
            <div className="hidden laptop:flex items-center justify-center">
                <div className="w-[390px] h-[590px] flex-shrink-0">
                    {/* Place your image in `public/login-side.png`. */}
                    <img src="/login-side.png" alt="Ilustración login" className="w-full h-full object-cover rounded-md shadow-lg" width={390} height={590} />
                </div>
            </div>
        </div>
    )
}