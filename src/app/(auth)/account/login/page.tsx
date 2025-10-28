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
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="email" name="email" />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}