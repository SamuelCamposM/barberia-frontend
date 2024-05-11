import { useEffect } from "react";
import { SocketOnVenta } from "../helpers";
import { useProvideSocket } from "../../../../hooks";
import { VentaItem } from "../interfaces";
import { Pagination } from "../../../../interfaces/global";

// Tipos para las funciones de manejo de eventos
type HandleAgregar = (data: VentaItem) => void;
type HandleEditar = (data: VentaItem) => void;
type HandleEliminar = (data: { _id: string }) => void;
type HandleMunicipioChange = (data: {
  _id: string;
  dataVentaRes: {
    gastoTotal: number;
    totalProductos: number;
  };
}) => void;

export const useSocketEvents = ({
  setVentasData,
  setPagination,
}: {
  setVentasData: React.Dispatch<React.SetStateAction<VentaItem[]>>;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}) => {
  const handleAgregar: HandleAgregar = (data) => {
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs + 1 }));
    setVentasData((prev) => [{ ...data, crud: { nuevo: true } }, ...prev]);
  };
  const handleEditar: HandleEditar = (data) =>
    setVentasData((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...data, crud: { editado: true } } : item
      )
    );
  const handleEliminar: HandleEliminar = ({ _id }) =>
    setVentasData((prev) => prev.filter((item) => item._id !== _id));
  const handleChangeDetVenta: HandleMunicipioChange = ({
    _id,
    dataVentaRes,
  }) => {
    setVentasData((prev) =>
      prev.map((item) =>
        item._id === _id
          ? {
              ...item,
              crud: { editado: true },
              ...dataVentaRes,
            }
          : item
      )
    );
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs - 1 }));
  };
  const { socket } = useProvideSocket();
  useEffect(() => {
    socket?.on(SocketOnVenta.agregar, handleAgregar);
    socket?.on(SocketOnVenta.editar, handleEditar);
    socket?.on(SocketOnVenta.eliminar, handleEliminar);
    socket?.on(SocketOnVenta.detVentaListener, handleChangeDetVenta);

    return () => {
      socket?.off(SocketOnVenta.agregar, handleAgregar);
      socket?.off(SocketOnVenta.editar, handleEditar);
      socket?.off(SocketOnVenta.eliminar, handleEliminar);
      socket?.off(SocketOnVenta.detVentaListener, handleChangeDetVenta);
    };
  }, [socket, setVentasData]);
};
