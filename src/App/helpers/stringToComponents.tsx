import * as Iconos from "@mui/icons-material";
import Componentes from "../router/routes";

export const ConvertirIcono = (icono: string) => {
  const Icono = (Iconos as any)[icono] || Iconos.Menu;
  return <Icono />;
};
export const ConvertirComponente = (nombre: string) => {
  const Componente = (Componentes as any)[nombre];
  return <Componente />;
};
