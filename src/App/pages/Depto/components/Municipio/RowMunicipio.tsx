import { Municipio } from "./interfaces";
import { useState } from "react";
import { StaticMunicipio } from "./StaticMunicipio";
import { EditableMunicipio } from "./EditableMunicipio";

export const RowMunicipio = ({
  busqueda,
  //separo busqueda por que es el unico que no pasare el editable
  ...rest
}: {
  municipio: Municipio;
  depto: string;
  busqueda?: string;
}) => {
  const [editando, setEditando] = useState(!Boolean(rest.municipio._id));
  return editando ? (
    <EditableMunicipio {...rest} setEditando={setEditando} />
  ) : (
    <StaticMunicipio
      setEditando={setEditando}
      {...rest}
      busqueda={busqueda || ""}
    />
  );
};
