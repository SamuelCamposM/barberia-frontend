import { useState } from "react";
import { StaticProveedor } from "./StaticProveedor";
import { EditableProveedor } from "./EditableProveedor";
import { ProveedorItem } from "../interfaces";
export const RowProveedor = ({
  busqueda,
  //separo busqueda por que es el unico que no pasare el editable
  proveedor,
}: {
  proveedor: ProveedorItem;
  busqueda?: string;
}) => {
  const [editando, setEditando] = useState(!Boolean(proveedor._id));

  return (
    <>
      {editando ? (
        <EditableProveedor proveedor={proveedor} setEditando={setEditando} />
      ) : (
        <StaticProveedor
          busqueda={busqueda || ""}
          proveedor={proveedor}
          setEditando={setEditando}
        />
      )}
    </>
  );
};
