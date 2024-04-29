import { Action, FromAnotherComponent, Sort } from "../../../interfaces/global";
import { AddCircle, Cancel, Refresh } from "@mui/icons-material";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { SucursalItem, setDataProps, useSocketEvents } from ".";
import {
  paginationDefault,
  rowsPerPageOptions,
  validateFunction,
} from "../../../helpers";
import { PaperContainerPage } from "../../components/style";
import { columns, getSucursals, itemDefault, sortDefault } from "./helpers";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useCommonStates } from "../../hooks";
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
  Buscador,
  Cargando,
  TablaLayout,
  TableTitle,
} from "../../components"; // Importaciones de hooks de menú y notificaciones.
import { useMenuStore } from "../Menu";
import { toast } from "react-toastify"; // Definición de las columnas de la tabla.
import { TableNoData } from "../../components/Tabla/TableNoData";
import { RowSucursal } from "./components/RowSucursal";
import { EditableSucursal } from "./components/EditableSucursal";
import { CallDepto } from "../Depto";

export const Sucursal = ({ dontChangePath }: FromAnotherComponent) => {
  // Hooks de navegación y rutas.
  const navigate = useNavigate();

  // Hooks personalizados para permisos.
  const { noTienePermiso, getPathPage, data: dataMenu } = useMenuStore();

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

  const handleChangePage = (_: unknown, newPage: number) => {
    setData({
      pagination: { ...pagination, page: newPage + 1 },
      busqueda,
      sort,
    });
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setData({
      pagination: { ...pagination, page: 1, limit: +event.target.value },
      busqueda,
      sort,
    });
  };

  const sortFunction = (newSort: Sort) => {
    setData({ pagination, busqueda, sort: newSort });
  };
  const searchFunction = (newBuscando: boolean, value: string) => {
    setBuscando(newBuscando);
    setData({ pagination: paginationDefault, sort, busqueda: value });
  };

  // Función asíncrona para obtener y establecer datos.
  const setData = async ({ pagination, sort, busqueda }: setDataProps) => {
    setCargando(true);
    const { error, result } = await getSucursals({
      pagination,
      sort,
      busqueda,
    });

    if (error.error) {
      toast.error(error.msg);
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
    buscando: buscandoQuery,
    pagination: paginationQuery,
    sort: sortQuery,
  } = queryString.parse(location.search) as {
    q: string;
    buscando: string;
    pagination: string;
    sort: string;
  };

  useEffect(() => {
    if (!dontChangePath) {
      let params = new URLSearchParams(window.location.search);
      params.set("q", busqueda);
      params.set("buscando", buscando ? "true" : "false");
      params.set("sort", JSON.stringify(sort));
      params.set("pagination", JSON.stringify(pagination));
      navigate(`?${params.toString()}`, { replace: true });
    }
  }, [busqueda, buscando, sort, pagination]);

  useEffect(() => {
    if (dontChangePath) {
      const estaBuscando = Boolean(buscandoQuery === "true");
      setBuscando(estaBuscando);
      setData({
        pagination,
        sort,
        busqueda,
      });
    } else {
      console.log({
        q,
        buscandoQuery,
        paginationQuery,
        sortQuery,
      });

      const estaBuscando = Boolean(buscandoQuery === "true");
      setBuscando(estaBuscando);
      setData({
        pagination: paginationQuery
          ? JSON.parse(paginationQuery)
          : paginationDefault,
        sort: sortQuery ? JSON.parse(sortQuery) : sort,
        busqueda: estaBuscando ? q : "",
      });
    }
  }, []);

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
      name: "Agregar Sucursal",
      onClick: () => {
        if (noTienePermiso("Sucursal", "insert")) return;
        setAgregando(!agregando);
      },
      tipo: "icono",
    },
  ];
  const { path: deptoPath } = useMemo(() => getPathPage("Depto"), []);
  const { path } = useMemo(() => getPathPage("Sucursal", false), [dataMenu]);
  return (
    <>
      <PaperContainerPage
        tabIndex={-1}
        onKeyDown={(e) => {
          if (validateFunction(e)) return;

          actions[Number(e.key) - 1].onClick(null);
        }}
      >
        <Routes>
          <Route path={`${deptoPath}`} element={<CallDepto />} />
        </Routes>
        <Buscador
          buscando={buscando}
          cargando={cargando}
          onSearch={(value) => searchFunction(true, value)}
          onSearchCancel={() => searchFunction(false, "")}
        />
        <>
          <TableTitle texto={path} />
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Acciones actions={actions} />
            <TablePagination
              className="tablePagination"
              rowsPerPageOptions={rowsPerPageOptions}
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
                  <EditableSucursal
                    esNuevo
                    setEditando={() => {}}
                    sucursal={{ ...itemDefault, crud: { nuevo: true } }}
                    setAgregando={setAgregando}
                  />
                )}
                {sucursalesData.length === 0 ? (
                  <TableNoData
                    length={columns.length}
                    title="No hay Sucursales"
                  />
                ) : (
                  sucursalesData.map((sucursal) => {
                    return (
                      <RowSucursal
                        key={sucursal._id}
                        sucursal={sucursal}
                        busqueda={busqueda}
                      />
                    );
                  })
                )}
              </TableBody>
            )}
          </TablaLayout>
        </>
      </PaperContainerPage>
    </>
  );
};

export default Sucursal;
