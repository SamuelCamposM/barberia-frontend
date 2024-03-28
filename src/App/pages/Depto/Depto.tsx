import { useEffect } from "react";
import { Tabla, useDeptoStore } from ".";
import { validateFunction } from "../../../helpers";
import { Action } from "../../../interfaces/global";
import { PaperContainerPage } from "../../components/style";
import TextField from "@mui/material/TextField";

export const Depto = () => {
  const actions: Action[] = [];
  const { getDataDepto } = useDeptoStore();

  useEffect(() => {
    getDataDepto();
  }, []);

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
