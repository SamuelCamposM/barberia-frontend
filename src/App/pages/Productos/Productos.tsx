import { Action, Pagination, Sort } from "../../../interfaces/global";
import { AddCircle, Cancel, Create, Refresh } from "@mui/icons-material";
import { Box, TableBody, TablePagination } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { columns, getProductos, sortDefault, tiposProducto } from "./helpers";
import { ModalRoute } from "./components/ModalRoute";
import { PaperContainerPage } from "../../components/style";
import { TipoProducto } from "./interfaces";
import { Route, Routes, useNavigate } from "react-router-dom";
import { StaticProducto, ProductoItem, setDataProps, useSocketEvents } from ".";
import { TableCargando } from "../../components/Tabla/TableCargando";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { TableNoData } from "../../components/Tabla/TableNoData";
import { toast } from "react-toastify";
import { useCommonStates } from "../../hooks";
import { useMenuStore } from "../Menu";
import { useProductoStore } from "./hooks/useProductoStore";
import queryString from "query-string";
import {
  getSubPath,
  paginationDefault,
  rowsPerPageOptions,
  validateFunction,
} from "../../../helpers";
import {
  Acciones,
  BuscadorPath,
  TablaLayout,
  TableTitle,
} from "../../components";
import { useHandleNavigation } from "../../hooks/useHandleNavigation";
interface handleEventProps {
  newPagination?: Pagination;
  newSort?: Sort;
  newTabValue?: TipoProducto;
  newEstadoValue?: boolean;
}
export const Productos = () => {
  // Hooks de navegación y rutas.
  // Importaciones y definiciones de estado
  const navigate = useNavigate();
  const { noTienePermiso, data: dataMenu, getPathPage } = useMenuStore();
  const { path } = useMemo(() => getPathPage("Productos", false), [dataMenu]);
  const { setItemActive, setOpenModal, itemActive, openModal, itemDefault } =
    useProductoStore();
  const [tipoProducto, setTipoProducto] = useState<TipoProducto>("PRODUCTO");
  const [estado, setEstado] = useState(true);

  const {
    buscando,
    busqueda,
    cargando,
    setCargando,
    setBuscando,
    setBusqueda,
    setSort,
    sort,
  } = useCommonStates(sortDefault);
  const [productosData, setProductosData] = useState<ProductoItem[]>([]);
  const [pagination, setPagination] = useState(paginationDefault);
  // Función de alto nivel para manejar eventos
  const handleEvent = useCallback(
    ({
      newPagination = pagination,
      newSort = sort,
      newTabValue = tipoProducto,
      newEstadoValue = estado,
    }: handleEventProps) => {
      const urlParams = `?q=${busqueda}&pagination=${JSON.stringify(
        newPagination
      )}&sort=${JSON.stringify(
        newSort
      )}&buscando=${buscando}&tipoProducto=${newTabValue}&estado=${newEstadoValue}`;
      navigate(urlParams);
    },
    [busqueda, navigate, pagination, sort, tipoProducto, estado]
  );

  const {
    handleChangePage,
    handleChangeRowsPerPage,
    sortFunction,
    handleChangeTab,
    handleChangeEstado,
  } = useHandleNavigation<TipoProducto, boolean>({
    handleEvent,
    pagination,
  });

  // Función asíncrona para obtener y establecer datos
  const setData = useCallback(
    async ({
      pagination,
      sort,
      busqueda,
      tipoProducto,
      estado,
    }: setDataProps) => {
      setCargando(true);
      const { error, result } = await getProductos({
        pagination,
        sort,
        busqueda,
        tipoProducto,
        estado,
      });
      if (error.error) {
        toast.error(error.msg);
        return;
      }
      const { docs, ...rest } = result;
      setPagination(rest);
      setProductosData(docs);
      setSort(sort);
      setBusqueda(busqueda);
      setTipoProducto(tipoProducto);
      setCargando(false);
      setEstado(estado);
    },
    []
  );

  // Efectos secundarios para la sincronización con la URL y sockets
  const {
    q = "",
    buscando: buscandoQuery = "",
    pagination: paginationQuery = "",
    sort: sortQuery = "",
    tipoProducto: tipoProductoQuery = "PRODUCTO",
    estado: estadoQuery = "true",
  } = queryString.parse(location.search) as {
    q: string;
    buscando: string;
    pagination: string;
    sort: string;
    tipoProducto: TipoProducto | undefined;
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
      tipoProducto: tipoProductoQuery,
      estado: estadoQuery === "true",
    });
  }, [
    q,
    paginationQuery,
    sortQuery,
    buscandoQuery,
    tipoProductoQuery,
    estadoQuery,
  ]);

  useSocketEvents({ setProductosData, setPagination });
  const nuevoActive = useMemo(() => itemActive.crud?.agregando, [itemActive]);

  const tabs: Action[] = tiposProducto.map((tipoProductoMap) => ({
    color: "primary",
    Icon: Refresh,
    name: tipoProductoMap,
    onClick: () => {
      handleChangeTab(tipoProductoMap);
    },
    size: "small",
    tipo: "tab",
    active: tipoProductoMap === tipoProducto,
  }));
  const tabEstado: Action = {
    color: "error",
    Icon: Refresh,
    name: "Inactivos",
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
      onClick: () =>
        setData({
          pagination,
          sort,
          busqueda: q,
          tipoProducto: tipoProducto,
          estado,
        }),
      tipo: "icono",
    },
    {
      color: "success",
      Icon: AddCircle,
      name: "Nuevo",
      tipo: "icono",
      disabled: nuevoActive,
      onClick: async () => {
        const canActive = await setItemActive({
          ...itemDefault,
          crud: { agregando: true },
        });
        if (canActive) {
          let params = new URLSearchParams(window.location.search);

          navigate(`nuevo?${params.toString()}`);
          setOpenModal(true);
        }
      },
    },
    {
      color: nuevoActive ? "success" : "secondary",
      tipo: "icono",
      badge: "index",
      disabled: false,
      Icon: Create,
      name: `Continuar ${nuevoActive ? "Creando" : "Editando"}`,
      ocultar: !Boolean(itemActive._id) && !nuevoActive,
      onClick: () => {
        if (!Boolean(itemActive._id) && !nuevoActive) return;
        setOpenModal(!openModal);
      },
    },
    {
      color: "error",
      tipo: "icono",
      badge: "index",
      disabled: false,
      Icon: Cancel,
      name: `Cancelar ${nuevoActive ? "Creando" : "Edición"}`,
      ocultar: !Boolean(itemActive._id) && !nuevoActive,
      onClick: async () => {
        navigate(getSubPath());
        setItemActive(itemDefault, true);
      },
    },
  ];

  const handleEditar = useCallback(
    async (itemEditing: ProductoItem) => {
      if (noTienePermiso("Menu", "update")) {
        return;
      }

      const canActive = await setItemActive(itemEditing);
      if (canActive) {
        let params = new URLSearchParams(window.location.search);
        navigate(`${itemEditing._id || ""}?${params.toString()}`);
        setOpenModal(!openModal);
      }
    },
    [dataMenu, itemActive]
  );

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
          <Route
            path="/:_id"
            element={
              <ModalRoute
                productosData={productosData}
                cargando={cargando}
                prevPath={path}
              />
            }
          />
        </Routes>
        <BuscadorPath label="Buscar por Producto, Marca y Categoria" />

        <TableTitle texto={path} Tabs={[...tabs, tabEstado]} />
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
            <TableCargando columnsLength={columns.length} />
          ) : (
            <TableBody>
              {productosData.length === 0 ? (
                <TableNoData length={columns.length} title="No hay Productos" />
              ) : (
                productosData.map((producto) => {
                  return (
                    <StaticProducto
                      key={producto._id}
                      producto={producto}
                      busqueda={busqueda}
                      handleEditar={handleEditar}
                      itemActive={itemActive}
                    />
                  );
                })
              )}
            </TableBody>
          )}
        </TablaLayout>
      </PaperContainerPage>
    </>
  );
};

export default Productos;
