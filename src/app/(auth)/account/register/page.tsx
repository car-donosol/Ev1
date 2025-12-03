"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/app/actions"
import Link from "next/link";

type ErrorState = {
    run?: string;
    dv?: string;
    pnombre?: string;
    snombre?: string;
    appaterno?: string;
    apmaterno?: string;
    email?: string;
    telefono?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
};

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<ErrorState>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const router = useRouter();

    /**
     * Validar RUN chileno
     */
    const validateRUN = (run: string): string | undefined => {
        if (!run) return "El RUN es requerido";
        const runNumber = parseInt(run);
        if (isNaN(runNumber) || runNumber < 1000000 || runNumber > 99999999) {
            return "RUN debe estar entre 1.000.000 y 99.999.999";
        }
        return undefined;
    };

    /**
     * Validar DV (dígito verificador)
     */
    const validateDV = (dv: string): string | undefined => {
        if (!dv) return "El DV es requerido";
        const dvNumber = parseInt(dv);
        if (isNaN(dvNumber) || dvNumber < 0 || dvNumber > 9) {
            return "DV debe ser un número entre 0 y 9";
        }
        return undefined;
    };

    /**
     * Validar nombre (solo letras y espacios)
     */
    const validateNombre = (nombre: string, campo: string): string | undefined => {
        if (!nombre) return `${campo} es requerido`;
        if (nombre.length < 2) return `${campo} debe tener al menos 2 caracteres`;
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
            return `${campo} solo puede contener letras`;
        }
        return undefined;
    };

    /**
     * Validar email
     */
    const validateEmail = (email: string): string | undefined => {
        if (!email) return "El correo electrónico es requerido";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Ingresa un correo electrónico válido";
        return undefined;
    };

    /**
     * Validar teléfono chileno (9 dígitos)
     */
    const validateTelefono = (telefono: string): string | undefined => {
        if (!telefono) return "El teléfono es requerido";
        const telefonoNumber = parseInt(telefono);
        if (isNaN(telefonoNumber) || telefono.length !== 9) {
            return "Teléfono debe tener 9 dígitos";
        }
        if (!telefono.startsWith('9')) {
            return "Teléfono debe comenzar con 9";
        }
        return undefined;
    };

    /**
     * Validar contraseña
     */
    const validatePassword = (password: string): string | undefined => {
        if (!password) return "La contraseña es requerida";
        if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
        return undefined;
    };

    const handleBlur = (field: string, value: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        let error: string | undefined;

        switch (field) {
            case 'run':
                error = validateRUN(value);
                break;
            case 'dv':
                error = validateDV(value);
                break;
            case 'pnombre':
                error = validateNombre(value, 'Primer nombre');
                break;
            case 'snombre':
                // Segundo nombre es opcional
                if (value && value.trim()) {
                    error = validateNombre(value, 'Segundo nombre');
                }
                break;
            case 'appaterno':
                error = validateNombre(value, 'Apellido paterno');
                break;
            case 'apmaterno':
                error = validateNombre(value, 'Apellido materno');
                break;
            case 'email':
                error = validateEmail(value);
                break;
            case 'telefono':
                error = validateTelefono(value);
                break;
            case 'password':
                error = validatePassword(value);
                break;
        }

        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(null);
        setErrors({});

        const formData = new FormData(event.currentTarget);

        // Obtener valores
        const run = formData.get("run")?.toString() || "";
        const dv = formData.get("dv")?.toString() || "";
        const pnombre = formData.get("pnombre")?.toString() || "";
        const snombre = formData.get("snombre")?.toString() || "";
        const appaterno = formData.get("appaterno")?.toString() || "";
        const apmaterno = formData.get("apmaterno")?.toString() || "";
        const email = formData.get("email")?.toString() || "";
        const telefono = formData.get("telefono")?.toString() || "";
        const password = formData.get("password")?.toString() || "";
        const confirmPassword = formData.get("confirmPassword")?.toString() || "";

        // Validar todos los campos
        const newErrors: ErrorState = {
            run: validateRUN(run),
            dv: validateDV(dv),
            pnombre: validateNombre(pnombre, 'Primer nombre'),
            appaterno: validateNombre(appaterno, 'Apellido paterno'),
            apmaterno: validateNombre(apmaterno, 'Apellido materno'),
            email: validateEmail(email),
            telefono: validateTelefono(telefono),
            password: validatePassword(password),
        };

        // Validar segundo nombre solo si se ingresó
        if (snombre && snombre.trim()) {
            newErrors.snombre = validateNombre(snombre, 'Segundo nombre');
        }

        // Validación de contraseñas coincidentes
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        // Filtrar errores undefined
        const filteredErrors = Object.fromEntries(
            Object.entries(newErrors).filter(([_, v]) => v !== undefined)
        ) as ErrorState;

        if (Object.keys(filteredErrors).length > 0) {
            setErrors(filteredErrors);
            // Marcar todos los campos como touched
            const allTouched = Object.keys(newErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {});
            setTouched(allTouched);
            return;
        }

        setLoading(true);

        try {
            const result = await register(formData);

            if (result?.success && result?.user) {
                setMessage("Registro exitoso. Redirigiendo...");

                // Redirigir al login después de 1.5 segundos
                setTimeout(() => {
                    router.push('/account/login');
                }, 1500);
            } else {
                setErrors({ general: result?.message || "Error al registrar usuario" });
            }
        } catch (err) {
            console.error(err);
            setErrors({ general: "Error inesperado al registrar" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                {/* Formulario de Registro */}
                <div className="w-full max-w-lg mx-auto lg:mx-0">
                    {/* Logo y encabezado */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
                            <img src="/logo.png" alt="Logo" className="h-16 mx-auto" />
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                            Crear cuenta
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base">
                            Únete y empieza a disfrutar de nuestros productos
                        </p>
                    </div>

                    {/* Card del formulario */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 max-h-[80vh] overflow-y-auto">
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* RUN y DV en la misma línea */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2">
                                    <label htmlFor="run" className="block text-sm font-semibold text-gray-700 mb-2">
                                        RUN <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="run"
                                        type="number"
                                        name="run"
                                        required
                                        placeholder="12345678"
                                        onBlur={(e) => handleBlur('run', e.target.value)}
                                        onChange={(e) => touched.run && handleBlur('run', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${errors.run && touched.run
                                                ? 'border-red-300 focus:ring-red-500 shake'
                                                : 'border-gray-200 focus:ring-[#004E09]'
                                            }`}
                                    />
                                    {errors.run && touched.run && (
                                        <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.run}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="dv" className="block text-sm font-semibold text-gray-700 mb-2">
                                        DV <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="dv"
                                        type="number"
                                        name="dv"
                                        required
                                        max="9"
                                        min="0"
                                        placeholder="9"
                                        onBlur={(e) => handleBlur('dv', e.target.value)}
                                        onChange={(e) => touched.dv && handleBlur('dv', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${errors.dv && touched.dv
                                                ? 'border-red-300 focus:ring-red-500 shake'
                                                : 'border-gray-200 focus:ring-[#004E09]'
                                            }`}
                                    />
                                    {errors.dv && touched.dv && (
                                        <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.dv}</p>
                                    )}
                                </div>
                            </div>

                            {/* Nombres en la misma línea */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="pnombre" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Primer nombre <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="pnombre"
                                        type="text"
                                        name="pnombre"
                                        required
                                        placeholder="Juan"
                                        onBlur={(e) => handleBlur('pnombre', e.target.value)}
                                        onChange={(e) => touched.pnombre && handleBlur('pnombre', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${errors.pnombre && touched.pnombre
                                                ? 'border-red-300 focus:ring-red-500 shake'
                                                : 'border-gray-200 focus:ring-[#004E09]'
                                            }`}
                                    />
                                    {errors.pnombre && touched.pnombre && (
                                        <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.pnombre}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="snombre" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Segundo nombre
                                    </label>
                                    <input
                                        id="snombre"
                                        type="text"
                                        name="snombre"
                                        placeholder="Carlos"
                                        onBlur={(e) => handleBlur('snombre', e.target.value)}
                                        onChange={(e) => touched.snombre && handleBlur('snombre', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${errors.snombre && touched.snombre
                                                ? 'border-red-300 focus:ring-red-500 shake'
                                                : 'border-gray-200 focus:ring-[#004E09]'
                                            }`}
                                    />
                                    {errors.snombre && touched.snombre && (
                                        <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.snombre}</p>
                                    )}
                                </div>
                            </div>

                            {/* Apellidos en la misma línea */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="appaterno" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Apellido paterno <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="appaterno"
                                        type="text"
                                        name="appaterno"
                                        required
                                        placeholder="Pérez"
                                        onBlur={(e) => handleBlur('appaterno', e.target.value)}
                                        onChange={(e) => touched.appaterno && handleBlur('appaterno', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${errors.appaterno && touched.appaterno
                                                ? 'border-red-300 focus:ring-red-500 shake'
                                                : 'border-gray-200 focus:ring-[#004E09]'
                                            }`}
                                    />
                                    {errors.appaterno && touched.appaterno && (
                                        <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.appaterno}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="apmaterno" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Apellido materno <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="apmaterno"
                                        type="text"
                                        name="apmaterno"
                                        required
                                        placeholder="González"
                                        onBlur={(e) => handleBlur('apmaterno', e.target.value)}
                                        onChange={(e) => touched.apmaterno && handleBlur('apmaterno', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${errors.apmaterno && touched.apmaterno
                                                ? 'border-red-300 focus:ring-red-500 shake'
                                                : 'border-gray-200 focus:ring-[#004E09]'
                                            }`}
                                    />
                                    {errors.apmaterno && touched.apmaterno && (
                                        <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.apmaterno}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Correo electrónico <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className={`w-5 h-5 transition-colors ${errors.email && touched.email ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                        className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${errors.email && touched.email
                                                ? 'border-red-300 focus:ring-red-500 shake'
                                                : 'border-gray-200 focus:ring-[#004E09]'
                                            }`}
                                    />
                                </div>
                                {errors.email && touched.email && (
                                    <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.email}</p>
                                )}
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Teléfono <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 font-medium">
                                        +56
                                    </div>
                                    <input
                                        id="telefono"
                                        type="tel"
                                        name="telefono"
                                        required
                                        maxLength={9}
                                        placeholder="912345678"
                                        onBlur={(e) => handleBlur('telefono', e.target.value)}
                                        onChange={(e) => touched.telefono && handleBlur('telefono', e.target.value)}
                                        className={`w-full pl-16 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${errors.telefono && touched.telefono
                                                ? 'border-red-300 focus:ring-red-500 shake'
                                                : 'border-gray-200 focus:ring-[#004E09]'
                                            }`}
                                    />
                                </div>
                                {errors.telefono && touched.telefono && (
                                    <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.telefono}</p>
                                )}
                            </div>

                            {/* Contraseñas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Contraseña <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            minLength={6}
                                            placeholder="Mínimo 6 caracteres"
                                            onBlur={(e) => handleBlur('password', e.target.value)}
                                            onChange={(e) => touched.password && handleBlur('password', e.target.value)}
                                            className={`w-full px-4 pr-10 py-3 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${errors.password && touched.password
                                                    ? 'border-red-300 focus:ring-red-500 shake'
                                                    : 'border-gray-200 focus:ring-[#004E09]'
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && touched.password && (
                                        <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.password}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirmar <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            required
                                            minLength={6}
                                            placeholder="Repite tu contraseña"
                                            className={`w-full px-4 pr-10 py-3 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${errors.confirmPassword
                                                    ? 'border-red-300 focus:ring-red-500 shake'
                                                    : 'border-gray-200 focus:ring-[#004E09]'
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            {/* Términos y condiciones */}
                            <div>
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        required
                                        className="w-4 h-4 mt-1 rounded border-gray-300 text-[#004E09] focus:ring-[#004E09] cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                                        Acepto los{" "}
                                        <a href="#" className="text-[#004E09] hover:underline font-medium">
                                            términos y condiciones
                                        </a>{" "}
                                        y la{" "}
                                        <a href="#" className="text-[#004E09] hover:underline font-medium">
                                            política de privacidad
                                        </a>
                                    </span>
                                </label>
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

                            {/* Botón de registro */}
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
                                        <span>Registrando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Crear cuenta</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Link a login */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            ¿Ya tienes una cuenta?{" "}
                            <Link href="/account/login" className="font-semibold text-[#004E09] hover:text-[#003707] transition-colors">
                                Inicia sesión aquí
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

                            {/* Overlay con beneficios */}
                            <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
                                <p className="text-sm font-semibold text-gray-800 mb-3">Beneficios de registrarte</p>
                                <ul className="space-y-2 text-xs text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Seguimiento de pedidos</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Ofertas exclusivas</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Compra rápida y fácil</span>
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