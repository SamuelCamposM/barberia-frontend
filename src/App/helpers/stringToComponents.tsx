import * as Iconos from "@mui/icons-material";
import Componentes from "../router/routes"; 

export const ConvertirIcono = (
  icono: string,
  size: string = "medium",
  color: string = ""
) => {
  const Icono = (Iconos as any)[icono] || Iconos.Menu;
  return <Icono fontSize={size} color={color} />;
};
export const ConvertirComponente = (nombre: string) => {
  const Componente = (Componentes as any)[nombre];
  return <Componente />;
};
