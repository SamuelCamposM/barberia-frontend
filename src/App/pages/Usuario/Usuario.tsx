import { Action, Pagination, Sort } from "../../../interfaces/global";
import { AddCircle, Cancel, Create, Refresh } from "@mui/icons-material";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { StaticUsuario, UsuarioItem, setDataProps, useSocketEvents } from ".";
import { paginationDefault, roles, validateFunction } from "../../../helpers";
import { PaperContainerPage } from "../../components/style";
import { columns, getUsuarios, sortDefault } from "./helpers";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useCommonStates, usePath, useThemeSwal } from "../../hooks";
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
  TabsSlide,
  TableTitle,
} from "../../components"; // Importaciones de hooks de menú y notificaciones.
import { useMenuStore } from "../Menu";
import { toast } from "react-toastify"; // Definición de las columnas de la tabla.
import { TableNoData } from "../../components/Tabla/TableNoData";
import { ModalRoute } from "./components/ModalRoute";
import { useUsuarioStore } from "./hooks/useUsuarioStore";
import { Roles } from "../../../store/interfaces";
import Swal from "sweetalert2";

export const Usuario = () => {
  // Hooks de navegación y rutas.
  const navigate = useNavigate();
  const path = usePath();

  // Hooks personalizados para permisos.
  const { noTienePermiso } = useMenuStore();
  const { setItemActive, setOpenModal, itemActive, openModal, itemDefault } =
    useUsuarioStore();
  const [rol, setRol] = useState<Roles>("CLIENTE");
  // Estados locales para el manejo de la UI y datos.
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
  const [usuariosData, setUsuariosData] = useState<UsuarioItem[]>([]);
  const [pagination, setPagination] = useState(paginationDefault);

  // Funciones para el manejo de eventos y acciones.
  const navigateWithParams = useCallback(
    ({
      newPagination,
      newSort,
      newEstadoRequest,
    }: {
      newPagination: Pagination;
      newSort: Sort;
      newEstadoRequest: Roles;
    }) => {
      const urlParams = `?q=${busqueda}&pagination=${JSON.stringify(
        newPagination
      )}&sort=${JSON.stringify(
        newSort
      )}&buscando=${buscando}&rol=${newEstadoRequest}`;
      navigate(urlParams);
    },
    [busqueda, navigate]
  );

  const handleChangePage = useCallback(
    (_: unknown, newPage: number) => {
      navigateWithParams({
        newPagination: { ...pagination, page: newPage + 1 },
        newSort: sort,
        newEstadoRequest: rol,
      });
    },
    [pagination, sort, rol]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      navigateWithParams({
        newPagination: { ...pagination, page: 1, limit: +event.target.value },
        newSort: sort,
        newEstadoRequest: rol,
      });
    },
    [pagination, sort, rol]
  );

  const sortFunction = useCallback(
    (newSort: Sort) => {
      navigateWithParams({
        newPagination: pagination,
        newSort,
        newEstadoRequest: rol,
      });
    },
    [pagination, rol]
  );
  const themeSwal = useThemeSwal();

  const handleChangeEstado = (_: React.SyntheticEvent, newValue: Roles) => {
    if (!itemActive._id) {
      return navigateWithParams({
        newPagination: pagination,
        newSort: sort,
        newEstadoRequest: newValue,
      });
    }
    if (itemActive._id) {
      Swal.fire({
        title: `La edición de un usuario esta en progreso`,
        text: "¿Desea cambiar de rol?",
        icon: "warning",
        confirmButtonText: "Confirmar",
        ...themeSwal,
      }).then((result) => {
        if (result.isConfirmed) {
          setItemActive(itemDefault);
          navigateWithParams({
            newPagination: pagination,
            newSort: sort,
            newEstadoRequest: newValue,
          });
        }
      });
    }
  };
  // Función asíncrona para obtener y establecer datos.
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

  // Efectos secundarios para la sincronización con la URL y sockets.
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
  // Acciones disponibles en la UI.
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

        // Asegúrate de que 'params.toString()' devuelva la cadena de consulta con los parámetros que deseas mantener.
        navigate(`/${path}/nuevo?${params.toString()}`);
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
        setItemActive(itemDefault);
        navigate(`/${path}`, { replace: true });
      },
    },
  ];
  const handleEditar = useCallback(
    (itemEditing: UsuarioItem) => {
      if (noTienePermiso("Menu", "update")) {
        return;
      }
      let params = new URLSearchParams(window.location.search);
      navigate(`/${path}/${itemEditing._id}?${params.toString()}`);
      setItemActive(itemEditing);
      setOpenModal(true);
    },
    [q]
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
        <>
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
              <TableBody>
                <TableRow>
                  <TableCell colSpan={columns.length + 1}>
                    <Cargando titulo="Cargando Usuarios..." />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {usuariosData.length === 0 ? (
                  <TableNoData
                    length={columns.length}
                    title="No hay Usuarios"
                  />
                ) : (
                  usuariosData.map((usuario) => {
                    return (
                      <StaticUsuario
                        key={usuario._id}
                        usuario={usuario}
                        busqueda={busqueda}
                        handleEditar={handleEditar}
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

export default Usuario;
