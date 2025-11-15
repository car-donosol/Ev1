"use server"
import Link from "next/link";
import { products } from "@/db/products";
import { ProductosClient } from "@/components/client/productos-client";
import { supabase } from "@/db/supabase";

export default async function Productos() {
    await new Promise(resolve => setTimeout(() => resolve(""), 2000));
    return (
        <ProductosClient products={products as any} />
    )
}

