import { Box, TableBody, TableHead } from "@mui/material";
import { Action, Column } from "../../../../interfaces/global";
import { Acciones, TablaLayout, Title } from "../../../components";
import {
  StyledTableHeaderCell,
  StyledTableRow,
} from "../../../components/style";
import { usePath } from "../../../hooks";
const columns: readonly Column[] = [
  { label: "", minWidth: 50, align: "center" },
  { label: "Nombre", minWidth: 40 },
];
export const Tabla = ({ actions }: { actions: Action[] }) => {
  // const { handleChangePage, handleChangeRowsPerPage, page, rowsPerPage } =
  //   useTablePagination();
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
        {/* <TablePagination
          className="tablePagination"
          rowsPerPageOptions={[10, 20, 100]}
          component="div"
          count={filterFunction(q, buscando, rows).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Box>
      <TablaLayout>
        <TableHead>
          <StyledTableRow>
            {columns.map((column) => (
              <StyledTableHeaderCell
                key={column.label}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </StyledTableHeaderCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {[]
            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(() => {
              return (
                <StyledTableRow
                  // crud={row.crud}
                  // key={row._id}
                  onDoubleClick={() => {
                    // handleEditar(row);
                    // setActiveRow(row);
                  }}
                  // onMouseEnter={() => setshowButtoms(true)}
                  // onMouseLeave={() => setshowButtoms(false)}
                  // className={`${
                  //   rowActive._id === row._id &&
                  //   "animate__animated animate__lightSpeedInRight"
                  // }`}
                >
                  {/* <StyledTableCell
                    padding="checkbox"
                    className={`pendingActive ${
                      rowActive._id === row._id && "active"
                    }`}
                  >
                    <Acciones
                      actions={[
                        {
                          color: "primary",
                          Icon: Create,
                          name: `Editar`,
                          onClick: () => {
                            handleEditar(row);
                          },
                          tipo: "icono",
                          size: "small",
                        },
                      ]}
                    />
                  </StyledTableCell> */}
                </StyledTableRow>
              );
            })}
        </TableBody>
      </TablaLayout>
    </>
  );
};
