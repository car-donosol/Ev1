import { supabase } from '../../db/supabase.js'
import { getSession } from '../../assets/js/getSession.js';
import { slugify } from '../../utils/slugify.js';

const session = await getSession(supabase);
await supabase.auth.setSession(session);

const cargando = document.getElementById('cargando');
const formProductos = document.getElementById('form-productos');

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

        if(userRol.rol != 'admin') {
            window.location.href = '/cuenta';
        }

        cargando.style.display = 'none';
        formProductos.style.display = 'block';
    } catch (error) {
        console.error('Error al obtener usuario:', error.message);
    }
}

async function addProduct() {
    const fileInput = document.getElementById("fileInput");
    const titleInput = document.getElementById("titleInput");
    const descriptionInput = document.getElementById("descriptionInput");
    const priceInput = document.getElementById("priceInput");
    const stockInput = document.getElementById("stockInput");
    const createProductBtn = document.getElementById("createProductBtn");
    const subiendoProducto = document.getElementById("subiendoProducto");

    const file = fileInput.files[0];

    if (!file) {
        alert("Selecciona una imagen primero");
        return;
    }

    subiendoProducto.style.display = 'block';
    createProductBtn.style.display = 'none';

    const formData = new FormData();
    formData.append('file', file);

    let imageUrl = '';

    try {
        const res = await fetch('https://qrv-storage.evairx.me/upload', {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            const text = await res.text();
            subiendoProducto.style.display = 'none';
            createProductBtn.style.display = 'block';
            throw new Error(`Error al subir imagen: ${text}`);
        }

        imageUrl = await res.text();
    } catch (err) {
        subiendoProducto.style.display = 'none';
        createProductBtn.style.display = 'block';
        console.error(err);
        return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
        console.error('Error obteniendo usuario:', userError);
        return;
    }

    const { data, error } = await supabase.rpc('create_product', { 
        p_user_id: user.id,
        p_name: titleInput.value,
        p_image: imageUrl,
        p_overview: descriptionInput.value,
        p_price: Number(priceInput.value),
        p_slug: slugify(titleInput.value),
        p_stock: Number(stockInput.value)
    })

    if (error) {
        console.error('Error creando producto:', error);
        subiendoProducto.style.display = 'none';
        createProductBtn.style.display = 'block';
        return;
    }

    console.log("Producto a crear:", data);
    subiendoProducto.style.display = 'none';
    createProductBtn.style.display = 'block';
            
}

user();
document.getElementById("createProductBtn").addEventListener("click", addProduct);