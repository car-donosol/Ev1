export function urlBase() {
  if (location.hostname === "127.0.0.1" || location.hostname === "localhost") {
    return "";
  }

  return "/" + window.location.pathname.split("/")[1];
}
