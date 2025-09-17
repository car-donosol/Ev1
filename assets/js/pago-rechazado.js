const urlParams = new URLSearchParams(window.location.search);

if (!urlParams.has('id')) {
    window.location.href = 'index.html';
}

const id = urlParams.get('id');

const payLinks = JSON.parse(localStorage.getItem('payLink')) || [];

const linkEncontrado = payLinks.find(link => link.id === id);

if (linkEncontrado) {
    const nuevosPayLinks = payLinks.filter(link => link.id !== id);
    localStorage.setItem('payLink', JSON.stringify(nuevosPayLinks));
}