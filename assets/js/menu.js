async function cargarMenu() {
  try {
    // Detecta el nombre del repo en GitHub Pages (ej: "/miweb")
    const repoBase = "/" + window.location.pathname.split("/")[1];

    // Normaliza la ruta: si termina en index.html → lo convierte en /
    let currentPath = window.location.pathname;
    if (currentPath.endsWith("index.html")) {
      currentPath = currentPath.replace("index.html", "");
    }

    let menuPath;

    // Si estamos en la raíz del repo → cargar directo
    if (currentPath === `${repoBase}/`) {
      menuPath = `${repoBase}/componentes/menu.html`;
    } else {
      // Si estamos en una subcarpeta o archivo dentro del repo → usar ../
      menuPath = `../componentes/menu.html`;
    }

    const response = await fetch(menuPath);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.text();
    document.getElementById("header").innerHTML = data;
  } catch (error) {
    console.error("No se pudo cargar el menú:", error);
  }
}

cargarMenu();