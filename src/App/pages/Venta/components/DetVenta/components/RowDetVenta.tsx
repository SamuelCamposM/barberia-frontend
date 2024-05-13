import { Dispatch, useState } from "react";
import { StaticDetVenta } from "./StaticDetVenta";
import { EditableDetVenta } from "./EditableDetVenta";
import { DetVentaItem } from "../interfaces";
import { VentaItem } from "../../../interfaces";

export const RowDetVenta = (rest: {
  detVenta: DetVentaItem;
  setformValues: Dispatch<React.SetStateAction<VentaItem>>;
  deshabilitar: boolean;
  sucursal_id: string;
}) => {
  const [editando, setEditando] = useState(!Boolean(rest.detVenta._id));
  return editando ? (
    <EditableDetVenta setEditando={setEditando} {...rest} />
  ) : (
    <StaticDetVenta setEditando={setEditando} {...rest} />
  );
};
