const url = new URLSearchParams(window.location.search);

import { data } from "../../api/db.js"

const id = url.get("id")

if(!id) window.location.href = "404.html"

const res = data.find(s => s.id == id)

const div = document.getElementById("detalle")

if(!res) {
    document.title = "Producto no encontrado - Huertabeja";
    const section = document.createElement("section")
    section.className = "container-404"

    const h4 = document.createElement("h4")
    h4.textContent = "404 Producto no encontrado"

    const p = document.createElement("p")
    p.textContent = "El producto que ha solicitado no existe"

    section.appendChild(h4)
    section.appendChild(p)

    div.appendChild(section)
}

document.title = `${res.name} - Huertabeja`;

const imagen = document.createElement("img")
imagen.src = `./assets/img/${res.image}`
imagen.width = 350
imagen.height = 350

const titulo = document.createElement("h1")
titulo.textContent = res.name

div.appendChild(imagen)
div.appendChild(titulo)