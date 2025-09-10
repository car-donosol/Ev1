const url = new URLSearchParams(window.location.search);

import { data } from "../../api/db.js"

const id = url.get("id")

if(!id) window.location.href = "404.html"

const res = data.find(s => s.id == id)

if(!res) window.location.href = "404.html"

const div = document.getElementById("detalle")

const imagen = document.createElement("img")
imagen.src = `./assets/img/${res.image}`
imagen.width = 350
imagen.height = 350

const titulo = document.createElement("h1")
titulo.textContent = res.name

div.appendChild(imagen)
div.appendChild(titulo)