import { Action } from "../../../interfaces/global";
import { AddCircle, Cancel, Refresh } from "@mui/icons-material";
import { columns, getMarcas, itemDefault, sortDefault } from "./helpers";
import { EditableMarca } from "./components/EditableMarca";
import { MarcaItem, handleEventProps, setDataProps, useSocketEvents } from ".";
import { PaperContainerPage } from "../../components/style";
import { RowMarca } from "./components/RowMarca";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { TableNoData } from "../../components/Tabla/TableNoData";
import { toast } from "react-toastify"; // Definición de las columnas de la tabla.
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCommonStates, useHandleNavigation } from "../../hooks";
import { useMenuStore } from "../Menu";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import {
  paginationDefault,
  rowsPerPageOptions,
  validateFunction,
} from "../../../helpers";
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
  TableTitle,
} from "../../components"; // Importaciones de hooks de menú y notificaciones.

export const Marca = () => {
  // Hooks de navegación y rutas.
  const navigate = useNavigate();

  // Hooks personalizados para permisos.
  const { noTienePermiso, getPathPage, data: dataMenu } = useMenuStore();

  const { path } = useMemo(() => getPathPage("Marca", false), [dataMenu]);
  // Estados locales para el manejo de la UI y datos.
  const [estado, setEstado] = useState(true);
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
  const [marcasData, setMarcasData] = useState<MarcaItem[]>([]);
  const [pagination, setPagination] = useState(paginationDefault);

  const handleEvent = useCallback(
    ({
      newPagination = pagination,
      newSort = sort,
      newEstadoValue = estado,
    }: handleEventProps) => {
      const urlParams = `?q=${busqueda}&pagination=${JSON.stringify(
        newPagination
      )}&sort=${JSON.stringify(
        newSort
      )}&buscando=${buscando}&estado=${newEstadoValue}`;
      navigate(urlParams);
    },
    [busqueda, pagination, sort, estado]
  );

  const {
    handleChangePage,
    handleChangeRowsPerPage,
    sortFunction,
    handleChangeEstado,
  } = useHandleNavigation<string, boolean>({
    handleEvent,
    pagination,
  });

  // Función asíncrona para obtener y establecer datos.
  const setData = async ({
    pagination,
    sort,
    busqueda,
    estado,
  }: setDataProps) => {
    setCargando(true);
    const { error, result } = await getMarcas({
      pagination,
      sort,
      busqueda,
      estado,
    });

    if (error.error) {
      toast.error(error.msg);
      return;
    }
    const { docs, ...rest } = result;
    setEstado(estado);
    setPagination(rest);
    setMarcasData(docs);
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
    estado: estadoQuery = "true",
  } = queryString.parse(location.search) as {
    q: string;
    buscando: string;
    pagination: string;
    sort: string;
    estado: string;
  };
  useEffect(() => {
    const estaBuscando = Boolean(buscandoQuery === "true");

    setBuscando(estaBuscando);
    setData({
      pagination: paginationQuery
        ? JSON.parse(paginationQuery)
        : paginationDefault,
      sort: sortQuery ? JSON.parse(sortQuery) : sort,
      busqueda: estaBuscando ? q : "",
      estado: estadoQuery === "true",
    });
  }, [q, paginationQuery, sortQuery, buscandoQuery, estadoQuery]);

  useSocketEvents({ setMarcasData, setPagination });
  // Acciones disponibles en la UI.
  const tabEstado: Action = {
    color: "error",
    Icon: Refresh,
    name: "Inactivas",
    onClick: () => {
      handleChangeEstado(!estado);
    },
    size: "small",
    tipo: "tab",
    active: !estado,
  };

  const actions: Action[] = [
    {
      color: "primary",
      Icon: Refresh,
      name: "Actualizar",
      onClick: () => setData({ pagination, sort, busqueda: q, estado }),
      tipo: "icono",
    },
    {
      color: agregando ? "error" : "success",
      Icon: agregando ? Cancel : AddCircle,
      name: "Agregar Marca",
      onClick: () => {
        if (noTienePermiso("Marca", "insert")) return;
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
        <TableTitle texto={path} Tabs={[tabEstado]} />
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
                <TableCell colSpan={columns.length}>
                  <Cargando titulo="Cargando Marcas..." />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {agregando && (
                <EditableMarca
                  esNuevo
                  setEditando={() => {}}
                  marca={{ ...itemDefault, crud: { nuevo: true } }}
                  setAgregando={setAgregando}
                />
              )}
              {marcasData.length === 0 ? (
                <TableNoData length={columns.length} title="No hay marcas" />
              ) : (
                marcasData.map((marca) => {
                  return (
                    <RowMarca
                      key={marca._id}
                      marca={marca}
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
  );
};

export default Marca;
