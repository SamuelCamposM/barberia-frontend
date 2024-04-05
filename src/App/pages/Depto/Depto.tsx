import { useEffect, useState } from "react";
import { DeptoItem, Tabla, useDeptoStore } from ".";
import { validateFunction } from "../../../helpers";
import { Action } from "../../../interfaces/global";
import { PaperContainerPage } from "../../components/style";
import TextField from "@mui/material/TextField";
import { AddCircle, Cancel, Refresh } from "@mui/icons-material";
import { useProvideSocket } from "../../../hooks";
import { SocketOnDepto } from "./helpers";
import { Box } from "@mui/material";

export const Depto = () => {
  const { socket } = useProvideSocket();
  const {
    agregando,
    getDataDepto,
    onAgregarDepto,
    onEditDepto,
    pagination,
    setAgregando,
    onEliminarDepto,
    cargando,
    sort,
  } = useDeptoStore();

  const actions: Action[] = [
    {
      color: "primary",
      Icon: Refresh,
      name: "Actualizar",
      onClick() {
        getDataDepto({ pagination, sort, busqueda: searchText });
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
    if (cargando) {
      getDataDepto({ pagination, sort, busqueda: "" });
    }
  }, []);

  useEffect(() => {
    socket?.on(SocketOnDepto.agregar, (data: DeptoItem) => {
      onAgregarDepto(data);
    });

    socket?.on(SocketOnDepto.editar, (data: DeptoItem) => {
      onEditDepto(data);
    });
    socket?.on(SocketOnDepto.eliminar, (data: { _id: string }) => {
      onEliminarDepto(data._id);
    });

    return () => {
      socket?.off(SocketOnDepto.agregar);
      socket?.off(SocketOnDepto.editar);
      socket?.off(SocketOnDepto.eliminar);
    };
  }, [socket]);

  return (
    <PaperContainerPage
      tabIndex={-1}
      onKeyDown={(e) => {
        if (validateFunction(e)) return;

        actions[Number(e.key) - 1].onClick(null);
      }}
    >
      <Box component={"form"}>
        <TextField
          label="Buscar"
          autoFocus
          variant="outlined"
          fullWidth
          size="small"
        />
      </Box>
      <Tabla actions={actions} />
    </PaperContainerPage>
  );
};

export default Depto;
