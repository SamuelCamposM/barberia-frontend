import * as Iconos from "@mui/icons-material";
import { PageItem } from "..";
export const IconosFiltered = Object.keys(Iconos).filter((nombreIcono) =>
  nombreIcono.endsWith("Rounded")
);

export const filterFunction = (q: string, buscando: string, rows: PageItem[]) =>
  rows.filter((row) =>
    buscando === "true"
      ? row.nombre.toLowerCase().includes(q.toLowerCase())
      : true
  );
