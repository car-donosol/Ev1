const urlParams = new URLSearchParams(window.location.search);

if (!urlParams.has('id')) {
    window.location.href = 'index.html';
}

const id = urlParams.get('id');

if (!id) {
    window.location.href = 'index.html';
}

const payLinks = JSON.parse(localStorage.getItem('payLink')) || [];

const linkEncontrado = payLinks.find(link => link.id === id);

if (linkEncontrado) {
    console.log('PayLink encontrado:', linkEncontrado);
    document.getElementById('mensaje').innerHTML = `Tu pago está pendiente. Por favor,  completa el pago haciendo <a href="${linkEncontrado.url}" class="pago-enlace"> clic aquí</a>.`;
} else {
    window.location.href = 'index.html';
}