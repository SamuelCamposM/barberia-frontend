import { useState } from "react";
import { StaticSucursal } from "./StaticSucursal";
import { EditableSucursal } from "./EditableSucursal";
import { SucursalItem } from "../interfaces";

export const RowSucursal = ({
  busqueda,
  sucursal,
}: {
  sucursal: SucursalItem;
  busqueda?: string;
}) => {
  const [editando, setEditando] = useState(!Boolean(sucursal._id));
  return (
    <>
      {editando ? (
        <EditableSucursal sucursal={sucursal} setEditando={setEditando} />
      ) : (
        <StaticSucursal
          busqueda={busqueda || ""}
          sucursal={sucursal}
          setEditando={setEditando}
        />
      )}
    </>
  );
};
