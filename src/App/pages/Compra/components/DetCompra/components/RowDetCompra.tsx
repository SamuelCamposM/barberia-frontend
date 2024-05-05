import { useState } from "react";
import { StaticDetCompra } from "./StaticDetCompra";
import { EditableDetCompra } from "./EditableDetCompra";
import { DetCompraItem } from "../interfaces";

export const RowDetCompra = ({
  busqueda,
  //separo busqueda por que es el unico que no pasare el editable
  ...rest
}: {
  detCompra: DetCompraItem;
  compra: string;
  busqueda?: string;
  finalizada: boolean;
}) => {
  const [editando, setEditando] = useState(!Boolean(rest.detCompra._id));
  return editando ? (
    <EditableDetCompra {...rest} setEditando={setEditando} />
  ) : (
    <StaticDetCompra 
      setEditando={setEditando}
      {...rest}
      busqueda={busqueda || ""}
    />
  );
};
