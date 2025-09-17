async function cargarMenu() {
  try {
    let menuPath;

    if (location.hostname === "127.0.0.1" || location.hostname === "localhost") {
      // Localhost: ruta fija
      menuPath = "http://127.0.0.1:5500/componentes/menu.html";
    } else {
      // Producción (GitHub Pages)
      const repoBase = "/" + window.location.pathname.split("/")[1];
      menuPath = `${repoBase}/componentes/menu.html`;
    }

    const response = await fetch(menuPath, { cache: "no-store" });
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const html = await response.text();
    document.getElementById("header").innerHTML = html;
    console.log("Menú cargado desde:", menuPath);
  } catch (error) {
    console.error("No se pudo cargar el menú:", error);
  }
}

cargarMenu();
