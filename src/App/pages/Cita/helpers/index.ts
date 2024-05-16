import { clienteAxios } from "../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import { EstadoCita, CitaItem, setDataProps } from "../interfaces";
import {
  DateTimeFormateadaWithHours,
  formatUsuarioForeign,
} from "../../../../helpers";

export enum SocketOnCita {
  agregar = "cliente:cita-agregar",
  editar = "cliente:cita-editar",
  eliminar = "cliente:cita-eliminar",
}

export enum SocketEmitCita {
  agregar = "server:cita-agregar",
  editar = "server:cita-editar",
  eliminar = "server:cita-eliminar",
}
export const estadosCita: EstadoCita[] = [
  "PENDIENTE",
  "FINALIZADA",
  "AUSENCIA",
  "ANULADA",
];
export const columns: Column[] = [
  { campo: "", label: "", minWidth: 10, align: "center", sortable: false },

  {
    campo: "estadoCita",
    label: "estado",
    align: "left",
    minWidth: 100,
    sortable: false,
  },
  {
    campo: "empleado.lastname",
    label: "empleado",
    align: "left",
    minWidth: 100,
    sortable: true,
  },
  {
    campo: "fecha",
    label: "fecha",
    align: "left",
    minWidth: 100,
    sortable: true,
  },
  {
    campo: "titulo",
    label: "titulo",
    align: "left",
    minWidth: 100,
    sortable: false,
  },
  {
    campo: "description",
    label: "description",
    align: "left",
    minWidth: 100,
    sortable: false,
  },
  {
    campo: "rUsuario.lastname",
    label: "rUsuario",
    align: "left",
    minWidth: 100,
    sortable: false,
  },
  {
    campo: "sucursal.name",
    label: "sucursal",
    align: "left",
    minWidth: 100,
    sortable: true,
  },
  {
    campo: "createdAt",
    label: "F. Reg.",
    align: "left",
    minWidth: 100,
    sortable: true,
  },
];

export const sortDefault = { asc: false, campo: "name" };

export const itemDefault: CitaItem = {
  createdAt: "",
  description: "",
  empleado: formatUsuarioForeign(),
  estadoCita: "PENDIENTE",
  fecha: DateTimeFormateadaWithHours(),
  rUsuario: formatUsuarioForeign(), 
  sucursal: {
    _id: "",
    name: "",
    tel: "",
  },
  titulo: "",
  // _id,
  // crud
};

export const columnsStocks: Column[] = [
  { label: "Sucursal", minWidth: 50 },
  { label: "Cantidad", minWidth: 200 },
];

interface Result extends Pagination {
  docs: CitaItem[];
}

interface MyResponse {
  result: Result;
}

type getCitasType = (params: setDataProps) => Promise<{
  error: ErrorBackend;
  result: Result;
}>;

export const getCitas: getCitasType = async (params) => {
  try {
    const {
      data: {
        result: { docs, limit, page, totalDocs, totalPages },
      },
    } = await clienteAxios.post<MyResponse>("/cita", params);
    console.log({ docs });
    return {
      error: {
        error: false,
        msg: "",
      },
      result: { docs, limit, page, totalDocs, totalPages },
    };
  } catch (error: any) {
    return {
      error: {
        error: true,
        msg: error?.response?.data?.msg || "Error al consultar las citas",
      },
      result: { docs: [], ...paginationDefault },
    };
  }
};
