"use server"
export default async function Productos() {
    const datos = await new Promise(resolve => setTimeout(() => resolve("Datos de productos"), 2000));
    return (
        <div>
            <h1>Productos</h1>
        </div>
    )
}