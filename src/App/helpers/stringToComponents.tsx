import * as Iconos from "@mui/icons-material";
import Componentes from "../router/routes";
import { Theme } from "@mui/material";

export const ConvertirIcono = (icono: string, size: string = "medium") => {
  const Icono = (Iconos as any)[icono] || Iconos.Menu;
  return <Icono fontSize={size} sx={{ color: (theme: Theme) => {
    return theme.palette.primary.contrastText
  } }} />;
};
export const ConvertirComponente = (nombre: string) => {
  const Componente = (Componentes as any)[nombre];
  return <Componente />;
};
