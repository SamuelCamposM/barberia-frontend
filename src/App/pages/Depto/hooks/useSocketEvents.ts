import { useEffect } from "react";
import { SocketOnDepto } from "../helpers";
import { useProvideSocket } from "../../../../hooks";
import { DeptoItem } from "../interfaces";
import { Pagination } from "../../../../interfaces/global";

// Tipos para las funciones de manejo de eventos
type HandleAgregar = (data: DeptoItem) => void;
type HandleEditar = (data: DeptoItem) => void;
type HandleEliminar = (data: { _id: string }) => void;
type HandleMunicipioChange = (data: {
  _id: string;
  tipo: "remove" | "add";
}) => void;

const useSocketEvents = (
  updateDeptoData: React.Dispatch<React.SetStateAction<DeptoItem[]>>,
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>
) => {
  const handleAgregar: HandleAgregar = (data) => {
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs + 1 }));
    updateDeptoData((prev) => [{ ...data, crud: { nuevo: true } }, ...prev]);
  };
  const handleEditar: HandleEditar = (data) =>
    updateDeptoData((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...data, crud: { editado: true } } : item
      )
    );
  const handleEliminar: HandleEliminar = ({ _id }) =>
    updateDeptoData((prev) => prev.filter((item) => item._id !== _id));
  const handleMunicipioChange: HandleMunicipioChange = ({ _id, tipo }) => {
    updateDeptoData((prev) =>
      prev.map((item) =>
        item._id === _id
          ? {
              ...item,
              crud: { editado: true },
              totalMunicipios:
                tipo === "remove"
                  ? (item.totalMunicipios || 0) - 1
                  : (item.totalMunicipios || 0) + 1,
            }
          : item
      )
    );
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs - 1 }));
  };
  const { socket } = useProvideSocket();
  useEffect(() => {
    socket?.on(SocketOnDepto.agregar, handleAgregar);
    socket?.on(SocketOnDepto.editar, handleEditar);
    socket?.on(SocketOnDepto.eliminar, handleEliminar);
    socket?.on(SocketOnDepto.municipioListener, handleMunicipioChange);

    return () => {
      socket?.off(SocketOnDepto.agregar, handleAgregar);
      socket?.off(SocketOnDepto.editar, handleEditar);
      socket?.off(SocketOnDepto.eliminar, handleEliminar);
      socket?.off(SocketOnDepto.municipioListener, handleMunicipioChange);
    };
  }, [socket, updateDeptoData]);
};

export default useSocketEvents;
