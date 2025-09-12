import { supabase } from '../../db/supabase.js'

if(localStorage.getItem('refresh-token')) {
    window.location.href = '/cuenta';
}

async function login() {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('pass').value;

        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            const error = document.getElementById("error");
            error.innerText = "Correo electrónico o contraseña incorrectos.";
            error.style.display = "block";
        } else {
            const caducidad = Date.now() + 60 * 60 * 1000;
            localStorage.removeItem('sb-ticfnujyxksjdfkwuoyk-auth-token')
            localStorage.setItem('access-token', JSON.stringify({ token: data.session?.access_token, expiresAt: caducidad }));
            localStorage.setItem('refresh-token', data.session?.refresh_token);
            window.location.href = '/cuenta';
        }
    });
}

login();