import { supabase } from './supabase';

// Tipos para los productos
export interface Product {
  id: number;
  title: string;
  price: number;
  price_offer: number;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  stock: number;
  slug: string;
  category: string;
  home?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Obtener todos los productos
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

// Obtener un producto por slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }

  return data;
}

// Obtener productos relacionados por categoría
export async function getRelatedProducts(
  productId: number,
  category: string,
  limit: number = 4
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', productId)
    .limit(limit);

  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }

  return data || [];
}

// Obtener productos destacados (home = true)
export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('home', true);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data || [];
}

// Obtener productos por categoría
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category);

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return data || [];
}