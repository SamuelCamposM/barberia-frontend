import { useCallback, useRef } from "react";

// Hook personalizado para manejar el retardo
export const useDebouncedCallback = <A extends any[]>(
  callback: (...args: A) => void
) => {
  // Crear una referencia mutable que permita acceder al último callback.
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  // Crear una referencia mutable que permita acceder al último temporizador.
  const timerId = useRef<number | null>(null);

  return useCallback(
    (...args: A) => {
      // Si existe un temporizador activo, lo cancelamos
      if (timerId.current) {
        clearTimeout(timerId.current);
      }

      // Creamos un nuevo temporizador
      timerId.current = setTimeout(() => {
        // Ejecutamos el callback con los últimos argumentos recibidos
        callbackRef.current(...args);
      }, 500);
    },
    [500]
  ); // Recrear el callback si el retardo cambia
};
