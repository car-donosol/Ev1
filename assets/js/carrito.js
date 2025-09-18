import { supabase } from '../../db/supabase.js';
import { getSession } from '../../assets/js/getSession.js';


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

        const eliminarProducto = document.createElement('button');
        eliminarProducto.className = 'btn-eliminar';
        eliminarProducto.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg"  
        width="24"  height="20"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  
        class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>`;
        eliminarProducto.className = 'btn-eliminar';
        eliminarProducto.onclick = () => {
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            carrito = carrito.filter(item => item.id !== p.id);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            location.reload();
        }

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
        containerInfo.appendChild(eliminarProducto);
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

conseguirProductos();

if (JSON.parse(localStorage.getItem('carrito')).length > 0) {
    const bottomContainer = document.createElement('div');
    bottomContainer.className = 'bottom-container';

    const totalCompra = document.createElement('div');
    totalCompra.className = 'total-compra';
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = 0;
    for (let item of carrito) {
        const { data: products, error } = await supabase
            .from('productos')
            .select('*')
            .eq('id', item.id)
            .single();
        if (products) {
            total += products.price * item.cantidad;
        }
    }
    totalCompra.textContent = `Total: $${formatearMoneda(total)}`;
    bottomContainer.appendChild(totalCompra);

    const btnContent = document.createElement('div');
    btnContent.className = 'btn-content';


    const btnFinalizarCompra = document.createElement('button');
    btnFinalizarCompra.className = 'btn-finalizar-compra';
    btnFinalizarCompra.textContent = 'Finalizar Compra';

    btnFinalizarCompra.onclick = async () => {
        try {
            const cargando = document.createElement('div');
            cargando.className = 'cargando';
            btnFinalizarCompra.disabled = true;
            btnFinalizarCompra.classList.add('disabled');
            btnFinalizarCompra.textContent = '';
            btnFinalizarCompra.appendChild(cargando)

            if (!localStorage.getItem('refresh-token')) {
                window.location.href = './login.html';
                return;
            };

            const sesion = await getSession(supabase);
            await supabase.auth.setSession(sesion);
            const { data: { user } } = await supabase.auth.getUser();

            const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            if (carrito.length === 0) {
                console.log('El carrito está vacío');
                return;
            }

            const datosCompra = {
                userId: user.id,
                products: carrito.map(producto => ({
                    id: producto.id,
                    cantidad: producto.cantidad
                }))
            };

            const respuesta = await fetch('https://api-pago.akongamer14.workers.dev/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosCompra)
            });

            const resultado = await respuesta.json();

            if (resultado.error) {
                btnFinalizarCompra.disabled = false;
                btnFinalizarCompra.classList.remove('disabled');
                btnFinalizarCompra.textContent = 'Finalizar Compra';

                const divError = document.createElement('div');
                divError.className = 'error-compra';
                divError.textContent = resultado.error;
                bottomContainer.appendChild(divError);

            } else {
                console.log(resultado.data);
                const payLinks = JSON.parse(localStorage.getItem('payLink')) || [];
                payLinks.push({ id: resultado.id, url: resultado.url });
                localStorage.setItem('payLink', JSON.stringify(payLinks));
                window.location.href = resultado.url;
            }

        } catch (error) {
            console.error('Error al finalizar la compra:', error);
        }
    };

    btnContent.appendChild(btnFinalizarCompra);
    bottomContainer.appendChild(btnContent);
    carritoContainer.parentNode.appendChild(bottomContainer);
}