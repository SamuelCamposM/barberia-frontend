import {
  Action,
  Pagination,
  Sort,
  socketChildListener,
} from "../../../interfaces/global";
import { AddCircle, Cancel, Refresh } from "@mui/icons-material";
import { ChangeEvent, useEffect, useState } from "react";
import { DeptoItem, setDataProps, useDeptoStore } from ".";
import { paginationDefault, validateFunction } from "../../../helpers";
import { PaperContainerPage } from "../../components/style";
import { SocketOnDepto, columns, rowDefault } from "./helpers";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { useNavigate } from "react-router-dom";
import { usePath } from "../../hooks";
import { useProvideSocket } from "../../../hooks";
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
import { EditableDepto } from "./components/EditableDepto";
import { RowDepto } from "./components/RowDepto";

export const Depto = () => {
  // Hooks de navegación y rutas.
  const navigate = useNavigate();
  const path = usePath();
  // Hooks personalizados para socket y permisos.
  const { socket } = useProvideSocket();
  const { noTienePermiso } = useMenuStore();
  const {
    cargando,
    data,
    pagination,
    getDataDepto,
    onAddOrRemoveMunicipio,
    onAgregarDepto,
    onEditDepto,
    onEliminarDepto,
  } = useDeptoStore();
  // Estados locales para el manejo de la UI y datos.
  const [agregando, setAgregando] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  // const [deptosData, setDeptosData] = useState<DeptoItem[]>([]);
  const [sort, setSort] = useState<Sort>({ asc: true, campo: "name" });

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
    const { error } = await getDataDepto({
      pagination,
      sort,
      busqueda,
    });
    if (error) {
      toast.error(error);
      return;
    }

    setSort(sort);
    setBusqueda(busqueda);
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

  useEffect(() => {
    // Eventos de socket para agregar, editar y eliminar departamentos.
    socket?.on(SocketOnDepto.agregar, (data: DeptoItem) =>
      onAgregarDepto(data)
    );
    socket?.on(SocketOnDepto.editar, (data: DeptoItem) => onEditDepto(data));
    socket?.on(SocketOnDepto.eliminar, (data: { _id: string }) =>
      onEliminarDepto(data._id)
    );
    socket?.on(
      SocketOnDepto.municipioListener,
      (data: { _id: string; tipo: socketChildListener }) =>
        onAddOrRemoveMunicipio(data)
    );

    // Limpieza de eventos de socket al desmontar el componente.
    return () => {
      socket?.off(SocketOnDepto.agregar);
      socket?.off(SocketOnDepto.editar);
      socket?.off(SocketOnDepto.eliminar);
      socket?.off(SocketOnDepto.municipioListener);
    };
  }, [socket]);

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
        if (noTienePermiso("Depto", "insert")) return;
        setAgregando(!agregando);
      },
      tipo: "icono",
    },
  ];

  return (
    <PaperContainerPage
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          return navigate(`/${path}`);
        }

        if (validateFunction(e)) return;

        actions[Number(e.key) - 1].onClick(null);
      }}
    >
      <BuscadorPath />
      <>
        <Title path={path} />
        {buscando ? "si" : "no"}
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
                  <Cargando titulo="Cargando Deptos..." />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {agregando && (
                <EditableDepto
                  setEditando={() => {}}
                  depto={{ ...rowDefault, crud: { nuevo: true } }}
                  setAgregando={setAgregando}
                />
              )}
              {data.map((depto) => {
                return (
                  <RowDepto key={depto._id} depto={depto} busqueda={busqueda} />
                );
              })}
            </TableBody>
          )}
        </TablaLayout>
      </>
    </PaperContainerPage>
  );
};

export default Depto;
