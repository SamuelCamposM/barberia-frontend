import { lazy } from "react";

export default {
  Menu: lazy(() => import("../pages/Menu/Menu")),
  Valoraciones: lazy(() => import("../pages/Valoraciones/Valoraciones")),
  Productos: lazy(() => import("../pages/Productos/Productos")),
  Categoria: lazy(() => import("../pages/Categoria/Categoria")),
  Cita: lazy(() => import("../pages/Cita/Cita")),
  Depto: lazy(() => import("../pages/Depto/Depto")),
  Marca: lazy(() => import("../pages/Marca/Marca")),
  Municipio: lazy(() => import("../pages/Municipio/Municipio")),
  Sucursal: lazy(() => import("../pages/Sucursal/Sucursal")),
};
