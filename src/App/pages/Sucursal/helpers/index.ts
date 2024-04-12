import { clienteAxios } from "../../../../api";
import { Column, Pagination } from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import { SucursalItem, setDataProps } from "../interfaces";
export enum SocketOnSucursal {
  agregar = "cliente:sucursal-agregar",
  editar = "cliente:sucursal-editar",
  eliminar = "cliente:sucursal-eliminar",
}

export enum SocketEmitSucursal {
  agregar = "server:sucursal-agregar",
  editar = "server:sucursal-editar",
  eliminar = "server:sucursal-eliminar",
}

export const columns: Column[] = [
  { campo: "", label: "", minWidth: 50, align: "center", sortable: false },
  {
    campo: "municipio.depto.name",
    label: "Departamento",
    minWidth: 40,
    sortable: true,
  },
  { campo: "municipio.name", label: "Municipio", minWidth: 40, sortable: true },
  { campo: "name", label: "Sucursal", minWidth: 40, sortable: true },
  { campo: "tel", label: "tel", minWidth: 40, sortable: true },
  { campo: "direccion", label: "direccion", minWidth: 40, sortable: true },
];

export const sortDefault = { asc: true, campo: "municipio" };

export const rowDefault: SucursalItem = {
  direccion: "",
  estado: true,
  municipio: {
    id: "", //ID MUNICIPIO
    name: "", // Aquí se almacena el nombre del municipio
    deptoName: "", // Aquí se almacena el nombre del departamento
  },
  name: "",
  tel: "",
};
interface Result extends Pagination {
  docs: SucursalItem[];
}

interface MyResponse {
  data: { result: Result };
}

type getSucursalsType = ({
  busqueda,
  pagination,
  sort,
}: setDataProps) => Promise<{
  error: boolean;
  result: Result;
}>;

export const getSucursals: getSucursalsType = async ({
  busqueda,
  pagination,
  sort,
}: setDataProps) => {
  try {
    const {
      data: {
        result: { docs, limit, page, totalDocs, totalPages },
      },
    }: MyResponse = await clienteAxios.post("/sucursal", {
      pagination,
      sort,
      busqueda,
    });

    return {
      error: false,
      result: { docs, limit, page, totalDocs, totalPages },
    };
  } catch (error) {
    return { error: true, result: { docs: [], ...paginationDefault } };
  }
};
