import { useEffect, useState } from "react";
import { DeptoItem, Tabla, useDeptoStore } from ".";
import { validateFunction } from "../../../helpers";
import { Action } from "../../../interfaces/global";
import { PaperContainerPage } from "../../components/style";
import TextField from "@mui/material/TextField";
import { AddCircle, Cancel, Refresh } from "@mui/icons-material";
import { useProvideSocket } from "../../../hooks";
import { SocketOnEvent } from "./helpers";
import { Cargando } from "../../components";

export const Depto = () => {
  const { socket } = useProvideSocket();
  const {
    agregando,
    getDataDepto,
    onAgregarDepto,
    onEditDepto,
    pagination,
    rowDefault,
    setAgregando,
    onEliminarDepto,
    cargando,
  } = useDeptoStore();

  const actions: Action[] = [
    {
      color: "primary",
      Icon: Refresh,
      name: "Actualizar",
      onClick() {
        getDataDepto(pagination, searchText);
      },
      tipo: "icono",
    },
    {
      color: agregando ? "error" : "success",
      Icon: agregando ? Cancel : AddCircle,
      name: "Agregar Departamento",
      onClick() {
        setAgregando(!agregando);
      },
      tipo: "icono",
    },
  ];
  const [searchText] = useState("");
  useEffect(() => {
    getDataDepto(pagination, searchText);
  }, []);

  const [itemEffectSocket, setItemEffectSocket] = useState<{
    item: DeptoItem;
    tipo?: string;
  }>({ item: rowDefault });
  useEffect(() => {
    const { item, tipo } = itemEffectSocket;
    if (!tipo) {
      return;
    }
    if (tipo === SocketOnEvent.agregar) {
      onAgregarDepto(item);
    }
    if (tipo === SocketOnEvent.editar) {
      onEditDepto(item);
    }
    if (tipo === SocketOnEvent.eliminar) {
      console.log(item);

      onEliminarDepto(item._id || "");
    }
  }, [itemEffectSocket]);

  useEffect(() => {
    socket?.on(SocketOnEvent.agregar, (data: DeptoItem) => {
      setItemEffectSocket({
        item: data,
        tipo: SocketOnEvent.agregar,
      });
    });

    socket?.on(SocketOnEvent.editar, (data: DeptoItem) => {
      setItemEffectSocket({
        item: data,
        tipo: SocketOnEvent.editar,
      });
    });
    socket?.on(SocketOnEvent.eliminar, (data: { _id: string }) => {
      console.log(data);

      setItemEffectSocket({
        item: { ...rowDefault, ...data },
        tipo: SocketOnEvent.eliminar,
      });
    });
  }, [socket]);
  if (cargando) {
    return <Cargando titulo="Cargando deptos" />;
  }
  return (
    <PaperContainerPage
      tabIndex={-1}
      onKeyDown={(e) => {
        if (validateFunction(e)) return;

        actions[Number(e.key) - 1].onClick(null);
      }}
    >
      <TextField label="Buscar" />
      <Tabla actions={actions} />
    </PaperContainerPage>
  );
};

export default Depto;
