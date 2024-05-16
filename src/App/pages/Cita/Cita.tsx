import { Action, FromAnotherComponent, Sort } from "../../../interfaces/global";
import { AddCircle, Cancel, Create, Refresh } from "@mui/icons-material";
import { Box, TableBody, TablePagination } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { columns, estadosCita, getCitas, sortDefault } from "./helpers";
import { ModalRoute } from "./components/ModalRoute";
import { PaperContainerPage } from "../../components/style";
import { EstadoCita } from "./interfaces";
import { Route, Routes, useNavigate } from "react-router-dom";
import { StaticCita, CitaItem, setDataProps, useSocketEvents } from ".";
import { TableCargando } from "../../components/Tabla/TableCargando";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { TableNoData } from "../../components/Tabla/TableNoData";
import { toast } from "react-toastify";
import { useCommonStates } from "../../hooks";
import { useMenuStore } from "../Menu";
import { useCitaStore } from "./hooks/useCitaStore";
import queryString from "query-string";
import {
  getSubPath,
  paginationDefault,
  rowsPerPageOptions,
  validateFunction,
} from "../../../helpers";
import { Acciones, Buscador, TablaLayout, TableTitle } from "../../components";

export const Cita = ({ dontChangePath }: FromAnotherComponent) => {
  // Hooks de navegación y rutas.
  // Importaciones y definiciones de estado
  const navigate = useNavigate();
  const { noTienePermiso, data: dataMenu, getPathPage } = useMenuStore();
  const { path } = useMemo(() => getPathPage("Cita", false), [dataMenu]);
  const { setItemActive, setOpenModal, itemActive, openModal, itemDefault } =
    useCitaStore();
  const [estadoCita, setEstadoCita] = useState<EstadoCita>("PENDIENTE");
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
  const [citasData, setCitasData] = useState<CitaItem[]>([]);
  const [pagination, setPagination] = useState(paginationDefault);

  // Función de alto nivel para manejar
  const handleChangePage = (_: unknown, newPage: number) => {
    setData({
      pagination: { ...pagination, page: newPage + 1 },
      busqueda,
      sort,
      estadoCita,
    });
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setData({
      pagination: { ...pagination, page: 1, limit: +event.target.value },
      busqueda,
      sort,
      estadoCita,
    });
  };

  const sortFunction = (newSort: Sort) => {
    setData({ pagination, busqueda, sort: newSort, estadoCita });
  };
  const searchFunction = (newBuscando: boolean, value: string) => {
    setBuscando(newBuscando);
    setData({
      pagination: paginationDefault,
      sort,
      busqueda: value,
      estadoCita,
    });
  };

  const handleChangeTab = (newEstadoCita: EstadoCita) => {
    setData({
      pagination,
      sort,
      busqueda,
      estadoCita: newEstadoCita,
    });
  };

  // Función asíncrona para obtener y establecer datos.
  const setData = async ({
    pagination,
    sort,
    busqueda,
    estadoCita,
  }: setDataProps) => {
    setCargando(true);
    const { error, result } = await getCitas({
      pagination,
      sort,
      busqueda,
      estadoCita,
    });

    if (error.error) {
      toast.error(error.msg);
      return;
    }
    const { docs, ...rest } = result;
    setPagination(rest);
    setCitasData(docs);
    setSort(sort);
    setBusqueda(busqueda);
    setCargando(false);
    setEstadoCita(estadoCita);
  };

  // Efectos secundarios para la sincronización con la URL y sockets.
  const {
    q = "",
    buscando: buscandoQuery,
    pagination: paginationQuery,
    sort: sortQuery,
    estadoCita: estadoCitaQuery = "PENDIENTE",
  } = queryString.parse(location.search) as {
    q: string;
    buscando: string;
    pagination: string;
    sort: string;
    estadoCita: EstadoCita | undefined;
  };

  useEffect(() => {
    if (!dontChangePath) {
      let params = new URLSearchParams(window.location.search);
      params.set("q", busqueda);
      params.set("buscando", buscando ? "true" : "false");
      params.set("sort", JSON.stringify(sort));
      params.set("pagination", JSON.stringify(pagination));
      params.set("estadoCita", estadoCita);
      navigate(`?${params.toString()}`, { replace: true });
    }
  }, [busqueda, buscando, sort, pagination, estadoCita]);

  useEffect(() => {
    if (dontChangePath) {
      const estaBuscando = Boolean(buscandoQuery === "true");
      setBuscando(estaBuscando);
      setData({
        pagination,
        sort,
        busqueda,
        estadoCita,
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
        estadoCita: estadoCitaQuery,
      });
    }
  }, []);
  useSocketEvents({ setCitasData, setPagination });
  const nuevoActive = useMemo(() => itemActive.crud?.agregando, [itemActive]);

  const tabs: Action[] = estadosCita.map((estadoCitaMap) => ({
    color:
      estadoCitaMap === "ANULADA"
        ? "error"
        : estadoCitaMap === "FINALIZADA"
        ? "success"
        : estadoCitaMap === "AUSENCIA"
        ? "warning"
        : "primary",
    Icon: Refresh,
    name: estadoCitaMap,
    onClick: () => {
      handleChangeTab(estadoCitaMap);
    },
    size: "small",
    tipo: "tab",
    active: estadoCitaMap === estadoCita,
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
          estadoCita: estadoCita,
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
    async (itemEditing: CitaItem) => {
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
                citasData={citasData}
                cargando={cargando}
                prevPath={path}
              />
            }
          />
        </Routes>
        <Buscador
          label="Buscar por Cita, Marca y Categoria"
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
              {citasData.length === 0 ? (
                <TableNoData length={columns.length} title="No hay Cita" />
              ) : (
                citasData.map((cita) => {
                  return (
                    <StaticCita
                      key={cita._id}
                      cita={cita}
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

export default Cita;
