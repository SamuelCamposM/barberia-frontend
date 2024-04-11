import { Action, Pagination, Sort } from "../../../interfaces/global";
import { AddCircle, Cancel, Refresh } from "@mui/icons-material";
import { ChangeEvent, useEffect, useState } from "react";
import { SucursalItem, setDataProps, useSocketEvents } from ".";
import { paginationDefault, validateFunction } from "../../../helpers";
import { PaperContainerPage } from "../../components/style";
import { Row } from "./components/Row";
import { columns, getSucursals, rowDefault, sortDefault } from "./helpers";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { useNavigate } from "react-router-dom";
import { useCommonStates, usePath } from "../../hooks";
import queryString from "query-string";

import {
  Box,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
} from "@mui/material";
import {
  Acciones,
  BuscadorPath,
  Cargando,
  TablaLayout,
  Title,
} from "../../components"; // Importaciones de hooks de menú y notificaciones.
import { useMenuStore } from "../Menu";
import { toast } from "react-toastify"; // Definición de las columnas de la tabla.
 

export const Sucursal = () => {
  // Hooks de navegación y rutas.
  const navigate = useNavigate();
  const path = usePath();

  // Hooks personalizados para permisos.
  const { noTienePermiso } = useMenuStore();

  // Estados locales para el manejo de la UI y datos.
  const {
    agregando,
    buscando,
    busqueda,
    cargando,
    setAgregando,
    setBuscando,
    setBusqueda,
    setCargando,
    setSort,
    sort,
  } = useCommonStates(sortDefault);
  const [sucursalesData, setSucursalsData] = useState<SucursalItem[]>([]);
  const [pagination, setPagination] = useState(paginationDefault);

  // Funciones para el manejo de eventos y acciones.
  const navigateWithParams = ({
    newPagination,
    newSort,
  }: {
    newPagination: Pagination;
    newSort: Sort;
  }) => {
    const urlParams = `?q=${busqueda}&pagination=${JSON.stringify(
      newPagination
    )}&sort=${JSON.stringify(newSort)}&buscando=${buscando}`;
    navigate(urlParams);
    // let params = new URLSearchParams(window.location.search);
    // params.set("q", busqueda);
    // params.set("buscando", String(buscando));
    // params.set("pagination", JSON.stringify(newPagination));
    // params.set("sort", JSON.stringify(newSort));
    // navigate(`?${params.toString()}`);
  };
  const handleChangePage = (_: unknown, newPage: number) => {
    navigateWithParams({
      newPagination: { ...pagination, page: newPage + 1 },
      newSort: sort,
    });
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    navigateWithParams({
      newPagination: { ...pagination, page: 1, limit: +event.target.value },
      newSort: sort,
    });
  };

  const sortFunction = (newSort: Sort) => {
    navigateWithParams({ newPagination: pagination, newSort });
  };

  // Función asíncrona para obtener y establecer datos.
  const setData = async ({ pagination, sort, busqueda }: setDataProps) => {
    setCargando(true);
    const { error, result } = await getSucursals({ pagination, sort, busqueda });
    if (error) {
      toast.error("Hubo un error al consultar las Sucursales");
      return;
    }
    const { docs, ...rest } = result;
    setPagination(rest);
    setSucursalsData(docs);
    setSort(sort);
    setBusqueda(busqueda);
    setCargando(false);
  };

  // Efectos secundarios para la sincronización con la URL y sockets.
  const {
    q = "",
    buscando: buscandoQuery = "",
    pagination: paginationQuery = "",
    sort: sortQuery = "",
  } = queryString.parse(location.search) as {
    q: string;
    buscando: string;
    pagination: string;
    sort: string;
  };
  useEffect(() => {
    const estaBuscando = Boolean(buscandoQuery);

    setBuscando(estaBuscando);
    setData({
      pagination: paginationQuery
        ? JSON.parse(paginationQuery)
        : paginationDefault,
      sort: sortQuery ? JSON.parse(sortQuery) : sort,
      busqueda: estaBuscando ? q : "",
    });
  }, [q, paginationQuery, sortQuery, buscandoQuery]);

  useSocketEvents({ setSucursalsData, setPagination });
  // Acciones disponibles en la UI.
  const actions: Action[] = [
    {
      color: "primary",
      Icon: Refresh,
      name: "Actualizar",
      onClick: () => setData({ pagination, sort, busqueda: q }),
      tipo: "icono",
    },
    {
      color: agregando ? "error" : "success",
      Icon: agregando ? Cancel : AddCircle,
      name: "Agregar Departamento",
      onClick: () => {
        if (noTienePermiso("Sucursal", "insert")) return;
        setAgregando(!agregando);
      },
      tipo: "icono",
    },
  ];

  return (
    <PaperContainerPage
      tabIndex={-1}
      onKeyDown={(e) => {
        if (validateFunction(e)) return;

        actions[Number(e.key) - 1].onClick(null);
      }}
    >
      <BuscadorPath />
      <>
        <Title path={path} />
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Acciones actions={actions} />
          <TablePagination
            className="tablePagination"
            rowsPerPageOptions={[10, 20, 100]}
            component="div"
            count={pagination.totalDocs}
            rowsPerPage={pagination.limit}
            page={pagination.page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>

        <TablaLayout>
          <TableHeader
            columns={columns}
            sort={sort}
            sortFunction={sortFunction}
          />
          {cargando ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  <Cargando titulo="Cargando Sucursales..." />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {agregando && (
                <Row
                  sucursal={{ ...rowDefault, crud: { nuevo: true } }}
                  setAgregando={setAgregando}
                />
              )}
              {sucursalesData.map((sucursal) => {
                return <Row key={sucursal._id} sucursal={sucursal} q={q} />;
              })}
            </TableBody>
          )}
        </TablaLayout>
      </>
    </PaperContainerPage>
  );
};

export default Sucursal;
