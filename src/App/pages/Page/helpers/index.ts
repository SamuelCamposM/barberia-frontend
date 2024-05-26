import { Column } from "../../../../interfaces/global";
import { PageItem } from "../interfaces";
import { formatUsuarioForeign } from "../../../../helpers";
import * as Iconos from "@mui/icons-material";

export const IconosFiltered = Object.keys(Iconos).filter((nombreIcono) =>
  nombreIcono.endsWith("Rounded")
);
export enum SocketOnPage {
  agregar = "cliente:page-agregar",
  editar = "cliente:page-editar",
}

export enum SocketEmitPage {
  agregar = "server:page-agregar",
  editar = "server:page-editar",
}
export const columns: Column[] = [
  { label: "", minWidth: 50, align: "center", sortable: false },
  { label: "Nombre", minWidth: 40, sortable: false },
  { label: "Icono", minWidth: 40, sortable: false },
  { label: "Delete", minWidth: 80, sortable: false },
  { label: "Insert", minWidth: 80, sortable: false },
  { label: "Update", minWidth: 80, sortable: false },
  { label: "Select", minWidth: 80, sortable: false },
  { label: "Wachar", minWidth: 80, sortable: false },
];

export const sortDefault = { asc: false, campo: "name" };

export const itemDefault: PageItem = {
  // _id: "",
  nombre: "",
  icono: "",
  padre: "",
  tipo: "SECCION",
  delete: [],
  update: [],
  insert: [],
  select: [],
  ver: [],
  createdAt: "",
  updatedAt: "",
  orden: 0,
  componente: "Seccion",
  rUsuario: formatUsuarioForeign(),
  eUsuario: formatUsuarioForeign(),
};

export const columnsStocks: Column[] = [
  { label: "Sucursal", minWidth: 50 },
  { label: "Cantidad", minWidth: 200 },
];

// interface Result extends Pagination {
//   docs: PageItem[];
// }

// interface MyResponse {
//   result: Result;
// }

// type getPagesType = (params: setDataProps) => Promise<{
//   error: ErrorBackend;
//   result: Result;
// }>;

// export const getPages: getPagesType = async (params) => {
//   try {
//     const {
//       data: {
//         result: { docs, limit, page, totalDocs, totalPages },
//       },
//     } = await clienteAxios.post<MyResponse>("/page", params);
//     console.log({ docs });
//     return {
//       error: {
//         error: false,
//         msg: "",
//       },
//       result: { docs, limit, page, totalDocs, totalPages },
//     };
//   } catch (error: any) {
//     return {
//       error: {
//         error: true,
//         msg: error?.response?.data?.msg || "Error al consultar las pages",
//       },
//       result: { docs: [], ...paginationDefault },
//     };
//   }
// };
