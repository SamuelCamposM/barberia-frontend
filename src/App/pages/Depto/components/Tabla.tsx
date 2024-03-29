import {
  Box,
  TableBody,
  TableHead,
  TablePagination,
  Typography,
} from "@mui/material";
import { Action, Column } from "../../../../interfaces/global";
import { Acciones, TablaLayout, Title } from "../../../components";
import {
  StyledTableHeaderCell,
  StyledTableRow,
} from "../../../components/style";
import { usePath } from "../../../hooks";
import { useDeptoStore } from "..";
import { Row } from "./Row";
import { ChangeEvent } from "react";
import { ArrowDownward } from "@mui/icons-material";
const columns: readonly Column[] = [
  { label: "", minWidth: 50, align: "center" },
  { label: "Nombre", minWidth: 40 },
  { label: "Municipios", minWidth: 40 },
];
export const Tabla = ({ actions }: { actions: Action[] }) => {
  // const { handleChangePage, handleChangeRowsPerPage, page, rowsPerPage } =
  //   useTablePagination();
  const { data, pagination, getDataDepto, rowDefault, agregando } =
    useDeptoStore();
  const handleChangePage = (_: unknown, newPage: number) => {
    getDataDepto({ ...pagination, page: newPage + 1 }, "");
  };
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    getDataDepto({ ...pagination, page: 1, limit: +event.target.value }, "");
  };
  const path = usePath();
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
        <TableHead>
          <StyledTableRow>
            {columns.map((column) => (
              <StyledTableHeaderCell
                key={column.label}
                style={{ minWidth: column.minWidth }}
              >
                <Box display={"flex"} alignItems={"center"}>
                  <Typography
                    variant="body1"
                    color="initial"
                    component={"span"}
                  >
                    {column.label}
                  </Typography>
                  <ArrowDownward fontSize="small" />
                </Box>
              </StyledTableHeaderCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {agregando && (
            <Row depto={{ ...rowDefault, crud: { nuevo: true } }} />
          )}
          {data.map((depto) => {
            return <Row key={depto._id} depto={depto} />;
          })}
        </TableBody>
      </TablaLayout>
    </>
  );
};
