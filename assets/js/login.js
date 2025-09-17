import { supabase } from '../../db/supabase.js'
import { urlBase } from "../../utils/urlBase.js";

if(localStorage.getItem('refresh-token')) {
    console.log(`${urlBase}/cuenta`);
  
}

async function login() {
    const form = document.getElementById('loginForm');
    const btnLogin = document.getElementById('btnLogin');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        btnLogin.disabled = true;
        btnLogin.classList.add("disabled");
        btnLogin.textContent = "";

        const btnLoading = document.createElement('div');
        btnLoading.classList.add("btnLoading");

        btnLogin.appendChild(btnLoading);

        const email = document.getElementById('email').value;
        const password = document.getElementById('pass').value;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            const error = document.getElementById("error");
            error.innerText = "Correo electrónico o contraseña incorrectos.";
            error.style.display = "block";
            btnLogin.disabled = false;
            btnLogin.classList.remove("disabled");
            btnLoading.remove();
            btnLogin.textContent = "Iniciar Sesión";
        } else {
            const caducidad = Date.now() + 60 * 60 * 1000;
            localStorage.removeItem('sb-ticfnujyxksjdfkwuoyk-auth-token')
            localStorage.setItem('access-token', JSON.stringify({ token: data.session?.access_token, expiresAt: caducidad }));
            localStorage.setItem('refresh-token', data.session?.refresh_token);
            window.location.href = `${urlBase}/cuenta`;
        }
    });
}

login();