import { useEffect } from "react";
import { SocketOnCategoria } from "../helpers";
import { useProvideSocket } from "../../../../hooks";
import { CategoriaItem } from "../interfaces";
import { Pagination } from "../../../../interfaces/global";

// Tipos para las funciones de manejo de eventos
type HandleAgregar = (data: CategoriaItem) => void;
type HandleEditar = (data: CategoriaItem) => void;
type HandleEliminar = (data: { _id: string }) => void;

export const useSocketEvents = ({
  setCategoriasData,
  setPagination,
}: {
  setCategoriasData: React.Dispatch<React.SetStateAction<CategoriaItem[]>>;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}) => {
  const handleAgregar: HandleAgregar = (data) => {
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs + 1 }));
    setCategoriasData((prev) => [{ ...data, crud: { nuevo: true } }, ...prev]);
  };
  const handleEditar: HandleEditar = (data) =>
    setCategoriasData((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...data, crud: { editado: true } } : item
      )
    );
  const handleEliminar: HandleEliminar = ({ _id }) =>
    setCategoriasData((prev) => prev.filter((item) => item._id !== _id));
  const { socket } = useProvideSocket();
  useEffect(() => {
    socket?.on(SocketOnCategoria.agregar, handleAgregar);
    socket?.on(SocketOnCategoria.editar, handleEditar);
    socket?.on(SocketOnCategoria.eliminar, handleEliminar);

    return () => {
      socket?.off(SocketOnCategoria.agregar, handleAgregar);
      socket?.off(SocketOnCategoria.editar, handleEditar);
      socket?.off(SocketOnCategoria.eliminar, handleEliminar);
    };
  }, [socket, setCategoriasData]);
};
