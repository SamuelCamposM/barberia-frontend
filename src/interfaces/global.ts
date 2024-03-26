import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export interface Crud {
  editado?: boolean;
  eliminado?: boolean;
  nuevo?: boolean;
}

export interface Action {
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  name: string;
  disabled?: boolean;
  ocultar?: boolean;
  onClick: (arg: any) => void;
  bgColor: "primary" | "secondary" | "error" | "success";
}

export type Components =
  | "Menu"
  | "Sucursal"
  | "Valoraciones"
  | "Marca"
  | "Municipio"
  | "Productos"
  | "Categoria"
  | "Depto"
  | "Cita";
export type tipoPermiso = "delete" | "update" | "insert" | "select" | "ver";
