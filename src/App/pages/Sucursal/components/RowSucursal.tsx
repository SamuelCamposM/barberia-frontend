import { useState } from "react";
import { StaticSucursal } from "./StaticSucursal";
import { EditableSucursal } from "./EditableSucursal";
import { SucursalItem } from "../interfaces";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Action } from "../../../../interfaces/global";

export const RowSucursal = ({
  busqueda,
  sucursal,
}: {
  sucursal: SucursalItem;
  busqueda?: string;
}) => {
  const [editando, setEditando] = useState(!Boolean(sucursal._id));
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
        <EditableSucursal
          actionsJoins={actionsJoins}
          sucursal={sucursal}
          setEditando={setEditando}
        />
      ) : (
        <StaticSucursal
          actionsJoins={actionsJoins}
          busqueda={busqueda || ""}
          sucursal={sucursal}
          setEditando={setEditando}
        />
      )}
    </>
  );
};
