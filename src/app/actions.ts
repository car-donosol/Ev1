'use server';
import { users } from "@/db/users";
import { products } from "@/db/products";
import { cookies } from "next/headers";

type CartCookieItem = { id: number; quantity: number };

// Función auxiliar para obtener usuarios de localStorage (simulado en cookie)
async function getUsersFromStorage() {
    const cookiesStore = await cookies();
    const userCookie = cookiesStore.get("users")?.value;
    if (userCookie) {
        try {
            const cookieUsers = JSON.parse(userCookie);
            return Array.isArray(cookieUsers) ? cookieUsers : [];
        } catch (err) {
            console.error("Invalid cookie format:", err);
            return [];
        }
    }
    return [];
}

// Función auxiliar para guardar usuarios en localStorage (simulado en cookie)
async function saveUsersToStorage(usersList: any[]) {
    const cookiesStore = await cookies();
    cookiesStore.set({
        name: 'users',
        value: JSON.stringify(usersList),
        path: '/',
        maxAge: 60 * 60 * 24 * 365 // 1 año
    });
}

export async function register(data: FormData) {
    try {
        const name = data.get("name")?.toString();
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();

        if (!name || !email || !password) {
            return { success: false, message: "Todos los campos son requeridos" };
        }

        // Validar longitud de contraseña
        if (password.length < 6) {
            return { success: false, message: "La contraseña debe tener al menos 6 caracteres" };
        }

        // Verificar si el email ya existe en users.ts
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return { success: false, message: "Este correo ya está registrado" };
        }

        // Verificar en localStorage (cookie)
        const storageUsers = await getUsersFromStorage();
        const existingStorageUser = storageUsers.find((u: any) => u.email === email);
        if (existingStorageUser) {
            return { success: false, message: "Este correo ya está registrado" };
        }

        // Crear nuevo usuario
        const newUser = {
            id: Date.now(), // ID único basado en timestamp
            name,
            email,
            password
        };

        // Agregar usuario a la lista de localStorage
        storageUsers.push(newUser);
        await saveUsersToStorage(storageUsers);

        return { 
            success: true, 
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
            message: "Usuario registrado exitosamente"
        };
    } catch (error) {
        console.error("Register error:", error);
        return { success: false, message: "Error inesperado al registrar" };
    }
}

export async function login(data: FormData) {
    try {
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();

        if (!email || !password) {
            return { success: false, message: "Email y contraseña son requeridos" };
        }

        // Buscar primero en users.ts (usuarios predefinidos)
        let user = users.find(u => u.email === email && u.password === password);

        // Si no se encuentra, buscar en localStorage (usuarios registrados)
        if (!user) {
            const storageUsers = await getUsersFromStorage();
            user = storageUsers.find(
                (u: any) => u.email === email && u.password === password
            );
        }

        if (!user) {
            return { success: false, message: "Email o contraseña incorrectos" };
        }

        // Retornar usuario sin la contraseña
        const { password: _, ...userWithoutPassword } = user;
        return { success: true, user: userWithoutPassword };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Error inesperado al iniciar sesión" };
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
        cookiesStore.set({ name: 'carrito', value: JSON.stringify([]), path: '/' });
        return { success: true };
    } catch (err) {
        console.error('clearCart error', err);
        return { success: false, message: 'Error al limpiar el carrito' };
    }
}