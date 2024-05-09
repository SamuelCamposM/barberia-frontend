import { useMemo, useState } from "react";
import { StaticCompra } from "./StaticCompra";
import { EditableCompra } from "./EditableCompra";
import { CompraItem } from "../interfaces";
import {
  StyledContainerSubTable,
  StyledTableCell,
} from "../../../components/style";
import { Collapse, TableRow } from "@mui/material";
// import { TablaMunicipio } from "./Municipio/Municipio";
import { ExpandLess, ExpandMore, PictureAsPdf } from "@mui/icons-material";
import { Action } from "../../../../interfaces/global";
import { columns } from "../helpers";
import { DetCompra } from "./DetCompra/DetCompra";
import { CompraProvider } from "./context/CompraProvider";

export const RowCompra = ({
  busqueda,
  //separo busqueda por que es el unico que no pasare el editable
  compra,
}: {
  compra: CompraItem;
  busqueda?: string;
}) => {
  const [editando, setEditando] = useState(!Boolean(compra._id));
  const finalizada = useMemo(
    () => compra.estado === "FINALIZADA",
    [compra.estado]
  );
  const [open, setopen] = useState(false);
  const actionsJoins: Action[] = [
    {
      color: "secondary",
      Icon: open ? ExpandLess : ExpandMore,
      name: `Ver detCompras`,
      onClick: () => {
        setopen(!open);
      },
      tipo: "icono",
      size: "small",
    },
    {
      color: "error",
      Icon: PictureAsPdf,
      name: `REPORTE PDF`,
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
          finalizada={finalizada}
          setEditando={setEditando}
        />
      )}
      <TableRow sx={{ padding: 0 }}>
        <StyledTableCell colSpan={columns.length}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <StyledContainerSubTable>
              <CompraProvider compra={compra}>
                <DetCompra />
              </CompraProvider>
            </StyledContainerSubTable>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </>
  );
};
