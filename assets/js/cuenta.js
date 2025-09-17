import { supabase } from '../../db/supabase.js';
import { getSession } from '../../assets/js/getSession.js';
import { urlBase } from "../../utils/urlBase.js";

const session = await getSession(supabase);
await supabase.auth.setSession(session);

const infoContent = document.getElementById('info-content');
const cargando = document.getElementById('cargando');

async function user() {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data: userData, error } = await supabase.from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;

        const { data: userRol, error: errorRol } = await supabase.from('roles')
            .select('rol')
            .eq('id', userData.rol_id)
            .single();

        if (userRol.rol === 'admin') {
            const sidemenuUl = document.getElementById('sidemenu-ul');
            const adminLink = document.createElement('a');
            adminLink.href = `${urlBase()}/admin`;
            adminLink.innerHTML = '<li class="sidemenu-li">Panel de control</li>';
            sidemenuUl.insertBefore(adminLink, sidemenuUl.firstChild);
        }

        cargando.style.display = 'none';
        infoContent.style.display = 'block';

        document.getElementById('name').textContent = userData.name;
        document.getElementById('email').textContent = user.email;


    } catch (error) {
        console.error('Error al obtener usuario:', error.message);
    }
}

async function getAddress() {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: addresses, error } = await supabase.from('address_user')
        .select('*')
        .eq('user_id', user.id);

    const listaDirecciones = document.getElementById('lista-direcciones');

    listaDirecciones.innerHTML = '';

    for (let addr of addresses) {
        const div = document.createElement('div');
        div.classList.add('delivery-info');

        const h4 = document.createElement('h4');
        h4.textContent = addr.name;

        const p = document.createElement('p');
        p.textContent = addr.address;

        const b = document.createElement('button');
        b.textContent = 'Eliminar';

        b.onclick = async () => {
            const { error: errorRemove } = await supabase.from('address_user').delete().eq('id', addr.id);

            if (errorRemove) {
                console.error('Error al eliminar dirección:', errorRemove);
            } else {
                div.remove();
            }
        };

        div.appendChild(h4);
        div.appendChild(p);
        div.appendChild(b);

        listaDirecciones.appendChild(div);
    }
}

async function AgregarDireccion() {
    const name = prompt('Ingrese un nombre para la dirección (ej. Casa, Trabajo):');
    const address = prompt('Ingrese la dirección completa:');

    if (name && address) {
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from('address_user').insert([
            { user_id: user.id, name, address }
        ]);

        if (error) {
            console.error('Error al agregar dirección:', error);
        } else {
            getAddress()
        }
    }
}

async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
        window.location.href = `${urlBase()}/login.html`;

    } catch (error) {
        console.error('Error al cerrar sesión:', error.message);
    }
}

user();
getAddress();

document.getElementById('logoutButton').addEventListener('click', logout);
document.getElementById('AgregarDireccion').addEventListener('click', AgregarDireccion);