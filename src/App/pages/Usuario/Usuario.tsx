import { Action, Pagination, Sort } from "../../../interfaces/global";
import { AddCircle, Cancel, Create, Refresh } from "@mui/icons-material";
import { Box, TableBody, TablePagination } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { columns, getUsuarios, sortDefault } from "./helpers";
import { ModalRoute } from "./components/ModalRoute";
import { PaperContainerPage } from "../../components/style";
import { Roles } from "../../../store/interfaces";
import { Route, Routes, useNavigate } from "react-router-dom";
import { StaticUsuario, UsuarioItem, setDataProps, useSocketEvents } from ".";
import { TableCargando } from "../../components/Tabla/TableCargando";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { TableNoData } from "../../components/Tabla/TableNoData";
import { toast } from "react-toastify";
import { useCommonStates } from "../../hooks";
import { useMenuStore } from "../Menu";
import { useUsuarioStore } from "./hooks/useUsuarioStore";
import queryString from "query-string";
import { paginationDefault, roles, validateFunction } from "../../../helpers";
import {
  Acciones,
  BuscadorPath,
  TablaLayout,
  TableTitle,
  TabsSlide,
} from "../../components";
import { useHandleNavigation } from "../../hooks/useHandleNavigation";

export const Usuario = () => {
  // Hooks de navegación y rutas.
  // Importaciones y definiciones de estado
  const navigate = useNavigate();
  const { noTienePermiso, data: dataMenu, getPathPage } = useMenuStore();
  const { path } = useMemo(() => getPathPage("Usuario", false), [dataMenu]);
  const { setItemActive, setOpenModal, itemActive, openModal, itemDefault } =
    useUsuarioStore();
  const [rol, setRol] = useState<Roles>("CLIENTE");
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
  const [usuariosData, setUsuariosData] = useState<UsuarioItem[]>([]);
  const [pagination, setPagination] = useState(paginationDefault);
  // Función de alto nivel para manejar eventos
  const handleEvent = useCallback(
    ({
      newPagination = pagination,
      newSort = sort,
      newEstadoRequest = rol,
    }: {
      newPagination?: Pagination;
      newSort?: Sort;
      newEstadoRequest?: Roles;
    }) => {
      const urlParams = `?q=${busqueda}&pagination=${JSON.stringify(
        newPagination
      )}&sort=${JSON.stringify(
        newSort
      )}&buscando=${buscando}&rol=${newEstadoRequest}`;
      navigate(urlParams);
    },
    [busqueda, navigate, pagination, sort, rol]
  );

  const {
    handleChangePage,
    handleChangeRowsPerPage,
    sortFunction,
    handleChangeEstado,
  } = useHandleNavigation<UsuarioItem, Roles>({
    handleEvent,
    pagination,
    setItemActive,
    itemDefault,
  });

  // Función asíncrona para obtener y establecer datos
  const setData = useCallback(
    async ({ pagination, sort, busqueda, rol }: setDataProps) => {
      setCargando(true);
      const { error, result } = await getUsuarios({
        pagination,
        sort,
        busqueda,
        rol,
      });
      if (error) {
        toast.error(error);
        return;
      }
      const { docs, ...rest } = result;
      setPagination(rest);
      setUsuariosData(docs);
      setSort(sort);
      setBusqueda(busqueda);
      setRol(rol);
      setCargando(false);
    },
    []
  );

  // Efectos secundarios para la sincronización con la URL y sockets
  const {
    q = "",
    buscando: buscandoQuery = "",
    pagination: paginationQuery = "",
    sort: sortQuery = "",
    rol: rolQuery = "CLIENTE",
  } = queryString.parse(location.search) as {
    q: string;
    buscando: string;
    pagination: string;
    sort: string;
    rol: Roles | undefined;
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
      rol: rolQuery,
    });
  }, [q, paginationQuery, sortQuery, buscandoQuery, rolQuery]);

  useSocketEvents({ setUsuariosData, setPagination });
  const nuevoActive = useMemo(() => itemActive.crud?.agregando, [itemActive]);

  const actions: Action[] = [
    {
      color: "primary",
      Icon: Refresh,
      name: "Actualizar",
      onClick: () => setData({ pagination, sort, busqueda: q, rol }),
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
      variant: "contained",
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
        setItemActive(itemDefault, true);
      },
    },
  ];

  const handleEditar = useCallback(
    async (itemEditing: UsuarioItem) => {
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
    [dataMenu, itemActive, nuevoActive]
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
              <ModalRoute usuariosData={usuariosData} cargando={cargando} />
            }
          />
        </Routes>
        <BuscadorPath />

        <TableTitle
          texto={path}
          Tabs={
            <TabsSlide
              onChange={handleChangeEstado}
              tabs={roles}
              valueTab={rol}
              cargando={cargando}
            />
          }
        />
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
            <TableCargando columnsLength={columns.length} />
          ) : (
            <TableBody>
              {usuariosData.length === 0 ? (
                <TableNoData length={columns.length} title="No hay Usuarios" />
              ) : (
                usuariosData.map((usuario) => {
                  return (
                    <StaticUsuario
                      key={usuario._id}
                      usuario={usuario}
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

export default Usuario;
