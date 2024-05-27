import { Action, FromAnotherComponent, Sort } from "../../../interfaces/global";
import { AddCircle, Cancel, Create, Refresh } from "@mui/icons-material";
import { Box, TableBody, TablePagination } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { columns, estados, getCompras, sortDefault } from "./helpers";
import { ModalRoute } from "./components/ModalRoute";
import { PaperContainerPage } from "../../components/style"; 
import { Route, Routes, useNavigate } from "react-router-dom";
import { StaticCompra, CompraItem, setDataProps, useSocketEvents } from ".";
import { TableCargando } from "../../components/Tabla/TableCargando";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { TableNoData } from "../../components/Tabla/TableNoData";
import { toast } from "react-toastify";
import { useCommonStates } from "../../hooks";
import { usePageStore } from "../Page";
import { useCompraStore } from "./hooks/useCompraStore";
import queryString from "query-string";
import {
  getSubPath,
  paginationDefault,
  rowsPerPageOptions,
  validateFunction,
} from "../../../helpers";
import { Acciones, Buscador, TablaLayout, TableTitle } from "../../components";

export const Compra = ({ dontChangePath }: FromAnotherComponent) => {
  // Hooks de navegación y rutas.
  // Importaciones y definiciones de estado
  const navigate = useNavigate();
  const { noTienePermiso, data: dataMenu, getPathPage } = usePageStore();
  const { path } = useMemo(() => getPathPage("Compra", false), [dataMenu]);
  const { setItemActive, setOpenModal, itemActive, openModal, itemDefault } =
    useCompraStore();
  const [estado, setEstado] = useState<CompraItem["estado"]>("EN PROCESO");
  const {
    // agregando,
    buscando,
    busqueda,
    cargando,
    // setAgregando,
    setBuscando,
    setBusqueda,
    setCargando,
    setSort,
    sort,
  } = useCommonStates(sortDefault);
  const [comprasData, setComprasData] = useState<CompraItem[]>([]);
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
  const handleChangeTab = (newTipoProducto: CompraItem["estado"]) => {
    setData({
      pagination,
      sort,
      busqueda,
      estado: newTipoProducto,
    });
  };

  // Función asíncrona para obtener y establecer datos.
  const setData = async ({
    pagination,
    sort,
    busqueda,
    estado,
  }: setDataProps) => {
    setCargando(true);
    const { error, result } = await getCompras({
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
    setComprasData(docs);
    setSort(sort);
    setBusqueda(busqueda);
    setEstado(estado);
    setCargando(false);
  };

  // Efectos secundarios para la sincronización con la URL y sockets.
  const {
    q = "",
    buscando: buscandoQuery,
    pagination: paginationQuery,
    sort: sortQuery,
    estado: estadoQuery = "EN PROCESO",
  } = queryString.parse(location.search) as {
    q: string;
    buscando: string;
    pagination: string;
    sort: string;
    estado: CompraItem["estado"];
  };

  useEffect(() => {
    if (!dontChangePath) {
      let params = new URLSearchParams(window.location.search);
      params.set("q", busqueda);
      params.set("buscando", buscando ? "true" : "false");
      params.set("sort", JSON.stringify(sort));
      params.set("pagination", JSON.stringify(pagination));
      params.set("estado", estado);
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
        estado: estadoQuery,
      });
    }
  }, []);

  useSocketEvents({ setComprasData, setPagination });
  const nuevoActive = useMemo(() => itemActive.crud?.agregando, [itemActive]);

  const tabs: Action[] = estados.map((estadoMap) => ({
    color:
      estadoMap === "ANULADA"
        ? "error"
        : estadoMap === "FINALIZADA"
        ? "success"
        : "primary",
    Icon: Refresh,
    name: estadoMap,
    onClick: () => {
      handleChangeTab(estadoMap);
    },
    size: "small",
    tipo: "tab",
    active: estadoMap === estado,
  }));

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
    async (itemEditing: CompraItem) => {
      if (noTienePermiso("Page", "update")) {
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
                comprasData={comprasData}
                cargando={cargando}
                
              />
            }
          />
        </Routes>
        <Buscador
          label="Buscar por Proveedor y Sucursal"
          buscando={buscando}
          cargando={cargando}
          onSearch={(value) => searchFunction(true, value)}
          onSearchCancel={() => searchFunction(false, "")}
        />

        <TableTitle texto={path} Tabs={[...tabs]} />
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
              {comprasData.length === 0 ? (
                <TableNoData length={columns.length} title="No hay Compra" />
              ) : (
                comprasData.map((compra) => {
                  return (
                    <StaticCompra
                      key={compra._id}
                      compra={compra}
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

export default Compra;
