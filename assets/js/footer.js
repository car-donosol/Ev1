import { urlBase } from "../../utils/urlBase.js";

async function cargarFooter() {
  try {
    const response = await fetch(`${urlBase()}/componentes/footer.html`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const html = await response.text();
    document.getElementById("footer").innerHTML = html;
  } catch (err) {
    console.error("No se pudo cargar el footer:", err);
  }
}
cargarFooter();
