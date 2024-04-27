import { useState } from "react";
import { StaticCategoria } from "./StaticCategoria";
import { EditableCategoria } from "./EditableCategoria";
import { CategoriaItem } from "../interfaces";
export const RowCategoria = ({
  busqueda,
  //separo busqueda por que es el unico que no pasare el editable
  categoria,
}: {
  categoria: CategoriaItem;
  busqueda?: string;
}) => {
  const [editando, setEditando] = useState(!Boolean(categoria._id));

  return (
    <>
      {editando ? (
        <EditableCategoria categoria={categoria} setEditando={setEditando} />
      ) : (
        <StaticCategoria
          busqueda={busqueda || ""}
          categoria={categoria}
          setEditando={setEditando}
        />
      )}
    </>
  );
};
