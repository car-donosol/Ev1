import { urlBase } from "../../utils/urlBase.js";

const urlParams = new URLSearchParams(window.location.search);

if (!urlParams.has('id')) {
    window.location.href = 'index.html';
}

const id = urlParams.get('id');

const payLinks = JSON.parse(localStorage.getItem('payLink')) || [];

const linkEncontrado = payLinks.find(link => link.id === id);

const a = document.getElementById('mis-pedidos');
a.href = `${urlBase()}/cuenta/mis-pedidos.html`;

if (linkEncontrado) {
    const nuevosPayLinks = payLinks.filter(link => link.id !== id);
    localStorage.setItem('payLink', JSON.stringify(nuevosPayLinks));
    localStorage.removeItem('carrito');
}