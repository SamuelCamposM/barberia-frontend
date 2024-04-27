import { useEffect } from "react";
import { SocketOnMarca } from "../helpers";
import { useProvideSocket } from "../../../../hooks";
import { MarcaItem } from "../interfaces";
import { Pagination } from "../../../../interfaces/global";

// Tipos para las funciones de manejo de eventos
type HandleAgregar = (data: MarcaItem) => void;
type HandleEditar = (data: MarcaItem) => void;
type HandleEliminar = (data: { _id: string }) => void;

export const useSocketEvents = ({
  setMarcasData,
  setPagination,
}: {
  setMarcasData: React.Dispatch<React.SetStateAction<MarcaItem[]>>;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}) => {
  const handleAgregar: HandleAgregar = (data) => {
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs + 1 }));
    setMarcasData((prev) => [{ ...data, crud: { nuevo: true } }, ...prev]);
  };
  const handleEditar: HandleEditar = (data) =>
    setMarcasData((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...data, crud: { editado: true } } : item
      )
    );
  const handleEliminar: HandleEliminar = ({ _id }) =>
    setMarcasData((prev) => prev.filter((item) => item._id !== _id));
  const { socket } = useProvideSocket();
  useEffect(() => {
    socket?.on(SocketOnMarca.agregar, handleAgregar);
    socket?.on(SocketOnMarca.editar, handleEditar);
    socket?.on(SocketOnMarca.eliminar, handleEliminar);

    return () => {
      socket?.off(SocketOnMarca.agregar, handleAgregar);
      socket?.off(SocketOnMarca.editar, handleEditar);
      socket?.off(SocketOnMarca.eliminar, handleEliminar);
    };
  }, [socket, setMarcasData]);
};
