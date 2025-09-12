import { supabase } from "../../db/supabase.js";

const div = document.getElementById("detalle");
const url = new URLSearchParams(window.location.search);
const slug = url.get("producto");

const cargando = document.getElementById("cargando")

if (!slug) {
    noencontrado()
} else {
    producto(slug);
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
        imagen.src = data.image;
        imagen.width = 350;
        imagen.height = 350;
        imagen.alt = data.name;

        const titulo = document.createElement("h1");
        titulo.textContent = data.name;

        div.appendChild(imagen);
        div.appendChild(titulo);
        
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
