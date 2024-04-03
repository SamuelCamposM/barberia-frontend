import {
  Box,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Action, Column, Sort } from "../../../../interfaces/global";
import { Acciones, Cargando, TablaLayout, Title } from "../../../components";

import { usePath } from "../../../hooks";
import { useDeptoStore } from "..";
import { Row } from "./Row";
import { ChangeEvent } from "react";
import { TableHeader } from "../../../components/Tabla/TableHeader";
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

export const Tabla = ({ actions }: { actions: Action[] }) => {
  // const { handleChangePage, handleChangeRowsPerPage, page, rowsPerPage } =
  //   useTablePagination();
  const {
    data,
    pagination,
    getDataDepto,
    rowDefault,
    agregando,
    cargando,
    sort,
  } = useDeptoStore();
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
  return (
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
              return <Row key={depto._id} depto={depto} />;
            })}
          </TableBody>
        )}
      </TablaLayout>
    </>
  );
};
