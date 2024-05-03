import { useEffect } from "react";
import { SocketOnProveedor } from "../helpers";
import { useProvideSocket } from "../../../../hooks";
import { ProveedorItem } from "../interfaces";
import { Pagination } from "../../../../interfaces/global";

// Tipos para las funciones de manejo de eventos
type HandleAgregar = (data: ProveedorItem) => void;
type HandleEditar = (data: ProveedorItem) => void;
type HandleEliminar = (data: { _id: string }) => void;

export const useSocketEvents = ({
  setProveedorsData,
  setPagination,
}: {
  setProveedorsData: React.Dispatch<React.SetStateAction<ProveedorItem[]>>;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}) => {
  const handleAgregar: HandleAgregar = (data) => {
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs + 1 }));
    setProveedorsData((prev) => [{ ...data, crud: { nuevo: true } }, ...prev]);
  };
  const handleEditar: HandleEditar = (data) =>
    setProveedorsData((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...data, crud: { editado: true } } : item
      )
    );
  const handleEliminar: HandleEliminar = ({ _id }) =>
    setProveedorsData((prev) => prev.filter((item) => item._id !== _id));
  const { socket } = useProvideSocket();
  useEffect(() => {
    socket?.on(SocketOnProveedor.agregar, handleAgregar);
    socket?.on(SocketOnProveedor.editar, handleEditar);
    socket?.on(SocketOnProveedor.eliminar, handleEliminar);

    return () => {
      socket?.off(SocketOnProveedor.agregar, handleAgregar);
      socket?.off(SocketOnProveedor.editar, handleEditar);
      socket?.off(SocketOnProveedor.eliminar, handleEliminar);
    };
  }, [socket, setProveedorsData]);
};
