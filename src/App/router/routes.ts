import { lazy } from "react";

export default {
  Menu: lazy(() => import("../pages/Menu/Menu")),
  Valoraciones: lazy(() => import("../pages/Valoraciones/Valoraciones")),
  Producto: lazy(() => import("../pages/Producto/Producto")),
  Categoria: lazy(() => import("../pages/Categoria/Categoria")),
  Cita: lazy(() => import("../pages/Cita/Cita")),
  Depto: lazy(() => import("../pages/Depto/Depto")),
  Marca: lazy(() => import("../pages/Marca/Marca")),
  Venta: lazy(() => import("../pages/Venta/Venta")),
  Sucursal: lazy(() => import("../pages/Sucursal/Sucursal")),
  Usuario: lazy(() => import("../pages/Usuario/Usuario")),
  Compra: lazy(() => import("../pages/Compra/Compra")),
  Proveedor: lazy(() => import("../pages/Proveedor/Proveedor")),
  CierreCaja: lazy(() => import("../pages/CierreCaja/CierreCaja")),
};
