import { supabase } from '../../db/supabase.js';

function formatearMoneda(numero) {
    return new Intl.NumberFormat('es-CL').format(numero);
}

const carritoContainer = document.getElementById('carrito-container');

async function conseguirProductos() {
    const cart = JSON.parse(localStorage.getItem('carrito')) || [];
    const carritoHeader = document.getElementById('carrito-header');
    const carritoVacio = document.getElementById('carrito-vacio');

    if (!cart || cart.length === 0) {
        carritoHeader.classList.add('full');
        return;
    }

    carritoHeader.classList.remove('full');
    carritoContainer.style.display = 'block';
    carritoVacio.style.display = 'none';

    const { data: products, error } = await supabase
        .from('productos')
        .select('*')
        .in('id', cart.map(item => item.id));

    for (let p of products) {
        const cantidad = cart ? cart.find(i => i.id === p.id).cantidad : 1;
        const containerProducto = document.createElement('div');
        containerProducto.className = 'container-producto';

        const containerImagen = document.createElement('div');
        containerImagen.className = 'container-imagen';

        const productoImg = document.createElement('img');
        productoImg.src = p.image;
        productoImg.alt = p.name;
        productoImg.className = 'producto-img';

        const containerInfo = document.createElement('div');
        containerInfo.className = 'container-info';

        const titleProducto = document.createElement('p');
        titleProducto.className = 'title-producto';
        titleProducto.textContent = p.name;

        const contenedorCantidad = document.createElement('div');
        contenedorCantidad.className = 'contenedor-cantidad';

        const restarUnItem = document.createElement('button');
        restarUnItem.className = 'btn-restar';
        restarUnItem.textContent = '-';

        const spanCantidad = document.createElement('span');
        spanCantidad.className = 'span-cantidad';
        spanCantidad.textContent = cantidad;

        const sumarUnItem = document.createElement('button');
        sumarUnItem.className = 'btn-sumar';
        sumarUnItem.textContent = '+';

        if (cantidad >= p.stock) {
            sumarUnItem.disabled = true;
            sumarUnItem.classList.add('disabled');
        }

        restarUnItem.onclick = () => {
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            const index = carrito.findIndex(item => item.id === p.id);
            if (index !== -1) {
                if (carrito[index].cantidad > 1) {
                    carrito[index].cantidad -= 1;
                } else {
                    carrito.splice(index, 1);
                }
                localStorage.setItem('carrito', JSON.stringify(carrito));
                location.reload();
            }
        };

        sumarUnItem.onclick = () => {
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            const index = carrito.findIndex(item => item.id === p.id);

            if (index !== -1) {
                if (carrito[index].cantidad < p.stock) {
                    carrito[index].cantidad += 1;
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    location.reload();
                } else {
                    sumarUnItem.disabled = true;
                    sumarUnItem.classList.add('disabled');
                }
            }
        };

        const precioProducto = document.createElement('p');
        precioProducto.className = 'precio-producto';
        precioProducto.textContent = `$${formatearMoneda(p.price * cantidad)}`;

        containerImagen.appendChild(productoImg);
        containerImagen.appendChild(containerInfo);
        containerInfo.appendChild(titleProducto);
        contenedorCantidad.appendChild(restarUnItem);
        contenedorCantidad.appendChild(spanCantidad);
        contenedorCantidad.appendChild(sumarUnItem);
        containerInfo.appendChild(contenedorCantidad);
        containerProducto.appendChild(containerImagen);
        containerProducto.appendChild(precioProducto);
        carritoContainer.appendChild(containerProducto);

        console.log({
            id: p.id,
            name: p.name,
            image: p.image,
            price: p.price,
            stock: p.stock,
            cantidad
        });
    }
}

async function crearBotonPago() {

}

conseguirProductos();

if (JSON.parse(localStorage.getItem('carrito')).length > 0) {
    const bottomContainer = document.createElement('div');
    bottomContainer.className = 'bottom-container';

    const btnFinalizarCompra = document.createElement('button');
    btnFinalizarCompra.className = 'btn-finalizar-compra';
    btnFinalizarCompra.textContent = 'Finalizar Compra';

    btnFinalizarCompra.onclick = async () => {
        if (!localStorage.getItem('refresh-token')) {
            window.location.href = './login.html';
        } else {
            localStorage.setItem("carrito", JSON.stringify([]));
            window.location.href = './pago-completado.html';
        }
    };

    bottomContainer.appendChild(btnFinalizarCompra);
    carritoContainer.parentNode.appendChild(bottomContainer);
}