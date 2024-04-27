import { useState } from "react";
import { StaticMarca } from "./StaticMarca";
import { EditableMarca } from "./EditableMarca";
import { MarcaItem } from "../interfaces";
export const RowMarca = ({
  busqueda,
  //separo busqueda por que es el unico que no pasare el editable
  marca,
}: {
  marca: MarcaItem;
  busqueda?: string;
}) => {
  const [editando, setEditando] = useState(!Boolean(marca._id));

  return (
    <>
      {editando ? (
        <EditableMarca marca={marca} setEditando={setEditando} />
      ) : (
        <StaticMarca
          busqueda={busqueda || ""}
          marca={marca}
          setEditando={setEditando}
        />
      )}
    </>
  );
};
