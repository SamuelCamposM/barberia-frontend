import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Paper,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Acciones } from "../../components";
import {
  CheckBox,
  Create,
  Delete,
  DeleteForever,
  FileCopy,
  PictureAsPdf,
} from "@mui/icons-material";
import { ModalMenu } from "./Componentes/ModalMenu";
import { useMenuStore } from "../../../hooks";
import { ConvertirIcono } from "../../hooks";
// import { agregarTransparencia } from "../../../helpers";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "center" | "left";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "nombre", label: "Nombre", minWidth: 170 },
  { id: "icono", label: "Icono", minWidth: 170 },
  { id: "delete", label: "Delete", minWidth: 170 },
  { id: "insert", label: "Insert", minWidth: 170 },
  { id: "update", label: "Update", minWidth: 170 },
  { id: "select", label: "Select", minWidth: 170 },
  { id: "ver", label: "Wachar", minWidth: 170 },
];

export const Page3 = () => {
  const { rows, setActiveRow, rowActive } = useMenuStore();
  const { onOpenModalMenu } = useMenuStore();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const actions = [
    {
      icon: <Create color="secondary" />,
      name: "Editar",
      onClick: () => {
        onOpenModalMenu();
      },
    },
    { icon: <FileCopy color="secondary" />, name: "Copiar", onClick: () => {} },
    {
      icon: <Delete sx={{ color: (theme) => theme.palette.tertiary.main }} />,
      name: "Eliminar",
      onClick: () => {},
    },
    {
      icon: <PictureAsPdf color="error" />,
      name: "Reporte PDF",
      onClick: () => {},
    },
  ];

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        position: "relative",
      }}
    >
      <ModalMenu />
      <TextField label="Buscar" size="small" />
      <TableContainer sx={{ flexGrow: 1 }}>
        <Table size="small" stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <TableSortLabel active={true} direction={"desc"}>
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    hover
                    sx={{
                      background:
                        rowActive._id === row._id
                          ? (theme) => theme.palette.secondary.dark
                          : "",
                    }}
                    role="checkbox"
                    key={row._id}
                    onDoubleClick={() => {
                      onOpenModalMenu();
                      setActiveRow(row);
                    }}
                  >
                    <TableCell size="small">
                      <Box display={"flex"} alignItems={"center"} gap={1}>
                        {/* //editado */}
                        {/* {true && <Create color="secondary" />} */}
                        {/* //eliminado */}
                        {/* {true && <DeleteForever color="error" />} */}
                        {/* //nuevo */}
                        {/* {true && <CheckBox color="success" />} */}
                        <Typography variant="body1">{row.nombre}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell size="small">
                      {ConvertirIcono(row.icono)}
                    </TableCell>
                    <TableCell size="small">{row.delete.join(", ")}</TableCell>
                    <TableCell size="small">{row.insert.join(", ")}</TableCell>
                    <TableCell size="small">{row.update.join(", ")}</TableCell>
                    <TableCell size="small">{row.select.join(", ")}</TableCell>
                    <TableCell size="small">{row.ver.join(", ")}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Acciones actions={actions} />
      <TablePagination
        sx={{
          minHeight: "52px",
        }}
        rowsPerPageOptions={[10, 20, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
export default Page3;
