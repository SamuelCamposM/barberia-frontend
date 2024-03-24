import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import { Box, TextField, Table, Typography } from "@mui/material";
import { Acciones } from "../../components";
import { Cancel, CenterFocusStrong, Create } from "@mui/icons-material";
import { ModalMenu } from "./Components/ModalMenu";

import { ChangeEvent, useContext, useEffect, useState } from "react";
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

export const Page3 = () => {
  const { socket } = useContext(SocketContext);
  const { rows, setActiveRow, rowActive, onEditMenu, rowDefault, openModal } =
    useMenuStore();
  const { onOpenModalMenu, onToggleOpenMenu } = useMenuStore();
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
      Icon: Create,
      bgColor: "secondary",
      name: "Continuar Editando",
      disabled: false,
      ocultar: !Boolean(rowActive._id),
      onClick: () => {
        if (Boolean(rowActive._id)) {
          onToggleOpenMenu();
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
      },
    },
  ];
  const actionsRight: Action[] = [
    {
      bgColor: "error",
      Icon: Create,
      name: "Editar",
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
    <PaperContainerPage
      tabIndex={-1}
      onKeyDown={(e) => {
        if (isNaN(Number(e.key)) || !e.altKey) {
          return;
        }

        actionsLeft[Number(e.key) - 1].onClick(null);
      }}
    >
      <ModalMenu />
      <TextField label="Buscar" size="small" />
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
                    // className={`table-container__row
                    // ${row.crud?.editado && "table-container__row--update"}
                    // ${row.crud?.nuevo && "table-container__row--create"}
                    // ${row.crud?.eliminado && "table-container__row--delete"}
                    // `}
                    key={row._id}
                    onClick={() => {
                      setActiveRow(row);
                    }}
                    onDoubleClick={() => {
                      onOpenModalMenu();
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
                      {ConvertirIcono(row.icono, "small")}
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
export default Page3;
