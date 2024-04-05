import { Action, Column, Sort } from "../../../interfaces/global";
import { AddCircle, Cancel, Refresh } from "@mui/icons-material";
import { ChangeEvent, useEffect } from "react";
import { DeptoItem, useDeptoStore } from ".";
import { PaperContainerPage } from "../../components/style";
import { Row } from "./components/Row";
import { SocketOnDepto } from "./helpers";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { useLocation } from "react-router-dom";
import { usePath } from "../../hooks";
import { useProvideSocket } from "../../../hooks";
import { validateFunction } from "../../../helpers";
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
} from "../../components";
const columns: Column[] = [
  { campo: "", label: "", minWidth: 50, align: "center", sortable: false },
  { campo: "name", label: "Nombre", minWidth: 40, sortable: true },
  {
    campo: "totalMunicipios",
    label: "Municipios",
    minWidth: 40,
    sortable: true,
  },
];
export const Depto = () => {
  const { socket } = useProvideSocket();
  const {
    agregando,
    getDataDepto,
    onAgregarDepto,
    onEditDepto,
    pagination,
    setAgregando,
    onEliminarDepto,
    cargando,
    sort,
    rowDefault,
    data,
  } = useDeptoStore();
  const location = useLocation();

  const { q = "" } = queryString.parse(location.search) as {
    q: string;
  };
  useEffect(() => {
    getDataDepto({ pagination, sort, busqueda: q });
  }, [q]);

  const actions: Action[] = [
    {
      color: "primary",
      Icon: Refresh,
      name: "Actualizar",
      onClick() {
        getDataDepto({ pagination, sort, busqueda: q });
      },
      tipo: "icono",
    },
    {
      color: agregando ? "error" : "success",
      Icon: agregando ? Cancel : AddCircle,
      name: "Agregar Departamento",
      onClick() {
        setAgregando(!agregando);
      },
      tipo: "icono",
    },
  ];
  const handleChangePage = (_: unknown, newPage: number) => {
    getDataDepto({
      pagination: { ...pagination, page: newPage + 1 },
      sort,
      busqueda: "",
    });
  };
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    getDataDepto({
      pagination: { ...pagination, page: 1, limit: +event.target.value },
      sort,
      busqueda: "",
    });
  };
  const path = usePath();
  const sortFunction = (newSort: Sort) => {
    getDataDepto({
      pagination,
      sort: newSort,
      busqueda: "",
    });
  };
  useEffect(() => {
    socket?.on(SocketOnDepto.agregar, (data: DeptoItem) => {
      onAgregarDepto(data);
    });

    socket?.on(SocketOnDepto.editar, (data: DeptoItem) => {
      onEditDepto(data);
    });
    socket?.on(SocketOnDepto.eliminar, (data: { _id: string }) => {
      onEliminarDepto(data._id);
    });

    return () => {
      socket?.off(SocketOnDepto.agregar);
      socket?.off(SocketOnDepto.editar);
      socket?.off(SocketOnDepto.eliminar);
    };
  }, [socket]);

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
        <Title path={path} />
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
                <Row depto={{ ...rowDefault, crud: { nuevo: true } }} />
              )}
              {data.map((depto) => {
                return <Row key={depto._id} depto={depto} q={q} />;
              })}
            </TableBody>
          )}
        </TablaLayout>
      </>
    </PaperContainerPage>
  );
};

export default Depto;
