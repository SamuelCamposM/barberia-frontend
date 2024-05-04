import { useState } from "react";
import { StaticCompra } from "./StaticCompra";
import { EditableCompra } from "./EditableCompra";
import { CompraItem } from "../interfaces";
import {
  StyledContainerSubTable,
  StyledTableCell,
} from "../../../components/style";
import { Collapse, TableRow } from "@mui/material";
// import { TablaMunicipio } from "./Municipio/Municipio";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Action } from "../../../../interfaces/global";
import { columns } from "../helpers";

export const RowCompra = ({
  busqueda,
  //separo busqueda por que es el unico que no pasare el editable
  compra,
}: {
  compra: CompraItem;
  busqueda?: string;
}) => {
  const [editando, setEditando] = useState(!Boolean(compra._id));
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
    },
  ];
  return (
    <>
      {editando ? (
        <EditableCompra
          actionsJoins={actionsJoins}
          compra={compra}
          setEditando={setEditando}
        />
      ) : (
        <StaticCompra
          actionsJoins={actionsJoins}
          busqueda={busqueda || ""}
          compra={compra}
          setEditando={setEditando}
        />
      )}
      <TableRow sx={{ padding: 0 }}>
        <StyledTableCell colSpan={columns.length}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <StyledContainerSubTable>
              {/* <Cargando/> */}
              {/* <TablaMunicipio compra={compra._id || ""} /> */}
            </StyledContainerSubTable>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </>
  );
};
