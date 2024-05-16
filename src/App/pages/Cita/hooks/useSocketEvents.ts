import { useEffect } from "react";
import { SocketOnCita } from "../helpers";
import { useProvideSocket } from "../../../../hooks";
import { CitaItem } from "../interfaces";
import { Pagination } from "../../../../interfaces/global";

// Tipos para las funciones de manejo de eventos
type HandleAgregar = (data: CitaItem) => void;
type HandleEditar = (data: CitaItem) => void;
type HandleEliminar = (data: { _id: string }) => void;

export const useSocketEvents = ({
  setCitasData,
  setPagination,
}: {
  setCitasData: React.Dispatch<React.SetStateAction<CitaItem[]>>;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}) => {
  const handleAgregar: HandleAgregar = (data) => {
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs + 1 }));
    setCitasData((prev) => [{ ...data, crud: { nuevo: true } }, ...prev]);
  };
  const handleEditar: HandleEditar = (data) =>
    setCitasData((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...data, crud: { editado: true } } : item
      )
    );
  const handleEliminar: HandleEliminar = ({ _id }) =>
    setCitasData((prev) => prev.filter((item) => item._id !== _id));

  const { socket } = useProvideSocket();
  useEffect(() => {
    socket?.on(SocketOnCita.agregar, handleAgregar);
    socket?.on(SocketOnCita.editar, handleEditar);
    socket?.on(SocketOnCita.eliminar, handleEliminar);

    return () => {
      //DEJAR DE ESCUCHAR
      socket?.off(SocketOnCita.agregar, handleAgregar);
      socket?.off(SocketOnCita.editar, handleEditar);
      socket?.off(SocketOnCita.eliminar, handleEliminar);
    };
  }, [socket, setCitasData]);
};
