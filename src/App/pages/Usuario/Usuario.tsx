import { Action, Pagination, Sort } from "../../../interfaces/global";
import { AddCircle, Cancel, Create, Refresh } from "@mui/icons-material";
import { Box, TableBody, TablePagination } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
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
import { useCommonStates, usePath, useThemeSwal } from "../../hooks";
import { useMenuStore } from "../Menu";
import { useUsuarioStore } from "./hooks/useUsuarioStore";
import queryString from "query-string";
import Swal from "sweetalert2";
import {
  getSubPath,
  paginationDefault,
  roles,
  validateFunction,
} from "../../../helpers";
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
  const path = usePath();
  const { noTienePermiso, data } = useMenuStore();
  const { setItemActive, setOpenModal, itemActive, openModal, itemDefault } =
    useUsuarioStore();
  const themeSwal = useThemeSwal();
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
    itemActive,
    setItemActive,
    itemDefault,
    alertConfig: {
      title: `La edición de un usuario esta en progreso`,
      text: "¿Desea cambiar de rol?",
      confirmButtonText: "Confirmar",
    },
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

  // Acciones disponibles en la UI
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
      onClick() {
        setOpenModal(true);
        let params = new URLSearchParams(window.location.search);
        const pathNavigate = `/${path}/nuevo?${params.toString()}`;
        navigate(pathNavigate);
      },
    },
    {
      color: "secondary",
      tipo: "icono",
      variant: "contained",
      badge: "index",
      disabled: false,
      Icon: Create,
      name: "Continuar Editando",
      ocultar: !Boolean(itemActive._id),
      onClick() {
        if (!Boolean(itemActive._id)) return;
        if (noTienePermiso("Menu", "update")) {
          return;
        }
        let params = new URLSearchParams(window.location.search);
        const pathNavigate = `/${path}/${itemActive._id}?${params.toString()}`;
        navigate(pathNavigate);
        setOpenModal(!openModal);
      },
    },
    {
      color: "error",
      tipo: "icono",
      badge: "index",
      disabled: false,
      Icon: Cancel,
      name: "Cancelar Edición",
      ocultar: !Boolean(itemActive._id),
      onClick() {
        if (!Boolean(itemActive._id)) return;
        navigate(getSubPath());
        setItemActive(itemDefault);
      },
    },
  ];

  const handleEditar = useCallback(
    (itemEditing: UsuarioItem) => {
      if (noTienePermiso("Menu", "update")) {
        return;
      }
      let params = new URLSearchParams(window.location.search);
      const pathNavigate = `/${path}/${itemEditing._id}?${params.toString()}`;

      if (!itemActive._id || itemActive._id === itemEditing._id) {
        navigate(pathNavigate);
        setItemActive(itemEditing);
        return setOpenModal(true);
      }
      if (itemActive._id) {
        Swal.fire({
          title: `La edición de un usuario esta en progreso`,
          text: "¿Desea cambiar de edición?",
          icon: "warning",
          confirmButtonText: "Confirmar",
          ...themeSwal,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(pathNavigate);
            setItemActive(itemEditing);
            setOpenModal(true);
          }
        });
      }
    },
    [q, itemActive, data]
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
