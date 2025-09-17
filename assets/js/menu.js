import { urlBase } from "../../utils/urlBase.js";

async function cargarMenu() {
  try {
    const response = await fetch(`${urlBase()}/componentes/menu.html`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const html = await response.text();
    document.getElementById("header").innerHTML = html;
  } catch (err) {
    console.error("No se pudo cargar el menú:", err);
  }
}
cargarMenu();
