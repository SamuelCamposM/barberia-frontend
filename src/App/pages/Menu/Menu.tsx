import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import { Box, TextField, Table, Typography } from "@mui/material";
import { Acciones } from "../../components";
import { Add, Cancel, CenterFocusStrong, Create } from "@mui/icons-material";

import { useContext, useEffect } from "react";
import { SocketContext } from "../../../context";
import { Action } from "../../../interfaces/global";
import { ConvertirIcono } from "../../helpers";
import { useMenuStore, PageItem } from "./";
import {
  PaperContainerPage,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHeaderCell,
  StyledTableRow,
} from "../../components/style";
import { useTablePagination } from "../../hooks";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ModalRoute } from "./Components/ModalRoute";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "center" | "left";
  format?: (value: number) => string;
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

export const Menu = () => {
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const {
    noTienePermiso,
    onEditMenu,
    openModal,
    rowActive,
    rowDefault,
    rows,
    setActiveRow,
    setOpenModalMenu,
  } = useMenuStore();
  const {
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    rowsPerPage,
    // setPage,
    // setRowsPerPage,
  } = useTablePagination();

  const actionsLeft: Action[] = [
    {
      Icon: Create,
      bgColor: "secondary",
      name: "Continuar Editando",
      disabled: false,
      ocultar: !Boolean(rowActive._id),
      onClick: () => {
        if (noTienePermiso("Menu", "update")) {
          return;
        }
        if (Boolean(rowActive._id)) {
          setOpenModalMenu(!openModal);
        }
      },
    },
    {
      Icon: Cancel,
      bgColor: "error",
      name: "Cancelar Edición",
      disabled: false,
      ocultar: !Boolean(rowActive._id),
      onClick: () => {
        if (Boolean(rowActive._id) && openModal) return;
        setActiveRow(rowDefault);
        navigate("/menu", { replace: true });
      },
    },
  ];
  const actionsRight: Action[] = [
    {
      Icon: Add,
      bgColor: "success",
      name: "Nuevo",
      disabled: false,
      ocultar: false,
      onClick: () => {
        navigate("/menu/nuevo", { replace: true });
        setOpenModalMenu(true);
      },
    },
  ];
  useEffect(() => {
    socket?.on("cliente:page-editar", (data: PageItem) => {
      onEditMenu(data);
    });
  }, [socket]);

  return (
    <PaperContainerPage
      tabIndex={-1}
      onKeyDown={(e) => {
        if (isNaN(Number(e.key)) || !e.altKey) {
          return;
        }
        actionsLeft[Number(e.key) - 1].onClick(null);
      }}
    >
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/:_id" element={<ModalRoute />} />
        <Route path="/*" element={<Navigate replace to="/" />} />
      </Routes>
      {/* <Routes>
        <Route path="/" element={<></>} />
        <Route path="modal/:item" element={<ModalMenu />} />
        <Route path="/*" element={<Navigate replace to="/" />} />
      </Routes> */}

      <TextField label="Buscar" size="small" variant="outlined" />
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
            {rows
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
                      navigate(`/menu/${row._id}`);
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

      <Acciones actionsLeft={actionsLeft} actionsRight={actionsRight} />

      <TablePagination
        className="tablePagination"
        rowsPerPageOptions={[10, 20, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </PaperContainerPage>
  );
};
export default Menu;
