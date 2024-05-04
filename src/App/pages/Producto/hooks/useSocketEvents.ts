import { useEffect } from "react";
import { SocketOnProducto } from "../helpers";
import { useProvideSocket } from "../../../../hooks";
import { ProductoItem } from "../interfaces";
import { Pagination } from "../../../../interfaces/global";

// Tipos para las funciones de manejo de eventos
type HandleAgregar = (data: ProductoItem) => void;
type HandleEditar = (data: ProductoItem) => void;
type HandleEliminar = (data: { _id: string }) => void;

export const useSocketEvents = ({
  setProductosData,
  setPagination,
}: {
  setProductosData: React.Dispatch<React.SetStateAction<ProductoItem[]>>;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}) => {
  const handleAgregar: HandleAgregar = (data) => {
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs + 1 }));
    setProductosData((prev) => [
      { ...data, crud: { nuevo: true }, totalMunicipios: 0 },
      ...prev,
    ]);
  };
  const handleEditar: HandleEditar = (data) =>
    setProductosData((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...data, crud: { editado: true } } : item
      )
    );
  const handleEliminar: HandleEliminar = ({ _id }) =>
    setProductosData((prev) => prev.filter((item) => item._id !== _id));

  const { socket } = useProvideSocket();
  useEffect(() => {
    socket?.on(SocketOnProducto.agregar, handleAgregar);
    socket?.on(SocketOnProducto.editar, handleEditar);
    socket?.on(SocketOnProducto.eliminar, handleEliminar);

    return () => {
      socket?.off(SocketOnProducto.agregar, handleAgregar);
      socket?.off(SocketOnProducto.editar, handleEditar);
      socket?.off(SocketOnProducto.eliminar, handleEliminar);
    };
  }, [socket, setProductosData]);
};
