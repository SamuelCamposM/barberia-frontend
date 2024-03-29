import { useEffect, useState } from "react";
import { DeptoItem, Tabla, useDeptoStore } from ".";
import { validateFunction } from "../../../helpers";
import { Action } from "../../../interfaces/global";
import { PaperContainerPage } from "../../components/style";
import TextField from "@mui/material/TextField";
import { AddCircle, Cancel } from "@mui/icons-material";
import { useProvideSocket } from "../../../hooks";
import { SocketOnEvent } from "./helpers";

export const Depto = () => {
  const { socket } = useProvideSocket();
  const {
    getDataDepto,
    pagination,
    onEditDepto,
    setAgregando,
    agregando,
    onAgregarDepto,
    rowDefault,
  } = useDeptoStore();

  const actions: Action[] = [
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
      console.log("eliminado");
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
    socket?.on(SocketOnEvent.eliminar, (data: string) => {
      setItemEffectSocket({
        item: { ...rowDefault, _id: data },
        tipo: SocketOnEvent.eliminar,
      });
    });
  }, [socket]);

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
