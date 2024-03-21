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
  IconButton,
} from "@mui/material";
import { Acciones } from "../../components";
import {
  Create,
  Delete,
  FileCopy,
  Person,
  PictureAsPdf,
} from "@mui/icons-material";
import { ModalMenu } from "./Componentes/ModalMenu";
import { useMenuStore } from "../../../hooks";
import { ConvertirIcono } from "../../hooks";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { SocketContext } from "../../../context";
import { PageItem } from "../../../store/interfaces";
import { Action } from "../../../interfaces/global";
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
  const { socket } = useContext(SocketContext);
  const { rows, setActiveRow, rowActive, onEditMenu } = useMenuStore();
  const { onOpenModalMenu } = useMenuStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const actionsLeft: Action[] = [
    {
      icon: <Create />,
      bgColor: "secondary",
      name: "Editar",
      badge: "1",
      disabled: false,
      ocultar: !Boolean(rowActive._id),
      onClick: () => {
        onOpenModalMenu();
      },
    },
  ];
  const actionsRight: Action[] = [
    {
      icon: <Create color="secondary" />,
      name: "Editar",
      badge: "1",
      disabled: true,
      ocultar: true,
      onClick: () => {
        onOpenModalMenu();
      },
    },
  ];
  useEffect(() => {
    socket?.on("cliente:page-editar", (data: PageItem) => {
      onEditMenu(data);
    });
  }, [socket]);
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
                      background: row.crud?.editado
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
                        {rowActive._id === row._id && (
                          <Create color="primary" />
                        )}
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
      <Acciones actionsLeft={actionsLeft} actionsRight={actionsRight} />

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
