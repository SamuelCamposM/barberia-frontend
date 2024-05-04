import { Dispatch, useEffect } from "react";
import { SocketOnMunicipio } from "../helpers"; // Asegúrate de importar el enum correcto

import { MunicipioItem } from "../interfaces"; // Asegúrate de importar la interfaz correcta
import { Pagination } from "../../../../../../interfaces/global";
import { useProvideSocket } from "../../../../../../hooks";

// Tipos para las funciones de manejo de eventos
type HandleAgregar = (data: MunicipioItem) => void;
type HandleEditar = (data: MunicipioItem) => void;
type HandleEliminar = (data: { _id: string }) => void;

export const useMunicipioSocketEvents = ({
  setMunicipiosData,
  setPagination,
  compra,
}: {
  setMunicipiosData: React.Dispatch<React.SetStateAction<MunicipioItem[]>>;
  setPagination: Dispatch<React.SetStateAction<Pagination>>;
  compra: string;
}) => {
  const handleAgregar: HandleAgregar = (data) => {
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs + 1 }));
    setMunicipiosData((prev) => [{ ...data, crud: { nuevo: true } }, ...prev]);
  };
  const handleEditar: HandleEditar = (data) =>
    setMunicipiosData((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...data, crud: { editado: true } } : item
      )
    );
  const handleEliminar: HandleEliminar = ({ _id }) => {
    setMunicipiosData((prev) => prev.filter((item) => item._id !== _id));
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs - 1 }));
  };

  const { socket } = useProvideSocket();
  useEffect(() => {
    socket?.on(`${SocketOnMunicipio.agregar}.${compra}`, handleAgregar);
    socket?.on(`${SocketOnMunicipio.editar}.${compra}`, handleEditar);
    socket?.on(`${SocketOnMunicipio.eliminar}.${compra}`, handleEliminar);

    return () => {
      socket?.off(`${SocketOnMunicipio.agregar}.${compra}`, handleAgregar);
      socket?.off(`${SocketOnMunicipio.editar}.${compra}`, handleEditar);
      socket?.off(`${SocketOnMunicipio.eliminar}.${compra}`, handleEliminar);
    };
  }, [socket, setMunicipiosData, compra]);
};
