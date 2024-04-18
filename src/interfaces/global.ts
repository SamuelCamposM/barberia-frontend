import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

export interface Crud {
  editado?: boolean;
  eliminado?: boolean;
  nuevo?: boolean;
}

export interface Action {
  badge?: string;
  color: "primary" | "secondary" | "error" | "success";
  disabled?: boolean;
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  name: string;
  ocultar?: boolean;
  onClick: (arg: any) => void;
  size?: "small" | "medium" | "large";
  tipo: "icono" | "boton";
  variant?: "text" | "outlined" | "contained";
}

export type Components =
  | "Categoria"
  | "Cita"
  | "Depto"
  | "Marca"
  | "Menu"
  | "Municipio"
  | "Productos"
  | "Sucursal"
  | "Valoraciones"
  | "Usuario";

export type tipoPermiso = "delete" | "update" | "insert" | "select" | "ver";

export interface Column {
  align?: "right" | "center" | "left";
  campo?: string;
  required?: boolean;
  label: string;
  minWidth?: number;
  sortable: boolean;
}

export interface Pagination {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
}
export interface Sort {
  asc: boolean;
  campo: string;
}
export interface ErrorSocket {
  error: boolean;
  msg: string;
  subtitulo?: string;
}

export type socketChildListener = "remove" | "add";
