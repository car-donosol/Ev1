import { supabase } from '../../db/supabase.js';
import { getSession } from '../../assets/js/getSession.js';

const session = await getSession(supabase);
await supabase.auth.setSession(session);

const cargando = document.getElementById('cargando');

function formatearMoneda(numero) {
    return new Intl.NumberFormat('es-CL').format(numero);
}

async function conseguirPedidos() {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: orders, error } = await supabase.from('orders_user')
        .select('*')
        .eq('user_id', user.id);

    const pedidosDiv = document.getElementById('pedidos');

    if (orders.length === 0) {
        cargando.style.display = 'none';
        pedidosDiv.innerHTML = '<div class="container-empty"><p>No tienes pedidos aún.</p></div>';
        pedidosDiv.style.display = 'block';
        return;
    }

    for (let order of orders) {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order');

        const date = new Date(order.created_at);
        const formattedDate = date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const statusMap = {
            unpaid: "Sin Pagar",
            paid: "Pagado",
            rejected: "Pago Rechazado"
        };

        const statusTexto = statusMap[order.status] || order.status;

        orderDiv.innerHTML = `
                    <h3>Pedido #${order.order_id}</h3>
                    <p>Fecha: ${formattedDate}</p>
                    <p>Total: $${formatearMoneda(order.total_price)}</p>
                    <p>Estado: ${statusTexto}</p>
                `;

        pedidosDiv.appendChild(orderDiv);
    }

    cargando.style.display = 'none';
    pedidosDiv.style.display = 'block';
}

conseguirPedidos()