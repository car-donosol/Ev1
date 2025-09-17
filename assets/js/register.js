import { supabase } from '../../db/supabase.js'
import { urlBase } from "../../utils/urlBase.js";

if(localStorage.getItem('refresh-token')) {
    window.location.href = `${urlBase}/cuenta`;
}

async function register() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('pass').value;

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name || '',
                }
            }
        });

        if (error) {
            const errorhtml = document.getElementById("error");
            errorhtml.innerText = "Error al crear la cuenta.";
            errorhtml.style.display = "block";
            console.log("Error:", error);
        } else {
            localStorage.removeItem('sb-ticfnujyxksjdfkwuoyk-auth-token')
            window.location.href = `${urlBase}/login.html`;
        }
    });
}

register();