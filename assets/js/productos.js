import { supabase } from "../../db/supabase.js"
import { urlBase } from "../../utils/urlBase.js"

async function conseguirProductos() {
    const { data, error } = await supabase.from('productos').select('*')
    console.log(data)
    const productosDiv = document.getElementById('Productos')
    
    for (let producto of data) {
        const link = document.createElement('a')
        link.href = `${urlBase()}/detalle.html?planta=${producto.slug}`
        link.className = "celda-producto"
        const celda = document.createElement('div')
        //rescate imagen
        const img = document.createElement('img')
        img.src = producto.image
        img.className = "imagenprod"

        const div = document.createElement('div')
        //rescate titulo
        const titulo = document.createElement('h3')
        titulo.textContent = producto.name

        //rescate precio
        const precio = document.createElement('h4')
        precio.textContent = "$" + producto.price

        //agregar boton
        const boton = document.createElement('button')
        boton.textContent = "ver producto"
        boton.className = "btn-ver-producto"
        boton.href = `/detalle.html?producto=${producto.slug}`

        //pasar variables a etiqueta div
        link.appendChild(celda)
        celda.appendChild(img)
        div.appendChild(titulo)
        div.appendChild(precio)
        productosDiv.appendChild(link)
        div.appendChild(boton)
        celda.appendChild(div)
    }
}
conseguirProductos()