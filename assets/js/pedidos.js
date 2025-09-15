import { supabase } from '../../db/supabase.js';
import { getSession } from '../../assets/js/getSession.js';

const session = await getSession(supabase);
await supabase.auth.setSession(session);

const cargando = document.getElementById('cargando');

async function conseguirPedidos() {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: orders, error } = await supabase.from('orders_user')
        .select('*')
        .eq('user_id', user.id);

    const pedidosDiv = document.getElementById('pedidos');

    if (orders.length === 0) {
        pedidosDiv.innerHTML = '<p>No tienes pedidos aún.</p>';
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

        orderDiv.innerHTML = `
                    <h3>Pedido #${order.orderId}</h3>
                    <p>Fecha: ${formattedDate}</p>
                    <p>Total: $${order.total_price}</p>
                    <p>Estado: ${order.status}</p>
                    <hr>
                `;

        pedidosDiv.appendChild(orderDiv);
    }

    cargando.style.display = 'none';
    pedidosDiv.style.display = 'block';
}

conseguirPedidos()