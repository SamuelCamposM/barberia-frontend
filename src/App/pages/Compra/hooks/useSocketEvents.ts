import { useEffect } from "react";
import { SocketOnCompra } from "../helpers";
import { useProvideSocket } from "../../../../hooks";
import { CompraItem } from "../interfaces";
import { Pagination } from "../../../../interfaces/global";

// Tipos para las funciones de manejo de eventos
type HandleAgregar = (data: CompraItem) => void;
type HandleEditar = (data: CompraItem) => void;
type HandleEliminar = (data: { _id: string }) => void;
type HandleMunicipioChange = (data: {
  _id: string;
  dataCompraRes: {
    gastoTotal: number;
    totalProductos: number;
  };
}) => void;

export const useSocketEvents = ({
  setComprasData,
  setPagination,
}: {
  setComprasData: React.Dispatch<React.SetStateAction<CompraItem[]>>;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}) => {
  const handleAgregar: HandleAgregar = (data) => {
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs + 1 }));
    setComprasData((prev) => [{ ...data, crud: { nuevo: true } }, ...prev]);
  };
  const handleEditar: HandleEditar = (data) =>
    setComprasData((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...data, crud: { editado: true } } : item
      )
    );
  const handleEliminar: HandleEliminar = ({ _id }) =>
    setComprasData((prev) => prev.filter((item) => item._id !== _id));
  const handleChangeDetCompra: HandleMunicipioChange = ({
    _id,
    dataCompraRes,
  }) => {
    setComprasData((prev) =>
      prev.map((item) =>
        item._id === _id
          ? {
              ...item,
              crud: { editado: true },
              ...dataCompraRes,
            }
          : item
      )
    );
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs - 1 }));
  };
  const { socket } = useProvideSocket();
  useEffect(() => {
    socket?.on(SocketOnCompra.agregar, handleAgregar);
    socket?.on(SocketOnCompra.editar, handleEditar);
    socket?.on(SocketOnCompra.eliminar, handleEliminar);
    socket?.on(SocketOnCompra.detCompraListener, handleChangeDetCompra);

    return () => {
      socket?.off(SocketOnCompra.agregar, handleAgregar);
      socket?.off(SocketOnCompra.editar, handleEditar);
      socket?.off(SocketOnCompra.eliminar, handleEliminar);
      socket?.off(SocketOnCompra.detCompraListener, handleChangeDetCompra);
    };
  }, [socket, setComprasData]);
};
