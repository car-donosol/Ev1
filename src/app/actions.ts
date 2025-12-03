'use server';
import { cookies } from "next/headers";
import { supabase } from "@/db/supabase";

type CartCookieItem = { id: number; quantity: number };

// Función para obtener productos desde Supabase
export async function getProductsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('Plantas')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getProductsFromSupabase:', err);
    return null;
  }
}

// Función para obtener un producto específico por slug
export async function getProductBySlugFromSupabase(slug: string) {
  try {
    const { data, error } = await supabase
      .from('Plantas')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching product from Supabase:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getProductBySlugFromSupabase:', err);
    return null;
  }
}

// Función para obtener un producto específico por ID
export async function getProductByIdFromSupabase(id: number) {
  try {
    const { data, error } = await supabase
      .from('Plantas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product from Supabase:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getProductByIdFromSupabase:', err);
    return null;
  }
}

// Función para obtener productos destacados (toHome = true)
export async function getFeaturedProductsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('Plantas')
      .select('*')
      .eq('toHome', true)
      .limit(6);

    if (error) {
      console.error('Error fetching featured products from Supabase:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getFeaturedProductsFromSupabase:', err);
    return null;
  }
}

// Función para obtener productos por categoría
export async function getProductsByCategoryFromSupabase(category: string) {
  try {
    const { data, error } = await supabase
      .from('Plantas')
      .select('*')
      .eq('category', category)
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching products by category from Supabase:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getProductsByCategoryFromSupabase:', err);
    return null;
  }
}

// ===========================
// AUTHENTICATION - RAILWAY API
// ===========================

export async function register(data: FormData) {
  try {
    const { registerUser } = await import('@/lib/railway-api');

    const run = parseInt(data.get("run")?.toString() || "0");
    const dv = parseInt(data.get("dv")?.toString() || "0");
    const pnombre = data.get("pnombre")?.toString();
    const snombre = data.get("snombre")?.toString();
    const appaterno = data.get("appaterno")?.toString();
    const apmaterno = data.get("apmaterno")?.toString();
    const email = data.get("email")?.toString();
    const telefono = parseInt(data.get("telefono")?.toString() || "0");
    const password = data.get("password")?.toString();

    if (!pnombre || !appaterno || !apmaterno || !email || !password) {
      return { success: false, message: "Todos los campos obligatorios son requeridos" };
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return { success: false, message: "La contraseña debe tener al menos 6 caracteres" };
    }

    const userData = {
      run,
      dv,
      pnombre,
      snombre,
      appaterno,
      apmaterno,
      email,
      telefono,
      password
    };

    const user = await registerUser(userData);

    if (!user) {
      return { success: false, message: "Error al registrar usuario" };
    }

    return {
      success: true,
      user: {
        id: user.id,
        pnombre: user.pnombre,
        snombre: user.snombre,
        appaterno: user.appaterno,
        apmaterno: user.apmaterno,
        email: user.email
      },
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

    // Llamar a la API de Railway para autenticar
    const { loginUser } = await import('@/lib/railway-api');
    const result = await loginUser({ email, password });

    if (!result.success || !result.user) {
      return {
        success: false,
        message: result.message || "Email o contraseña incorrectos"
      };
    }

    // Retornar usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = result.user;
    return {
      success: true,
      user: userWithoutPassword,
      message: "Inicio de sesión exitoso"
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Error inesperado al iniciar sesión" };
  }
}

// ===========================
// SHOPPING CART
// ===========================

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

async function buildCartResponse(items: CartCookieItem[]) {
  if (items.length === 0) return [];

  const productIds = items.map(ci => ci.id);
  const { data: productsData, error } = await supabase
    .from('products')
    .select('id, title, image, price')
    .in('id', productIds);

  if (error || !productsData) {
    console.error('Error fetching products for cart:', error);
    return [];
  }

  return items
    .map(ci => {
      const p = productsData.find(pp => pp.id === ci.id);
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
    return await buildCartResponse(parsed);
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

    // Verificar que el producto existe en Supabase
    const { data: product, error } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single();

    if (error || !product) {
      return { success: false, message: 'Producto no encontrado' };
    }

    const existing = parsed.find(i => i.id === productId);
    if (existing) {
      existing.quantity = Math.max(1, existing.quantity + quantity);
    } else {
      parsed.push({ id: productId, quantity: Math.max(1, quantity) });
    }

    cookiesStore.set({ name: 'carrito', value: JSON.stringify(parsed), path: '/' });

    return { success: true, carrito: await buildCartResponse(parsed) };
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
    return { success: true, carrito: await buildCartResponse(parsed) };
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
    return { success: true, carrito: await buildCartResponse(newParsed) };
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