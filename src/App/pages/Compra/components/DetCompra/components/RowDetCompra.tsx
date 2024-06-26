import { Dispatch, useState } from "react";
import { StaticDetCompra } from "./StaticDetCompra";
import { EditableDetCompra } from "./EditableDetCompra";
import { DetCompraItem } from "../interfaces";
import { CompraItem } from "../../../interfaces";

export const RowDetCompra = (rest: {
  detCompra: DetCompraItem;
  setformValues: Dispatch<React.SetStateAction<CompraItem>>;
  finalizada: boolean;
}) => {
  const [editando, setEditando] = useState(!Boolean(rest.detCompra._id));
  return editando ? (
    <EditableDetCompra setEditando={setEditando} {...rest} />
  ) : (
    <StaticDetCompra setEditando={setEditando} {...rest} />
  );
};
