"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apis } from "@/apis";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const res = await fetch(`${apis.users}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok || !data?.success || !data?.user) {
                setMessage(data?.message || "Credenciales incorrectas.");
                return;
            }
            
            const {
                password: _ignorePassword,
                ...cleanUser
            } = data.user;

            localStorage.setItem("account", JSON.stringify(cleanUser));

            setMessage("Inicio de sesión exitoso.");

            setTimeout(() => router.push("/"), 800);

        } catch (error) {
            console.error(error);
            setMessage("Error inesperado al iniciar sesión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                {/* Formulario */}
                <div className="w-full max-w-md mx-auto lg:mx-0">

                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
                            <img src="/logo.png" alt="Logo" className="h-16 mx-auto" />
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                            ¡Bienvenido de vuelta!
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base">
                            Ingresa a tu cuenta para continuar
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Correo electrónico
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="tu@email.com"
                                    className="w-full pl-4 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#004E09] focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#004E09] transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400"
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            {/* Mensaje */}
                            {message && (
                                <div className={`p-4 rounded-xl text-sm font-medium ${
                                    message.includes("exitoso")
                                        ? "bg-green-50 text-green-700 border border-green-200"
                                        : "bg-red-50 text-red-700 border border-red-200"
                                }`}>
                                    {message}
                                </div>
                            )}

                            {/* Botón */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-[#004E09] to-[#006B0D] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] disabled:opacity-70 transition-all flex justify-center"
                            >
                                {loading ? "Iniciando..." : "Iniciar sesión"}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-600 mt-6">
                            ¿No tienes una cuenta?{" "}
                            <Link href="/account/register" className="font-semibold text-[#004E09] hover:text-[#003707]">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 mt-6"
                    >
                        ← Volver al inicio
                    </Link>
                </div>

                {/* Ilustración */}
                <div className="hidden lg:flex items-center justify-center">
                    <img src="/login-side.png" alt="Decoración" className="w-[420px] h-[520px] object-cover rounded-xl shadow-2xl" />
                </div>

            </div>
        </div>
    );
}
