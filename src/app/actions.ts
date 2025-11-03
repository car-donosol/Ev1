'use server';
import { users } from "@/db/users";
import { products } from "@/db/products";
import { cookies } from "next/headers";

type CartCookieItem = { id: number; quantity: number };

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

function parseCartCookie(value?: string | null): CartCookieItem[] {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value) as any;
        if (!Array.isArray(parsed)) return [];
        return parsed
            .map((i: any) => ({ id: Number(i.id), quantity: Number(i.quantity) }))
            .filter((i: CartCookieItem) => Number.isFinite(i.id) && Number.isFinite(i.quantity) && i.quantity > 0);
    } catch (err) {
        console.error('Failed to parse carrito cookie', err);
        return [];
    }
}

function buildCartResponse(items: CartCookieItem[]) {
    // Map cookie items to product info
    return items
        .map(ci => {
            const p = products.find(pp => pp.id === ci.id);
            if (!p) return null;
            return {
                id: p.id,
                title: p.title,
                image: p.image,
                price: p.price,
                quantity: ci.quantity
            };
        })
        .filter(Boolean);
}

export async function getCarrito() {
    try {
    const cookiesStore = await cookies();
        const cookieValue = cookiesStore.get('carrito')?.value ?? null;
        const parsed = parseCartCookie(cookieValue);
        return buildCartResponse(parsed);
    } catch (err) {
        console.error('getCarrito error', err);
        return [];
    }
}

export async function addToCart(productId: number, quantity = 1) {
    try {
    const cookiesStore = await cookies();
        const cookieValue = cookiesStore.get('carrito')?.value ?? null;
        const parsed = parseCartCookie(cookieValue);

        const product = products.find(p => p.id === productId);
        if (!product) {
            return { success: false, message: 'Producto no encontrado' };
        }

        const existing = parsed.find(i => i.id === productId);
        if (existing) {
            existing.quantity = Math.max(1, existing.quantity + quantity);
        } else {
            parsed.push({ id: productId, quantity: Math.max(1, quantity) });
        }

        cookiesStore.set({ name: 'carrito', value: JSON.stringify(parsed), path: '/' });

        return { success: true, carrito: buildCartResponse(parsed) };
    } catch (err) {
        console.error('addToCart error', err);
        return { success: false, message: 'Error al añadir al carrito' };
    }
}

export async function updateCartItem(productId: number, quantity: number) {
    try {
    const cookiesStore = await cookies();
        const cookieValue = cookiesStore.get('carrito')?.value ?? null;
        const parsed = parseCartCookie(cookieValue);

        const idx = parsed.findIndex(i => i.id === productId);
        if (idx === -1) {
            return { success: false, message: 'Item no encontrado en el carrito' };
        }

        if (quantity <= 0) {
            // remove
            parsed.splice(idx, 1);
        } else {
            parsed[idx].quantity = quantity;
        }

        cookiesStore.set({ name: 'carrito', value: JSON.stringify(parsed), path: '/' });
        return { success: true, carrito: buildCartResponse(parsed) };
    } catch (err) {
        console.error('updateCartItem error', err);
        return { success: false, message: 'Error al actualizar el carrito' };
    }
}

export async function removeFromCart(productId: number) {
    try {
    const cookiesStore = await cookies();
        const cookieValue = cookiesStore.get('carrito')?.value ?? null;
        const parsed = parseCartCookie(cookieValue);

        const newParsed = parsed.filter(i => i.id !== productId);
        cookiesStore.set({ name: 'carrito', value: JSON.stringify(newParsed), path: '/' });
        return { success: true, carrito: buildCartResponse(newParsed) };
    } catch (err) {
        console.error('removeFromCart error', err);
        return { success: false, message: 'Error al remover del carrito' };
    }
}

export async function clearCart() {
    try {
    const cookiesStore = await cookies();
        // delete by setting empty value
        cookiesStore.set({ name: 'carrito', value: JSON.stringify([]), path: '/' });
        return { success: true };
    } catch (err) {
        console.error('clearCart error', err);
        return { success: false, message: 'Error al limpiar el carrito' };
    }
}