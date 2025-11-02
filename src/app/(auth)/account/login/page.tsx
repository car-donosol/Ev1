"use client"
import { login } from "@/app/actions"

export default function LoginPage() {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const result = await login(formData);
        console.log(result);
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
                        <input type="email" name="email" className="bg-white text-[1.2rem] font-medium rounded-full h-[2.8rem] mobile:h-[3.2rem] text-black w-full shadow-sm tracking-normal px-[3.5rem] border-[transparent] transition-all duration-300 focus:outline-0 border-[2px] focus:border-[#004E09]" />
                    </label>
                    <label className="mt-3 mobile:mt-4 text-[.900rem] mobile:text-[1rem] text-[#696969] tracking-[0.20em] uppercase font-medium flex flex-col gap-2 relative">
                        Password:
                        <input type="password" name="password" />
                    </label>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}