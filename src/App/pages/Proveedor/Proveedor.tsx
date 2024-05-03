import { Action, FromAnotherComponent, Sort } from "../../../interfaces/global";
import { AddCircle, Cancel, Refresh } from "@mui/icons-material";
import { columns, getProveedors, itemDefault, sortDefault } from "./helpers";
import { EditableProveedor } from "./components/EditableProveedor";
import { ProveedorItem, setDataProps, useSocketEvents } from ".";
import { PaperContainerPage } from "../../components/style";
import { RowProveedor } from "./components/RowProveedor";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { TableNoData } from "../../components/Tabla/TableNoData";
import { toast } from "react-toastify"; // Definición de las columnas de la tabla.
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useCommonStates } from "../../hooks";
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
  Buscador,
  Cargando,
  TablaLayout,
  TableTitle,
} from "../../components"; // Importaciones de hooks de menú y notificaciones.

export const Proveedor = ({ dontChangePath }: FromAnotherComponent) => {
  // Hooks de navegación y rutas.
  const navigate = useNavigate();

  // Hooks personalizados para permisos.
  const { noTienePermiso, getPathPage, data: dataMenu } = useMenuStore();

  const { path } = useMemo(() => getPathPage("Proveedor", false), [dataMenu]);
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
  const [proveedoresData, setProveedorsData] = useState<ProveedorItem[]>([]);
  const [pagination, setPagination] = useState(paginationDefault);

  const handleChangePage = (_: unknown, newPage: number) => {
    setData({
      pagination: { ...pagination, page: newPage + 1 },
      busqueda,
      sort,
      estado,
    });
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setData({
      pagination: { ...pagination, page: 1, limit: +event.target.value },
      busqueda,
      sort,
      estado,
    });
  };

  const sortFunction = (newSort: Sort) => {
    setData({ pagination, busqueda, sort: newSort, estado });
  };
  const searchFunction = (newBuscando: boolean, value: string) => {
    setBuscando(newBuscando);
    setData({ pagination: paginationDefault, sort, busqueda: value, estado });
  };
  const handleChangeEstado = (newEstado: boolean) => {
    setData({ pagination, sort, busqueda, estado: newEstado });
  };

  // Función asíncrona para obtener y establecer datos.
  const setData = async ({
    pagination,
    sort,
    busqueda,
    estado,
  }: setDataProps) => {
    console.log('consultando');
    
    setCargando(true);
    const { error, result } = await getProveedors({
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
    setPagination(rest);
    setProveedorsData(docs);
    setSort(sort);
    setBusqueda(busqueda);
    setCargando(false);
    setEstado(estado);
  };

  // Efectos secundarios para la sincronización con la URL y sockets.
  const {
    q = "",
    buscando: buscandoQuery,
    pagination: paginationQuery,
    sort: sortQuery,
    estado: estadoQuery,
  } = queryString.parse(location.search) as {
    q: string;
    buscando: string;
    pagination: string;
    sort: string;
    estado: string;
  };

  useEffect(() => {
    if (!dontChangePath) {
      let params = new URLSearchParams(window.location.search);
      params.set("q", busqueda);
      params.set("buscando", buscando ? "true" : "false");
      params.set("sort", JSON.stringify(sort));
      params.set("pagination", JSON.stringify(pagination));
      params.set("estado", estado ? "true" : "false");
      navigate(`?${params.toString()}`, { replace: true });
    }
  }, [busqueda, buscando, sort, pagination, estado]);

  useEffect(() => {
    if (dontChangePath) {
      const estaBuscando = Boolean(buscandoQuery === "true");
      setBuscando(estaBuscando);
      setData({
        pagination,
        sort,
        busqueda,
        estado,
      });
    } else {
      const estaBuscando = Boolean(buscandoQuery === "true");
      setBuscando(estaBuscando);
      setData({
        pagination: paginationQuery
          ? JSON.parse(paginationQuery)
          : paginationDefault,
        sort: sortQuery ? JSON.parse(sortQuery) : sort,
        busqueda: estaBuscando ? q : "",
        estado: estadoQuery ? estadoQuery === "true" : estado,
      });
    }
  }, []);

  useSocketEvents({ setProveedorsData, setPagination });
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
      name: "Agregar Proveedor",
      onClick: () => {
        if (noTienePermiso("Proveedor", "insert")) return;
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
      <Buscador
        buscando={buscando}
        cargando={cargando}
        onSearch={(value) => searchFunction(true, value)}
        onSearchCancel={() => searchFunction(false, "")}
      />
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
                  <Cargando titulo="Cargando Proveedors..." />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {agregando && (
                <EditableProveedor
                  esNuevo
                  setEditando={() => {}}
                  proveedor={{ ...itemDefault, crud: { nuevo: true } }}
                  setAgregando={setAgregando}
                />
              )}
              {proveedoresData.length === 0 ? (
                <TableNoData
                  length={columns.length}
                  title="No hay proveedores"
                />
              ) : (
                proveedoresData.map((proveedor) => {
                  return (
                    <RowProveedor
                      key={proveedor._id}
                      proveedor={proveedor}
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

export default Proveedor;
