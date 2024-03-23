import * as Iconos from "@mui/icons-material";
import Componentes from "../router/routes";

export const ConvertirIcono = (icono: string, size: string = "medium") => {
  const Icono = (Iconos as any)[icono] || Iconos.Menu;
  return <Icono fontSize={size} />;
};
export const ConvertirComponente = (nombre: string) => {
  const Componente = (Componentes as any)[nombre];
  return <Componente />;
};
