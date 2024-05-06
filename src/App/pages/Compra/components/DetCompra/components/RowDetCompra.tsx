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
  busqueda?: string;
}) => {
  const [editando, setEditando] = useState(!Boolean(rest.detCompra._id));
  return editando ? (
    <EditableDetCompra setEditando={setEditando} {...rest} />
  ) : (
    <StaticDetCompra
      setEditando={setEditando}
      busqueda={busqueda || ""}
      {...rest}
    />
  );
};
