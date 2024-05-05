import { Dispatch, useEffect } from "react";
import { SocketOnDetCompra } from "../helpers"; // Asegúrate de importar el enum correcto

import { DetCompraItem } from "../interfaces"; // Asegúrate de importar la interfaz correcta
import { Pagination } from "../../../../../../interfaces/global";
import { useProvideSocket } from "../../../../../../hooks";

// Tipos para las funciones de manejo de eventos
type HandleAgregar = (data: DetCompraItem) => void;
type HandleEditar = (data: DetCompraItem) => void;
type HandleEliminar = (data: { _id: string }) => void;

export const useDetCompraSocketEvents = ({
  setDetComprasData,
  setPagination,
  compra,
}: {
  setDetComprasData: React.Dispatch<React.SetStateAction<DetCompraItem[]>>;
  setPagination: Dispatch<React.SetStateAction<Pagination>>;
  compra: string;
}) => {
  const handleAgregar: HandleAgregar = (data) => {
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs + 1 }));
    setDetComprasData((prev) => [{ ...data, crud: { nuevo: true } }, ...prev]);
  };
  const handleEditar: HandleEditar = (data) =>
    setDetComprasData((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...data, crud: { editado: true } } : item
      )
    );
  const handleEliminar: HandleEliminar = ({ _id }) => {
    setDetComprasData((prev) => prev.filter((item) => item._id !== _id));
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs - 1 }));
  };

  const { socket } = useProvideSocket();
  useEffect(() => {
    socket?.on(`${SocketOnDetCompra.agregar}.${compra}`, handleAgregar);
    socket?.on(`${SocketOnDetCompra.editar}.${compra}`, handleEditar);
    socket?.on(`${SocketOnDetCompra.eliminar}.${compra}`, handleEliminar);

    return () => {
      socket?.off(`${SocketOnDetCompra.agregar}.${compra}`, handleAgregar);
      socket?.off(`${SocketOnDetCompra.editar}.${compra}`, handleEditar);
      socket?.off(`${SocketOnDetCompra.eliminar}.${compra}`, handleEliminar);
    };
  }, [socket, setDetComprasData, compra]);
};
