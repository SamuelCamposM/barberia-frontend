import { Box, TableBody, TableHead, TablePagination } from "@mui/material";
import { Create } from "@mui/icons-material";

import { PageItem, useMenuStore } from "..";
import { useNavigate } from "react-router-dom";
import {
  StyledTableCell,
  StyledTableHeaderCell,
  StyledTableRow,
} from "../../../components/style";
import queryString from "query-string";
import { filterFunction } from "../helpers";
import { usePath, useTablePagination } from "../../../hooks";
import { useCallback } from "react";
import "animate.css/animate.min.css";
import { Acciones, TablaLayout, TableTitle } from "../../../components";
import { Action, Column } from "../../../../interfaces/global";
import { ConvertirIcono } from "../../../../helpers";

const columns: readonly Column[] = [
  { label: "", minWidth: 50, align: "center", sortable: false },
  { label: "Nombre", minWidth: 40, sortable: false },
  { label: "Icono", minWidth: 40, sortable: false },
  { label: "Delete", minWidth: 80, sortable: false },
  { label: "Insert", minWidth: 80, sortable: false },
  { label: "Update", minWidth: 80, sortable: false },
  { label: "Select", minWidth: 80, sortable: false },
  { label: "Wachar", minWidth: 80, sortable: false },
];
export const Tabla = ({ actions }: { actions: Action[] }) => {
  const navigate = useNavigate();
  const { data, noTienePermiso, setOpenModalMenu, setActiveRow, rowActive } =
    useMenuStore();
  const path = usePath();
  const { q = "", buscando = "" } = queryString.parse(location.search) as {
    q: string;
    buscando: string;
  };
  const { handleChangePage, handleChangeRowsPerPage, page, rowsPerPage } =
    useTablePagination();

  const handleEditar = useCallback(
    (row: PageItem) => {
      if (noTienePermiso("Menu", "update")) {
        return;
      }
      navigate(`/${path}/${row._id}${q && `?q=${q}&buscando=${buscando}`}`);
      setActiveRow(row);
      setOpenModalMenu(true);
    },
    [q]
  );
  // const [, setshowButtoms] = useState(false);

  return (
    <>
      <TableTitle path={path} />
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
          count={filterFunction(q, buscando, data).length}
          rowsPerPage={rowsPerPage}
          page={page}
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
                {column.label}
              </StyledTableHeaderCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {filterFunction(String(q), String(buscando), data)
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => {
              return (
                <StyledTableRow
                  crud={row.crud}
                  key={row._id}
                  onDoubleClick={() => {
                    handleEditar(row);
                    // setActiveRow(row);
                  }}
                  // onMouseEnter={() => setshowButtoms(true)}
                  // onMouseLeave={() => setshowButtoms(false)}
                  // className={`${
                  //   rowActive._id === row._id &&
                  //   "animate__animated animate__lightSpeedInRight"
                  // }`}
                >
                  <StyledTableCell
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
                  </StyledTableCell>
                  <StyledTableCell>{row.nombre}</StyledTableCell>
                  <StyledTableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {ConvertirIcono(row.icono, "small")}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>{row.delete.join(", ")}</StyledTableCell>
                  <StyledTableCell>{row.insert.join(", ")}</StyledTableCell>
                  <StyledTableCell>{row.update.join(", ")}</StyledTableCell>
                  <StyledTableCell>{row.select.join(", ")}</StyledTableCell>
                  <StyledTableCell>{row.ver.join(", ")}</StyledTableCell>
                </StyledTableRow>
              );
            })}
        </TableBody>
      </TablaLayout>
    </>
  );
};
