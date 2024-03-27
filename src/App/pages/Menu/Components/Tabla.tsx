import { Box, Table, TableBody, TableHead, Typography } from "@mui/material";
import { CenterFocusStrong } from "@mui/icons-material";
import { ConvertirIcono } from "../../../helpers";
import { useMenuStore } from "..";
import { useNavigate } from "react-router-dom";
import {
  StyledTableCell,
  StyledTableContainer,
  StyledTableHeaderCell,
  StyledTableRow,
} from "../../../components/style";
import queryString from "query-string";
import { filterFunction } from "../helpers";
interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "center" | "left";
}

const columns: readonly Column[] = [
  { id: "nombre", label: "Nombre", minWidth: 50 },
  { id: "icono", label: "Icono", minWidth: 50 },
  { id: "delete", label: "Delete", minWidth: 50 },
  { id: "insert", label: "Insert", minWidth: 50 },
  { id: "update", label: "Update", minWidth: 50 },
  { id: "select", label: "Select", minWidth: 50 },
  { id: "ver", label: "Wachar", minWidth: 50 },
];
export const Tabla = ({
  page,
  rowsPerPage,
}: {
  page: number;
  rowsPerPage: number;
}) => {
  const navigate = useNavigate();
  const { rows, noTienePermiso, setOpenModalMenu, setActiveRow, rowActive } =
    useMenuStore();
  const { q = "", buscando = "" } = queryString.parse(location.search);
  return (
    <StyledTableContainer>
      <Table size="small" stickyHeader aria-label="sticky table">
        <TableHead>
          <StyledTableRow>
            {columns.map((column, index) => (
              <StyledTableHeaderCell
                key={index}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </StyledTableHeaderCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {filterFunction(String(q), String(buscando), rows)
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => {
              return (
                <StyledTableRow
                  crud={row.crud}
                  key={row._id}
                  onClick={() => {
                    setActiveRow(row);
                  }}
                  onDoubleClick={() => {
                    if (noTienePermiso("Menu", "update")) {
                      return;
                    }
                    navigate(
                      `/menu/${row._id}${q && `?q=${q}&buscando=${buscando}`}`
                    );
                    // navigate(`/menu/${row._id}?q=asdasd`);
                    setOpenModalMenu(true);
                    // setActiveRow(row);
                  }}
                >
                  <StyledTableCell>
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                      {rowActive._id === row._id && (
                        <CenterFocusStrong color="primary" />
                      )}
                      <Typography variant="body1">{row.nombre}</Typography>
                    </Box>
                  </StyledTableCell>
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
      </Table>
    </StyledTableContainer>
  );
};
