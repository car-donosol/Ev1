"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions"
import Link from "next/link";

type ErrorState = {
    email?: string;
    password?: string;
    general?: string;
};

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<ErrorState>({});
    const [touched, setTouched] = useState({ email: false, password: false });
    const router = useRouter();

    const validateEmail = (email: string): string | undefined => {
        if (!email) return "El correo electrónico es requerido";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Ingresa un correo electrónico válido";
        return undefined;
    };

    const validatePassword = (password: string): string | undefined => {
        if (!password) return "La contraseña es requerida";
        if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
        return undefined;
    };

    const handleBlur = (field: 'email' | 'password', value: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        if (field === 'email') {
            const error = validateEmail(value);
            setErrors(prev => ({ ...prev, email: error }));
        } else {
            const error = validatePassword(value);
            setErrors(prev => ({ ...prev, password: error }));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(null);
        setErrors({});

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email")?.toString() || "";
        const password = formData.get("password")?.toString() || "";

        // Validar campos
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
            setTouched({ email: true, password: true });
            return;
        }

        setLoading(true);

        try {
            const result = await login(formData);

            if (result?.success && result?.user) {
                // Guardar usuario en localStorage
                localStorage.setItem('usuario', JSON.stringify(result.user));
                setMessage("Inicio de sesión exitoso.");

                // Redirigir al inicio después de 1 segundo
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            } else {
                setErrors({ general: result?.message || "Credenciales inválidas." });
            }
        } catch (err) {
            console.error(err);
            setErrors({ general: "Error inesperado al iniciar sesión." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                {/* Formulario de Login */}
                <div className="w-full max-w-md mx-auto lg:mx-0">
                    {/* Logo y encabezado */}
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

                    {/* Card del formulario */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Correo electrónico
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className={`w-5 h-5 transition-colors duration-200 ${errors.email && touched.email ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="tu@email.com"
                                        onBlur={(e) => handleBlur('email', e.target.value)}
                                        onChange={(e) => touched.email && handleBlur('email', e.target.value)}
                                        className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${errors.email && touched.email
                                                ? 'border-red-300 focus:ring-red-500 shake'
                                                : 'border-gray-200 focus:ring-[#004E09]'
                                            }`}
                                    />
                                </div>
                                {errors.email && touched.email && (
                                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className={`w-5 h-5 transition-colors duration-200 ${errors.password && touched.password ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        placeholder="••••••••"
                                        onBlur={(e) => handleBlur('password', e.target.value)}
                                        onChange={(e) => touched.password && handleBlur('password', e.target.value)}
                                        className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${errors.password && touched.password
                                                ? 'border-red-300 focus:ring-red-500 shake'
                                                : 'border-gray-200 focus:ring-[#004E09]'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && touched.password && (
                                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Recordarme / Olvidé contraseña */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-[#004E09] focus:ring-[#004E09] cursor-pointer"
                                    />
                                    <span className="text-gray-600 group-hover:text-gray-800 transition-colors">
                                        Recordarme
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    className="text-[#004E09] hover:text-[#003707] font-medium transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>

                            {/* Mensaje de error/éxito */}
                            {(message || errors.general) && (
                                <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 animate-fade-in ${message?.includes("exitoso")
                                        ? "bg-green-50 text-green-700 border border-green-200"
                                        : "bg-red-50 text-red-700 border border-red-200"
                                    }`}>
                                    {message?.includes("exitoso") ? (
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    <span>{message || errors.general}</span>
                                </div>
                            )}

                            {/* Botón de login */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-[#004E09] to-[#006B0D] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Iniciando sesión...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Iniciar sesión</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">o continúa con</span>
                            </div>
                        </div>

                        {/* Social login buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">GitHub</span>
                            </button>
                        </div>

                        {/* Link a registro */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            ¿No tienes una cuenta?{" "}
                            <Link href="/account/register" className="font-semibold text-[#004E09] hover:text-[#003707] transition-colors">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>

                    {/* Volver al inicio */}
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 mt-6 transition-colors group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-medium">Volver al inicio</span>
                    </Link>
                </div>

                {/* Ilustración decorativa */}
                <div className="hidden lg:flex items-center justify-center">
                    <div className="relative">
                        {/* Decoración de fondo */}
                        <div className="absolute -inset-4 bg-gradient-to-br from-green-100 to-green-50 rounded-3xl blur-2xl opacity-50"></div>

                        {/* Imagen */}
                        <div className="relative rounded-2xl shadow-2xl overflow-hidden border border-gray-100 p-8">
                            <div className="w-[420px] h-[520px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                                <img
                                    src="/login-side.png"
                                    alt="Plantas decorativas"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* Overlay con features */}
                            <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
                                <p className="text-sm font-semibold text-gray-800 mb-3">¿Por qué elegirnos?</p>
                                <ul className="space-y-2 text-xs text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Plantas de alta calidad</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Envío rápido y seguro</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Garantía de satisfacción</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Elementos decorativos flotantes */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-300 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }

                .shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
}