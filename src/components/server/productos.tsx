"use server"
import Link from "next/link";
import { getProducts } from "@/db/products";
import { ProductosClient } from "@/components/client/productos-client";

export default async function Productos() {
    const products = await getProducts();
    return (
        <ProductosClient products={products as any} />
    )
}


