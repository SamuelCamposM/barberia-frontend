import * as Iconos from "@mui/icons-material";
export const IconosFiltered = Object.keys(Iconos).filter((nombreIcono) =>
  nombreIcono.endsWith("Rounded")
);
