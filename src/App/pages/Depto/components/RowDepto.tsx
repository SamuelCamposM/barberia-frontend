import { useMemo, useState } from "react";
import { StaticDepto } from "./StaticDepto";
import { EditableDepto } from "./EditableDepto";
import { DeptoItem } from "../interfaces";
import {
  StyledContainerSubTable,
  StyledTableCell,
} from "../../../components/style";
import { Collapse, TableRow } from "@mui/material";
import { TablaMunicipio } from "./Municipio/Municipio";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Action } from "../../../../interfaces/global";
import { columns } from "../helpers";

export const RowDepto = ({
  busqueda,
  //separo busqueda por que es el unico que no pasare el editable
  ...rest
}: {
  depto: DeptoItem;
  busqueda?: string;
}) => {
  const esNuevo = useMemo(() => !Boolean(rest.depto._id), []);
  const [editando, setEditando] = useState(esNuevo);
  const [open, setopen] = useState(false);
  const actionsJoins: Action[] = [
    {
      color: "secondary",
      Icon: open ? ExpandLess : ExpandMore,
      name: `Ver municipios`,
      onClick: () => {
        setopen(!open);
      },
      tipo: "icono",
      size: "small",
      ocultar: esNuevo,
    },
  ];
  return (
    <>
      {editando ? (
        <EditableDepto
          {...rest}
          esNuevo={esNuevo}
          setEditando={setEditando}
          actionsJoins={actionsJoins}
        />
      ) : (
        <StaticDepto
          setEditando={setEditando}
          {...rest}
          busqueda={busqueda || ""}
          actionsJoins={actionsJoins}
        />
      )}
      <TableRow sx={{ padding: 0 }}>
        <StyledTableCell colSpan={columns.length}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <StyledContainerSubTable>
              {/* <Cargando/> */}
              <TablaMunicipio depto={rest.depto._id || ""} />
            </StyledContainerSubTable>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </>
  );
};
