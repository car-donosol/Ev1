import { supabase } from "../../db/supabase.js";

const div = document.getElementById("detalle");
const url = new URLSearchParams(window.location.search);

if(!url.has("planta")) {
    window.location.href = "index.html";
}

const slug = url.get("planta");

const cargando = document.getElementById("cargando")

if (!slug) {
    noencontrado()
} else {
    producto(slug);
}

function formatearMoneda(numero) {
  return new Intl.NumberFormat('es-CL').format(numero);
}

async function producto(id) {
    try {
        const { data, error } = await supabase.from("productos").select("*").eq("slug", slug).single();

        if (error || !data) {
            noencontrado()
            return;
        }

        document.title = `${data.name} - Huertabeja`;
        
        const imagen = document.createElement("img");
        imagen.className = "imagen-detalle";
        imagen.src = data.image;
        imagen.alt = data.name;

        const detalle = document.createElement("div");
        detalle.className = "detalle-producto";

        const titulo = document.createElement("h1");
        titulo.className = "titulo-detalle";
        titulo.textContent = data.name;

        const contenedorInfo = document.createElement("div");
        contenedorInfo.className = "contenedor-info";

        const precio = document.createElement("p");
        precio.textContent = `$${formatearMoneda(data.price)}`;
        precio.className = "precio-detalle";

        const stock = document.createElement("span");
        stock.textContent = data.stock > 0 ? "Disponible" : "Agotado";
        stock.className = data.stock > 0 ? "stock-disponible" : "stock-agotado";

        contenedorInfo.appendChild(precio);
        contenedorInfo.appendChild(stock);

        const contenedorAgregar = document.createElement("div");
        contenedorAgregar.className = "contenedor-agregar";

        const agregarCarrito = document.createElement("button");
        agregarCarrito.textContent = "Agregar al carrito";
        agregarCarrito.className = data.stock > 0 ? "btn-agregar" : "btn-agregar-disabled";
        agregarCarrito.disabled = data.stock <= 0;

        agregarCarrito.onclick = () => {
            agregarCarrito.className = "btn-agregar-cargando";
            const loadingSpinner = document.createElement("span");
            loadingSpinner.className = "cargando-agregar";
            agregarCarrito.textContent = "";
            agregarCarrito.appendChild(loadingSpinner);

            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

            const productoEnCarrito = carrito.find(item => item.id === data.id);
            if (productoEnCarrito) {
                productoEnCarrito.cantidad += 1;
            } else {
                carrito.push({ id: data.id, cantidad: 1 });
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));

            setTimeout(() => {
                agregarCarrito.className = "btn-agregar";
                agregarCarrito.textContent = "Agregar al carrito";
                window.location.href = "carrito.html";
            }, 1000);
        }

        const alertaStock = document.createElement("p");
        alertaStock.className = "alerta-stock";
        alertaStock.textContent = data.stock > 0 && data.stock <= 5 ? (data.stock === 1 ? "¡Última unidad disponible!" : `¡Últimas ${data.stock} unidades disponibles!`) : "";

        const tituloDescripcion = document.createElement("h3");
        tituloDescripcion.textContent = "Descripción";
        tituloDescripcion.className = "titulo-descripcion";

        const descripcion = document.createElement("p");
        descripcion.textContent = data.overview;
        descripcion.className = "descripcion-producto";
        
        div.appendChild(imagen);
        div.appendChild(detalle);
        detalle.appendChild(titulo);
        detalle.appendChild(contenedorInfo);
        detalle.appendChild(contenedorAgregar);
        detalle.appendChild(alertaStock);
        detalle.appendChild(tituloDescripcion);
        detalle.appendChild(descripcion);
        contenedorAgregar.appendChild(agregarCarrito);
        cargando.style.display = "none"

    } catch (err) {
        console.error("Error al obtener el producto:", err);
        noencontrado()
    }
}

function noencontrado() {
    document.title = "Producto no encontrado - Huertabeja";

    cargando.style.display = "none"

    const section = document.createElement("section");
    section.className = "container-404";

    const h4 = document.createElement("h4");
    h4.textContent = "404 Producto no encontrado";

    const p = document.createElement("p");
    p.textContent = "El producto que ha solicitado no existe";

    section.appendChild(h4);
    section.appendChild(p);
    div.appendChild(section);
}
