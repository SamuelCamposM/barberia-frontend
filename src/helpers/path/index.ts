export const convertirPath = (nombre: string) => {
  // Primero, quitamos las tildes
  nombre = nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Luego, reemplazamos los espacios por guiones bajos y convertimos a minúsculas
  nombre = nombre.replace(/\s/g, "_").toLowerCase();

  // Finalmente, quitamos los caracteres especiales
  nombre = nombre.replace(/[^a-z0-9_]/g, "");

  return nombre;
};
export const getSubPath = () => {
  const parts = location.pathname.split("/");
  let params = new URLSearchParams(window.location.search);
  parts.pop(); // Elimina el último elemento del array
  return `${parts.join("/")}?${params.toString()}`; // Une los elementos del array en una cadena
};
