import { useEffect } from "react";
import { SocketOnSucursal } from "../helpers";
import { useProvideSocket } from "../../../../hooks";
import { SucursalItem } from "../interfaces";
import { Pagination } from "../../../../interfaces/global";

// Tipos para las funciones de manejo de eventos
type HandleAgregar = (data: SucursalItem) => void;
type HandleEditar = (data: SucursalItem) => void;
type HandleEliminar = (data: { _id: string }) => void;

export const useSocketEvents = ({
  setSucursalsData,
  setPagination,
}: {
  setSucursalsData: React.Dispatch<React.SetStateAction<SucursalItem[]>>;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}) => {
  const handleAgregar: HandleAgregar = (data) => {
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs + 1 }));
    setSucursalsData((prev) => [{ ...data, crud: { nuevo: true } }, ...prev]);
  };
  const handleEditar: HandleEditar = (data) =>
    setSucursalsData((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...data, crud: { editado: true } } : item
      )
    );
  const handleEliminar: HandleEliminar = ({ _id }) =>
    setSucursalsData((prev) => prev.filter((item) => item._id !== _id));

  const { socket } = useProvideSocket();
  useEffect(() => {
    socket?.on(SocketOnSucursal.agregar, handleAgregar);
    socket?.on(SocketOnSucursal.editar, handleEditar);
    socket?.on(SocketOnSucursal.eliminar, handleEliminar);

    return () => {
      socket?.off(SocketOnSucursal.agregar, handleAgregar);
      socket?.off(SocketOnSucursal.editar, handleEditar);
      socket?.off(SocketOnSucursal.eliminar, handleEliminar);
    };
  }, [socket, setSucursalsData]);
};
