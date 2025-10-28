'use server';
import { users } from "@/users";
import { cookies } from "next/headers";

export async function login(data: FormData) {
    try {
        const cookiesStore = await cookies();

        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();

        if (!email || !password) {
            return { success: false, message: "Email and password are required" };
        }

        let user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            const userCookie = cookiesStore.get("users")?.value;
            if (userCookie) {
                try {
                    const cookieUsers = JSON.parse(userCookie);
                    if (Array.isArray(cookieUsers)) {
                        user = cookieUsers.find(
                            (u: any) => u.email === email && u.password === password
                        );
                    }
                } catch (err) {
                    console.error("Invalid cookie format:", err);
                }
            }
        }

        if (!user) {
            return { success: false, message: "Invalid email or password" };
        }

        return { success: true, user };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Unexpected error during login" };
    }
}