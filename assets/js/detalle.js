import { supabase } from "../../db/supabase.js";
import { tns } from 'https://cdn.skypack.dev/tiny-slider';


const div = document.getElementById("detalle");
const url = new URLSearchParams(window.location.search);

if (!url.has("planta")) {
    window.location.href = "index.html";
}

const slug = url.get("planta");

const cargando = document.getElementById("cargando")
const masProductos = document.getElementById("mas-productos")

if (!slug) {
    noencontrado()
    productosSugeridos();
} else {
    producto(slug);
    productosSugeridos();
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
        descripcion.textContent = data.overview || "Sin descripción disponible.";
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
        masProductos.style.display = "block"

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

async function productosSugeridos() {
    const { data, error } = await supabase.from('productos').select('*');
    const contenedor = document.getElementById("productos-sugeridos");

    if (error) {
        console.error(error);
        return;
    }

    for (let p of data) {
        const contenedorProducto = document.createElement("div");
        contenedorProducto.className = "producto-sugerido";

        const imagen = document.createElement("img");
        imagen.src = p.image;
        imagen.alt = p.name;
        imagen.className = "imagen-producto";

        const infoContenido = document.createElement("div");
        infoContenido.className = "info-contenido";
        
        const titulo = document.createElement("h2");
        titulo.textContent = p.name;
        titulo.className = "titulo-producto";

        const precio = document.createElement("p");
        precio.textContent = `$${formatearMoneda(p.price)}`;
        precio.className = "precio-producto";

        const a = document.createElement("a");
        a.href = `detalle.html?planta=${p.slug}`;
        a.style.textDecoration = "none";
        a.style.color = "inherit";

        const button = document.createElement("button");
        button.textContent = "Ver producto";
        button.className = "btn-ver-producto";

        contenedorProducto.appendChild(imagen);
        infoContenido.appendChild(titulo);
        infoContenido.appendChild(precio);
        a.appendChild(button);
        infoContenido.appendChild(a);
        contenedorProducto.appendChild(infoContenido);
        contenedor.appendChild(contenedorProducto);
    }

    const slider = tns({
        container: '.my-slider',
        items: 1,
        slideBy: 'page',
        autoplay: true,
        controls: false,
        autoplayTimeout: 6000,
        mouseDrag: true,
        gutter: 5,
        responsive: {
            640: { items: 2, gutter: 20 },
            900: { items: 3, gutter: 30 }
        }
    });
}