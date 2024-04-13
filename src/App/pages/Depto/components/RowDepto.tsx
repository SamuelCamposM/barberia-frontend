import { useMemo, useState } from "react";
import { StaticDepto } from "./StaticDepto";
import { EditableDepto } from "./EditableDepto";
import { DeptoItem } from "../interfaces";
import {
  StyledContainerSubTable,
  StyledTableCell,
  StyledTableRow,
} from "../../../components/style";
import { Collapse } from "@mui/material";
import { TablaMunicipio } from "./Municipio/Municipio";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Action } from "../../../../interfaces/global";

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
      <StyledTableRow>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <StyledContainerSubTable>
              {/* <Cargando/> */}
              <TablaMunicipio depto={rest.depto._id || ""} />
            </StyledContainerSubTable>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};
