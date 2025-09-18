import { supabase } from "../../db/supabase.js"
import { urlBase } from "../../utils/urlBase.js"

function formatearMoneda(numero) {
    return new Intl.NumberFormat('es-CL').format(numero);
}

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
        titulo.className = "titulo" 
        titulo.textContent = producto.name

        //rescate precio
        const precio = document.createElement('p')
        precio.className = "precio"
        precio.textContent = "$" + formatearMoneda(producto.price)

        //agregar boton
        const boton = document.createElement('button')
        boton.textContent = "Ver producto"
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